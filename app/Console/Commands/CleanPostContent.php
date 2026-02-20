<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;

class CleanPostContent extends Command
{
    protected $signature = 'posts:clean-content {--dry-run : Sadece kontrol et}';
    protected $description = 'Wix import sonrası yazı içeriklerindeki gereksiz HTML/CSS\'i temizle';

    public function handle()
    {
        $dryRun = $this->option('dry-run');
        $posts = Post::all();

        $this->info("Toplam yazı sayısı: {$posts->count()}");
        $cleaned = 0;

        foreach ($posts as $post) {
            $original = $post->content;
            $content = $post->content;

            // Wix class'larını kaldır
            $content = preg_replace('/\s*class="[^"]*"/', '', $content);
            // Wix style attribute'larını kaldır
            $content = preg_replace('/\s*style="[^"]*"/', '', $content);
            // Wix data attribute'larını kaldır
            $content = preg_replace('/\s*data-[a-z-]+="[^"]*"/', '', $content);
            // Boş span'ları kaldır
            $content = preg_replace('/<span>\s*<\/span>/', '', $content);
            // Boş div'leri kaldır
            $content = preg_replace('/<div>\s*<\/div>/', '', $content);
            // Birden fazla boş satırı teke indir
            $content = preg_replace('/(\s*<br\s*\/?>\s*){3,}/', '<br><br>', $content);
            // Wix embed container'larını kaldır (boş olanlar)
            $content = preg_replace('/<div[^>]*wix[^>]*>\s*<\/div>/', '', $content);

            if ($content !== $original) {
                if (!$dryRun) {
                    $post->update(['content' => $content]);
                }
                $cleaned++;
                if ($dryRun) {
                    $this->line("  Temizlenecek: [{$post->id}] {$post->title}");
                }
            }
        }

        $this->info($dryRun
            ? "Temizlenecek yazı sayısı: {$cleaned}"
            : "Temizlendi: {$cleaned} yazı");

        return 0;
    }
}
