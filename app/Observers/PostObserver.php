<?php

namespace App\Observers;

use App\Models\Post;
use App\Observers\Concerns\FlushesAuthorStatsCache;
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
}