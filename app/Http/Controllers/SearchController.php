<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\VertexAiSearchService;
use App\Support\PostCard;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function complete(Request $request, VertexAiSearchService $vertex): \Illuminate\Http\JsonResponse
    {
        $q = trim((string) $request->input('q', ''));
        if (mb_strlen($q) < 2 || ! config('services.gcp.search_enabled')) {
            return response()->json(['suggestions' => []]);
        }
        $suggestions = $vertex->complete($q, 6);

        return response()->json(['suggestions' => $suggestions]);
    }

    public function index(Request $request, VertexAiSearchService $vertex)
    {
        $query = trim((string) $request->input('q', ''));
        $posts = collect();
        $engine = 'mysql';

        if (mb_strlen($query) >= 2) {
            if (config('services.gcp.search_enabled')) {
                $vertexResults = $this->vertexSearch($vertex, $query, $request);
                if ($vertexResults !== null) {
                    $posts = $vertexResults;
                    $engine = 'vertex';
                }
            }

            if ($engine !== 'vertex') {
                $posts = $this->mysqlSearch($query, $request);
            }
        }

        return Inertia::render('Search/Index', [
            'posts' => $posts,
            'query' => $query,
            'engine' => $engine,
            'title' => $query !== '' ? '"'.$query.'" için arama sonuçları' : 'Arama',
            'description' => $query !== ''
                ? '"'.$query.'" için Ben İzledim film, dizi ve belgesel yazılarında arama sonuçları.'
                : 'Ben İzledim arşivinde film, dizi ve belgesel yazılarında arama yap.',
            'canonicalUrl' => 'https://benizledim.com/ara',
            'robots' => 'noindex, follow',
        ]);
    }

    private function vertexSearch(VertexAiSearchService $vertex, string $query, Request $request): ?LengthAwarePaginator
    {
        $hits = $vertex->search($query, 24);
        if (empty($hits)) {
            return null;
        }

        $ids = collect($hits)->pluck('id')->filter()->values()->all();
        if (empty($ids)) {
            return null;
        }

        $posts = Post::articles()
            ->select(PostCard::COLUMNS)
            ->whereIn('id', $ids)
            ->with(PostCard::RELATIONS)
            ->withCount(['comments', 'likes'])
            ->get()
            ->keyBy('id');

        $ordered = collect($ids)
            ->map(fn ($id) => $posts->get((int) $id) ?? $posts->get((string) $id))
            ->filter()
            ->values();

        if ($ordered->isEmpty()) {
            return null;
        }

        $perPage = 12;
        $page = max(1, (int) $request->input('page', 1));
        $slice = $ordered->slice(($page - 1) * $perPage, $perPage)->values();

        return new LengthAwarePaginator(
            PostCard::collection($slice),
            $ordered->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );
    }

    private function mysqlSearch(string $query, Request $request): LengthAwarePaginator
    {
        $escaped = str_replace(['%', '_'], ['\\%', '\\_'], $query);

        return Post::articles()
            ->where(function ($q) use ($escaped) {
                $q->where('title', 'like', "%{$escaped}%")
                    ->orWhere('excerpt', 'like', "%{$escaped}%")
                    ->orWhere('content', 'like', "%{$escaped}%");
            })
            ->select(PostCard::COLUMNS)
            ->with(PostCard::RELATIONS)
            ->withCount(['comments', 'likes'])
            ->latest('published_at')
            ->paginate(12)
            ->appends($request->only('q'))
            ->through(fn (Post $post) => PostCard::make($post));
    }
}
