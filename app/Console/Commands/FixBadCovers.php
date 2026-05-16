<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;

/**
 * One-off, idempotent data cleanup for the 2 posts whose cover_image survived
 * the Wix migration in a broken state:
 *   - "yeni-x-men..."  : cover_image is a YouTube *watch* URL (not an image)
 *                        -> use that video's YouTube thumbnail
 *   - "mark-hamill..."  : cover_image points to a server file that no longer
 *                         exists and is not a Wix media id
 *                        -> use the post's only body image (Wix CDN original)
 *
 * SAFE: dry-run unless --apply. Only rewrites a post if its cover_image still
 * equals the known-bad value, so re-running does nothing.
 */
class FixBadCovers extends Command
{
    protected $signature = 'benizledim:fix-covers {--apply : Write the change (otherwise dry-run)}';

    protected $description = 'Repair the 2 posts with broken cover_image left by the Wix migration';

    /** slug => [expected current bad value (substring) , new value] */
    private array $targets = [
        'yeni-x-men-geliyor-deadpool-3-incelemesi-ve-mcuya-katkisi' => [
            'bad'  => 'youtube.com/watch',
            'new'  => 'https://i.ytimg.com/vi/N7i7nCK90Hw/maxresdefault.jpg',
        ],
        'mark-hamillden-luke-skywalker-yorumu-star-warsun-unutulan-mesaji' => [
            'bad'  => '/storage/posts/mark-hamillden-luke-skywalker',
            'new'  => 'https://static.wixstatic.com/media/61dd5d_f57322b340494ae6a5aab644dfdf76be~mv2.avif',
        ],
    ];

    public function handle(): int
    {
        $apply = (bool) $this->option('apply');
        $this->warn($apply ? '!!! APPLY — veritabanı güncellenecek (sadece bu 2 yazı)'
                            : 'DRY-RUN — yazma yok. Uygulamak için --apply ekleyin.');

        $rows = [];
        foreach ($this->targets as $slug => $cfg) {
            $post = Post::where('slug', $slug)->first();
            if (!$post) { $rows[] = [$slug, 'YOK', '-', 'atlandı']; continue; }

            $cur = (string) $post->cover_image;
            if (!str_contains($cur, $cfg['bad'])) {
                $rows[] = [$slug, mb_strimwidth($cur, 0, 40, '…'), '-', 'zaten düzgün'];
                continue;
            }

            if ($apply) {
                $post->cover_image = $cfg['new'];
                $post->save();
                $status = 'GÜNCELLENDİ';
            } else {
                $status = 'değişecek';
            }
            $rows[] = [$slug, mb_strimwidth($cur, 0, 38, '…'), mb_strimwidth($cfg['new'], 0, 46, '…'), $status];
        }

        $this->table(['slug', 'eski cover', 'yeni cover', 'durum'], $rows);
        $this->info($apply ? 'Bitti.' : 'Uygulamak için: php artisan benizledim:fix-covers --apply');

        return self::SUCCESS;
    }
}
