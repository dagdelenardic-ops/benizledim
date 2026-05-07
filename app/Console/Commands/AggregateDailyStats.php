<?php

namespace App\Console\Commands;

use App\Models\DailyStat;
use App\Models\PageView;
use Carbon\CarbonImmutable;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AggregateDailyStats extends Command
{
    protected $signature = 'stats:aggregate {--date= : Hedef gün (YYYY-MM-DD). Boşsa dünü işler.}';

    protected $description = 'page_views tablosundan günlük özet üretir ve daily_stats tablosuna yazar.';

    public function handle(): int
    {
        $date = $this->option('date')
            ? CarbonImmutable::parse($this->option('date'))->startOfDay()
            : CarbonImmutable::yesterday();

        $start = $date->startOfDay();
        $end = $date->endOfDay();

        $row = PageView::query()
            ->whereBetween('viewed_at', [$start, $end])
            ->selectRaw('COUNT(*) as pv, COUNT(DISTINCT visitor_id) as uv, COUNT(DISTINCT NULLIF(user_id, NULL)) as auth_uv, COUNT(DISTINCT session_id) as sessions')
            ->first();

        $totalPv = (int) ($row->pv ?? 0);

        if ($totalPv === 0) {
            $this->info("[{$date->toDateString()}] Kayıt yok, atlandı.");
            return self::SUCCESS;
        }

        $bounces = (int) DB::table('page_views')
            ->whereBetween('viewed_at', [$start, $end])
            ->whereNotNull('session_id')
            ->groupBy('session_id')
            ->havingRaw('COUNT(*) = 1')
            ->get()
            ->count();

        $avgDurationMs = (float) (PageView::query()
            ->whereBetween('viewed_at', [$start, $end])
            ->whereNotNull('duration_ms')
            ->avg('duration_ms') ?? 0);

        $topPaths = PageView::query()
            ->whereBetween('viewed_at', [$start, $end])
            ->groupBy('path')
            ->selectRaw('path, COUNT(*) as views, AVG(duration_ms) as avg_ms')
            ->orderByDesc('views')
            ->limit(20)
            ->get()
            ->map(fn ($r) => [
                'path' => $r->path,
                'views' => (int) $r->views,
                'avg_seconds' => $r->avg_ms ? (int) round($r->avg_ms / 1000) : 0,
            ])->toArray();

        $topReferers = PageView::query()
            ->whereBetween('viewed_at', [$start, $end])
            ->whereNotNull('referer')
            ->where('referer', '!=', '')
            ->groupBy('referer')
            ->selectRaw('referer, COUNT(*) as views')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->map(fn ($r) => ['referer' => $r->referer, 'views' => (int) $r->views])
            ->toArray();

        $deviceRows = PageView::query()
            ->whereBetween('viewed_at', [$start, $end])
            ->whereNotNull('device_type')
            ->groupBy('device_type')
            ->selectRaw('device_type, COUNT(DISTINCT visitor_id) as visitors')
            ->get();

        $devices = ['mobile' => 0, 'desktop' => 0, 'tablet' => 0];
        foreach ($deviceRows as $d) {
            $devices[$d->device_type] = (int) $d->visitors;
        }

        DailyStat::updateOrCreate(
            ['date' => $date->toDateString()],
            [
                'unique_visitors' => (int) ($row->uv ?? 0),
                'total_pageviews' => $totalPv,
                'authenticated_visitors' => (int) ($row->auth_uv ?? 0),
                'sessions' => (int) ($row->sessions ?? 0),
                'bounces' => $bounces,
                'avg_session_duration_seconds' => (int) round($avgDurationMs / 1000),
                'top_paths' => $topPaths,
                'top_referers' => $topReferers,
                'device_breakdown' => $devices,
            ]
        );

        $this->info("[{$date->toDateString()}] Özet yazıldı: {$totalPv} PV, {$row->uv} UV.");
        return self::SUCCESS;
    }
}
