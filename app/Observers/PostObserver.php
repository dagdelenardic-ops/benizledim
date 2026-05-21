<?php

namespace App\Observers;

use App\Models\Post;
use App\Observers\Concerns\FlushesAuthorStatsCache;
use App\Services\ActivityService;
use App\Services\SentimentAnalyzer;
use App\Services\VertexAiSearchService;
use Illuminate\Support\Facades\Artisan;

class PostObserver
{
    use FlushesAuthorStatsCache;

    public function __construct(private readonly SentimentAnalyzer $sentimentAnalyzer)
    {
    }

    public function saved(Post $post): void
    {
        $this->flushAuthorStatsCache($post->user_id);
        $this->recordPublishActivity($post);
        $this->syncToVertex($post);

        if ($post->format !== 'watch_log' || blank($post->excerpt)) {
            return;
        }

        $meta = $post->meta ?? [];

        if (isset($meta['excerpt_sentiment'])) {
            return;
        }

        $meta['excerpt_sentiment'] = $this->sentimentAnalyzer->analyze($post->excerpt);

        $post->forceFill(['meta' => $meta])->saveQuietly();
    }

    public function deleted(Post $post): void
    {
        if (!config('services.gcp.search_enabled')) {
            return;
        }
        try {
            app(VertexAiSearchService::class)->deleteDocument($post->id);
        } catch (\Throwable $e) {
            // log only — don't break delete flow
            \Log::warning('Vertex delete failed', ['post_id' => $post->id, 'error' => $e->getMessage()]);
        }
    }

    private function syncToVertex(Post $post): void
    {
        if (!config('services.gcp.search_enabled')) {
            return;
        }
        if ($post->status !== 'published') {
            return;
        }
        if (!$post->wasChanged(['title', 'excerpt', 'content', 'status', 'mood_tags', 'duration_category', 'intensity_level', 'published_at'])
            && !$post->wasRecentlyCreated) {
            return;
        }

        // Run in background so save() returns immediately.
        dispatch(function () use ($post) {
            try {
                Artisan::call('app:vertex-sync', ['--post-id' => $post->id]);
            } catch (\Throwable $e) {
                \Log::warning('Vertex sync dispatch failed', ['post_id' => $post->id, 'error' => $e->getMessage()]);
            }
        })->afterResponse();
    }

    private function recordPublishActivity(Post $post): void
    {
        if (! $post->wasChanged('status') && ! $post->wasRecentlyCreated) {
            return;
        }

        if ($post->status !== 'published' || $post->published_at === null) {
            return;
        }

        $meta = $post->meta ?? [];

        if (($meta['activity_recorded'] ?? false) === true) {
            return;
        }

        app(ActivityService::class)->record(
            $post->format === 'watch_log' ? 'watch_log_created' : 'post_published',
            $post->user,
            ['subject_user_id' => $post->user_id, 'post_id' => $post->id]
        );

        $meta['activity_recorded'] = true;
        $post->forceFill(['meta' => $meta])->saveQuietly();
    }
}
