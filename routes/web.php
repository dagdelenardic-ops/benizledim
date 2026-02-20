<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PodcastController;
use App\Http\Controllers\FestivalController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminPostController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\SitemapController;

// Sitemap
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::get('/', function () {
    // Ana sayfa: son yazıları göster
    $posts = \App\Models\Post::published()
        ->with(['user', 'categories', 'tags'])
        ->withCount(['comments', 'likes'])
        ->latest('published_at')
        ->take(8)
        ->get();

    $categories = \App\Models\Category::withCount('posts')->get();

    return Inertia::render('Home', [
        'posts' => $posts,
        'categories' => $categories,
    ]);
});

// Yazı listesi (kategori/tag filtreleme)
Route::get('/yazilar', [PostController::class, 'index'])->name('posts.index');

// Yazı detay (slug ile)
Route::get('/yazi/{post}', [PostController::class, 'show'])->name('posts.show');

// Arama
Route::get('/ara', [SearchController::class, 'index'])->name('search');

// Yorum
Route::post('/yazi/{post}/yorum', [CommentController::class, 'store'])->name('comments.store');
Route::delete('/yorum/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

// Beğeni (toggle)
Route::post('/yazi/{post}/begen', [LikeController::class, 'toggle'])->name('likes.toggle');

// Podcast
Route::get('/podcast', [PodcastController::class, 'index'])->name('podcast.index');

// Festival
Route::get('/festival', [FestivalController::class, 'index'])->name('festival.index');

// Newsletter
Route::post('/newsletter', [NewsletterController::class, 'store'])->name('newsletter.store');

// Yazar Profili
Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');

// Admin Panel
Route::prefix('admin')->middleware(['auth', 'admin'])->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Yazılar
    Route::get('/posts', [AdminPostController::class, 'index'])->name('posts.index');
    Route::get('/posts/create', [AdminPostController::class, 'create'])->name('posts.create');
    Route::post('/posts', [AdminPostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post}/edit', [AdminPostController::class, 'edit'])->name('posts.edit');
    Route::put('/posts/{post}', [AdminPostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post}', [AdminPostController::class, 'destroy'])->name('posts.destroy');

    // Kategoriler
    Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

    // Kullanıcılar
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::put('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.updateRole');
});

// Wix Redirect'leri (eski URL yapısından yeni yapıya)
// Wix blog post formatı: /post/yazi-basligi
Route::get('/post/{slug}', function (string $slug) {
    $post = \App\Models\Post::where('slug', $slug)->first();

    if ($post) {
        return redirect("/yazi/{$post->slug}", 301);
    }

    return redirect('/yazilar', 302);
});

// Wix kategori formatı
Route::get('/blog/categories/{slug}', function (string $slug) {
    return redirect("/yazilar?category={$slug}", 301);
});
