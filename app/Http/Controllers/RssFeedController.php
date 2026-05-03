<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Response;

class RssFeedController extends Controller
{
    public function index()
    {
        $posts = Post::published()
            ->with(['user', 'categories'])
            ->select('id', 'title', 'slug', 'excerpt', 'cover_image', 'published_at', 'user_id')
            ->latest('published_at')
            ->limit(30)
            ->get();

        $content = view('rss', compact('posts'))->render();

        return response($content, 200)
            ->header('Content-Type', 'application/rss+xml; charset=UTF-8');
    }
}
