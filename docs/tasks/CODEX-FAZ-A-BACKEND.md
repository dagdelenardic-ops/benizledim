# Codex Ödev — Faz A Backend (Benizledim)

> **Not:** Bu görev tek başına çalışmak için yeterlidir. Paralel olarak Deepseek frontend kısmını yapacak (`DEEPSEEK-FAZ-A-FRONTEND.md`). Sözleşme: API endpoint'leri ve JSON şemaları aşağıda. Endpoint'ler bu görevde yazılacak; frontend onları tüketecek.

## 1. Bağlam (kısa)

Benizledim film/dizi/belgesel platformu (Laravel 12 + Inertia 2 + Vue 3 + MySQL 8, shared LiteSpeed/cPanel). Yazarlar mobilden hızlı içerik girsin diye PWA + push + "watch_log" tipi içerik + TMDB autocomplete + Letterboxd RSS sync ekliyoruz. Bu görev **sadece backend** kısmıdır.

**İlke:** Mevcut yapıyı kullan, yeniden yazma. `posts.format` zaten string(20); `'watch_log'` sadece yeni bir değer. `mood_tags` JSON cast'i zaten var. SentimentAnalyzer var. Spatie HasSlug var.

## 2. Branch ve PR

- Branch: `feature/faz-a-backend`
- PR başlığı: `feat(faz-a): backend — quick-log, tmdb, push, letterboxd, stats`
- Tek PR; mümkünse migration → service → controller → notification → observer sırasıyla atomik commit'ler.

## 3. Kabul Kriterleri (her biri test ile doğrulanmalı)

1. `POST /api/quick-log` ile authenticated yazar, TMDB ID veya manuel başlık vererek `posts.format='watch_log'` kaydı yaratabilmeli.
2. `GET /api/tmdb/search?q=inception&type=multi` 24h cache'li, normalized JSON döndürmeli.
3. `POST /api/push/subscribe` ile yazar push aboneliği kaydedebilmeli; `POST /api/push/test` aboneye test push göndermeli.
4. Yorum veya entry yazıldığında post yazarına webpush bildirimi gitmeli (kendi yorumun değilse).
5. 10/50/100 like eşiklerinde post yazarına 1 kez milestone push'u gitmeli (tekrarlama olmamalı).
6. `POST /api/letterboxd/connect` ile yazar username bağlayabilmeli; `POST /api/letterboxd/sync-now` throttle uyumlu sync tetiklemeli; daily artisan komutu tüm enabled yazarları sync etmeli.
7. `GET /yazar` (auth + role:admin/editor/author) → Inertia `Author/Home` render eder, `stats` prop'u 12 anahtarla dolu gelir.
8. Yazar profili (`/profile/{user}`) artık `stats` prop'u ile döner; format'a göre filtre query param destekler (`?format=watch_log`).
9. PHPUnit feature/unit testleri yeşil; en az: QuickLogControllerTest, TmdbServiceTest (Http::fake), AuthorStatsServiceTest, LetterboxdSyncServiceTest, milestone observer test.

## 4. Bağımlılıklar (Composer)

```
composer require laravel-notification-channels/webpush
composer show laravel-notification-channels/webpush --available
```

Eğer Laravel 12 desteği yoksa: `composer require minishlink/web-push:^9` + custom kanal yaz (`app/Notifications/Channels/WebPushChannel.php`).

`vendor:publish`:
```
php artisan vendor:publish --provider="NotificationChannels\WebPush\WebPushServiceProvider" --tag="migrations"
php artisan webpush:vapid    # .env'e VAPID_PUBLIC_KEY/VAPID_PRIVATE_KEY yazılır
```

## 5. .env

```
TMDB_API_KEY=...           # (kullanıcı verecek; yoksa README'de belirt)
VAPID_PUBLIC_KEY=...       # webpush:vapid komutu yazar
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:gurursonmez@gmail.com
LETTERBOXD_SYNC_THROTTLE=60
```

## 6. Migration'lar (tam liste)

