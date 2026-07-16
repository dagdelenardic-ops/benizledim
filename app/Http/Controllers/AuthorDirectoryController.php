<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AuthorDirectoryController extends Controller
{
    public function index(Request $request): Response
    {
        $authUser = $request->user();
        $followingIds = $authUser ? $authUser->following()->pluck('users.id')->all() : [];

        $authors = User::query()
            ->whereIn('role', ['admin', 'editor', 'author'])
            ->when($request->filled('q'), function ($query) use ($request) {
                $query->where('name', 'like', '%'.$request->query('q').'%');
            })
            ->withCount(['posts', 'followers'])
            ->orderBy('name')
            ->paginate(24)
            ->appends($request->only('q'))
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'bio' => $user->bio,
                'role' => $user->role,
                'posts_count' => $user->posts_count,
                'followers_count' => $user->followers_count,
                'is_following' => in_array($user->id, $followingIds, true),
            ]);

        $canonicalUrl = 'https://benizledim.com/yazarlar';
        if (! $request->filled('q') && $request->integer('page', 1) > 1) {
            $canonicalUrl .= '?page='.$request->integer('page');
        }

        return Inertia::render('Author/Index', [
            'authors' => $authors,
            'filters' => ['q' => $request->query('q', '')],
            'title' => 'Yazarlar',
            'description' => 'Ben İzledim yazar kadrosu: film, dizi ve belgesel üzerine yazan eleştirmenler ve katkıda bulunanlar.',
            'canonicalUrl' => $canonicalUrl,
            'robots' => $request->filled('q')
                ? 'noindex, follow'
                : 'index, follow, max-image-preview:large, max-snippet:-1',
        ]);
    }

    public function search(Request $request)
    {
        $query = trim((string) $request->query('q', ''));

        if (mb_strlen($query) < 1) {
            return response()->json([]);
        }

        $authors = User::query()
            ->whereIn('role', ['admin', 'editor', 'author'])
            ->where('name', 'like', '%'.$query.'%')
            ->orderBy('name')
            ->limit(8)
            ->get(['id', 'name', 'avatar'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'avatar' => $user->avatar,
                'username' => Str::slug($user->name),
            ])
            ->values();

        return response()->json($authors);
    }
}
