<?php

namespace App\Console\Commands;

use App\Models\Category;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class ImportWixCategories extends Command
{
    protected $signature = 'wix:import-categories {file? : JSON dosya yolu}';
    protected $description = 'Wix export JSON dosyasından kategorileri import et';

    public function handle()
    {
        $filePath = $this->argument('file') ?: 'database/data/wix-categories.json';

        if (!file_exists($filePath)) {
            $this->error("Dosya bulunamadı: {$filePath}");
            return 1;
        }

        $data = json_decode(file_get_contents($filePath), true);

        if (!$data || !isset($data['categories'])) {
            $this->error('Geçersiz JSON formatı. "categories" anahtarı bulunamadı.');
            return 1;
        }

        $this->info('Kategori import işlemi başlıyor...');
        $bar = $this->output->createProgressBar(count($data['categories']));

        $imported = 0;
        $skipped = 0;

        foreach ($data['categories'] as $wixCategory) {
            $name = $wixCategory['name'] ?? null;
            if (!$name) {
                $skipped++;
                $bar->advance();
                continue;
            }

            $slug = $wixCategory['slug'] ?? Str::slug($name);

            $category = Category::where('slug', $slug)->first();

            if (!$category) {
                Category::create([
                    'name' => $name,
                    'slug' => $slug,
                ]);
                $imported++;
            } else {
                $skipped++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Tamamlandı! {$imported} yeni kategori eklendi, {$skipped} atlandı.");

        return 0;
    }
}
