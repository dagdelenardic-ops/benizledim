<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Services\VertexAiSearchService;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;

class VertexSyncCommand extends Command
{
    protected $signature = 'app:vertex-sync
        {--post-id= : Sync only a single post by ID}
        {--chunk=50 : Batch size per import call}';

    protected $description = 'Upsert published posts into the Vertex AI Search data store (inline import).';

    public function handle(VertexAiSearchService $vertex): int
    {
        if (!config('services.gcp.search_enabled')) {
            $this->warn('GCP_SEARCH_ENABLED is false. Aborting.');
            return self::SUCCESS;
        }

        $postId = $this->option('post-id');
        $chunk = max(1, (int) $this->option('chunk'));

        $query = Post::query()->published()->with('categories');
        if ($postId !== null) {
            $query->where('id', (int) $postId);
        }

        $total = (clone $query)->count();
        if ($total === 0) {
            $this->info('No posts to sync.');
            return self::SUCCESS;
        }

        $this->info("Syncing {$total} post(s) to Vertex AI Search…");
        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $synced = 0;
        $failed = 0;

        $query->chunkById($chunk, function ($posts) use ($vertex, $bar, &$synced, &$failed) {
            $documents = $posts->map(fn (Post $p) => $this->toDocument($p))->all();
            if ($vertex->importDocuments($documents)) {
                $synced += count($documents);
            } else {
                $failed += count($documents);
            }
            $bar->advance(count($documents));
        });

        $bar->finish();
        $this->newLine(2);

        if ($failed > 0) {
            $this->error("Synced {$synced}, failed {$failed}. Check logs.");
            return self::FAILURE;
        }
        $this->info("Synced {$synced} document(s).");
        return self::SUCCESS;
    }

    private function toDocument(Post $post): array
    {
        $cleanContent = trim(preg_replace('/\s+/', ' ', strip_tags(html_entity_decode($post->content ?? ''))));

        return [
            'id' => (string) $post->id,
            'structData' => [
                'id' => (string) $post->id,
                'title' => (string) $post->title,
                'slug' => (string) $post->slug,
                'excerpt' => (string) ($post->excerpt ?? ''),
                'content' => $cleanContent,
                'published_at' => $post->published_at?->toIso8601String(),
                'view_count' => (int) ($post->view_count ?? 0),
                'mood_tags' => is_array($post->mood_tags) ? $post->mood_tags : [],
                'duration_category' => $post->duration_category,
                'intensity_level' => $post->intensity_level,
                'categories' => $post->categories->pluck('name')->toArray(),
            ],
        ];
    }
}
