<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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

        return Inertia::render('Author/Index', [
            'authors' => $authors,
            'filters' => ['q' => $request->query('q', '')],
        ]);
    }
}