**`2026_05_05_100000_add_watch_log_fields_to_posts_table.php`**
```php
$table->unsignedBigInteger('tmdb_id')->nullable()->index();
$table->string('tmdb_type', 10)->nullable();        // 'movie' | 'tv'
$table->string('external_title')->nullable();
$table->smallInteger('external_year')->nullable();
$table->date('watched_on')->nullable();
$table->unsignedTinyInteger('rating')->nullable();  // 1-10
$table->string('letterboxd_uri')->nullable()->unique();
$table->json('meta')->nullable();                   // milestone bayrakları için
```

**`2026_05_05_100100_create_push_subscriptions_table.php`** — paket publish'ten gelir.

**`2026_05_05_100200_add_letterboxd_to_users_table.php`**
```php
$table->string('letterboxd_username')->nullable();
$table->timestamp('last_letterboxd_sync_at')->nullable();
$table->boolean('letterboxd_sync_enabled')->default(false);
```

## 7. Yazılacak Sınıflar (yol → sorumluluk → kritik metod imzaları)

### `app/Services/TmdbService.php`
```php
public function search(string $query, string $type = 'multi'): array;
public function details(int $id, string $type): array;
```
- `Http::baseUrl(config('services.tmdb.base'))->withHeaders(['Authorization'=>'Bearer '.config('services.tmdb.api_key')])` ya da `?api_key=` query (v3).
- Cache: `Cache::remember("tmdb:{$query}:{$type}", 86400, ...)`.
- Türkçe: `language=tr-TR`.
- Normalized response: `[{ id, type:'movie'|'tv', title, year, poster_path:'/abc.jpg', poster_url:'https://image.tmdb.org/t/p/w342/abc.jpg', overview, genres:[...] }, ...]`.

### `app/Services/LetterboxdSyncService.php`
```php
public function syncForUser(\App\Models\User $u, bool $force = false): array; // returns ['created' => int, 'skipped' => int]
```
- `https://letterboxd.com/{username}/rss/` GET (User-Agent: `BenIzledim-Sync/1.0`).
- SimpleXML parse; her item `<guid>`, `<title>`, `<link>`, `<pubDate>`, `<letterboxd:watchedDate>`, `<letterboxd:rewatch>`, `<letterboxd:memberRating>` kullan.
- Dedupe: `Post::where('letterboxd_uri', $guid)->exists()`.
- Yeni entry için: TMDB lookup (`search($title, 'multi')` → ilk eşleşmeyi al, yıl tutuyorsa öncele).
- `Post::create([format=>'watch_log', status=>'draft', user_id=>$u->id, ...])`.
- Throttle: `now()->diffInMinutes($u->last_letterboxd_sync_at) < config('services.letterboxd.sync_throttle_minutes')` ise atla (`$force` değilse).
- Her yazar için max 50 yeni post per sync (rate-limit koruması).

### `app/Services/AuthorStatsService.php`
```php
public function forUser(\App\Models\User $u, ?int $year = null): array;
```
Dönüş anahtarları (eksiksiz, frontend bunlara bağlı):
```
posts_count, watch_logs_count, total_likes_received, total_comments_received,
total_entries_received, most_liked_post (object|null: {id, slug, title, cover_image, likes_count}),
top_mood_tags (array of {tag, count} max 3),
avg_rating (float|null), last_log_at (date|null),
current_streak (int, Faz C'ye kadar 0), followers_count (int, Faz B'ye kadar 0)
```
Cache: `Cache::tags(["user.{$u->id}.stats"])->remember("stats:{$year}", 600, fn() => ...)`.

### Controllers

**`app/Http/Controllers/QuickLogController.php`**
- `store(QuickLogRequest)` → Post create, format='watch_log'. status=$request->status (`published`|`draft`).
- Title: `external_title (external_year)`. Slug otomatik (HasSlug).
- `cover_image` = TMDB `poster_url` (re-host yok).
- `intensity_level` map: rating 1-3 → 'low', 4-7 → 'medium', 8-10 → 'high'.
- `categories()->sync(...)` — `tmdb_type='movie'` → "sinema" (veya "film"), `tmdb_type='tv'` → "dizi" (slug bazlı lookup; yoksa atla).
- 422 validation hatası, 201 başarı (`{ post: { ...resource } }`).

