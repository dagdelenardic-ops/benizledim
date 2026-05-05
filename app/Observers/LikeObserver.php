<?php

namespace App\Observers;

use App\Models\Like;
use App\Notifications\PostHitLikeMilestone;
use App\Observers\Concerns\FlushesAuthorStatsCache;

class LikeObserver
{
    use FlushesAuthorStatsCache;

    public function created(Like $like): void
    {
        $post = $like->post()->with('user')->withCount('likes')->first();

        if (! $post) {
            return;
        }

        $meta = $post->meta ?? [];
        $notifiedMilestones = $meta['notified_milestones'] ?? [];

        foreach ([10, 50, 100] as $milestone) {
            if ($post->likes_count === $milestone && ! in_array($milestone, $notifiedMilestones, true)) {
                $post->user->notify(new PostHitLikeMilestone($post, $milestone));
                $notifiedMilestones[] = $milestone;
            }
        }

        if (($meta['notified_milestones'] ?? []) !== $notifiedMilestones) {
            $meta['notified_milestones'] = array_values(array_unique($notifiedMilestones));
            $post->forceFill(['meta' => $meta])->saveQuietly();
        }

        $this->flushAuthorStatsCache($post->user_id);
    }
}