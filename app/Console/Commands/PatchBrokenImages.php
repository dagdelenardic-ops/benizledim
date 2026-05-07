<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PatchBrokenImages extends Command
{
    protected $signature = 'wix:patch-broken-images
        {--limit=0 : İşlenecek post sayısı (0 = hepsi)}
        {--dry-run : Sadece raporla, üretme}
        {--post= : Tek bir post ID ile sınırla}';

    protected $description = 'İçerikteki indirilemeyen Wix img tag\'lerini xAI ile üretilmiş alakalı görsellerle değiştirir.';

    public function handle(): int
    {
        $apiKey = config('services.xai.api_key');
        $model = config('services.xai.image_model', 'grok-imagine-image-pro');

        if (! $apiKey && ! $this->option('dry-run')) {
            $this->error('XAI_API_KEY tanımlı değil.');

            return self::FAILURE;
        }

        $query = Post::where('content', 'LIKE', '%wixstatic%');
        if ($postId = $this->option('post')) {
            $query->where('id', $postId);
        }
        $limit = (int) $this->option('limit');
        if ($limit > 0) {
            $query->limit($limit);
        }

        $posts = $query->get();
        if ($posts->isEmpty()) {
            $this->info('İşlenecek post yok.');

            return self::SUCCESS;
        }

        $this->info("Hedef: {$posts->count()} post");

        $totalImg = 0;
        $generated = 0;
        $failed = 0;
        $srcsetCleaned = 0;
        $dryRun = (bool) $this->option('dry-run');
        $disk = Storage::disk('public');
        $disk->makeDirectory('posts/ai-generated');

        foreach ($posts as $post) {
            $newContent = $this->stripWixstaticFromSrcsets($post->content, $stripped);
            $srcsetCleaned += $stripped;

            preg_match_all('/<img[^>]+src=["\']([^"\']*wixstatic[^"\']*)["\'][^>]*>/i', $newContent, $matches, PREG_OFFSET_CAPTURE);
            $urls = array_unique(array_column($matches[1] ?? [], 0));

            if (empty($urls)) {
                if (! $dryRun && $newContent !== $post->content) {
                    $post->forceFill(['content' => $newContent])->saveQuietly();
                    $this->line("[#{$post->id}] {$post->title} — srcset temizlendi ({$stripped})");
                }

                continue;
            }

            $count = count($urls);
            $this->line("[#{$post->id}] {$post->title} — {$count} gerçek kayıp src + srcset:{$stripped}");
            $totalImg += count($urls);

            $idx = 0;

            foreach ($urls as $oldUrl) {
                $idx++;

                if ($dryRun) {
                    $this->line("    [dry] {$oldUrl}");

                    continue;
                }

                $prompt = $this->buildPrompt($post, $idx);

                try {
                    $response = Http::withToken($apiKey)
                        ->timeout(150)
                        ->retry(2, 2000)
                        ->post('https://api.x.ai/v1/images/generations', [
                            'model' => $model,
                            'prompt' => $prompt,
                            'n' => 1,
                            'response_format' => 'url',
                        ]);

                    if (! $response->ok()) {
                        $this->warn("    [{$idx}] xAI hata: ".$response->status().' '.Str::limit($response->body(), 120));
                        $failed++;

                        continue;
                    }

                    $imgUrl = data_get($response->json(), 'data.0.url');
                    if (! $imgUrl) {
                        $this->warn("    [{$idx}] xAI url yok");
                        $failed++;

                        continue;
                    }

                    $imgData = Http::timeout(60)->retry(2, 1000)->get($imgUrl)->body();
                    if (strlen($imgData) < 1024) {
                        $this->warn("    [{$idx}] indirilen image boş");
                        $failed++;

                        continue;
                    }

                    $filename = "posts/ai-generated/{$post->id}-{$idx}.jpeg";
                    $disk->put($filename, $imgData);
                    $publicUrl = '/storage/'.$filename;

                    $newContent = str_replace($oldUrl, $publicUrl, $newContent);
                    $generated++;
                    $this->info("    [{$idx}] ✓ {$publicUrl}");
                } catch (\Throwable $e) {
                    $this->warn("    [{$idx}] hata: ".$e->getMessage());
                    Log::warning('[wix:patch-broken-images]', ['post' => $post->id, 'error' => $e->getMessage()]);
                    $failed++;
                }
            }

            if (! $dryRun && $newContent !== $post->content) {
                $post->forceFill(['content' => $newContent])->saveQuietly();
            }
        }

        $this->info("Gerçek kayıp src: {$totalImg} | Üretildi: {$generated} | Hata: {$failed} | Srcset temizlik: {$srcsetCleaned} URL");

        return self::SUCCESS;
    }

    private function stripWixstaticFromSrcsets(string $content, ?int &$stripped = 0): string
    {
        $stripped = 0;

        return preg_replace_callback(
            '/(\s+(?:srcset|data-srcset)=["\'])([^"\']*)(["\'])/i',
            function ($m) use (&$stripped) {
                if (stripos($m[2], 'wixstatic') === false) {
                    return $m[0];
                }
                $candidates = preg_split('/\s*,\s*/', $m[2]);
                $kept = array_values(array_filter($candidates, fn ($c) => stripos($c, 'wixstatic') === false));
                $stripped += count($candidates) - count($kept);
                if (empty($kept)) {
                    return '';
                }

                return $m[1].implode(', ', $kept).$m[3];
            },
            $content
        );
    }

    private function buildPrompt(Post $post, int $idx): string
    {
        $title = trim((string) $post->title);
        $excerpt = trim(strip_tags((string) ($post->excerpt ?? '')));
        $excerpt = Str::limit($excerpt, 200, '');

        $context = $title;
        if ($excerpt !== '') {
            $context .= ' — '.$excerpt;
        }

        return "Atmospheric cinematic still relevant to a Turkish film/TV review article titled \"{$context}\". "
            .'Mood: editorial, professional film photography, dramatic lighting, no text, no watermark, no logos. '
            ."Variant {$idx}.";
    }
}
