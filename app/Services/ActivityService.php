<?php

namespace App\Services;

use App\Models\ActivityItem;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ActivityService
{
    public function record(string $type, ?User $actor = null, array $payload = []): ActivityItem
    {
        return ActivityItem::create([
            'type' => $type,
            'actor_id' => $actor?->id,
            'subject_user_id' => $payload['subject_user_id'] ?? null,
            'post_id' => $payload['post_id'] ?? null,
            'entry_id' => $payload['entry_id'] ?? null,
            'comment_id' => $payload['comment_id'] ?? null,
            'meta' => $payload['meta'] ?? null,
        ]);
    }

    public function feedFor(User $user, int $limit = 30): LengthAwarePaginator
    {
        $followedIds = $user->following()->pluck('users.id')->push($user->id)->unique()->values();

        return ActivityItem::query()
            ->with(['actor:id,name,avatar', 'post:id,user_id,title,slug,cover_image,format,status,published_at,deletion_requested_at'])
            ->whereIn('actor_id', $followedIds)
            ->where(function ($query) {
                $query
                    ->whereNull('post_id')
                    ->orWhereHas('post', function ($postQuery) {
                        $postQuery->published();
                    });
            })
            ->latest()
            ->paginate($limit);
    }
}
