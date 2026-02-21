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