**`app/Http/Controllers/Api/TmdbSearchController.php`**
- `search(Request)` → `$service->search($q, $type)`. `query` min 2 char. Hata → 400.

**`app/Http/Controllers/PushSubscriptionController.php`**
- `store(Request)` → User'a push subscription kaydet (`updatePushSubscription($endpoint, $key, $token, $contentEncoding)`).
- `destroy(Request)` → `deletePushSubscription($endpoint)`.
- `vapidKey()` → `['publicKey' => config('services.webpush.vapid_public')]`.
- `test(Request)` → auth user'a `PushSubscriptionTest` notification.

**`app/Http/Controllers/AuthorHomeController.php`**
- `index()` → Inertia render `Author/Home`:
  ```
  return inertia('Author/Home', [
    'stats' => $stats->forUser($user, now()->year),
    'recentLogs' => $user->posts()->where('format','watch_log')->latest('watched_on')->take(6)->get(),
    'recentPosts' => $user->posts()->published()->whereIn('format', [...])->latest('published_at')->take(3)->get(),
    'pendingDrafts' => $user->posts()->where('status','draft')->where('format','watch_log')->count(),
    'letterboxd' => ['username'=>$user->letterboxd_username, 'enabled'=>$user->letterboxd_sync_enabled, 'lastSyncAt'=>$user->last_letterboxd_sync_at],
    'pushVapidKey' => config('services.webpush.vapid_public'),
  ]);
  ```

**`app/Http/Controllers/LetterboxdController.php`**
- `connect(Request)` → username validate, RSS test fetch, kullanıcıya 5 örnek entry preview döndür (henüz kaydetme).
- `confirm(Request)` → `letterboxd_username` set + `letterboxd_sync_enabled=true`.
- `syncNow(Request)` → `LetterboxdSyncService->syncForUser($user)`, sonuç döndür.
- `disconnect(Request)` → username null, enabled false.

### Form Request

**`app/Http/Requests/QuickLogRequest.php`**
```
'tmdb_id' => 'nullable|integer|required_without:external_title',
'tmdb_type' => 'nullable|in:movie,tv',
'external_title' => 'nullable|string|max:255|required_without:tmdb_id',
'external_year' => 'nullable|integer|between:1880,2100',
'rating' => 'nullable|integer|between:1,10',
'mood_tags' => 'nullable|array|max:3',
'mood_tags.*' => 'string|max:30',
'note' => 'nullable|string|max:280',
'watched_on' => 'nullable|date|before_or_equal:today',
'status' => 'required|in:published,draft',
'cover_image' => 'nullable|url',
```

### Notifications (4 sınıf)

Tümü `via(['webpush'])` ve `toWebPush(): WebPushMessage`. Body Türkçe, max 80 karakter; data.url frontend'in açacağı sayfa.

- `NewCommentOnYourPost` — title: "Yorumun var", body: "{commenter} → {post.title}"
- `NewEntryOnYourPost` — title: "Yeni entry", body aynı stil
- `PostHitLikeMilestone` — title: "🎉 {milestone} beğeni!", body: "{post.title}"
- `PushSubscriptionTest` — title: "Bildirimler aktif", body: "Test başarılı"

### Observers

**`app/Observers/CommentObserver.php`** → `created`: `$comment->user_id !== $post->user_id` ise `$post->user->notify(new NewCommentOnYourPost($comment))`. Ayrıca `Cache::tags("user.{$post->user_id}.stats")->flush()`.

**`app/Observers/EntryObserver.php`** → aynı mantık.

**`app/Observers/LikeObserver.php`** → `created`: post yazarına milestone kontrol. `$post->meta['notified_milestones'] ?? []`. 10/50/100'e ulaşıldıysa ve henüz bildirilmediyse notify + meta'ya ekle. Cache flush.

