<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Models\User;
use Illuminate\Console\Command;

class UpdatePostAuthors extends Command
{
    protected $signature = 'wix:update-authors';
    protected $description = 'Wix-authors.json dosyasından okuyarak makale yazarlarını günceller';

    // Wix yazar isimlerini e-posta adresine eşleyen harita
    protected $authorEmailMap = [
        "Gurur Sönmez" => "gurur@benizledim.com",
        "İris Eryılmaz" => "iris@benizledim.com",
        "Muhammed Muğlu" => "muhammed@benizledim.com",
        "Su Evci" => "su@benizledim.com",
        "Alphan Karabat" => "alphan@benizledim.com",
        "Hümeyra Fidan" => "humeyra@benizledim.com",
        "Ben İzledim" => "gurur@benizledim.com",
        "BIZSSN" => "gurur@benizledim.com",
        "BİZ5SN" => "gurur@benizledim.com"
    ];

    public function handle()
    {
        $jsonPath = base_path('database/data/wix-authors.json');

        if (!file_exists($jsonPath)) {
            $this->error('Wix authors JSON bulunamadı! Önce python scriptini çalıştırın.');
            return;
        }

        $authorMap = json_decode(file_get_contents($jsonPath), true);

        if (!is_array($authorMap)) {
            $this->error('Geçersiz JSON dosyası.');
            return;
        }

        $this->info("Yazar güncellemeleri başlıyor...");
        $bar = $this->output->createProgressBar(count($authorMap));

        $updated = 0;
        $failed = 0;

        foreach ($authorMap as $url => $authorName) {
            // URL içindeki slug'ı al (Örn: /post/ornek-slug -> ornek-slug)
            $parts = explode('/post/', $url);
            if (count($parts) < 2) {
                $failed++;
                $bar->advance();
                continue;
            }

            // Wix'te slug 50 karakterle sınırlı olabilir, veya biz limitlemiş olabiliriz.
            $slugPrefix = substr($parts[1], 0, 50);

            // Eşleşen kullanıcıyı bul
            $email = $this->authorEmailMap[trim($authorName)] ?? 'gurur@benizledim.com';
            $user = User::where('email', $email)->first();

            if (!$user) {
                $failed++;
                $bar->advance();
                continue;
            }

            // İlgili Post'u slug üzerinden bul.
            // StartsWith yapıyoruz çünkü Laravel import sırasında slug formatında değişiklik yapmış olabilir
            $post = Post::where('slug', 'like', $slugPrefix . '%')->first();

            if ($post && $post->user_id !== $user->id) {
                $post->user_id = $user->id;
                $post->save();
                $updated++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("İşlem tamam! Güncellenen: {$updated}, Atlanan/Hatalı: {$failed}");
    }
}
