<?php

namespace App\Console\Commands;

use App\Models\GuestPushSubscriber;
use App\Models\Post;
use App\Models\User;
use App\Notifications\DailyDigestNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SendDailyDigestPush extends Command
{
    protected $signature = 'push:daily-digest {--force : Cache lock kontrolünü atla}';

    protected $description = 'Bugün yayınlanan yazılar için tüm push abonelerine günlük özet bildirimi gönderir';

    public function handle(): int
    {
        $today = now()->startOfDay();
        $lockKey = 'push:daily-digest:' . $today->toDateString();

        $lock = Cache::lock($lockKey, 600);

        if (! $this->option('force') && ! $lock->get()) {
            $this->warn('Bugünün digest push işlemi zaten çalıştırıldı veya çalışıyor.');

            return self::SUCCESS;
        }

        try {
            $posts = Post::query()
                ->where('status', 'published')
                ->whereDate('published_at', $today)
                ->orderBy('published_at')
                ->get();

            if ($posts->isEmpty()) {
                $this->info('Bugün yayınlanmış yazı yok, push gönderilmedi.');
                Log::info('[push:daily-digest] no posts today', ['date' => $today->toDateString()]);

                return self::SUCCESS;
            }

            $notification = new DailyDigestNotification($posts);
            $sent = 0;
            $failed = 0;

            foreach (User::has('pushSubscriptions')->cursor() as $user) {
                try {
                    $user->notify($notification);
                    $sent++;
                } catch (\Throwable $e) {
                    $failed++;
                    Log::warning('[push:daily-digest] user failed', ['user_id' => $user->id, 'error' => $e->getMessage()]);
                }
            }

            foreach (GuestPushSubscriber::has('pushSubscriptions')->cursor() as $guest) {
                try {
                    $guest->notify($notification);
                    $sent++;
                } catch (\Throwable $e) {
                    $failed++;
                    Log::warning('[push:daily-digest] guest failed', ['guest_id' => $guest->id, 'error' => $e->getMessage()]);
                }
            }

            $this->info("Push gönderildi: {$sent} alıcı, {$failed} hata, {$posts->count()} yazı.");
            Log::info('[push:daily-digest] sent', [
                'date' => $today->toDateString(),
                'recipients' => $sent,
                'failed' => $failed,
                'posts' => $posts->count(),
            ]);

            return self::SUCCESS;
        } finally {
            optional($lock)->release();
        }
    }
}
