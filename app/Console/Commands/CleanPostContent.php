<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanPostContent extends Command
{
    protected $signature = 'posts:clean-content
        {--dry-run : Sadece önizleme, DB değişmez}
        {--id= : Tek bir post id\'sini hedefle}
        {--sample=3 : Dry-run\'da gösterilecek örnek diff sayısı}';

    protected $description = 'Wix import sonrası yazı içeriklerindeki gereksiz HTML kabuğunu temizle';

    public function handle(): int
    {
        $dryRun = (bool) $this->option('dry-run');
        $sampleLimit = (int) $this->option('sample');
        $id = $this->option('id');

        $query = Post::query();
        if ($id) {
            $query->where('id', $id);
        }

        $totalPosts = (clone $query)->count();
        $this->info(sprintf('Hedef post: %d (dry-run=%s)', $totalPosts, $dryRun ? 'evet' : 'hayır'));

        $cleanedCount = 0;
        $totalBefore = 0;
        $totalAfter = 0;
        $samples = [];

        $query->chunkById(50, function ($chunk) use (&$cleanedCount, &$totalBefore, &$totalAfter, &$samples, $dryRun, $sampleLimit) {
            foreach ($chunk as $post) {
                $original = (string) $post->content;
                if ($original === '') {
                    continue;
                }

                $cleaned = $this->cleanHtml($original);

                if ($cleaned === $original) {
                    continue;
                }

                $cleanedCount++;
                $totalBefore += strlen($original);
                $totalAfter += strlen($cleaned);

                if ($dryRun && count($samples) < $sampleLimit) {
                    $samples[] = [
                        'id' => $post->id,
                        'title' => $post->title,
                        'before_len' => strlen($original),
                        'after_len' => strlen($cleaned),
                        'before_preview' => substr($original, 0, 200),
                        'after_preview' => substr($cleaned, 0, 200),
                    ];
                }

                if (!$dryRun) {
                    DB::table('posts')->where('id', $post->id)->update(['content' => $cleaned]);
                }
            }
        });

        if ($dryRun && !empty($samples)) {
            $this->line('');
            $this->line('=== ÖRNEK DIFF\'LER ===');
            foreach ($samples as $s) {
                $this->line('');
                $this->line(sprintf('[%d] %s', $s['id'], $s['title']));
                $this->line(sprintf('  byte: %s → %s (-%s, %%%d tasarruf)',
                    number_format($s['before_len']),
                    number_format($s['after_len']),
                    number_format($s['before_len'] - $s['after_len']),
                    $s['before_len'] > 0 ? round((1 - $s['after_len'] / $s['before_len']) * 100) : 0
                ));
                $this->line('  ÖNCE:  ' . str_replace(["\n", "\r"], ' ', substr($s['before_preview'], 0, 160)));
                $this->line('  SONRA: ' . str_replace(["\n", "\r"], ' ', substr($s['after_preview'], 0, 160)));
            }
        }

        $this->line('');
        $this->info(sprintf(
            '%s: %d/%d post (toplam %s → %s, %s tasarruf)',
            $dryRun ? 'Temizlenecek' : 'Temizlendi',
            $cleanedCount,
            $totalPosts,
            number_format($totalBefore),
            number_format($totalAfter),
            number_format(max(0, $totalBefore - $totalAfter))
        ));

        return self::SUCCESS;
    }

    public function cleanHtml(string $html): string
    {
        $rules = [
            ['pattern' => '/<button[^>]*aria-label=["\']\s*G[öo]r[üu]nt[üu]y[üu]\s+Geni[şs]let[^"\']*["\'][^>]*>.*?<\/button>/is', 'replacement' => ''],
            ['pattern' => '/<svg[^>]+viewbox=["\']0 0 19 19["\'][^>]*>.*?<\/svg>/is', 'replacement' => ''],
            ['pattern' => '/<wow-image[^>]*>(.*?)<\/wow-image>/is', 'replacement' => function ($m) {
                if (preg_match('/<img\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*\/?>/i', $m[1], $img)) {
                    $src = $img[1];
                    $alt = '';
                    if (preg_match('/\balt=["\']([^"\']*)["\']/', $img[0], $altMatch)) {
                        $alt = $altMatch[1];
                    }
                    $altAttr = htmlspecialchars($alt, ENT_QUOTES, 'UTF-8');
                    return '<figure><img src="' . htmlspecialchars($src, ENT_QUOTES, 'UTF-8') . '" alt="' . $altAttr . '" loading="lazy" /></figure>';
                }
                return '';
            }],
            ['pattern' => '/<\/?wow-[a-z-]+[^>]*>/i', 'replacement' => ''],
            ['pattern' => '/\s+id=["\']viewer-[a-z0-9]+["\']/i', 'replacement' => ''],
            ['pattern' => '/<br\s+role=["\']presentation["\'][^>]*\/?\s*>/i', 'replacement' => ''],
            ['pattern' => '/\s+dir=["\'](?:auto|ltr)["\']/i', 'replacement' => ''],
            ['pattern' => '/\s+target=["\']_self["\']/i', 'replacement' => ''],
            ['pattern' => '/<div\s+type=["\']empty-line["\'][^>]*>.*?<\/div>/is', 'replacement' => ''],
            ['pattern' => '/<div\s+type=["\'](?:first|paragraph|heading|image|gallery|list|blockquote|video)["\'][^>]*>(.*?)<\/div>/is', 'replacement' => '$1'],
            ['pattern' => '/<div\s+type=["\'][a-z-]+["\'][^>]*>(.*?)<\/div>/is', 'replacement' => '$1'],
            ['pattern' => '/\s*class="[^"]*"/', 'replacement' => ''],
            ['pattern' => '/\s*style="[^"]*"/', 'replacement' => ''],
            ['pattern' => '/\s*data-[a-z-]+="[^"]*"/i', 'replacement' => ''],
            ['pattern' => '/<span>\s*<span>\s*<span>(.*?)<\/span>\s*<\/span>\s*<\/span>/s', 'replacement' => '$1'],
            ['pattern' => '/<span>\s*<span>(.*?)<\/span>\s*<\/span>/s', 'replacement' => '$1'],
            ['pattern' => '/<span>(.*?)<\/span>/s', 'replacement' => '$1'],
            ['pattern' => '/<span>\s*<\/span>/', 'replacement' => ''],
            ['pattern' => '/<div>\s*<\/div>/', 'replacement' => ''],
            ['pattern' => '/<p>\s*<\/p>/', 'replacement' => ''],
            ['pattern' => '/(\s*<br\s*\/?>\s*){3,}/', 'replacement' => '<br><br>'],
            ['pattern' => '/<div[^>]*wix[^>]*>\s*<\/div>/i', 'replacement' => ''],
            ['pattern' => '/(\s*\n\s*){3,}/', 'replacement' => "\n\n"],
            ['pattern' => '/  +/', 'replacement' => ' '],
        ];

        $cleaned = $html;

        for ($pass = 0; $pass < 5; $pass++) {
            $previous = $cleaned;
            foreach ($rules as $rule) {
                if (is_callable($rule['replacement'])) {
                    $result = preg_replace_callback($rule['pattern'], $rule['replacement'], $cleaned);
                } else {
                    $result = preg_replace($rule['pattern'], $rule['replacement'], $cleaned);
                }
                if ($result !== null) {
                    $cleaned = $result;
                }
            }
            if ($cleaned === $previous) {
                break;
            }
        }

        return trim($cleaned);
    }
}
