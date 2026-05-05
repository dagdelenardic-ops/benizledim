<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPostController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $query = Post::with(['user', 'categories', 'deletionRequestedBy', 'pendingReviewBy', 'reviewedBy'])
            ->latest();

        if (!$user->canManageAllPosts()) {
            $query->where('user_id', $user->id);
        }

        $status = $request->string('status')->toString();

        if ($status === 'pending_deletion') {
            $query->whereNotNull('deletion_requested_at');
        } elseif (in_array($status, ['draft', 'published', 'pending_review'], true)) {
            $query->where('status', $status)
                ->whereNull('deletion_requested_at');
        }

        $ownerId = $request->integer('owner');

        if ($ownerId > 0 && $user->canManageAllPosts()) {
            $query->where('user_id', $ownerId);
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
            $post->setAttribute('resolved_status', $post->resolveStatus());

            return $post;
        });

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
            'filters' => $request->only(['status', 'search', 'owner']),
            'owners' => $user->canManageAllPosts()
                ? User::query()->orderBy('name')->get(['id', 'name', 'email', 'role'])
                : [],
            'permissions' => [
                'canApproveDeletion' => $user->isAdmin(),
                'canManageAllPosts' => $user->canManageAllPosts(),
                'canReviewPosts' => $user->canManageAllPosts(),
                'canReassignPosts' => $user->isAdmin(),
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
            'publishMode' => [
                'requiresReview' => !request()->user()?->canPublishWithoutReview(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'cover_image' => 'nullable|image|max:8192',
            'cover_image_focus_x' => 'nullable|integer|min:0|max:100',
            'cover_image_focus_y' => 'nullable|integer|min:0|max:100',
            'cover_image_mobile_focus_x' => 'nullable|integer|min:0|max:100',
            'cover_image_mobile_focus_y' => 'nullable|integer|min:0|max:100',
            'status' => 'required|in:draft,published',
            'scheduled_at' => 'nullable|date',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        $wordCount = str_word_count(strip_tags($validated['content']));
        $readingTime = max(1, ceil($wordCount / 200));
        $scheduledAt = $validated['scheduled_at'] ?? null;
        $targetStatus = $scheduledAt ? 'draft' : $this->resolveTargetStatus($user, $validated['status']);

        $postData = [
            'user_id' => $user->id,
            'title' => $validated['title'],
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'cover_image_focus_x' => $validated['cover_image_focus_x'] ?? 50,
            'cover_image_focus_y' => $validated['cover_image_focus_y'] ?? 50,
            'cover_image_mobile_focus_x' => $validated['cover_image_mobile_focus_x'] ?? 50,
            'cover_image_mobile_focus_y' => $validated['cover_image_mobile_focus_y'] ?? 50,
            'status' => $targetStatus,
            'reading_time_minutes' => $readingTime,
            'scheduled_at' => $scheduledAt ?: null,
            'published_at' => $targetStatus === 'published' ? now() : null,
            'pending_review_at' => $targetStatus === 'pending_review' ? now() : null,
            'pending_review_by' => $targetStatus === 'pending_review' ? $user->id : null,
        ];

        $post = Post::create($postData);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('posts', 'public');
            $post->update(['cover_image' => '/storage/' . $path]);
        }

        $post->categories()->sync($validated['categories']);
        $post->tags()->sync($validated['tags'] ?? []);

        $message = $targetStatus === 'pending_review'
            ? 'Yazı inceleme için gönderildi.'
            : 'Yazı başarıyla kaydedildi!';

        return redirect()->route('admin.posts.index')
            ->with('success', $message);
    }

    public function edit(Post $post): Response
    {
        $user = request()->user();
        $this->authorizePostAccess($post, $user);

        $post->load(['categories', 'tags']);

        return Inertia::render('Admin/Posts/Edit', [
            'post' => $post,
            'categories' => Category::all(),
            'tags' => Tag::all(),
            'publishMode' => [
                'requiresReview' => !$user->canPublishWithoutReview(),
            ],
            'owners' => $user->canManageAllPosts()
                ? User::query()->orderBy('name')->get(['id', 'name', 'email', 'role'])
                : [],
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
            'cover_image' => 'nullable|image|max:8192',
            'cover_image_focus_x' => 'nullable|integer|min:0|max:100',
            'cover_image_focus_y' => 'nullable|integer|min:0|max:100',
            'cover_image_mobile_focus_x' => 'nullable|integer|min:0|max:100',
            'cover_image_mobile_focus_y' => 'nullable|integer|min:0|max:100',
            'status' => 'required|in:draft,published',
            'scheduled_at' => 'nullable|date',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $wordCount = str_word_count(strip_tags($validated['content']));
        $readingTime = max(1, ceil($wordCount / 200));
        $scheduledAt = $validated['scheduled_at'] ?? null;
        $targetStatus = $scheduledAt ? 'draft' : $this->resolveTargetStatus($user, $validated['status']);

        $updateData = [
            'title' => $validated['title'],
            'excerpt' => $validated['excerpt'] ?? null,
            'content' => $validated['content'],
            'cover_image_focus_x' => $validated['cover_image_focus_x'] ?? 50,
            'cover_image_focus_y' => $validated['cover_image_focus_y'] ?? 50,
            'cover_image_mobile_focus_x' => $validated['cover_image_mobile_focus_x'] ?? 50,
            'cover_image_mobile_focus_y' => $validated['cover_image_mobile_focus_y'] ?? 50,
            'reading_time_minutes' => $readingTime,
            'status' => $targetStatus,
            'scheduled_at' => $scheduledAt ?: null,
            'pending_review_at' => $targetStatus === 'pending_review' ? now() : null,
            'pending_review_by' => $targetStatus === 'pending_review' ? $user->id : null,
            'reviewed_at' => $targetStatus === 'published' ? now() : null,
            'reviewed_by' => $targetStatus === 'published' ? $user->id : null,
        ];

        if ($targetStatus === 'published' && !$post->published_at) {
            $updateData['published_at'] = now();
        }

        if ($targetStatus !== 'published') {
            $updateData['published_at'] = null;
        }

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('posts', 'public');
            $updateData['cover_image'] = '/storage/' . $path;
        }

        if ($post->isDeletionPending() && $user->isAdmin()) {
            $updateData['deletion_requested_at'] = null;
            $updateData['deletion_requested_by'] = null;
            $updateData['deletion_approved_at'] = null;
            $updateData['deletion_approved_by'] = null;
        }

        $post->update($updateData);

        $post->categories()->sync($validated['categories']);
        $post->tags()->sync($validated['tags'] ?? []);

        $message = $targetStatus === 'pending_review'
            ? 'Yazı güncellendi ve tekrar incelemeye gönderildi.'
            : 'Yazı başarıyla güncellendi!';

        return redirect()->route('admin.posts.index')
            ->with('success', $message);
    }

    public function updateOwner(Request $request, Post $post)
    {
        $user = $request->user();
        $this->assertAdmin($user);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $post->update([
            'user_id' => (int) $validated['user_id'],
        ]);

        return back()->with('success', 'Yazı sahibi güncellendi.');
    }

    public function approveReview(Post $post)
    {
        $user = request()->user();
        abort_unless($user && $user->canManageAllPosts(), 403, 'Bu işlem için yetkiniz yok.');

        abort_unless($post->isPendingReview(), 422, 'Bu yazı inceleme beklemiyor.');

        $post->update([
            'status' => 'published',
            'published_at' => $post->published_at ?? now(),
            'pending_review_at' => null,
            'pending_review_by' => null,
            'reviewed_at' => now(),
            'reviewed_by' => $user->id,
        ]);

        return back()->with('success', 'Yazı yayına alındı.');
    }

    public function rejectReview(Post $post)
    {
        $user = request()->user();
        abort_unless($user && $user->canManageAllPosts(), 403, 'Bu işlem için yetkiniz yok.');

        abort_unless($post->isPendingReview(), 422, 'Bu yazı inceleme beklemiyor.');

        $post->update([
            'status' => 'draft',
            'published_at' => null,
            'pending_review_at' => null,
            'pending_review_by' => null,
            'reviewed_at' => now(),
            'reviewed_by' => $user->id,
        ]);

        return back()->with('success', 'Yazı taslağa geri alındı.');
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
        $entryIds = $post->entries()->pluck('id');
        \App\Models\EntryVote::whereIn('entry_id', $entryIds)->delete();

        $post->entries()->delete();
        $post->comments()->delete();
        $post->likes()->delete();
        $post->dialogueExchanges()->delete();
        $post->visualEssayBlocks()->delete();
        $post->categories()->detach();
        $post->tags()->detach();
        $post->delete();
    }

    public function autosave(Request $request, Post $post): JsonResponse
    {
        $this->authorize('update', $post);

        $request->validate([
            'content' => ['required', 'string', 'max:500000'],
        ]);

        $post->update([
            'content'    => $request->string('content'),
            'updated_at' => now(),
        ]);

        return response()->json([
            'saved_at' => $post->updated_at->toISOString(),
        ]);
    }

    public function draftStatus(Post $post): JsonResponse
    {
        $this->authorize('view', $post);

        return response()->json([
            'updated_at' => $post->updated_at->toISOString(),
            'status'     => $post->status,
        ]);
    }

    public function searchPosts(Request $request): JsonResponse
    {
        $query = $request->string('q')->toString();

        if (mb_strlen($query) < 2) {
            return response()->json([]);
        }

        $posts = Post::published()
            ->where('title', 'like', "%{$query}%")
            ->orWhere('excerpt', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'title', 'slug']);

        return response()->json($posts);
    }

    public function checkSlug(Request $request): JsonResponse
    {
        $slug = $request->string('slug')->toString();
        $excludeId = $request->integer('exclude');

        $exists = Post::where('slug', $slug)
            ->when($excludeId > 0, fn ($q) => $q->where('id', '!=', $excludeId))
            ->exists();

        return response()->json(['available' => !$exists]);
    }

    private function resolveTargetStatus(User $user, string $requestedStatus): string
    {
        if ($requestedStatus !== 'published') {
            return 'draft';
        }

        return $user->canPublishWithoutReview() ? 'published' : 'pending_review';
    }
}
