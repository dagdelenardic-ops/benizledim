<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;

class FixPostTitles extends Command
{
    protected $signature = 'posts:fix-titles {--dry-run}';
    protected $description = 'Wix migration sırasında oluşan title typo ve fazla boşlukları düzeltir';

    private array $fixes = [
        'Skrulllar Aramızda - Secret Invasion S1' => 'Skrullar Aramızda - Secret Invasion S1',
        'Her (Aşk)  "Robotlar dünyayı ele geçirecek!"' => 'Her (Aşk) — "Robotlar dünyayı ele geçirecek!"',
        'TAIPEI  SUICIDE STORY' => 'Taipei Suicide Story',
    ];

    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        $fixed = 0;

        foreach ($this->fixes as $old => $new) {
            $post = Post::where('title', $old)->first();
            if (!$post) {
                $this->warn("Bulunamadı: '{$old}'");
                continue;
            }

            $this->info("'{$post->title}'");
            $this->info("  → '{$new}'");

            if (!$dryRun) {
                $post->title = $new;
                $post->save();
                $fixed++;
            }
        }

        // Genel temizlik: çoklu boşlukları tek boşluğa indir
        $bulkFixed = 0;
        $candidates = Post::where('title', 'LIKE', '%  %')->get();
        foreach ($candidates as $post) {
            $clean = preg_replace('/\s+/u', ' ', trim($post->title));
            if ($clean !== $post->title) {
                $this->info("Boşluk: '{$post->title}' → '{$clean}'");
                if (!$dryRun) {
                    $post->title = $clean;
                    $post->save();
                    $bulkFixed++;
                }
            }
        }

        $this->newLine();
        if ($dryRun) {
            $this->comment('DRY RUN — değişiklik yapılmadı.');
        } else {
            $this->info("✅ {$fixed} özel düzeltme + {$bulkFixed} boşluk düzeltmesi uygulandı.");
        }

        return 0;
    }
}
