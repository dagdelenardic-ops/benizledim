<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuickLogRequest;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\JsonResponse;

class QuickLogController extends Controller
{
    public function store(QuickLogRequest $request): JsonResponse
    {
        $data = $request->validated();
        $title = $this->buildTitle($data['external_title'] ?? null, $data['external_year'] ?? null);

        $post = Post::create([
            'user_id' => $request->user()->id,
            'title' => $title,
            'excerpt' => $data['note'] ?? null,
            'content' => $data['note'] ?? $title,
            'cover_image' => $data['cover_image'] ?? null,
            'reading_time_minutes' => 1,
            'status' => $data['status'],
            'published_at' => $data['status'] === 'published' ? now() : null,
            'format' => 'watch_log',
            'mood_tags' => $data['mood_tags'] ?? null,
            'intensity_level' => $this->mapIntensity($data['rating'] ?? null),
            'tmdb_id' => $data['tmdb_id'] ?? null,
            'tmdb_type' => $data['tmdb_type'] ?? null,
            'external_title' => $data['external_title'] ?? null,
            'external_year' => $data['external_year'] ?? null,
            'watched_on' => $data['watched_on'] ?? null,
            'rating' => $data['rating'] ?? null,
        ]);

        $this->syncCategories($post, $data['tmdb_type'] ?? null);

        return response()->json([
            'post' => [
                'id' => $post->id,
                'slug' => $post->slug,
                'title' => $post->title,
                'format' => $post->format,
                'url' => route('posts.show', $post),
            ],
        ], 201);
    }

    private function buildTitle(?string $title, ?int $year): string
    {
        if ($title === null || $title === '') {
            return 'Untitled Watch Log';
        }

        return $year ? sprintf('%s (%d)', $title, $year) : $title;
    }

    private function mapIntensity(?int $rating): ?string
    {
        if ($rating === null) {
            return null;
        }

        return match (true) {
            $rating <= 3 => 'low',
            $rating <= 7 => 'medium',
            default => 'high',
        };
    }

    private function syncCategories(Post $post, ?string $tmdbType): void
    {
        $slugCandidates = match ($tmdbType) {
            'movie' => ['sinema', 'film'],
            'tv' => ['dizi'],
            default => [],
        };

        if ($slugCandidates === []) {
            return;
        }

        $categoryIds = Category::query()
            ->whereIn('slug', $slugCandidates)
            ->pluck('id')
            ->all();

        if ($categoryIds !== []) {
            $post->categories()->sync($categoryIds);
        }
    }
}