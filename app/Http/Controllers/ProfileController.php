<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AuthorStatsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(private readonly AuthorStatsService $stats) {}

    public function show(Request $request, User $user)
    {
        $format = $request->string('format')->toString() ?: 'standard';
        $authUser = $request->user();

        $postsQuery = $user->posts()
            ->published()
            ->with(['categories', 'tags'])
            ->withCount(['comments', 'likes']);

        if ($format === 'watch_log') {
            $postsQuery
                ->where('format', 'watch_log')
                ->orderByDesc('watched_on')
                ->orderByDesc('published_at');
        } else {
            $postsQuery
                ->where('format', '!=', 'watch_log')
                ->latest('published_at');
        }

        $posts = $postsQuery
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Profile/Show', [
            'author' => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'role' => $user->role,
                'is_following' => $authUser ? $authUser->isFollowing($user) : false,
            ],
            'format' => $format,
            'activeTab' => $format,
            'stats' => $this->stats->forUser($user),
            'posts' => $posts,
            'title' => $user->name,
            'description' => $user->bio
                ? \Illuminate\Support\Str::limit(strip_tags($user->bio), 155)
                : $user->name . ' - Ben İzledim yazarının film, dizi ve belgesel yazıları.',
            'canonicalUrl' => 'https://benizledim.com/profile/' . $user->getRouteKey(),
        ]);
    }
}
