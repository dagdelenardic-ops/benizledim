<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class ImportWixUsers extends Command
{
    protected $signature = 'wix:import-users {file? : JSON dosya yolu}';
    protected $description = 'Wix export JSON dosyasından kullanıcıları import et';

    public function handle()
    {
        $filePath = $this->argument('file') ?: 'database/data/wix-users.json';

        if (!file_exists($filePath)) {
            $this->error("Dosya bulunamadı: {$filePath}");
            return 1;
        }

        $data = json_decode(file_get_contents($filePath), true);

        if (!$data || !isset($data['users'])) {
            $this->error('Geçersiz JSON formatı. "users" anahtarı bulunamadı.');
            return 1;
        }

        $this->info('Kullanıcı import başlıyor...');
        $bar = $this->output->createProgressBar(count($data['users']));

        $imported = 0;
        $skipped = 0;
        $updated = 0;

        foreach ($data['users'] as $wixUser) {
            $email = $wixUser['email'] ?? null;
            $name = $wixUser['name'] ?? '';

            if (!$email || !$name) {
                $skipped++;
                $bar->advance();
                continue;
            }

            // "OOPS!" gibi hatalı isimleri atla
            if (strlen($name) < 3 || $name === 'OOPS!') {
                $skipped++;
                $bar->advance();
                continue;
            }

            // Mevcut kullanıcıyı bul veya yeni oluştur
            $user = User::where('email', $email)->first();

            if ($user) {
                // Güncelle
                $user->update([
                    'bio' => $wixUser['bio'] ?? $user->bio,
                    'avatar' => $wixUser['avatar'] ?: $user->avatar,
                ]);
                $updated++;
            } else {
                // Yeni oluştur
                User::create([
                    'name' => $name,
                    'email' => $email,
                    // Şifreyi admin panelinden güvenli şekilde tanımlamak için boş bırak.
                    'password' => null,
                    'role' => 'author',
                    'bio' => $wixUser['bio'] ?? null,
                    'avatar' => $wixUser['avatar'] ?? null,
                    'provider' => 'email',
                ]);
                $imported++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Tamamlandı! {$imported} yeni kullanıcı, {$updated} güncellenmiş, {$skipped} atlandı.");

        return 0;
    }
}
