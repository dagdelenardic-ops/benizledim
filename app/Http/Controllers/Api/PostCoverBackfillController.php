<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Support\MediaUrl;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PostCoverBackfillController extends Controller
{
    private function authorizeToken(Request $request): bool
    {
        $token = config('services.flashnews.token');
        $given = (string) ($request->query('token') ?: $request->input('token'));

        return $token && hash_equals($token, $given);
    }

    /**
     * Kapak görseli olmayan yayınlanmış yazıları döner.
     * Lokal Mac rutini bunu çekip claude -p (Sonnet) ile film adını çıkarır,
     * TMDB'den poster bulup set-cover'a basar.
     */
    public function candidates(Request $request): JsonResponse
    {
        if (! $this->authorizeToken($request)) {
            return response()->json(['error' => 'unauthorized'], 401);
        }

        $posts = Post::query()
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('cover_image')->orWhere('cover_image', '');
            })
            ->orderBy('id')
            ->get(['id', 'title', 'excerpt', 'external_title', 'external_year', 'tmdb_id', 'tmdb_type']);

        return response()->json([
            'ok' => true,
            'count' => $posts->count(),
            'posts' => $posts->map(fn ($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'excerpt' => mb_substr((string) $p->excerpt, 0, 200),
                'external_title' => $p->external_title,
                'external_year' => $p->external_year,
                'tmdb_id' => $p->tmdb_id,
                'tmdb_type' => $p->tmdb_type,
            ])->values(),
        ]);
    }

    /**
     * Tek bir yazının kapak görselini (TMDB poster URL) ve TMDB meta'sını günceller.
     */
    public function setCover(Request $request): JsonResponse
    {
        if (! $this->authorizeToken($request)) {
            return response()->json(['error' => 'unauthorized'], 401);
        }

        $data = $request->validate([
            'id' => ['required', 'integer', 'exists:posts,id'],
            'cover_image' => ['required', 'url', 'max:1000'],
            'tmdb_id' => ['nullable', 'integer'],
            'tmdb_type' => ['nullable', 'in:movie,tv'],
            'external_title' => ['nullable', 'string', 'max:255'],
            'external_year' => ['nullable', 'integer'],
        ]);

        $post = Post::findOrFail($data['id']);

        // Sadece hâlâ görselsizse yaz — yarış / tekrar koşumu güvenli
        if (filled($post->cover_image)) {
            return response()->json([
                'ok' => true,
                'skipped' => true,
                'reason' => 'already has cover_image',
                'id' => $post->id,
            ]);
        }

        $post->cover_image = MediaUrl::upgradeToOriginal($data['cover_image']);

        if (! empty($data['tmdb_id']) && blank($post->tmdb_id)) {
            $post->tmdb_id = $data['tmdb_id'];
            $post->tmdb_type = $data['tmdb_type'] ?? $post->tmdb_type;
        }
        if (! empty($data['external_title']) && blank($post->external_title)) {
            $post->external_title = $data['external_title'];
            $post->external_year = $data['external_year'] ?? $post->external_year;
        }

        $post->save();

        Log::info('[posts:backfill-cover] set', [
            'id' => $post->id,
            'cover_image' => $post->cover_image,
            'tmdb_id' => $post->tmdb_id,
        ]);

        return response()->json([
            'ok' => true,
            'skipped' => false,
            'id' => $post->id,
            'cover_image' => $post->cover_image,
        ]);
    }
}
