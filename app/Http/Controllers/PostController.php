<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Category;
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

        return Inertia::render('Post/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => $request->only(['category', 'tag']),
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
        ]);
    }

    public function show(Request $request, Post $post)
    {
        if (! $post->isPubliclyViewable()) {
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

        $relatedPosts = Post::articles()
            ->where('id', '!=', $post->id)
            ->whereHas('categories', function ($q) use ($post) {
                $q->whereIn('categories.id', $post->categories->pluck('id'));
            })
            ->with(['user', 'categories'])
            ->withCount(['comments', 'likes'])
            ->limit(4)
            ->latest('published_at')
            ->get();

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
}
