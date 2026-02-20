<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImportWixImages extends Command
{
    protected $signature = 'wix:import-images {--dry-run : Sadece kontrol et, indirme}';
    protected $description = 'Yazılardaki Wix görsellerini indir ve yerel storage\'a taşı';

    public function handle()
    {
        $dryRun = $this->option('dry-run');
        $posts = Post::whereNotNull('cover_image')
            ->where('cover_image', 'like', '%wix%')
            ->orWhere('cover_image', 'like', '%static.wixstatic%')
            ->get();

        $this->info("Wix görseli bulunan yazı sayısı: {$posts->count()}");

        if ($dryRun) {
            foreach ($posts as $post) {
                $this->line("  - [{$post->id}] {$post->title}: {$post->cover_image}");
            }
            return 0;
        }

        $bar = $this->output->createProgressBar($posts->count());
        $success = 0;
        $failed = 0;

        foreach ($posts as $post) {
            try {
                $response = Http::timeout(30)->get($post->cover_image);

                if ($response->successful()) {
                    $extension = pathinfo(parse_url($post->cover_image, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'jpg';
                    $filename = 'posts/' . Str::slug($post->title) . '-' . $post->id . '.' . $extension;

                    Storage::disk('public')->put($filename, $response->body());

                    $post->update(['cover_image' => '/storage/' . $filename]);
                    $success++;
                } else {
                    $failed++;
                    $this->warn("İndirilemedi: {$post->cover_image}");
                }
            } catch (\Exception $e) {
                $failed++;
                $this->warn("Hata [{$post->id}]: {$e->getMessage()}");
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Tamamlandı! {$success} görsel indirildi, {$failed} hata.");

        return 0;
    }
}
