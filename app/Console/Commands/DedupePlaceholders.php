<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Support\WixTitleNormalizer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Seeder placeholder postları ile gerçek import postlarının çift kaydını birleştirir.
 *
 * Sorun: DatabaseSeeder kısa başlıkla örnek post yarattı (ör. "Köln 75: ...Piyano"),
 * gerçek Wix import'u uzun başlıkla AYRI post yarattı (ör. "Köln 75: ...Piyano, Tarihin En...").
 * Kullanıcının linki kısa-slug'lu placeholder'a gidiyor ama içerik boş.
 *
 * Çözüm: gerçek postun içerik/kapak/yazar/tarihini placeholder'a KOPYALA (temiz slug korunur),
 * sonra gerçek (dublör) postu sil.
 */
class DedupePlaceholders extends Command
{
    protected $signature = 'wix:dedupe-placeholders
        {--dry-run : Önizleme; DB değişmez}
        {--min-real=800 : Gerçek post için minimum içerik uzunluğu}
        {--max-placeholder=400 : Placeholder için maksimum içerik uzunluğu}';

    protected $description = 'Seeder placeholder + gerçek import çift kayıtlarını birleştirir (içeriği placeholder\'a taşır)';

    public function handle(): int
    {
        $dry = (bool) $this->option('dry-run');
        $minReal = (int) $this->option('min-real');
        $maxPlaceholder = (int) $this->option('max-placeholder');

        $all = Post::all();

        // Placeholder adayları: içeriği kısa
        $placeholders = $all->filter(fn (Post $p) => mb_strlen(trim(strip_tags((string) $p->content))) <= $maxPlaceholder);

        $merged = 0;
        $skipped = 0;

        foreach ($placeholders as $ph) {
            $phTitle = trim((string) $ph->title);
            if ($phTitle === '') {
                continue;
            }

            // Gerçek eş: normalleştirilmiş başlığı placeholder ile başlayan, daha uzun,
            // dolu içerikli BAŞKA post. Normalleştirme noktalama/aksan farklarını yok sayar
            // (ör. "Çığlık:" vs "Çığlık;").
            $phNorm = WixTitleNormalizer::normalize($phTitle);
            $candidates = $all->filter(function (Post $r) use ($ph, $phNorm, $minReal) {
                if ($r->id === $ph->id) {
                    return false;
                }
                $rNorm = WixTitleNormalizer::normalize((string) $r->title);
                // Normalleştirilmiş başlık eşit VEYA placeholder onun ön eki olsun
                // (Köln: gerçek daha uzun; Gürültüsüz: eşit, sadece noktalama farkı).
                // Placeholder-vs-gerçek ayrımını içerik uzunluğu farkı yapıyor.
                $prefixMatch = $phNorm !== '' && str_starts_with($rNorm, $phNorm);
                $hasContent = mb_strlen(trim(strip_tags((string) $r->content))) >= $minReal;

                return $prefixMatch && $hasContent;
            })->values();

            if ($candidates->count() !== 1) {
                if ($candidates->count() > 1) {
                    $this->warn("Belirsiz ({$candidates->count()} aday): {$phTitle}");
                    $skipped++;
                }

                continue;
            }

            /** @var Post $real */
            $real = $candidates->first();

            $this->line(sprintf(
                'BİRLEŞTİR: [%d] "%s" (%dch) ← [%d] "%s" (%dch)',
                $ph->id, mb_substr($phTitle, 0, 35), mb_strlen(strip_tags((string) $ph->content)),
                $real->id, mb_substr($real->title, 0, 45), mb_strlen(strip_tags((string) $real->content))
            ));

            if (! $dry) {
                DB::transaction(function () use ($ph, $real) {
                    // Gerçek postun zengin verisini placeholder'a taşı.
                    // BAŞLIK/SLUG placeholder'da KALIR — böylece kullanıcının linkleri kırılmaz
                    // (başlığı değiştirmek Spatie slug'ı yeniden üretir → link 404 olur).
                    $ph->content = $real->content;
                    $ph->excerpt = $real->excerpt ?: $ph->excerpt;
                    $ph->cover_image = $real->cover_image ?: $ph->cover_image;
                    $ph->user_id = $real->user_id;
                    $ph->published_at = $real->published_at ?: $ph->published_at;
                    if ($real->reading_time_minutes) {
                        $ph->reading_time_minutes = $real->reading_time_minutes;
                    }
                    $ph->save();

                    // İlişkileri taşı (kategori/etiket), sonra dublörü sil
                    $ph->categories()->sync($real->categories()->pluck('categories.id')->all());
                    $ph->tags()->sync($real->tags()->pluck('tags.id')->all());

                    $real->delete();
                });
            }

            $merged++;
        }

        $this->newLine();
        $this->info(sprintf('%s: %d birleştirme, %d atlandı', $dry ? 'DRY RUN' : 'Tamam', $merged, $skipped));

        return self::SUCCESS;
    }
}
