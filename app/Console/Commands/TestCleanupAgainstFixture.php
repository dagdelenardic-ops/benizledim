<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestCleanupAgainstFixture extends Command
{
    protected $signature = 'posts:test-cleanup
        {--file=database/data/wix-posts.json : Test fixture path}
        {--limit=5 : Kaç post işlensin}
        {--show-diff=2 : Kaç post için detaylı diff göster}';

    protected $description = 'Wix HTML cleanup pattern\'ları wix-posts.json fixture\'ına karşı test eder, DB\'ye dokunmaz';

    public function handle(CleanPostContent $cleaner): int
    {
        $file = base_path((string) $this->option('file'));
        if (!is_file($file)) {
            $this->error("Fixture bulunamadı: {$file}");
            return self::FAILURE;
        }

        $data = json_decode(file_get_contents($file), true);
        $posts = $data['posts'] ?? [];

        if (empty($posts)) {
            $this->error('Fixture\'da post yok.');
            return self::FAILURE;
        }

        $limit = (int) $this->option('limit');
        $showDiff = (int) $this->option('show-diff');

        $totalBefore = 0;
        $totalAfter = 0;
        $processed = 0;
        $diffsShown = 0;

        $patterns = [
            'div type='       => '/<div[^>]+type=["\'][^"\']+["\']/i',
            'wow-image'       => '/<wow-image/i',
            'viewer-id'       => '/id=["\']viewer-/i',
            'br role=present' => '/<br[^>]+role=["\']presentation/i',
            'data-* attr'     => '/\sdata-[a-z-]+=/i',
            'dir=auto/ltr'    => '/\sdir=["\'](?:auto|ltr)/i',
            'span nested'     => '/<span>\s*<span>/',
        ];

        foreach (array_slice($posts, 0, $limit) as $p) {
            $original = (string) ($p['content'] ?? '');
            if ($original === '') continue;

            $cleaned = $cleaner->cleanHtml($original);

            $totalBefore += strlen($original);
            $totalAfter += strlen($cleaned);
            $processed++;

            $beforeCounts = [];
            $afterCounts = [];
            foreach ($patterns as $name => $pat) {
                $beforeCounts[$name] = preg_match_all($pat, $original);
                $afterCounts[$name] = preg_match_all($pat, $cleaned);
            }

            $this->line('');
            $this->line(sprintf('[%d] %s', $processed, substr($p['title'] ?? 'no-title', 0, 60)));
            $this->line(sprintf('  byte: %s → %s (%%%d tasarruf)',
                number_format(strlen($original)),
                number_format(strlen($cleaned)),
                strlen($original) > 0 ? round((1 - strlen($cleaned) / strlen($original)) * 100) : 0
            ));
            $this->line('  Pattern temizliği:');
            foreach ($patterns as $name => $_) {
                $b = $beforeCounts[$name];
                $a = $afterCounts[$name];
                if ($b > 0 || $a > 0) {
                    $marker = $a === 0 ? '✓' : ($a < $b ? '~' : '✗');
                    $this->line(sprintf('    %s %-20s %d → %d', $marker, $name, $b, $a));
                }
            }

            if ($diffsShown < $showDiff) {
                $diffsShown++;
                $this->line('  ÖNCE (ilk 250 char):');
                $this->line('    ' . str_replace(["\n", "\r"], ' ', substr($original, 0, 250)));
                $this->line('  SONRA (ilk 250 char):');
                $this->line('    ' . str_replace(["\n", "\r"], ' ', substr($cleaned, 0, 250)));
            }
        }

        $this->line('');
        $this->info(sprintf(
            'TOPLAM: %d post — %s → %s byte (%%%d tasarruf)',
            $processed,
            number_format($totalBefore),
            number_format($totalAfter),
            $totalBefore > 0 ? round((1 - $totalAfter / $totalBefore) * 100) : 0
        ));

        return self::SUCCESS;
    }
}
