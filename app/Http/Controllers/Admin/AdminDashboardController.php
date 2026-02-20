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
        $user = request()->user();

        $postQuery = Post::query();

        if (!$user->canManageAllPosts()) {
            $postQuery->where('user_id', $user->id);
        }

        $stats = [
            'total_posts' => (clone $postQuery)->count(),
            'published_posts' => (clone $postQuery)->published()->count(),
            'draft_posts' => (clone $postQuery)->where('status', 'draft')->whereNull('deletion_requested_at')->count(),
            'pending_deletion_posts' => (clone $postQuery)->whereNotNull('deletion_requested_at')->count(),
            'total_users' => $user->isAdmin() ? User::count() : null,
            'total_comments' => $user->canManageAllPosts()
                ? Comment::count()
                : Comment::whereHas('post', fn ($query) => $query->where('user_id', $user->id))->count(),
            'total_views' => (clone $postQuery)->sum('view_count'),
            'newsletter_subscribers' => Newsletter::whereNull('unsubscribed_at')->count(),
        ];

        $recentPosts = (clone $postQuery)->with('user')
            ->latest()
            ->take(5)
            ->get();

        $recentComments = Comment::with(['user', 'post'])
            ->when(
                !$user->canManageAllPosts(),
                fn ($query) => $query->whereHas('post', fn ($subQuery) => $subQuery->where('user_id', $user->id))
            )
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
