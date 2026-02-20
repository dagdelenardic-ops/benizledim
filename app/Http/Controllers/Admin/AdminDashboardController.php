<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use App\Models\Newsletter;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_posts' => Post::count(),
            'published_posts' => Post::where('status', 'published')->count(),
            'draft_posts' => Post::where('status', 'draft')->count(),
            'total_users' => User::count(),
            'total_comments' => Comment::count(),
            'total_views' => Post::sum('view_count'),
            'newsletter_subscribers' => Newsletter::whereNull('unsubscribed_at')->count(),
        ];

        $recentPosts = Post::with('user')
            ->latest()
            ->take(5)
            ->get();

        $recentComments = Comment::with(['user', 'post'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentPosts' => $recentPosts,
            'recentComments' => $recentComments,
        ]);
    }
}
