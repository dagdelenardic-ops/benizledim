<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class RollbackContentCleanup extends Command
{
    protected $signature = 'content:rollback {table : Backup tablo adı (posts_backup_YYYYMMDD_HHMMSS)}';
    protected $description = 'Backup tablosundan posts.content kolonunu geri yükler';

    public function handle(): int
    {
        $table = (string) $this->argument('table');

        if (!preg_match('/^posts_backup_\d{8}_\d{6}$/', $table)) {
            $this->error("Geçersiz tablo adı: {$table}");
            $this->line('Beklenen format: posts_backup_YYYYMMDD_HHMMSS');
            return self::FAILURE;
        }

        if (!Schema::hasTable($table)) {
            $this->error("Tablo bulunamadı: {$table}");
            $this->line('Mevcut backup tablolarını listelemek için:');
            $this->line('  php artisan tinker');
            $this->line('  >>> DB::select("SHOW TABLES LIKE \'posts_backup_%\'");');
            return self::FAILURE;
        }

        $backupCount = DB::table($table)->count();
        $currentCount = DB::table('posts')->count();

        $this->line("Geri yükleme planı:");
        $this->line("  Backup tablo: {$table} ({$backupCount} satır)");
        $this->line("  Mevcut tablo: posts ({$currentCount} satır)");
        $this->line('');
        $this->warn('Bu işlem mevcut posts.content kolonunu backup ile değiştirir.');

        if (!$this->confirm('Geri yükleme yapılsın mı?', false)) {
            $this->warn('İptal edildi.');
            return self::FAILURE;
        }

        try {
            DB::beginTransaction();

            $updated = DB::statement("
                UPDATE posts p
                JOIN {$table} b ON p.id = b.id
                SET p.content = b.content
            ");

            DB::commit();

            $this->info("✓ Geri yükleme tamam.");
            $this->line('  Backup tabloyu silmek için: DROP TABLE ' . $table);

            return self::SUCCESS;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error('Geri yükleme hatası: ' . $e->getMessage());
            return self::FAILURE;
        }
    }
}
