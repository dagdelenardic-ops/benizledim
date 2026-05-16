<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\FlashNews;
use App\Models\Post;

class SitemapController extends Controller
{
    public function index()
    {
        $posts = Post::articles()
            ->select('slug', 'published_at', 'updated_at')
            ->latest('published_at')
            ->cursor();
        $categories = Category::select('slug')->cursor();

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

        $content = view('sitemap', compact('posts', 'categories', 'flashNews'))->render();

        return response($content, 200)
            ->header('Content-Type', 'text/xml');
    }
}
