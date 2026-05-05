<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuthorStatsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(private readonly AuthorStatsService $stats)
    {
    }

    public function show(Request $request, User $user)
    {
        $format = $request->string('format')->toString() ?: 'standard';

        $posts = $user->posts()
            ->published()
            ->with(['categories', 'tags'])
            ->withCount(['comments', 'likes'])
            ->when($format === 'watch_log', fn ($query) => $query->where('format', 'watch_log'))
            ->when($format === 'standard', fn ($query) => $query->where('format', '!=', 'watch_log'))
            ->latest('published_at')
            ->paginate(12);

        return Inertia::render('Profile/Show', [
            'author' => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'role' => $user->role,
            ],
            'format' => $format,
            'stats' => $this->stats->forUser($user),
            'posts' => $posts,
        ]);
    }
}
