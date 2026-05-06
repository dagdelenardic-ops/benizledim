<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Cache\TaggedCache;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class AuthorStatsService
{
    public function forUser(User $user, ?int $year = null): array
    {
        $callback = fn () => $this->compute($user, $year);

        $store = Cache::getStore();

        if (method_exists($store, 'tags')) {
            /** @var TaggedCache $cache */
            $cache = Cache::tags(["user.{$user->id}.stats"]);

            return $cache->remember($this->cacheKey($year), 600, $callback);
        }

        return Cache::remember("user.{$user->id}.{$this->cacheKey($year)}", 600, $callback);
    }

    private function compute(User $user, ?int $year): array
    {
        $postsQuery = $user->posts()->when($year, function ($query) use ($year) {
            $query->where(function ($nested) use ($year) {
                $nested
                    ->whereYear('published_at', $year)
                    ->orWhereYear('created_at', $year)
                    ->orWhereYear('watched_on', $year);
            });
        });

        $posts = (clone $postsQuery)
            ->withCount(['likes', 'comments', 'entries'])
            ->get();

        $watchLogs = $posts->where('format', 'watch_log');
        $mostLikedPost = $posts->sortByDesc('likes_count')->first();

        return [
            'posts_count' => $posts->count(),
            'watch_logs_count' => $watchLogs->count(),
            'total_likes_received' => (int) $posts->sum('likes_count'),
            'total_comments_received' => (int) $posts->sum('comments_count'),
            'total_entries_received' => (int) $posts->sum('entries_count'),
            'most_liked_post' => $mostLikedPost && $mostLikedPost->likes_count > 0 ? [
                'id' => $mostLikedPost->id,
                'slug' => $mostLikedPost->slug,
                'title' => $mostLikedPost->title,
                'cover_image' => $mostLikedPost->cover_image,
                'likes_count' => $mostLikedPost->likes_count,
            ] : null,
            'top_mood_tags' => $this->topMoodTags($watchLogs),
            'avg_rating' => $this->averageRating($watchLogs),
            'last_log_at' => optional($watchLogs->filter(fn (Post $post) => $post->watched_on)->sortByDesc('watched_on')->first()?->watched_on)?->toDateString(),
            'current_streak' => 0,
            'followers_count' => $user->followers()->count(),
        ];
    }

    private function topMoodTags(Collection $watchLogs): array
    {
        return $watchLogs
            ->flatMap(fn (Post $post) => $post->mood_tags ?? [])
            ->filter(fn ($tag) => is_string($tag) && $tag !== '')
            ->countBy()
            ->sortDesc()
            ->take(3)
            ->map(fn ($count, $tag) => ['tag' => $tag, 'count' => $count])
            ->values()
            ->all();
    }

    private function averageRating(Collection $watchLogs): ?float
    {
        $ratings = $watchLogs->pluck('rating')->filter(fn ($rating) => is_numeric($rating));

        if ($ratings->isEmpty()) {
            return null;
        }

        return round((float) $ratings->avg(), 1);
    }

    private function cacheKey(?int $year): string
    {
        return 'stats:'.($year ?? 'all');
    }
}
