<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Services\AuthorStatsService;
use App\Support\PostCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(private readonly AuthorStatsService $stats) {}

    public function show(Request $request, User $user)
    {
        $requestedFormat = $request->string('format')->toString();
        $format = in_array($requestedFormat, ['standard', 'watch_log'], true)
            ? $requestedFormat
            : 'standard';
        $authUser = $request->user();

        $postsQuery = $user->posts()
            ->published()
            ->select(PostCard::COLUMNS)
            ->with(PostCard::RELATIONS)
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
            ->appends($format === 'watch_log' ? ['format' => $format] : [])
            ->through(fn (Post $post) => PostCard::make($post));

        $canonicalParameters = [];
        if ($format !== 'standard') {
            $canonicalParameters['format'] = $format;
        }
        if ($request->integer('page', 1) > 1) {
            $canonicalParameters['page'] = $request->integer('page');
        }

        $canonicalUrl = 'https://benizledim.com/profile/'.$user->getRouteKey();
        if ($canonicalParameters !== []) {
            $canonicalUrl .= '?'.http_build_query($canonicalParameters, '', '&', PHP_QUERY_RFC3986);
        }

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
            'title' => $format === 'watch_log' ? $user->name.' Watch-Log' : $user->name,
            'description' => $user->bio
                ? \Illuminate\Support\Str::limit(strip_tags($user->bio), 155)
                : $user->name.' - Ben İzledim yazarının film, dizi ve belgesel yazıları.',
            'canonicalUrl' => $canonicalUrl,
        ]);
    }
}
