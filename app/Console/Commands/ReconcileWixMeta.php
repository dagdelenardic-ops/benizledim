<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Models\User;
use App\Support\WixTitleNormalizer;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Düzeltilmiş Wix JSON'undan (yazar_name + author_email + published_at)
 * MEVCUT yazıların yazar ve yayın tarihini günceller. DB'yi SİLMEZ —
 * yalnızca eşleşen postların user_id ve published_at alanlarını düzeltir.
 *
 * Eski migrasyonda scraper yazar/tarih çekemediği için 216 yazı Gurur'a
 * ve tüm yazılar bugünün tarihine atanmıştı; bu komut onları onarır.
 */
class ReconcileWixMeta extends Command
{
    protected $signature = 'wix:reconcile-meta
        {--source=database/data/wix-posts-fixed.json : Düzeltilmiş Wix JSON yolu}
        {--dry-run : Önizleme; DB değişmez}
        {--authors : Yazarları güncelle (varsayılan açık)}
        {--dates : Tarihleri güncelle (varsayılan açık)}
        {--content : Placeholder/eksik içerikleri scrape ile onar}
        {--covers : Boş kapakları scrape\'ten doldur}
        {--content-threshold=0.7 : DB metni scrape metninin bu oranından azsa içeriği değiştir}';

    protected $description = 'Düzeltilmiş Wix JSON\'undan mevcut yazıların yazar ve tarihini onar (non-destructive)';

    private Collection $byExactTitle;

    private Collection $byNormalizedTitle;

    /** @var array<string, User> */
    private array $userCache = [];

    public function handle(): int
    {
        $dry = (bool) $this->option('dry-run');
        $doContent = (bool) $this->option('content');
        $doCovers = (bool) $this->option('covers');
        // authors/dates: hiçbir bayrak verilmediyse ikisi de açık (geriye dönük uyum);
        // herhangi bir bayrak verildiyse yalnız seçilenler çalışır.
        $anyFlag = $this->option('authors') || $this->option('dates') || $doContent || $doCovers;
        $doAuthors = $anyFlag ? (bool) $this->option('authors') : true;
        $doDates = $anyFlag ? (bool) $this->option('dates') : true;
        $threshold = (float) $this->option('content-threshold');
        $cleaner = new CleanPostContent;

        $source = base_path((string) $this->option('source'));
        if (! is_file($source)) {
            $this->error("Kaynak JSON bulunamadı: {$source}");

            return self::FAILURE;
        }

        $raw = json_decode((string) file_get_contents($source), true);
        $posts = $raw['posts'] ?? (is_array($raw) ? $raw : []);
        if (! $posts) {
            $this->error('JSON içinde post bulunamadı.');

            return self::FAILURE;
        }
        $this->info(sprintf('JSON: %d yazı | authors=%s dates=%s content=%s covers=%s | dry-run=%s',
            count($posts), $doAuthors ? 'evet' : 'hayır', $doDates ? 'evet' : 'hayır',
            $doContent ? 'evet' : 'hayır', $doCovers ? 'evet' : 'hayır', $dry ? 'evet' : 'hayır'));

        $this->primeIndexes();

        $stats = [
            'author_updated' => 0, 'author_same' => 0,
            'date_updated' => 0, 'date_same' => 0,
            'content_updated' => 0, 'content_same' => 0,
            'cover_set' => 0,
            'users_created' => 0, 'unmatched' => 0, 'ambiguous' => 0,
        ];
        $unmatchedTitles = [];

        $runner = function () use ($posts, $dry, $doAuthors, $doDates, $doContent, $doCovers, $threshold, $cleaner, &$stats, &$unmatchedTitles): void {
            foreach ($posts as $jp) {
                $title = trim((string) ($jp['title'] ?? ''));
                if ($title === '') {
                    continue;
                }

                $match = $this->matchPost($title, $jp['published_at'] ?? null);
                if ($match === 'ambiguous') {
                    $stats['ambiguous']++;
                    $unmatchedTitles[] = "[ambiguous] {$title}";

                    continue;
                }
                if (! $match) {
                    $stats['unmatched']++;
                    $unmatchedTitles[] = $title;

                    continue;
                }

                /** @var Post $post */
                $post = $match;

                if ($doAuthors) {
                    $user = $this->resolveUser($jp, $dry, $stats);
                    if ($user && $post->user_id !== $user->id) {
                        if (! $dry) {
                            $post->user_id = $user->id;
                        }
                        $stats['author_updated']++;
                        $this->line(sprintf('  YAZAR  %-40s → %s', Str::limit($title, 38), $user->name));
                    } elseif ($user) {
                        $stats['author_same']++;
                    }
                }

                if ($doDates && ! empty($jp['published_at'])) {
                    $newDate = $this->parseDate((string) $jp['published_at']);
                    if ($newDate) {
                        $cur = $post->published_at;
                        if (! $cur || ! $cur->equalTo($newDate)) {
                            if (! $dry) {
                                $post->published_at = $newDate;
                            }
                            $stats['date_updated']++;
                            $this->line(sprintf('  TARİH  %-40s → %s', Str::limit($title, 38), $newDate->toDateString()));
                        } else {
                            $stats['date_same']++;
                        }
                    }
                }

                if ($doContent) {
                    $scrapeRaw = (string) ($jp['content'] ?? '');
                    if ($scrapeRaw !== '') {
                        $cleaned = $cleaner->cleanHtml($scrapeRaw);
                        $dbLen = mb_strlen(trim(strip_tags((string) $post->content)));
                        $newLen = mb_strlen(trim(strip_tags($cleaned)));
                        // DB metni scrape'in threshold'undan azsa (placeholder/eksik) → onar
                        if ($newLen > 200 && $dbLen < $newLen * $threshold) {
                            if (! $dry) {
                                $post->content = $cleaned;
                            }
                            $stats['content_updated']++;
                            $this->line(sprintf('  İÇERİK %-40s %d→%d char', Str::limit($title, 38), $dbLen, $newLen));
                        } else {
                            $stats['content_same']++;
                        }
                    }
                }

                if ($doCovers) {
                    $scrapeCover = (string) ($jp['cover_image'] ?? '');
                    if ($scrapeCover !== '' && ! $post->cover_image) {
                        if (! $dry) {
                            $post->cover_image = $scrapeCover;
                        }
                        $stats['cover_set']++;
                        $this->line(sprintf('  KAPAK  %-40s ← scrape', Str::limit($title, 38)));
                    }
                }

                if (! $dry && $post->isDirty()) {
                    $post->save();
                }
            }
        };

        if ($dry) {
            $this->warn('DRY RUN — DB değişmeyecek.');
            $runner();
        } else {
            DB::transaction($runner);
        }

        $this->newLine();
        $this->table(['Metrik', 'Sayı'], collect($stats)->map(fn ($v, $k) => [$k, $v])->values()->all());

        if ($unmatchedTitles) {
            $this->warn('Eşleşmeyen '.count($unmatchedTitles).' başlık (ilk 15):');
            foreach (array_slice($unmatchedTitles, 0, 15) as $t) {
                $this->line('  - '.$t);
            }
        }

        return self::SUCCESS;
    }

    private function primeIndexes(): void
    {
        $posts = Post::query()->get();
        $this->byExactTitle = $posts
            ->groupBy(fn (Post $p) => trim((string) $p->title))
            ->map(fn (Collection $g) => $g->values());
        $this->byNormalizedTitle = $posts
            ->groupBy(fn (Post $p) => WixTitleNormalizer::normalize((string) $p->title))
            ->map(fn (Collection $g) => $g->values());
    }

    /**
     * @return Post|string|null Post = eşleşti, 'ambiguous' = birden fazla, null = yok
     */
    private function matchPost(string $title, ?string $publishedAt): Post|string|null
    {
        foreach ([$this->byExactTitle->get(trim($title)),
            $this->byNormalizedTitle->get(WixTitleNormalizer::normalize($title))] as $cands) {
            if (! $cands || $cands->isEmpty()) {
                continue;
            }
            if ($cands->count() === 1) {
                return $cands->first();
            }

            // Birden fazla aday: yayın tarihiyle daralt
            $date = $publishedAt ? $this->parseDate($publishedAt) : null;
            if ($date) {
                $narrowed = $cands->filter(fn (Post $p) => $p->published_at
                    && $p->published_at->copy()->startOfDay()->equalTo($date->copy()->startOfDay()))->values();
                if ($narrowed->count() === 1) {
                    return $narrowed->first();
                }
            }

            return 'ambiguous';
        }

        return null;
    }

    private function resolveUser(array $jp, bool $dry, array &$stats): ?User
    {
        $email = trim((string) ($jp['author_email'] ?? ''));
        $name = trim((string) ($jp['author_name'] ?? '')) ?: 'Wix Yazar';
        if ($email === '') {
            return null;
        }

        if (isset($this->userCache[$email])) {
            return $this->userCache[$email];
        }

        $user = User::where('email', $email)->first();
        if ($user) {
            return $this->userCache[$email] = $user;
        }

        // E-posta bulunamadı: aynı yazar DB'de FARKLI e-posta ile olabilir
        // (ör. Gökçe Serim = gokce@benizledim.com ama scrape sentetik e-posta üretti).
        // İsimle tek eşleşme varsa onu yeniden kullan — çift kullanıcı yaratma.
        if ($name !== '' && $name !== 'Wix Yazar') {
            $byName = User::where('name', $name)->get();
            if ($byName->count() === 1) {
                return $this->userCache[$email] = $byName->first();
            }
        }

        // Kullanıcı yoksa oluştur (dry-run'da sahte nesne)
        if ($dry) {
            $stats['users_created']++;
            $u = new User(['name' => $name, 'email' => $email, 'role' => 'author', 'provider' => 'email']);
            $u->id = -1; // eşleşmeyi tetikle ama kaydetme

            return $this->userCache[$email] = $u;
        }

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make(Str::random(32)),
            'role' => 'author',
            'provider' => 'email',
            'email_verified_at' => now(),
        ]);
        $stats['users_created']++;

        return $this->userCache[$email] = $user;
    }

    private function parseDate(string $value): ?Carbon
    {
        $value = trim($value);
        if ($value === '') {
            return null;
        }
        try {
            return Carbon::parse($value);
        } catch (\Throwable) {
            return null;
        }
    }
}
