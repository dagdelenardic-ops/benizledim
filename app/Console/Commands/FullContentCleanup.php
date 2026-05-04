<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FullContentCleanup extends Command
{
    protected $signature = 'content:full-cleanup
        {--dry-run : Sadece önizleme}
        {--no-backup : Backup alma (TEHLİKELİ)}';

    protected $description = 'Wix HTML temizleme pipeline\'ı: backup → clean-content';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $skipBackup = (bool) $this->option('no-backup');

        $this->line('=== Wix HTML Cleanup Pipeline ===');
        $this->line('Mode: ' . ($dryRun ? 'DRY-RUN (DB değişmez)' : 'GERÇEK ÇALIŞTIRMA'));
        $this->line('');

        if (!$dryRun && !$skipBackup) {
            $backupTable = $this->createBackup();
            if (!$backupTable) {
                $this->error('Backup başarısız oldu. Çıkılıyor.');
                return self::FAILURE;
            }
            $this->info("✓ Backup oluşturuldu: {$backupTable}");
            $this->info("  Geri yüklemek için: php artisan content:rollback {$backupTable}");
            $this->line('');
        } elseif (!$dryRun && $skipBackup) {
            if (!$this->confirm('--no-backup ile çalışıyorsun. Geri dönüş YOK. Devam edilsin mi?', false)) {
                $this->warn('İptal edildi.');
                return self::FAILURE;
            }
        }

        $this->line('--- 1/1 posts:clean-content ---');
        $exitCode = $this->call('posts:clean-content', [
            '--dry-run' => $dryRun,
            '--sample' => 3,
        ]);

        if ($exitCode !== 0) {
            $this->error('clean-content başarısız.');
            return self::FAILURE;
        }

        $this->line('');
        $this->info($dryRun
            ? '✓ Dry-run tamam. Gerçek çalıştırmak için --dry-run\'ı kaldır.'
            : '✓ Cleanup tamamlandı. Frontend\'i kontrol et.'
        );

        return self::SUCCESS;
    }

    private function createBackup(): ?string
    {
        $timestamp = now()->format('Ymd_His');
        $backupTable = "posts_backup_{$timestamp}";

        try {
            Schema::dropIfExists($backupTable);
            DB::statement("CREATE TABLE {$backupTable} LIKE posts");
            DB::statement("INSERT INTO {$backupTable} SELECT * FROM posts");

            $count = DB::table($backupTable)->count();
            $this->line("  {$count} satır kopyalandı");

            return $backupTable;
        } catch (\Throwable $e) {
            $this->error('Backup hatası: ' . $e->getMessage());
            return null;
        }
    }
}
