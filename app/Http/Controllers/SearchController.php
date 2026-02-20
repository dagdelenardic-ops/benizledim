<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->input('q', '');
        $posts = collect();

        if (strlen($query) >= 2) {
            $posts = Post::published()
                ->where(function ($q) use ($query) {
                    $q->where('title', 'like', "%{$query}%")
                      ->orWhere('excerpt', 'like', "%{$query}%")
                      ->orWhere('content', 'like', "%{$query}%");
                })
                ->with(['user', 'categories'])
                ->withCount(['comments', 'likes'])
                ->latest('published_at')
                ->paginate(12);
        }

        return Inertia::render('Search/Index', [
            'posts' => $posts,
            'query' => $query,
        ]);
    }
}
