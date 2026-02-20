<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show(User $user)
    {
        $posts = $user->posts()
            ->published()
            ->with(['categories', 'tags'])
            ->withCount(['comments', 'likes'])
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
            'posts' => $posts,
        ]);
    }
}
