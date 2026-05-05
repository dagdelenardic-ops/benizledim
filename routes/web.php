<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PodcastController;
use App\Http\Controllers\FestivalController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\AdminTagController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminCommentController;
use App\Http\Controllers\Admin\AdminPodcastController;
use App\Http\Controllers\Admin\AdminPageController;
use App\Http\Controllers\Admin\AdminPostController;
use App\Http\Controllers\Admin\AdminFestivalEventController;
use App\Http\Controllers\Admin\AdminCategoryController;
use App\Http\Controllers\Admin\AdminNewsletterController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\PostImageController;
use App\Http\Controllers\Admin\PostEmbedController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\EntryController;
use App\Http\Controllers\CinemaController;
use App\Http\Controllers\CinemaReviewController;
use App\Http\Controllers\AiRecommendationController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\RssFeedController;
use App\Http\Controllers\WixRedirectController;
use App\Http\Controllers\ImageVariantController;
use App\Http\Controllers\Api\TmdbSearchController;
use App\Http\Controllers\QuickLogController;
use App\Http\Controllers\AuthorHomeController;
use App\Http\Controllers\PushSubscriptionController;
use App\Http\Controllers\LetterboxdController;

Route::get('/up', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
})->name('health.up');

Route::get('/img/variant', [ImageVariantController::class, 'show'])->name('image.variant');

// Sitemap & RSS
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/feed', [RssFeedController::class, 'index'])->name('feed');
Route::get('/rss', [RssFeedController::class, 'index']);

Route::get('/', [HomeController::class, 'index']);

// Yazı listesi (kategori/tag filtreleme)
Route::get('/yazilar', [PostController::class, 'index'])->name('posts.index');
Route::get('/yazilar/{category:slug}', [PostController::class, 'indexByCategory'])->name('posts.category');

// Yazı detay (slug ile)
Route::get('/yazi/{post}', [PostController::class, 'show'])->name('posts.show');

// Arama
Route::get('/ara', [SearchController::class, 'index'])->name('search');

// Yorum
Route::post('/yazi/{post}/yorum', [CommentController::class, 'store'])->name('comments.store')->middleware('auth');
Route::delete('/yorum/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy')->middleware('auth');

// Beğeni (toggle)
Route::post('/yazi/{post}/begen', [LikeController::class, 'toggle'])->name('likes.toggle')->middleware('auth');

// Entry (sosyal tartışma)
Route::post('/yazi/{post}/entry', [EntryController::class, 'store'])->name('entries.store');
Route::post('/entry/{entry}/vote', [EntryController::class, 'vote'])->name('entries.vote')->middleware('auth');
Route::delete('/entry/{entry}', [EntryController::class, 'destroy'])->name('entries.destroy')->middleware('auth');

// Sinemalar
Route::get('/sinemalar', [CinemaController::class, 'index'])->name('cinemas.index');
Route::get('/sinema/{cinema}', [CinemaController::class, 'show'])->name('cinemas.show');
Route::post('/sinema/{cinema}/yorum', [CinemaReviewController::class, 'store'])->name('cinema-reviews.store')->middleware('auth');
Route::delete('/sinema-yorum/{cinemaReview}', [CinemaReviewController::class, 'destroy'])->name('cinema-reviews.destroy')->middleware('auth');

// Ne Izlesem (AI Recommendation)
Route::get('/ne-izlesem', [AiRecommendationController::class, 'index'])->name('recommend.index');
Route::post('/ne-izlesem/chat', [AiRecommendationController::class, 'chat'])->name('recommend.chat');
Route::post('/ne-izlesem/new', [AiRecommendationController::class, 'newConversation'])->name('recommend.new');

// Podcast
Route::get('/podcast', [PodcastController::class, 'index'])->name('podcast.index');

// Festival
Route::get('/festival', [FestivalController::class, 'index'])->name('festival.index');

// Newsletter
Route::post('/newsletter', [NewsletterController::class, 'store'])->name('newsletter.store');

// Yazar Profili
Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');

Route::middleware(['auth', 'role:admin,editor,author'])
    ->get('/yazar', [AuthorHomeController::class, 'index'])
    ->name('author.home');

Route::middleware('auth')->group(function () {
    Route::post('/api/quick-log', [QuickLogController::class, 'store'])->name('quick-log.store');
    Route::get('/api/tmdb/search', [TmdbSearchController::class, 'search'])->name('tmdb.search');
    Route::post('/api/push/subscribe', [PushSubscriptionController::class, 'store'])->name('push.subscribe');
    Route::delete('/api/push/subscribe', [PushSubscriptionController::class, 'destroy'])->name('push.unsubscribe');
    Route::get('/api/push/vapid', [PushSubscriptionController::class, 'vapidKey'])->name('push.vapid');
    Route::post('/api/push/test', [PushSubscriptionController::class, 'test'])->name('push.test');
    Route::post('/api/letterboxd/connect', [LetterboxdController::class, 'connect'])->name('letterboxd.connect');
    Route::post('/api/letterboxd/confirm', [LetterboxdController::class, 'confirm'])->name('letterboxd.confirm');
    Route::post('/api/letterboxd/sync-now', [LetterboxdController::class, 'syncNow'])->name('letterboxd.sync');
    Route::delete('/api/letterboxd', [LetterboxdController::class, 'disconnect'])->name('letterboxd.disconnect');
});

// Statik Sayfalar
Route::get('/sayfa/{page:slug}', [PageController::class, 'show'])->name('pages.show');

