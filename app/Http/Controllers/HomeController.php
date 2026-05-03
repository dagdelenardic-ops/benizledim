<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $posts = Post::published()
            ->with(['user', 'categories', 'tags'])
            ->withCount(['comments', 'likes'])
            ->latest('published_at')
            ->take(8)
            ->get();

        $categories = Category::withCount('posts')->get();

        return Inertia::render('Home', [
            'posts' => $posts,
            'categories' => $categories,
        ]);
    }
}
