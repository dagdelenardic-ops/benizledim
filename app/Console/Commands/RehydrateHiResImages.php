<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Support\MediaUrl;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RehydrateHiResImages extends Command
{
    protected $signature = 'wix:rehydrate-hires
        {--dry-run : Yalnızca rapor; indirme/yazma yok}
        {--cover-only : Sadece kapak görsellerini işle}
        {--content-only : Sadece içerik içindeki görselleri işle}
        {--limit= : İşlenecek yazı sayısını sınırla}
        {--offset= : Kaçıncı yazıdan başla (chunk işlemleri için)}
        {--force-cover : Mevcut kapağa bakma, JSON\'dan upgrade et ve yeniden indir}
        {--source=database/data/wix-posts.json : Wix posts JSON yolu}';

    protected $description = 'Wix kapak ve içerik görsellerini orijinal (yüksek) çözünürlükte yeniden indirir';

    public function handle(): int
    {
        $dry = (bool) $this->option('dry-run');
        $coverOnly = (bool) $this->option('cover-only');
        $contentOnly = (bool) $this->option('content-only');
        $forceCover = (bool) $this->option('force-cover');
        $limit = $this->option('limit');
        $offset = $this->option('offset');
        $source = base_path((string) $this->option('source'));

        if (! is_file($source)) {
            $this->error("Kaynak JSON bulunamadı: {$source}");

            return 1;
        }

        $raw = json_decode((string) file_get_contents($source), true);
        if (is_array($raw) && isset($raw['posts']) && is_array($raw['posts'])) {
            $posts = $raw['posts'];
        } elseif (is_array($raw) && array_is_list($raw)) {
            $posts = $raw;
        } else {
            $posts = is_array($raw) ? array_values(array_filter($raw, 'is_array')) : [];
        }
        if (! $posts) {
            $this->error('JSON içinde post bulunamadı.');

            return 1;
        }

        $bySlug = [];
        foreach ($posts as $p) {
            if (! empty($p['title'])) {
                $bySlug[Str::slug($p['title'])] = $p;
            }
        }
        $this->info('JSON\'dan '.count($bySlug).' yazı yüklendi.');

        // Deterministik sıralama şart: offset/limit ile chunk'lanınca
        // her seferinde aynı 15 yazıyı işlememek için sabit bir sıra gerekir.
        $query = Post::query()->orderBy('id');
        if ($limit !== null) {
            $query->limit((int) $limit);
        }
        if ($offset !== null) {
            $query->offset((int) $offset);
            // MySQL'de OFFSET kullanmak için LIMIT zorunlu
            if ($limit === null) {
                $query->limit(PHP_INT_MAX);
            }
        }

        $dbPosts = $query->get();
        $this->info("DB'de işlenecek yazı: {$dbPosts->count()}");

        $stats = ['cover_upgraded' => 0, 'cover_skipped' => 0, 'cover_failed' => 0, 'content_imgs' => 0, 'content_failed' => 0, 'unmatched' => 0];

        $bar = $this->output->createProgressBar($dbPosts->count());

        foreach ($dbPosts as $post) {
            $key = $post->slug ?: Str::slug((string) $post->title);
            $jsonPost = $bySlug[$key] ?? null;
            if (! $jsonPost) {
                $stats['unmatched']++;
                $bar->advance();

                continue;
            }

            if (! $contentOnly) {
                $this->processCover($post, $jsonPost, $dry, $forceCover, $stats);
            }
            if (! $coverOnly) {
                $this->processContent($post, $jsonPost, $dry, $stats);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->table(['Metrik', 'Sayı'], collect($stats)->map(fn ($v, $k) => [$k, $v])->values()->all());

        if ($dry) {
            $this->warn('DRY RUN — hiçbir dosya yazılmadı.');
        }

        return 0;
    }

    private function processCover(Post $post, array $jsonPost, bool $dry, bool $force, array &$stats): void
    {
        $jsonCover = $jsonPost['cover_image'] ?? null;
        if (! $jsonCover) {
            $stats['cover_skipped']++;

            return;
        }

        $hiresUrl = MediaUrl::upgradeToOriginal($jsonCover);
        $needsUpgrade = $force
            || ! $post->cover_image
            || str_contains((string) $post->cover_image, 'wixstatic')
            || MediaUrl::isUpgradable((string) $post->cover_image);

        if (! $needsUpgrade) {
            $stats['cover_skipped']++;

            return;
        }

        $ext = MediaUrl::extension($hiresUrl);
        $filename = 'posts/'.Str::slug((string) $post->title).'-'.$post->id.'.'.$ext;
        $localPath = $post->cover_image && str_starts_with((string) $post->cover_image, '/storage/')
            ? ltrim(str_replace('/storage/', '', (string) $post->cover_image), '/')
            : $filename;

        if ($dry) {
            $stats['cover_upgraded']++;

            return;
        }

        try {
            $resp = Http::timeout(30)->retry(2, 800, throw: false)->withHeaders(['User-Agent' => 'BenIzledim/1.0'])->get($hiresUrl);
            if (! $resp->successful()) {
                $this->warn("Cover indirilemedi [{$post->id}] {$hiresUrl} (HTTP {$resp->status()})");
                $stats['cover_failed']++;

                return;
            }
            Storage::disk('public')->put($localPath, $resp->body());
            $newCover = '/storage/'.$localPath;
            if ($post->cover_image !== $newCover) {
                $post->update(['cover_image' => $newCover]);
            }
            $stats['cover_upgraded']++;
        } catch (\Throwable $e) {
            $this->warn("Cover hatası [{$post->id}]: ".$e->getMessage());
            $stats['cover_failed']++;
        }
    }

    private function processContent(Post $post, array $jsonPost, bool $dry, array &$stats): void
    {
        $jsonContent = (string) ($jsonPost['content'] ?? '');
        if ($jsonContent === '') {
            return;
        }

        // JSON içindeki tüm Wix görsel URL'lerini topla
        preg_match_all('#https?://static\.wixstatic\.com/media/[^"\'\s)]+#i', $jsonContent, $m);
        $jsonUrls = array_values(array_unique($m[0] ?? []));
        if (! $jsonUrls) {
            return;
        }

        // file id (61dd5d_xxx~mv2.ext) bazlı eşleme tablosu
        $byFileId = [];
        foreach ($jsonUrls as $u) {
            if (preg_match('#/media/([^/]+\~mv2\.[a-z0-9]+)#i', $u, $mm)) {
                $byFileId[$mm[1]] = MediaUrl::upgradeToOriginal($u);
            }
        }

        $content = (string) $post->content;
        $changed = false;
        $slugDir = 'posts/content/'.Str::slug((string) $post->title);

        // 1) İçerikte hâlâ wixstatic URL'i varsa: upgrade + indir + replace
        $content = preg_replace_callback('#https?://static\.wixstatic\.com/media/[^"\'\s)]+#i', function ($mat) use ($post, $slugDir, $dry, &$stats, &$changed) {
            $orig = MediaUrl::upgradeToOriginal($mat[0]);
            $local = $this->downloadTo($orig, $slugDir, $dry, $stats, $post->id);
            if ($local) {
                $changed = true;

                return $local;
            }

            return $mat[0];
        }, $content);

        // 2) İçerikte zaten /storage/posts/content/<slug>/<fileid>.<ext> path'i varsa
        //    fileid eşlemesi ile aynı dosyayı yüksek çözünürlükle yeniden indir (yerinde overwrite)
        if (preg_match_all('#/storage/posts/content/[^"\'\s)]+/([^"\'\s)/]+\~mv2\.[a-z0-9]+)#i', $content, $cm)) {
            foreach (array_unique($cm[1] ?? []) as $fileId) {
                if (isset($byFileId[$fileId])) {
                    $this->downloadOverwrite($byFileId[$fileId], 'posts/content/'.Str::slug((string) $post->title).'/'.$fileId, $dry, $stats, $post->id);
                }
            }
        }

        if ($changed && ! $dry && $content !== $post->content) {
            $post->update(['content' => $content]);
        }
    }

    private function downloadTo(string $url, string $dir, bool $dry, array &$stats, int $postId): ?string
    {
        if (preg_match('#/media/([^/]+\~mv2\.[a-z0-9]+)#i', $url, $m)) {
            $name = $m[1];
        } else {
            $name = md5($url).'.'.MediaUrl::extension($url);
        }
        $path = trim($dir, '/').'/'.$name;

        if ($dry) {
            $stats['content_imgs']++;

            return '/storage/'.$path;
        }

        try {
            $resp = Http::timeout(30)->retry(2, 800, throw: false)->withHeaders(['User-Agent' => 'BenIzledim/1.0'])->get($url);
            if (! $resp->successful()) {
                $this->warn("Content img indirilemedi [{$postId}] {$url}");
                $stats['content_failed']++;

                return null;
            }
            Storage::disk('public')->put($path, $resp->body());
            $stats['content_imgs']++;

            return '/storage/'.$path;
        } catch (\Throwable $e) {
            $this->warn("Content img hatası [{$postId}]: ".$e->getMessage());
            $stats['content_failed']++;

            return null;
        }
    }

    private function downloadOverwrite(string $url, string $path, bool $dry, array &$stats, int $postId): void
    {
        if ($dry) {
            $stats['content_imgs']++;

            return;
        }
        try {
            $resp = Http::timeout(30)->retry(2, 800, throw: false)->withHeaders(['User-Agent' => 'BenIzledim/1.0'])->get($url);
            if (! $resp->successful()) {
                $this->warn("Overwrite indirilemedi [{$postId}] {$url}");
                $stats['content_failed']++;

                return;
            }
            Storage::disk('public')->put($path, $resp->body());
            $stats['content_imgs']++;
        } catch (\Throwable $e) {
            $this->warn("Overwrite hatası [{$postId}]: ".$e->getMessage());
            $stats['content_failed']++;
        }
    }
}
