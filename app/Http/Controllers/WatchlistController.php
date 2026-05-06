<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WatchlistController extends Controller
{
    public function index(Request $request): Response
    {
        $items = $request->user()
            ->watchlistItems()
            ->whereHas('post', fn ($query) => $query->published())
            ->with(['post.user:id,name,avatar'])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->latest()
            ->paginate(20)
            ->through(fn ($item) => $this->serializeItem($item));

        return Inertia::render('Watchlist/Index', [
            'items' => $items,
            'filters' => ['status' => $request->query('status')],
        ]);
    }

    public function store(Request $request, Post $post): JsonResponse
    {
        $this->abortUnlessPubliclyViewable($post);

        $data = $request->validate([
            'status' => 'nullable|in:planned,watching,watched',
            'note' => 'nullable|string|max:500',
        ]);

        $item = $request->user()->watchlistItems()->updateOrCreate(
            ['post_id' => $post->id],
            [
                'status' => $data['status'] ?? 'planned',
                'note' => $data['note'] ?? null,
                'watched_at' => ($data['status'] ?? null) === 'watched' ? now() : null,
            ]
        );

        return response()->json(['watchlisted' => true, 'item' => $this->serializeItem($item->loadMissing('post.user'))]);
    }

    public function update(Request $request, Post $post): JsonResponse
    {
        $this->abortUnlessPubliclyViewable($post);

        $data = $request->validate([
            'status' => 'required|in:planned,watching,watched',
            'note' => 'nullable|string|max:500',
        ]);

        $item = $request->user()->watchlistItems()->firstOrCreate(['post_id' => $post->id]);
        $item->update([
            'status' => $data['status'],
            'note' => array_key_exists('note', $data) ? $data['note'] : $item->note,
            'watched_at' => $data['status'] === 'watched' ? ($item->watched_at ?? now()) : null,
        ]);

        return response()->json(['watchlisted' => true, 'item' => $this->serializeItem($item->loadMissing('post.user'))]);
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        $this->abortUnlessPubliclyViewable($post);

        $request->user()->watchlistItems()->where('post_id', $post->id)->delete();

        return response()->json(['watchlisted' => false, 'item' => null]);
    }

    private function serializeItem($item): array
    {
        return [
            'id' => $item->id,
            'post_id' => $item->post_id,
            'status' => $item->status,
            'note' => $item->note,
            'watched_at' => optional($item->watched_at)?->toIso8601String(),
            'post' => $item->relationLoaded('post') ? [
                'id' => $item->post->id,
                'slug' => $item->post->slug,
                'title' => $item->post->title,
                'cover_image' => $item->post->cover_image,
                'format' => $item->post->format,
                'author' => $item->post->user ? ['id' => $item->post->user->id, 'name' => $item->post->user->name] : null,
            ] : null,
        ];
    }

    private function abortUnlessPubliclyViewable(Post $post): void
    {
        if (! $post->isPubliclyViewable()) {
            abort(404);
        }
    }
}
