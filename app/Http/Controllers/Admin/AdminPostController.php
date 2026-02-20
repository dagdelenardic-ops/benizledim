<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['user', 'categories'])
            ->latest();

        if ($request->has('status') && in_array($request->status, ['draft', 'published'])) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $posts = $query->paginate(15);

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create()
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

        // Okuma süresi hesapla (her 200 kelime = 1 dakika)
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
        ];

        // Cover image upload
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('posts', 'public');
            $postData['cover_image'] = '/storage/' . $path;
        }

        $post = Post::create($postData);

        $post->categories()->sync($validated['categories']);
        if (!empty($validated['tags'])) {
            $post->tags()->sync($validated['tags']);
        }

        return redirect()->route('admin.posts.index')
            ->with('success', 'Yazı başarıyla oluşturuldu!');
    }

    public function edit(Post $post)
    {
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

        // Yeni publish oluyorsa published_at set et
        if ($validated['status'] === 'published' && !$post->published_at) {
            $updateData['published_at'] = now();
        }

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('posts', 'public');
            $updateData['cover_image'] = '/storage/' . $path;
        }

        $post->update($updateData);

        $post->categories()->sync($validated['categories']);
        $post->tags()->sync($validated['tags'] ?? []);

        return redirect()->route('admin.posts.index')
            ->with('success', 'Yazı başarıyla güncellendi!');
    }

    public function destroy(Post $post)
    {
        $post->comments()->delete();
        $post->likes()->delete();
        $post->categories()->detach();
        $post->tags()->detach();
        $post->delete();

        return redirect()->route('admin.posts.index')
            ->with('success', 'Yazı silindi.');
    }
}
