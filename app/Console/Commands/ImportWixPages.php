<?php

namespace App\Console\Commands;

use App\Models\Page;
use Illuminate\Console\Command;

class ImportWixPages extends Command
{
    protected $signature = 'wix:import-pages {file? : JSON dosya yolu}';
    protected $description = 'Wix export JSON dosyasından statik sayfaları import et';

    public function handle()
    {
        $filePath = $this->argument('file') ?: 'database/data/wix-pages.json';

        if (!file_exists($filePath)) {
            $this->error("Dosya bulunamadı: {$filePath}");
            return 1;
        }

        $data = json_decode(file_get_contents($filePath), true);

        if (!$data || !isset($data['pages'])) {
            $this->error('Geçersiz JSON formatı. "pages" anahtarı bulunamadı.');
            return 1;
        }

        $this->info('Sayfa import işlemi başlıyor...');
        $bar = $this->output->createProgressBar(count($data['pages']));

        $imported = 0;
        $skipped = 0;
        $updated = 0;

        foreach ($data['pages'] as $wixPage) {
            $slug = $wixPage['slug'] ?? null;
            $title = $wixPage['title'] ?? 'İsimsiz Sayfa';
            $content = $wixPage['content'] ?? '';

            if (!$slug) {
                $skipped++;
                $bar->advance();
                continue;
            }

            $page = Page::where('slug', $slug)->first();

            if ($page) {
                $page->update([
                    'title' => $title,
                    'content' => $content,
                ]);
                $updated++;
            } else {
                Page::create([
                    'title' => $title,
                    'slug' => $slug,
                    'content' => $content,
                ]);
                $imported++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Tamamlandı! {$imported} yeni sayfa, {$updated} güncellenmiş, {$skipped} atlandı.");

        return 0;
    }
}