**`app/Observers/PostObserver.php`** → `saved`: cache flush. `format='watch_log'` ise `SentimentAnalyzer` (varsa) excerpt'e uygula.

Observer'ları `AppServiceProvider::boot()` içinde register et.

### Console Command

**`app/Console/Commands/LetterboxdSyncCommand.php`**
- Signature: `letterboxd:sync {user? : User ID veya null=hepsi} {--force}`.
- Tüm `letterboxd_sync_enabled=true` kullanıcılar için `LetterboxdSyncService->syncForUser($u, $force)`.
- Sonuçları konsola yaz.

`bootstrap/app.php` (Laravel 12) veya `routes/console.php` schedule:
```php
Schedule::command('letterboxd:sync')->dailyAt('03:00');
```

## 8. Routes (`routes/web.php`)

```php
Route::middleware('auth')->group(function () {
    Route::post('/api/quick-log', [QuickLogController::class, 'store'])->name('quick-log.store');
    Route::patch('/api/quick-log/{post}', [QuickLogController::class, 'update']);

    Route::get('/api/tmdb/search', [TmdbSearchController::class, 'search']);

    Route::post('/api/push/subscribe', [PushSubscriptionController::class, 'store']);
    Route::delete('/api/push/subscribe', [PushSubscriptionController::class, 'destroy']);
    Route::get('/api/push/vapid', [PushSubscriptionController::class, 'vapidKey']);
    Route::post('/api/push/test', [PushSubscriptionController::class, 'test']);

    Route::post('/api/letterboxd/connect', [LetterboxdController::class, 'connect']);
    Route::post('/api/letterboxd/confirm', [LetterboxdController::class, 'confirm']);
    Route::post('/api/letterboxd/sync-now', [LetterboxdController::class, 'syncNow']);
    Route::delete('/api/letterboxd', [LetterboxdController::class, 'disconnect']);
});

Route::middleware(['auth', 'role:admin,editor,author'])
    ->get('/yazar', [AuthorHomeController::class, 'index'])->name('author.home');
```

`role` middleware mevcut değilse, mevcut `User::canAccessCms()` veya benzeri yetenek metodunu kullan; controller başında `abort_unless($request->user()->canAccessCms(), 403)` da geçer.

## 9. Mevcut Dosyalarda Değişiklik

### `app/Models/Post.php`
- `$fillable`'a ekle: `tmdb_id`, `tmdb_type`, `external_title`, `external_year`, `watched_on`, `rating`, `letterboxd_uri`, `meta`.
- `casts()`'a ekle: `'watched_on' => 'date'`, `'meta' => 'array'`.

### `app/Models/User.php`
- `use \NotificationChannels\WebPush\HasPushSubscriptions;`
- `routeNotificationForWebPush()` paket trait'inden hazır; ek kod gereksiz.
- `$fillable`'a ekle: `letterboxd_username`, `last_letterboxd_sync_at`, `letterboxd_sync_enabled`.
- `casts`'a: `'last_letterboxd_sync_at' => 'datetime'`, `'letterboxd_sync_enabled' => 'boolean'`.

### `app/Http/Controllers/ProfileController.php`
- `show(User $user)` → `$stats = app(AuthorStatsService::class)->forUser($user)` enjekte.
- `request('format')` parametresine göre filtre: `'standard'` (default, makaleler), `'watch_log'`, `'all'`.
- Inertia prop'larına `stats` ve `format` ekle.

### `config/services.php`
- `tmdb`, `webpush`, `letterboxd` blokları (plan dosyasındaki gibi).

## 10. Frontend Sözleşmesi (Deepseek bunu tüketecek — değiştirme!)

### `POST /api/quick-log` — Request body
```json
{
  "tmdb_id": 27205,
  "tmdb_type": "movie",
  "external_title": "Inception",
  "external_year": 2010,
  "rating": 8,
  "mood_tags": ["gerilim","sessiz"],
  "note": "Yıllar sonra hala işliyor.",
  "watched_on": "2026-05-05",
  "status": "published",
  "cover_image": "https://image.tmdb.org/t/p/w780/xyz.jpg"
}
```

