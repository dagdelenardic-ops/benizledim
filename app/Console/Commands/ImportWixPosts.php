<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImportWixPosts extends Command
{
    protected $signature = 'wix:import-posts {file : JSON dosya yolu}';
    protected $description = 'Wix export JSON dosyasından yazıları import et';

    public function handle()
    {
        $filePath = $this->argument('file');

        if (!file_exists($filePath)) {
            $this->error("Dosya bulunamadı: {$filePath}");
            return 1;
        }

        $data = json_decode(file_get_contents($filePath), true);

        if (!$data || !isset($data['posts'])) {
            $this->error('Geçersiz JSON formatı. "posts" anahtarı bulunamadı.');
            return 1;
        }

        $this->info('Import başlıyor...');
        $bar = $this->output->createProgressBar(count($data['posts']));

        $imported = 0;
        $skipped = 0;

        foreach ($data['posts'] as $wixPost) {
            // Zaten var mı kontrol et (başlık ile)
            if (Post::where('title', $wixPost['title'])->exists()) {
                $skipped++;
                $bar->advance();
                continue;
            }

            // Yazar bul veya admin kullan
            $user = User::where('email', $wixPost['author_email'] ?? '')->first()
                ?? User::where('role', 'admin')->first();

            // Okuma süresi hesapla
            $wordCount = str_word_count(strip_tags($wixPost['content'] ?? ''));
            $readingTime = max(1, ceil($wordCount / 200));

            $post = Post::create([
                'user_id' => $user->id,
                'title' => $wixPost['title'],
                'slug' => Str::slug($wixPost['title']),
                'excerpt' => $wixPost['excerpt'] ?? Str::limit(strip_tags($wixPost['content'] ?? ''), 200),
                'content' => $wixPost['content'] ?? '',
                'cover_image' => $wixPost['cover_image'] ?? null,
                'reading_time_minutes' => $readingTime,
                'status' => 'published',
                'published_at' => isset($wixPost['published_at'])
                    ? \Carbon\Carbon::parse($wixPost['published_at'])
                    : now(),
                'view_count' => $wixPost['view_count'] ?? 0,
            ]);

            // Kategoriler
            if (!empty($wixPost['categories'])) {
                $categoryIds = [];
                foreach ($wixPost['categories'] as $catName) {
                    $category = Category::firstOrCreate(
                        ['slug' => Str::slug($catName)],
                        ['name' => $catName]
                    );
                    $categoryIds[] = $category->id;
                }
                $post->categories()->sync($categoryIds);
            }

            // Taglar
            if (!empty($wixPost['tags'])) {
                $tagIds = [];
                foreach ($wixPost['tags'] as $tagName) {
                    $tag = Tag::firstOrCreate(
                        ['slug' => Str::slug($tagName)],
                        ['name' => $tagName]
                    );
                    $tagIds[] = $tag->id;
                }
                $post->tags()->sync($tagIds);
            }

            $imported++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Tamamlandı! {$imported} yazı import edildi, {$skipped} yazı atlandı.");

        return 0;
    }
}
