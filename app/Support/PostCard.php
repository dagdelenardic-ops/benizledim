<?php

namespace App\Support;

use App\Models\Post;

/**
 * Listing payload for a post card.
 *
 * Public pages render cards, never article bodies, yet they used to serialize
 * whole Post models into the Inertia page object. That shipped every article's
 * `content` plus moderation columns and the author's e-mail address to anyone
 * who viewed the source. This keeps the payload to what the cards actually read.
 */
class PostCard
{
    /**
     * Post columns a card needs. `content` is deliberately absent.
     *
     * @var list<string>
     */
    public const COLUMNS = [
        'id',
        'user_id',
        'title',
        'slug',
        'excerpt',
        'cover_image',
        'cover_image_focus_x',
        'cover_image_focus_y',
        'cover_image_mobile_focus_x',
        'cover_image_mobile_focus_y',
        'reading_time_minutes',
        'published_at',
        'view_count',
        'format',
        'rating',
        'watched_on',
        'mood_tags',
    ];

    /**
     * Relations a card needs, each narrowed to its displayed columns.
     *
     * @var array<int|string, mixed>
     */
    public const RELATIONS = [
        'user:id,name,avatar',
        'categories:id,name,slug',
    ];

    /**
     * @return array<string, mixed>
     */
    public static function make(Post $post): array
    {
        return [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'cover_image' => $post->cover_image,
            'cover_image_focus_x' => $post->cover_image_focus_x,
            'cover_image_focus_y' => $post->cover_image_focus_y,
            'cover_image_mobile_focus_x' => $post->cover_image_mobile_focus_x,
            'cover_image_mobile_focus_y' => $post->cover_image_mobile_focus_y,
            'reading_time_minutes' => $post->reading_time_minutes,
            'published_at' => $post->published_at,
            'view_count' => $post->view_count,
            'format' => $post->format,
            'rating' => $post->rating,
            'watched_on' => $post->watched_on,
            'mood_tags' => $post->mood_tags,
            'comments_count' => $post->comments_count,
            'likes_count' => $post->likes_count,
            'user' => $post->relationLoaded('user') && $post->user
                ? [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'avatar' => $post->user->avatar,
                ]
                : null,
            'categories' => $post->relationLoaded('categories')
                ? $post->categories->map(fn ($category) => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                ])->values()->all()
                : [],
        ];
    }

    /**
     * @param  iterable<Post>  $posts
     * @return list<array<string, mixed>>
     */
    public static function collection(iterable $posts): array
    {
        $cards = [];
        foreach ($posts as $post) {
            $cards[] = self::make($post);
        }

        return $cards;
    }
}
