# Codex Odev — Faz B Backend (Benizledim)

> Paralel frontend isi `DEEPSEEK-FAZ-B-FRONTEND.md`. Bu dosya backend sozlesmesidir; endpoint ve JSON sekilleri frontend tarafindan aynen tuketilecek.

## 1. Baglam

Faz A yazar gunluk kullanimini tamamlandi: PWA, QuickLog, Letterboxd, push, `/yazar`. Faz B sosyal cekirdegi ekler: takip sistemi, watchlist, activity feed, yazar dizini ve mention altyapisi.

Ilke: mevcut Laravel 12 + Inertia yapisini koru. Public feed'leri kirletme; `watch_log` sadece yazar/profil sosyal yuzeylerinde gorunur.

## 2. Branch ve PR

- Branch: `feature/faz-b-social-core`
- PR basligi: `feat(faz-b): social core backend`
- Commit sirasi onerisi: migrations/models -> controllers/routes -> notifications/activity -> tests.

## 3. Kabul Kriterleri

1. Kullanici baska bir yazari takip edip takibi birakabilir; kendini takip edemez.
2. `/yazarlar` public yazar dizini arama, role filtreleme ve takip durumuyla Inertia render eder.
3. Auth kullanici `/akis` sayfasinda takip ettigi yazarlarin yeni yayinlari, watch-loglari ve temel sosyal hareketlerini gorur.
4. Auth kullanici postlari watchlist'e ekleyip cikarabilir; `/watchlist` kendi listesini doner.
5. `@kullanici` mention parsing yorum ve entry metinlerinde calisir, ilgili kullaniciya tek bildirim/activity uretir.
6. Follow/watchlist/activity endpointleri auth gerekir; public yazar dizini auth'suz calisir ama takip durumu yalniz auth varsa gelir.
7. Author stats `followers_count` artik gercek follower sayisini doner.
8. Feature testler en az: follow toggle, watchlist toggle, activity feed, author directory, mention extraction.

## 4. Veritabani

### `follows`

```php
$table->id();
$table->foreignId('follower_id')->constrained('users')->cascadeOnDelete();
$table->foreignId('followed_id')->constrained('users')->cascadeOnDelete();
$table->timestamps();
$table->unique(['follower_id', 'followed_id']);
$table->index(['followed_id', 'created_at']);
```

### `watchlist_items`

```php
$table->id();
$table->foreignId('user_id')->constrained()->cascadeOnDelete();
$table->foreignId('post_id')->constrained()->cascadeOnDelete();
$table->string('status', 20)->default('planned'); // planned|watching|watched
$table->text('note')->nullable();
$table->timestamp('watched_at')->nullable();
$table->timestamps();
$table->unique(['user_id', 'post_id']);
```

### `activity_items`

```php
$table->id();
$table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
$table->foreignId('subject_user_id')->nullable()->constrained('users')->nullOnDelete();
$table->foreignId('post_id')->nullable()->constrained()->nullOnDelete();
$table->foreignId('entry_id')->nullable()->constrained()->nullOnDelete();
$table->foreignId('comment_id')->nullable()->constrained()->nullOnDelete();
$table->string('type', 40); // post_published|watch_log_created|followed_user|commented|entry_created|mentioned
$table->json('meta')->nullable();
$table->timestamps();
$table->index(['subject_user_id', 'created_at']);
$table->index(['actor_id', 'created_at']);
```

## 5. Modeller ve Iliskiler

- `Follow`: `follower()`, `followed()`.
- `WatchlistItem`: `user()`, `post()`.
- `ActivityItem`: `actor()`, `subjectUser()`, `post()`, `entry()`, `comment()`.
- `User`:
  - `following()`, `followers()` belongsToMany self relation.
  - `watchlistItems()`, `activityItems()`.
  - `isFollowing(User $user): bool`.
- `Post`: `watchlistedBy()` belongsToMany users via watchlist.

## 6. Servisler

### `app/Services/ActivityService.php`

```php
public function record(string $type, ?User $actor = null, array $payload = []): ActivityItem;
public function feedFor(User $user, int $limit = 30): LengthAwarePaginator;
```

Feed kurali: kullanicinin takip ettigi yazarlar + kendi aktiviteleri. `post_published` icin `posts.status='published'`; silinme bekleyen postlari disla.

### `app/Services/MentionService.php`

```php
public function extractUsernames(string $text): array;
public function notifyMentions(string $text, User $actor, array $context = []): void;
```

Mention formati: `@slug` veya `@kullanici-adi`. Ilk surumda `Str::slug($user->name)` ile eslestir. Ayni metinde ayni kullaniciya tek bildirim/activity. Actor kendini mention ederse atla.

## 7. Controller ve Route Sozlesmesi

Auth group:

```php
Route::post('/api/users/{user}/follow', [FollowController::class, 'store']);
Route::delete('/api/users/{user}/follow', [FollowController::class, 'destroy']);
Route::post('/api/watchlist/{post}', [WatchlistController::class, 'store']);
Route::patch('/api/watchlist/{post}', [WatchlistController::class, 'update']);
Route::delete('/api/watchlist/{post}', [WatchlistController::class, 'destroy']);
Route::get('/akis', [ActivityFeedController::class, 'index'])->name('activity.index');
Route::get('/watchlist', [WatchlistController::class, 'index'])->name('watchlist.index');
```

Public:

```php
Route::get('/yazarlar', [AuthorDirectoryController::class, 'index'])->name('authors.index');
```

### JSON cevaplari

Follow toggle:

```json
{ "following": true, "followers_count": 12 }
```

Watchlist item:

```json
{ "watchlisted": true, "item": { "id": 1, "status": "planned", "note": null, "post_id": 10 } }
```

Activity feed Inertia prop:

```php
'items' => [
  ['id'=>1, 'type'=>'post_published', 'created_at'=>'...', 'actor'=>['id'=>1,'name'=>'...','avatar'=>null], 'post'=>['id'=>1,'slug'=>'...','title'=>'...','cover_image'=>null,'format'=>'article'], 'meta'=>[]]
]
```

## 8. Activity Uretimi

- `PostObserver::saved`: status `published` olduktan sonra ilk kez `post_published`; format `watch_log` ise `watch_log_created`.
- `FollowController::store`: `followed_user`.
- `CommentObserver::created`: mevcut push davranisina ek olarak `commented`; mention parse et.
- `EntryObserver::created`: `entry_created`; mention parse et.
- `MentionService`: `mentioned` activity + ileride push'a uygun notification.

## 9. Test Plani

- `FollowControllerTest`: takip, unfollow, self-follow 422, duplicate safe.
- `WatchlistControllerTest`: add/update/remove, auth required, only own list.
- `ActivityFeedControllerTest`: followed author activity visible, unrelated hidden.
- `AuthorDirectoryControllerTest`: public list, search, auth user following flag.
- `MentionServiceTest`: duplicate mentions collapse, actor self mention skipped.
- `AuthorStatsServiceTest`: `followers_count` gercek sayiya doner.

## 10. Notlar

- Cache: follow/watchlist/activity mutasyonlarinda ilgili user stats cache flush.
- N+1 yok: directory/feed sorgularinda eager loading ve counts kullan.
- Faz C'ye kadar rozet, streak, haftalik ozet yok.
