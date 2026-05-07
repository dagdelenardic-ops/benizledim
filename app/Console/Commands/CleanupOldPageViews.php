<?php

namespace App\Console\Commands;

use App\Models\PageView;
use Illuminate\Console\Command;

class CleanupOldPageViews extends Command
{
    protected $signature = 'stats:cleanup {--days=90 : Bu kadar günden eski page_views satırları silinir.}';

    protected $description = 'Eski page_views satırlarını siler (varsayılan 90 gün).';

    public function handle(): int
    {
        $days = max(7, (int) $this->option('days'));
        $threshold = now()->subDays($days);

        $deleted = PageView::query()
            ->where('viewed_at', '<', $threshold)
            ->limit(50000)
            ->delete();

        $this->info("Silinen kayıt: {$deleted} (>{$days} gün eski)");
        return self::SUCCESS;
    }
}
