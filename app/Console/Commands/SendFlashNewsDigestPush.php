<?php

namespace App\Console\Commands;

use App\Models\FlashNews;
use App\Services\FlashNewsDigestSender;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class SendFlashNewsDigestPush extends Command
{
    protected $signature = 'push:flash-digest {--body= : Gönderilecek özet metni (zorunlu)} {--title= : Bildirim başlığı (boşsa otomatik)} {--force : Cache lock kontrolünü atla}';

    protected $description = 'Hazır özetle tüm push abonelerine flash haber bildirimi gönderir (özet lokal Mac rutininde claude -p ile üretilir)';

    public function handle(FlashNewsDigestSender $sender): int
    {
        $body = trim((string) $this->option('body'));

        if ($body === '') {
            $this->error('--body zorunlu. Özet lokal rutinde claude -p ile üretilir; bu komut sadece gönderimi yapar.');

            return self::FAILURE;
        }

        $today = now()->startOfDay();
        $lockKey = 'push:flash-digest:'.$today->toDateString();
        $lock = Cache::lock($lockKey, 600);

        if (! $this->option('force') && ! $lock->get()) {
            $this->warn('Bugünün flash digest push işlemi zaten çalıştırıldı veya çalışıyor.');

            return self::SUCCESS;
        }

        try {
            $count = FlashNews::published()->whereDate('published_at', $today)->count();

            $title = trim((string) $this->option('title')) ?: ($count > 0
                ? "🔥 Günün Flash Haberleri ({$count})"
                : '🔥 Günün Flash Haberleri');

            $result = $sender->send($title, $body, $today->toDateString());

            $this->info("Flash digest gönderildi: {$result['recipients']} alıcı, {$result['failed']} hata.");
            $this->info("Başlık: {$title}");
            $this->info("Body: {$body}");

            return self::SUCCESS;
        } finally {
            optional($lock)->release();
        }
    }
}