// Admin Panel
Route::prefix('admin')->middleware(['auth', 'admin'])->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Yazılar (admin, editör, yazar)
    Route::get('/posts', [AdminPostController::class, 'index'])->name('posts.index');
    Route::get('/posts/create', [AdminPostController::class, 'create'])->name('posts.create');
    Route::post('/posts/autosave-draft', [AdminPostController::class, 'autosaveDraft'])->name('posts.autosaveDraft');
    Route::post('/posts', [AdminPostController::class, 'store'])->name('posts.store');
    Route::get('/posts/{post:id}/edit', [AdminPostController::class, 'edit'])->name('posts.edit');
    Route::put('/posts/{post:id}', [AdminPostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post:id}', [AdminPostController::class, 'destroy'])->name('posts.destroy');

    // Autosave & draft status
    Route::put('/posts/{post:id}/autosave', [AdminPostController::class, 'autosave'])->name('posts.autosave');
    Route::get('/posts/{post:id}/draft-status', [AdminPostController::class, 'draftStatus'])->name('posts.draftStatus');

    // Slug check & post search (inline editör için)
    Route::get('/posts/check-slug', [AdminPostController::class, 'checkSlug'])->name('posts.checkSlug');
    Route::get('/posts/search', [AdminPostController::class, 'searchPosts'])->name('posts.search');

    // Görsel yükleme
    Route::post('/posts/images', [PostImageController::class, 'store'])
        ->middleware('throttle:60,1')
        ->name('posts.images.store');

    // Embed çözümleme
    Route::post('/posts/embed', [PostEmbedController::class, 'oembed'])->name('posts.embed');

    Route::middleware('role:admin,editor')->group(function () {
        Route::post('/posts/{post:id}/approve-review', [AdminPostController::class, 'approveReview'])->name('posts.approveReview');
        Route::post('/posts/{post:id}/reject-review', [AdminPostController::class, 'rejectReview'])->name('posts.rejectReview');

        // Kategoriler
        Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

        // Etiketler
        Route::get('/tags', [AdminTagController::class, 'index'])->name('tags.index');
        Route::post('/tags', [AdminTagController::class, 'store'])->name('tags.store');
        Route::put('/tags/{tag}', [AdminTagController::class, 'update'])->name('tags.update');
        Route::delete('/tags/{tag}', [AdminTagController::class, 'destroy'])->name('tags.destroy');

        // Podcast
        Route::get('/podcasts', [AdminPodcastController::class, 'index'])->name('podcasts.index');
        Route::post('/podcasts', [AdminPodcastController::class, 'store'])->name('podcasts.store');
        Route::put('/podcasts/{podcast}', [AdminPodcastController::class, 'update'])->name('podcasts.update');
        Route::delete('/podcasts/{podcast}', [AdminPodcastController::class, 'destroy'])->name('podcasts.destroy');

        // Festival
        Route::get('/festival-events', [AdminFestivalEventController::class, 'index'])->name('festival.index');
        Route::post('/festival-events', [AdminFestivalEventController::class, 'store'])->name('festival.store');
        Route::put('/festival-events/{festivalEvent}', [AdminFestivalEventController::class, 'update'])->name('festival.update');
        Route::delete('/festival-events/{festivalEvent}', [AdminFestivalEventController::class, 'destroy'])->name('festival.destroy');

        // Sayfalar
        Route::get('/pages', [AdminPageController::class, 'index'])->name('pages.index');
        Route::post('/pages', [AdminPageController::class, 'store'])->name('pages.store');
        Route::put('/pages/{page}', [AdminPageController::class, 'update'])->name('pages.update');
        Route::delete('/pages/{page}', [AdminPageController::class, 'destroy'])->name('pages.destroy');

        // Yorumlar
        Route::get('/comments', [AdminCommentController::class, 'index'])->name('comments.index');
        Route::delete('/comments/{comment}', [AdminCommentController::class, 'destroy'])->name('comments.destroy');

        // Newsletter
        Route::get('/newsletters', [AdminNewsletterController::class, 'index'])->name('newsletters.index');
        Route::post('/newsletters/{newsletter}/toggle', [AdminNewsletterController::class, 'toggle'])->name('newsletters.toggle');
        Route::delete('/newsletters/{newsletter}', [AdminNewsletterController::class, 'destroy'])->name('newsletters.destroy');
    });

    Route::middleware('role:admin')->group(function () {
        Route::put('/posts/{post:id}/owner', [AdminPostController::class, 'updateOwner'])->name('posts.updateOwner');
        Route::post('/posts/{post:id}/approve-deletion', [AdminPostController::class, 'approveDeletion'])->name('posts.approveDeletion');
        Route::post('/posts/{post:id}/reject-deletion', [AdminPostController::class, 'rejectDeletion'])->name('posts.rejectDeletion');

        // Site ayarları
        Route::get('/settings', [AdminSettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [AdminSettingsController::class, 'update'])->name('settings.update');

        // Kullanıcılar
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::put('/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.updateRole');
        Route::put('/users/{user}/password', [AdminUserController::class, 'updatePassword'])->name('users.updatePassword');
    });
});

// Wix Redirect'leri (eski URL yapısından yeni yapıya)
Route::get('/post/{slug}', [WixRedirectController::class, 'post'])->where('slug', '.*');
Route::get('/blog/{slug}', [WixRedirectController::class, 'post'])->where('slug', '.*');
Route::get('/blog/categories/{slug}', [WixRedirectController::class, 'category']);
