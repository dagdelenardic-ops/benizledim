<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('queue:prune-failed --hours=168')
    ->dailyAt('02:10')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/scheduler.log'));

Schedule::command('queue:prune-batches --hours=72')
    ->dailyAt('02:20')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/scheduler.log'));

// Vertex AI Search — günlük full sync (PostObserver canlı upsert yapıyor; bu failsafe).
Schedule::command('app:vertex-sync')
    ->dailyAt('03:30')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/scheduler.log'));

if ((bool) env('RUN_QUEUE_WORKER_VIA_SCHEDULER', false)) {
    Schedule::command('queue:work --stop-when-empty --queue=default,scrapers --tries=1 --timeout=120')
        ->everyMinute()
        ->withoutOverlapping()
        ->appendOutputTo(storage_path('logs/scheduler.log'));
}

if ((bool) env('RUN_WIX_SCRAPER_SCHEDULED', false)) {
    Schedule::command('wix:scrape --queued')
        ->dailyAt((string) env('WIX_SCRAPER_DAILY_AT', '03:00'))
        ->withoutOverlapping()
        ->appendOutputTo(storage_path('logs/scheduler.log'));
}

// One-shot: ilk schedule:run tetiklemesinde flash_news migration'ını çalıştır.
// Marker dosyası yazılınca tekrar çalışmaz. Güvenli silindi sayılır.
Schedule::call(function () {
    $marker = storage_path('app/.flash_news_migrated');
    if (file_exists($marker)) {
        return;
    }
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('route:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');
    @file_put_contents($marker, now()->toIso8601String());
})->name('one-shot-flashnews-migrate')->everyMinute();

Schedule::command('flashnews:fetch')
    ->dailyAt('08:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/flashnews.log'));

Schedule::command('flashnews:fetch')
    ->dailyAt('14:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/flashnews.log'));

Schedule::command('flashnews:fetch')
    ->dailyAt('20:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/flashnews.log'));

Schedule::command('letterboxd:sync')
    ->dailyAt('03:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/scheduler.log'));

// NOT: Flash digest artık production cron'unda DEĞİL. Lokal Mac'teki LaunchAgent
// (com.benizledim.flashdigest) 21:00'de claude -p (Sonnet, Claude Max aboneliği)
// ile özet üretip /api/flashnews/digest-send endpoint'ine basar. API key kullanılmaz.

// One-shot: guest_push_subscribers migration'ını tetikle, marker yazılınca tekrar çalışmaz.
Schedule::call(function () {
    $marker = storage_path('app/.guest_push_subscribers_migrated');
    if (file_exists($marker)) {
        return;
    }
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('route:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');
    @file_put_contents($marker, now()->toIso8601String());
})->name('one-shot-guest-push-migrate')->everyMinute();

Schedule::call(function () {
    \App\Models\Post::where('status', 'draft')
        ->whereNotNull('scheduled_at')
        ->where('scheduled_at', '<=', now())
        ->each(function ($post) {
            $post->update([
                'status' => 'published',
                'published_at' => now(),
                'scheduled_at' => null,
            ]);
        });
})->name('publish-scheduled-posts')->everyMinute()->withoutOverlapping()->appendOutputTo(storage_path('logs/scheduler.log'));

// One-shot: analytics tabloları (page_views, daily_stats, user_login_events, users.last_login_at vb.)
Schedule::call(function () {
    $marker = storage_path('app/.analytics_migrated');
    if (file_exists($marker)) {
        return;
    }
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('route:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');
    @file_put_contents($marker, now()->toIso8601String());
})->name('one-shot-analytics-migrate')->everyMinute();

// One-shot: içerikteki taşınamamış Wix görsellerini orijinal çözünürlükte yeniden indir.
// SSH olmadığı için cron tetikler; marker yazılınca tekrar çalışmaz. Komut idempotent.
Schedule::call(function () {
    $marker = storage_path('app/.rehydrate_content_done');
    if (file_exists($marker)) {
        return;
    }
    \Illuminate\Support\Facades\Artisan::call('wix:rehydrate-hires', ['--content-only' => true]);
    @file_put_contents($marker, now()->toIso8601String());
})->name('one-shot-rehydrate-content')
    ->everyMinute()
    ->withoutOverlapping(1440)
    ->appendOutputTo(storage_path('logs/rehydrate.log'));

Schedule::command('stats:aggregate')
    ->dailyAt('00:15')
    ->timezone('Europe/Istanbul')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/analytics.log'));

Schedule::command('stats:cleanup --days=90')
    ->dailyAt('03:30')
    ->timezone('Europe/Istanbul')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/analytics.log'));