Response (201):
```json
{ "post": { "id": 1234, "slug": "inception-2010-abc12345", "title": "Inception (2010)", "format": "watch_log", "url": "/yazi/inception-2010-abc12345" } }
```

### `GET /api/tmdb/search?q=...&type=multi` — Response
```json
{ "results": [
  { "id": 27205, "type": "movie", "title": "Inception", "year": 2010, "poster_path": "/abc.jpg", "poster_url": "https://image.tmdb.org/t/p/w342/abc.jpg", "overview": "...", "genres": ["Aksiyon","Bilim Kurgu"] }
] }
```

### `GET /api/push/vapid` — Response
```json
{ "publicKey": "BPxxx..." }
```

### `POST /api/push/subscribe` — Request body (browser PushSubscription.toJSON())
```json
{ "endpoint": "https://fcm.googleapis.com/...", "keys": { "p256dh": "...", "auth": "..." }, "contentEncoding": "aes128gcm" }
```

### `GET /yazar` Inertia props (Author/Home)
```ts
{
  stats: { posts_count: number, watch_logs_count: number, total_likes_received: number, total_comments_received: number, total_entries_received: number, most_liked_post: {id, slug, title, cover_image, likes_count}|null, top_mood_tags: Array<{tag,count}>, avg_rating: number|null, last_log_at: string|null, current_streak: number, followers_count: number },
  recentLogs: Post[],
  recentPosts: Post[],
  pendingDrafts: number,
  letterboxd: { username: string|null, enabled: boolean, lastSyncAt: string|null },
  pushVapidKey: string
}
```

### `POST /api/letterboxd/connect` — Request `{ username }` → Response `{ preview: [{title,year,watchedDate,rating}], confirmed: false }`
### `POST /api/letterboxd/confirm` — Request `{ username }` → 200
### `POST /api/letterboxd/sync-now` — Response `{ created: int, skipped: int, last_sync_at: string }`

## 11. Test Komutları

```
php artisan test --filter=QuickLog
php artisan test --filter=Tmdb
php artisan test --filter=AuthorStats
php artisan test --filter=Letterboxd
php artisan test --filter=Notification
```

Her servis ve controller için minimum bir feature/unit test. `Http::fake()` TMDB için, `Notification::fake()` push için.

## 12. Risk Notları

- Webpush paketi Laravel 12 desteklemiyorsa: `minishlink/web-push` direkt kullan, kendi `WebPushChannel` yaz. Kanal: `via(['webpush'])`'in çalışması için `Notification::routes(['webpush' => $sub])` ya da User'a manuel `routeNotificationForWebpush()` ekle.
- `ext-gmp` cPanel'de açık olmayabilir; kurulumda `composer require` öncesi `php -m | grep -i gmp` çıktısını al, yoksa kullanıcıya bildir (görev ilerlemesini durdurma — local dev'de çalışsın yeter).
- `role` middleware mevcut değilse mevcut auth pattern'ini takip et (`canAccessCms()` benzeri).
- Wix migration'dan gelen post'ların `format='standard'` olduğu varsayılıyor; ProfileController filter'ında `format != 'watch_log'` ile yazıları ayır.
- Watch_log post'ları **Home.vue, kategori sayfaları, /yazi listesi gibi public listelerde GÖZÜKMEMELİ** — bu görevin scope'unda değil ama not: ilgili controller'lara `whereIn('format', ['standard','dialogue','visual_essay','time_capsule'])` filtresi eklemek için takip iş öğesi aç.

## 13. Tamamlanma Sinyali

PR açıldığında README'de açıklanan kabul kriterlerinin her birinin nasıl test edildiğini madde madde yaz. CI yeşil. PR yorumuna 11. bölümdeki test komutlarının çıktısını ekle.
