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
            $escaped = str_replace(['%', '_'], ['\\%', '\\_'], $query);
            $posts = Post::articles()
                ->where(function ($q) use ($escaped) {
                    $q->where('title', 'like', "%{$escaped}%")
                      ->orWhere('excerpt', 'like', "%{$escaped}%")
                      ->orWhere('content', 'like', "%{$escaped}%");
                })
                ->with(['user', 'categories'])
                ->withCount(['comments', 'likes'])
                ->latest('published_at')
                ->paginate(12)
                ->appends($request->only('q'));
        }

        return Inertia::render('Search/Index', [
            'posts' => $posts,
            'query' => $query,
        ]);
    }
}
