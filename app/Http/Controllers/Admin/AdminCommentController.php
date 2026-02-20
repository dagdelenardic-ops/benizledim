<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCommentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Comment::with(['user', 'post.user'])
            ->latest();

        if (!$user->canManageAllPosts()) {
            $query->whereHas('post', fn ($postQuery) => $postQuery->where('user_id', $user->id));
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search) {
                $builder->where('content', 'like', "%{$search}%")
                    ->orWhereHas('post', fn ($postQuery) => $postQuery->where('title', 'like', "%{$search}%"))
                    ->orWhereHas('user', fn ($userQuery) => $userQuery->where('name', 'like', "%{$search}%"));
            });
        }

        $comments = $query->paginate(30)->withQueryString();

        return Inertia::render('Admin/Comments/Index', [
            'comments' => $comments,
            'filters' => $request->only('search'),
        ]);
    }

    public function destroy(Comment $comment)
    {
        $user = request()->user();

        $canDelete = $user->canManageAllPosts()
            || $comment->post()->where('user_id', $user->id)->exists();

        abort_unless($canDelete, 403, 'Bu yorumu silme yetkiniz yok.');

        $comment->delete();

        return back()->with('success', 'Yorum silindi.');
    }
}
