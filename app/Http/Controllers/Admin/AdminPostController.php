<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPostController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Post::with(['user', 'categories', 'deletionRequestedBy'])
            ->latest();

        if (!$user->canManageAllPosts()) {
            $query->where('user_id', $user->id);
        }

        $status = $request->string('status')->toString();

        if ($status === 'pending_deletion') {
            $query->whereNotNull('deletion_requested_at');
        } elseif (in_array($status, ['draft', 'published'], true)) {
            $query->where('status', $status)
                ->whereNull('deletion_requested_at');
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $posts = $query->paginate(15)->withQueryString();

        $posts->getCollection()->transform(function (Post $post) {
            $post->setAttribute('is_deletion_pending', $post->isDeletionPending());

            return $post;
        });

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
            'filters' => $request->only(['status', 'search']),
            'permissions' => [
                'canApproveDeletion' => $user->isAdmin(),
                'canManageAllPosts' => $user->canManageAllPosts(),
            ],
        ]);
    }

    public function create(): Response
    {
        $categories = Category::all();
        $tags = Tag::all();

        return Inertia::render('Admin/Posts/Create', [
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'cover_image' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $wordCount = str_word_count(strip_tags($validated['content']));
        $readingTime = max(1, ceil($wordCount / 200));

        $postData = [
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'reading_time_minutes' => $readingTime,
            'status' => $validated['status'],
            'published_at' => $validated['status'] === 'published' ? now() : null,
            'deletion_requested_at' => null,
            'deletion_requested_by' => null,
            'deletion_approved_at' => null,
            'deletion_approved_by' => null,
        ];

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('posts', 'public');
            $postData['cover_image'] = '/storage/' . $path;
        }

        $post = Post::create($postData);

        $post->categories()->sync($validated['categories']);
        $post->tags()->sync($validated['tags'] ?? []);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Yazı başarıyla oluşturuldu!');
    }

    public function edit(Post $post): Response
    {
        $this->authorizePostAccess($post, request()->user());

        $post->load(['categories', 'tags']);
        $categories = Category::all();
        $tags = Tag::all();

        return Inertia::render('Admin/Posts/Edit', [
            'post' => $post,
            'categories' => $categories,
            'tags' => $tags,
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $user = $request->user();
        $this->authorizePostAccess($post, $user);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'cover_image' => 'nullable|image|max:2048',
            'status' => 'required|in:draft,published',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $wordCount = str_word_count(strip_tags($validated['content']));
        $readingTime = max(1, ceil($wordCount / 200));

        $updateData = [
            'title' => $validated['title'],
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'reading_time_minutes' => $readingTime,
            'status' => $validated['status'],
        ];

        if ($validated['status'] === 'published' && !$post->published_at) {
            $updateData['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('posts', 'public');
            $updateData['cover_image'] = '/storage/' . $path;
        }

        // Admin bir yazıyı güncellediyse, isterse silme talebini kaldırabilsin.
        if ($post->isDeletionPending() && $user->isAdmin()) {
            $updateData['deletion_requested_at'] = null;
            $updateData['deletion_requested_by'] = null;
            $updateData['deletion_approved_at'] = null;
            $updateData['deletion_approved_by'] = null;
        }

        $post->update($updateData);

        $post->categories()->sync($validated['categories']);
        $post->tags()->sync($validated['tags'] ?? []);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Yazı başarıyla güncellendi!');
    }

    public function destroy(Post $post)
    {
        $user = request()->user();
        $this->authorizePostAccess($post, $user);

        if ($user->isAdmin()) {
            $this->hardDeletePost($post);

            return redirect()->route('admin.posts.index')
                ->with('success', 'Yazı kalıcı olarak silindi.');
        }

        if ($post->isDeletionPending()) {
            return back()->with('error', 'Bu yazı zaten admin onayı bekliyor.');
        }

        $post->update([
            'deletion_requested_at' => now(),
            'deletion_requested_by' => $user->id,
            'deletion_approved_at' => null,
            'deletion_approved_by' => null,
        ]);

        return back()->with('success', 'Yazı yayından kaldırıldı ve admin silme onayına gönderildi.');
    }

    public function approveDeletion(Post $post)
    {
        $user = request()->user();
        $this->assertAdmin($user);

        if (!$post->isDeletionPending()) {
            return back()->with('error', 'Bu yazı için bekleyen bir silme talebi yok.');
        }

        $post->update([
            'deletion_approved_at' => now(),
            'deletion_approved_by' => $user->id,
        ]);

        $this->hardDeletePost($post);

        return back()->with('success', 'Silme talebi onaylandı ve yazı kalıcı olarak silindi.');
    }

    public function rejectDeletion(Post $post)
    {
        $this->assertAdmin(request()->user());

        if (!$post->isDeletionPending()) {
            return back()->with('error', 'Bu yazı için bekleyen bir silme talebi yok.');
        }

        $post->update([
            'deletion_requested_at' => null,
            'deletion_requested_by' => null,
            'deletion_approved_at' => null,
            'deletion_approved_by' => null,
        ]);

        return back()->with('success', 'Silme talebi reddedildi. Yazı tekrar canlıda görünecek.');
    }

    private function authorizePostAccess(Post $post, ?User $user): void
    {
        abort_unless($user && $post->canBeEditedBy($user), 403, 'Bu yazıyı düzenleme yetkiniz yok.');
    }

    private function assertAdmin(?User $user): void
    {
        abort_unless($user && $user->isAdmin(), 403, 'Bu işlem sadece admin için açıktır.');
    }

    private function hardDeletePost(Post $post): void
    {
        $post->comments()->delete();
        $post->likes()->delete();
        $post->categories()->detach();
        $post->tags()->detach();
        $post->delete();
    }
}
