<?php

namespace App\Observers;

use App\Models\Post;
use App\Observers\Concerns\FlushesAuthorStatsCache;
use App\Services\ActivityService;
use App\Services\SentimentAnalyzer;

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
