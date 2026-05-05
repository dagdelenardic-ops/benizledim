<?php

namespace App\Http\Controllers;

use App\Services\AuthorStatsService;
use Inertia\Inertia;
use Inertia\Response;

class AuthorHomeController extends Controller
{
    public function __construct(private readonly AuthorStatsService $stats)
    {
    }

    public function index(): Response
    {
        $user = request()->user();

        return Inertia::render('Author/Home', [
            'stats' => $this->stats->forUser($user, now()->year),
            'recentLogs' => $user->posts()
                ->where('format', 'watch_log')
                ->latest('watched_on')
                ->take(6)
                ->get(),
            'recentPosts' => $user->posts()
                ->published()
                ->where('format', '!=', 'watch_log')
                ->latest('published_at')
                ->take(3)
                ->get(),
            'pendingDrafts' => $user->posts()
                ->where('status', 'draft')
                ->where('format', 'watch_log')
                ->count(),
            'letterboxd' => [
                'username' => $user->letterboxd_username,
                'enabled' => (bool) $user->letterboxd_sync_enabled,
                'lastSyncAt' => optional($user->last_letterboxd_sync_at)?->toIso8601String(),
            ],
            'pushVapidKey' => config('services.webpush.vapid_public'),
        ]);
    }
}