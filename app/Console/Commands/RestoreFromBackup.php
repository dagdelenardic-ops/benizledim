<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Disaster-recovery: restore posts (content + metadata + images) from the
 * Wix-independent local backup archive produced by scripts/wix-full-backup.py
 * (~/Desktop/Benizledim-Yedek). DB-agnostic (works on sqlite local / MySQL prod).
 *
 * SAFE BY DEFAULT: dry-run unless --apply is passed. Never deletes anything;
 * only upserts by slug.
 */
class RestoreFromBackup extends Command
{
    protected $signature = 'benizledim:restore-backup
        {--dir= : Backup directory (default: ~/Desktop/Benizledim-Wix-Yedek)}
        {--apply : Actually write to the database (without this it is a dry-run)}
        {--images : Also copy archived image files into storage/app/public}
        {--limit=0 : Only process first N posts (0 = all)}';

    protected $description = 'Restore posts + images from the local Wix backup archive (dry-run by default)';

    public function handle(): int
    {
        $dir = $this->option('dir')
            ?: rtrim(getenv('HOME') ?: '', '/') . '/Desktop/Benizledim-Wix-Yedek';
        $postsFile = $dir . '/posts.json';

        if (!is_file($postsFile)) {
            $this->error("posts.json bulunamadı: {$postsFile}");
            return self::FAILURE;
        }

        $apply = (bool) $this->option('apply');
        $withImages = (bool) $this->option('images');
        $limit = (int) $this->option('limit');

        $posts = json_decode(file_get_contents($postsFile), true);
        if (!is_array($posts)) {
            $this->error('posts.json çözümlenemedi.');
            return self::FAILURE;
        }
        if ($limit > 0) {
            $posts = array_slice($posts, 0, $limit);
        }

        $this->warn($apply
            ? '!!! APPLY MODU — veritabanına YAZILACAK (upsert, silme YOK)'
            : 'DRY-RUN — hiçbir şey yazılmayacak. Uygulamak için --apply ekleyin.');
        $this->line("Kaynak: {$dir}  |  Yazı: " . count($posts));

        $stats = ['create' => 0, 'update' => 0, 'img_ok' => 0, 'img_missing' => 0, 'user_new' => 0];
        $bar = $this->output->createProgressBar(count($posts));

        foreach ($posts as $p) {
            $slug = $p['slug'] ?? Str::slug($p['title'] ?? '');
            if ($slug === '') { $bar->advance(); continue; }

            $existing = Post::where('slug', $slug)->first();
            $existing ? $stats['update']++ : $stats['create']++;

            if ($apply) {
                $userId = $this->resolveUser($p, $stats);

                $fillable = (new Post)->getFillable();
                $data = [];
                foreach ($fillable as $col) {
                    if (array_key_exists($col, $p)) {
                        $data[$col] = $p[$col];
                    }
                }
                $data['user_id'] = $userId;
                $data['slug'] = $slug;

                $post = Post::updateOrCreate(['slug' => $slug], $data);

                if (!empty($p['categories'])) {
                    $ids = [];
                    foreach ($p['categories'] as $c) {
                        $name = is_array($c) ? ($c['name'] ?? '') : $c;
                        if ($name === '') continue;
                        $ids[] = Category::firstOrCreate(
                            ['slug' => Str::slug($name)],
                            ['name' => $name]
                        )->id;
                    }
                    $post->categories()->sync($ids);
                }
                if (!empty($p['tags'])) {
                    $ids = [];
                    foreach ($p['tags'] as $t) {
                        $name = is_array($t) ? ($t['name'] ?? '') : $t;
                        if ($name === '') continue;
                        $ids[] = Tag::firstOrCreate(
                            ['slug' => Str::slug($name)],
                            ['name' => $name]
                        )->id;
                    }
                    $post->tags()->sync($ids);
                }
            }

            if ($withImages) {
                $this->restoreImages($dir, $slug, $apply, $stats);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->table(
            ['Oluşturulacak', 'Güncellenecek', 'Görsel OK', 'Görsel eksik', 'Yeni yazar'],
            [[$stats['create'], $stats['update'], $stats['img_ok'], $stats['img_missing'], $stats['user_new']]]
        );

        if (!$apply) {
            $this->info('Dry-run bitti. Gerçekten uygulamak için: php artisan benizledim:restore-backup --apply --images');
        } else {
            $this->info('Geri yükleme tamamlandı.');
        }

        return self::SUCCESS;
    }

    private function resolveUser(array $p, array &$stats): int
    {
        $u = $p['user'] ?? null;
        $email = is_array($u) ? ($u['email'] ?? null) : null;
        $name = is_array($u) ? ($u['name'] ?? null) : null;

        if ($email) {
            $user = User::where('email', $email)->first();
            if ($user) return $user->id;
        }
        if ($name) {
            $user = User::where('name', $name)->first();
            if ($user) return $user->id;
        }

        // Placeholder author, consistent with the project's wix-author scheme.
        $ph = 'wix-author+' . Str::slug($name ?: 'bilinmeyen') . '@benizledim.local';
        $user = User::firstOrCreate(
            ['email' => $ph],
            ['name' => $name ?: 'Ben İzledim', 'password' => bcrypt(Str::random(32)), 'role' => 'author']
        );
        if ($user->wasRecentlyCreated) $stats['user_new']++;
        return $user->id;
    }

    private function restoreImages(string $dir, string $slug, bool $apply, array &$stats): void
    {
        $src = "{$dir}/images/{$slug}";
        if (!is_dir($src)) { return; }

        foreach (scandir($src) as $file) {
            if ($file === '.' || $file === '..') continue;
            $from = "{$src}/{$file}";
            if (!is_file($from) || filesize($from) < 800) continue;

            // Body images -> posts/content/<slug>/, covers -> posts/
            $isContent = (bool) preg_match('/~mv2|^[0-9a-f]{4,8}_[0-9a-f]{16,}/i', $file);
            $rel = $isContent ? "posts/content/{$slug}/{$file}" : "posts/{$file}";
            $dest = storage_path('app/public/' . $rel);

            if (is_file($dest) && filesize($dest) > 800) { $stats['img_ok']++; continue; }

            if ($apply) {
                @mkdir(dirname($dest), 0755, true);
                if (@copy($from, $dest)) { $stats['img_ok']++; }
                else { $stats['img_missing']++; }
            } else {
                $stats['img_missing']++; // would need restoring
            }
        }
    }
}
