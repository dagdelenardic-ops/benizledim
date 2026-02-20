<?php

namespace App\Console\Commands;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Console\Command;

class ImportWixComments extends Command
{
    protected $signature = 'wix:import-comments {file? : JSON dosya yolu}';
    protected $description = 'Wix export JSON dosyasından yorumları import et';

    public function handle()
    {
        $filePath = $this->argument('file') ?: 'database/data/wix-comments.json';

        if (!file_exists($filePath)) {
            $this->error("Dosya bulunamadı: {$filePath}");
            return 1;
        }

        $data = json_decode(file_get_contents($filePath), true);

        if (!$data || !isset($data['comments'])) {
            $this->error('Geçersiz JSON formatı. "comments" anahtarı bulunamadı.');
            return 1;
        }

        $this->info('Yorum import işlemi başlıyor...');
        $bar = $this->output->createProgressBar(count($data['comments']));

        $imported = 0;
        $skipped = 0;

        foreach ($data['comments'] as $wixComment) {
            $postSlug = $wixComment['post_slug'] ?? null;
            $content = $wixComment['content'] ?? '';
            $authorName = $wixComment['author'] ?? 'Misafir';

            if (!$postSlug || !$content) {
                $skipped++;
                $bar->advance();
                continue;
            }

            $post = Post::where('slug', 'like', substr($postSlug, 0, 50) . '%')->first();

            if ($post) {
                Comment::create([
                    'post_id' => $post->id,
                    'user_id' => null, // Misafir yorumu olarak kabul et veya eşleştir
                    'content' => $content,
                    'created_at' => $wixComment['created_at'] ? \Carbon\Carbon::parse($wixComment['created_at']) : now(),
                ]);
                $imported++;
            } else {
                $skipped++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Tamamlandı! {$imported} yeni yorum eklendi, {$skipped} atlandı.");

        return 0;
    }
}
