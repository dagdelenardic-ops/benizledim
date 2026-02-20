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
        $query = Post::published()
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

    public function show(Post $post)
    {
        // View count artır
        $post->increment('view_count');

        $post->load(['user', 'categories', 'tags', 'comments.user', 'likes']);

        // Mevcut kullanıcı beğenmiş mi?
        $isLiked = auth()->check()
            ? $post->likes->contains('user_id', auth()->id())
            : false;

        $relatedPosts = Post::published()
            ->where('id', '!=', $post->id)
            ->whereHas('categories', function ($q) use ($post) {
                $q->whereIn('categories.id', $post->categories->pluck('id'));
            })
            ->with(['user', 'categories'])
            ->withCount(['comments', 'likes'])
            ->limit(4)
            ->latest('published_at')
            ->get();

        return Inertia::render('Post/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'isLiked' => $isLiked,
        ]);
    }
}
