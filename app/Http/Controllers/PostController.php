<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
use App\Services\VertexAiSearchService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::articles()
            ->with(['user', 'categories', 'tags'])
            ->withCount(['comments', 'likes'])
            ->latest('published_at');

        // Kategori filtresi
        if ($request->has('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Tag filtresi
        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        $posts = $query->paginate(12);
        $categories = Category::withCount('posts')->get();

        $listTitle = 'Tüm Yazılar';
        $listDescription = 'Ben İzledim arşivindeki tüm film, dizi ve belgesel yazıları.';
        if ($request->filled('category')) {
            $filterCategory = $categories->firstWhere('slug', $request->category);
            if ($filterCategory) {
                $listTitle = $filterCategory->name . ' Yazıları';
                $listDescription = $filterCategory->name . ' kategorisindeki film, dizi ve belgesel yazıları.';
            }
        } elseif ($request->filled('tag')) {
            $listTitle = 'Etiket: ' . $request->tag;
            $listDescription = $request->tag . ' etiketiyle işaretlenmiş Ben İzledim yazıları.';
        }

        return Inertia::render('Post/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => $request->only(['category', 'tag']),
            'title' => $listTitle,
            'description' => $listDescription,
        ]);
    }

    public function indexByCategory(Request $request, Category $category)
    {
        $posts = Post::articles()
            ->with(['user', 'categories', 'tags'])
            ->withCount(['comments', 'likes'])
            ->whereHas('categories', fn ($q) => $q->where('categories.id', $category->id))
            ->latest('published_at')
            ->paginate(12);

        $categories = Category::withCount('posts')->get();

        return Inertia::render('Post/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => ['category' => $category->slug],
            'title' => $category->name . ' Yazıları',
            'description' => $category->name . ' kategorisindeki film, dizi ve belgesel eleştiri ve tavsiye yazıları.',
            'canonicalUrl' => 'https://benizledim.com/yazilar/' . $category->slug,
        ]);
    }

    public function show(Request $request, Post $post, VertexAiSearchService $vertex)
    {
        if (!$post->published_at || $post->status !== 'published' || $post->deletion_requested_at) {
            abort(404);
        }

        // View count: session-based dedup to prevent bot/refresh inflation
        $viewKey = 'viewed_post_' . $post->id;
        if (!$request->session()->has($viewKey)) {
            $post->increment('view_count');
            $request->session()->put($viewKey, true);
        }

        $post->load([
            'user', 'categories', 'tags', 'comments.user',
            'entries.user', 'entries.votes',
            'originalPost:id,title,slug,published_at',
            'revisits' => fn ($q) => $q->published()->select('id', 'title', 'slug', 'published_at', 'parent_post_id'),
            'secondaryAuthor:id,name,avatar',
            'dialogueExchanges.user:id,name,avatar',
            'visualEssayBlocks',
        ]);
        $post->loadCount('likes');

        $isLiked = auth()->check()
            ? $post->likes()->where('user_id', auth()->id())->exists()
            : false;
        $isWatchlisted = auth()->check()
            ? $post->watchlistedBy()->where('users.id', auth()->id())->exists()
            : false;

        $relatedPosts = $this->resolveRelatedPosts($post, $vertex);

        $userEntryVotes = [];
        if (auth()->check()) {
            $userEntryVotes = \App\Models\EntryVote::whereIn('entry_id', $post->entries->pluck('id'))
                ->where('user_id', auth()->id())
                ->pluck('vote', 'entry_id')
                ->toArray();
        }

        return Inertia::render('Post/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'isLiked' => $isLiked,
            'isWatchlisted' => $isWatchlisted,
            'userEntryVotes' => $userEntryVotes,
        ]);
    }

    private function resolveRelatedPosts(Post $post, VertexAiSearchService $vertex)
    {
        $limit = 4;

        if (config('services.gcp.search_enabled')) {
            $moodTags = is_array($post->mood_tags) ? $post->mood_tags : [];
            $signal = trim($post->title . ' ' . implode(' ', $moodTags));
            $hits = $vertex->search($signal, $limit + 4);
            $ids = collect($hits)->pluck('id')->filter()->map(fn ($id) => (int) $id)
                ->reject(fn ($id) => $id === $post->id)
                ->take($limit)
                ->values();

            if ($ids->isNotEmpty()) {
                $posts = Post::articles()
                    ->whereIn('id', $ids)
                    ->with(['user', 'categories'])
                    ->withCount(['comments', 'likes'])
                    ->get()
                    ->keyBy('id');

                $ordered = $ids->map(fn ($id) => $posts->get($id))->filter()->values();
                if ($ordered->isNotEmpty()) {
                    return $ordered;
                }
            }
        }

        return Post::articles()
            ->where('id', '!=', $post->id)
            ->whereHas('categories', function ($q) use ($post) {
                $q->whereIn('categories.id', $post->categories->pluck('id'));
            })
            ->with(['user', 'categories'])
            ->withCount(['comments', 'likes'])
            ->limit($limit)
            ->latest('published_at')
            ->get();
    }
}
