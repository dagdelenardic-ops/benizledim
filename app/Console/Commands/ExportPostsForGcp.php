<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ExportPostsForGcp extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:export-posts-for-gcp';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Exports all published blog posts as flat JSON Lines (JSONL) format for Google Vertex AI Search RAG Data Store.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting blog posts export for Google Vertex AI Search...');

        $posts = Post::published()
            ->with('categories')
            ->select('id', 'title', 'slug', 'excerpt', 'content', 'published_at', 'view_count', 'mood_tags', 'duration_category', 'intensity_level')
            ->get();

        if ($posts->isEmpty()) {
            $this->error('No published posts found to export.');
            return self::FAILURE;
        }

        $exportDir = storage_path('app/exports');
        if (!file_exists($exportDir)) {
            mkdir($exportDir, 0755, true);
        }

        $filePath = $exportDir . '/benizledim_posts_gcp.jsonl';
        $fileHandle = fopen($filePath, 'w');

        if (!$fileHandle) {
            $this->error("Failed to open file for writing: {$filePath}");
            return self::FAILURE;
        }

        $bar = $this->output->createProgressBar($posts->count());
        $bar->start();

        foreach ($posts as $post) {
            // Strip HTML tags for clean semantic RAG text
            $cleanContent = strip_tags(html_entity_decode($post->content));
            // Normalize whitespace
            $cleanContent = preg_replace('/\s+/', ' ', $cleanContent);
            $cleanContent = trim($cleanContent);

            $data = [
                'id' => (string) $post->id,
                'structData' => [
                    'id' => (string) $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'content' => $cleanContent,
                    'published_at' => $post->published_at?->toIso8601String(),
                    'view_count' => (int) $post->view_count,
                    'mood_tags' => is_array($post->mood_tags) ? $post->mood_tags : [],
                    'duration_category' => $post->duration_category,
                    'intensity_level' => $post->intensity_level,
                    'categories' => $post->categories->pluck('name')->toArray(),
                ],
            ];

            fwrite($fileHandle, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n");
            $bar->advance();
        }

        fclose($fileHandle);
        $bar->finish();
        $this->newLine(2);

        $this->info("Export completed successfully!");
        $this->line("File saved to: <comment>{$filePath}</comment>");
        $this->line("Size: " . number_format(filesize($filePath) / 1024, 2) . " KB");
        $this->line("Total lines: " . number_format($posts->count()) . " posts");
        
        $this->newLine();
        $this->info("=== HOW TO IMPORT TO GOOGLE VERTEX AI SEARCH ===");
        $this->line("1. Open Google Cloud Console -> Cloud Storage (GCS)");
        $this->line("2. Create a bucket or select an existing one (e.g. gs://benizledim-vertex-rag)");
        $this->line("3. Upload 'benizledim_posts_gcp.jsonl' to the bucket.");
        $this->line("4. Go to Vertex AI Agent Builder -> Data Stores -> Create Data Store.");
        $this->line("5. Select 'Cloud Storage' as source, choose 'JSON Lines' format, and point to your file.");
        $this->line("6. Create an App (Search or Chat Engine), link this Data Store, and you have an enterprise-grade semantic recommendation engine grounded in your reviews!");

        return self::SUCCESS;
    }
}
