<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\FlashNews;
use App\Models\Post;
use App\Models\User;

class SitemapController extends Controller
{
    public function index()
    {
        $posts = Post::articles()
            ->select('slug', 'published_at', 'updated_at')
            ->latest('published_at')
            ->cursor();
        $categories = Category::select('slug')->cursor();

        // Author profiles are indexable and carry their own canonical, but they
        // were reachable only through article bylines. Only list authors who
        // actually have something published.
        $authors = User::select('id')
            ->whereHas('posts', fn ($q) => $q->published())
            ->cursor();

        $flashNews = collect();
        try {
            $flashNews = FlashNews::published()
                ->whereNotNull('image_url')
                ->select('slug', 'published_at', 'updated_at')
                ->latest('published_at')
                ->limit(500)
                ->get();
        } catch (\Throwable $e) {
            // table not yet created
        }

        $content = view('sitemap', compact('posts', 'categories', 'authors', 'flashNews'))->render();

        return response($content, 200)
            ->header('Content-Type', 'text/xml');
    }
}
