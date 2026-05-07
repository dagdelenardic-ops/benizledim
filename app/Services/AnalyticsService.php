<?php

namespace App\Services;

use App\Models\DailyStat;
use App\Models\PageView;
use App\Models\User;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function rangeDates(string $range): array
    {
        $today = CarbonImmutable::today();

        return match ($range) {
            'today' => [$today, $today],
            'yesterday' => [$today->subDay(), $today->subDay()],
            '7d' => [$today->subDays(6), $today],
            '30d' => [$today->subDays(29), $today],
            '90d' => [$today->subDays(89), $today],
            default => [$today->subDays(6), $today],
        };
    }

    public function summary(string $range): array
    {
        [$from, $to] = $this->rangeDates($range);

        $todayKey = CarbonImmutable::today()->toDateString();
        $rangeIncludesToday = $to->toDateString() === $todayKey;

        $aggregate = DailyStat::whereBetween('date', [$from->toDateString(), $to->toDateString()])
            ->selectRaw('SUM(unique_visitors) as uv, SUM(total_pageviews) as pv, SUM(authenticated_visitors) as auth_visits, SUM(sessions) as sessions, SUM(bounces) as bounces, AVG(NULLIF(avg_session_duration_seconds,0)) as avg_dur')
            ->first();

        $uv = (int) ($aggregate->uv ?? 0);
        $pv = (int) ($aggregate->pv ?? 0);
        $authVisits = (int) ($aggregate->auth_visits ?? 0);
        $sessions = (int) ($aggregate->sessions ?? 0);
        $bounces = (int) ($aggregate->bounces ?? 0);
        $avgDuration = (int) ($aggregate->avg_dur ?? 0);

        if ($rangeIncludesToday) {
            $today = $this->computeDayLive(CarbonImmutable::today());
            $uv += $today['unique_visitors'];
            $pv += $today['total_pageviews'];
            $authVisits += $today['authenticated_visitors'];
            $sessions += $today['sessions'];
            $bounces += $today['bounces'];
            if ($today['avg_session_duration_seconds'] > 0) {
                $avgDuration = $avgDuration > 0
                    ? (int) (($avgDuration + $today['avg_session_duration_seconds']) / 2)
                    : $today['avg_session_duration_seconds'];
            }
        }

        return [
            'unique_visitors' => $uv,
            'total_pageviews' => $pv,
            'authenticated_visitors' => $authVisits,
            'sessions' => $sessions,
            'bounce_rate' => $sessions > 0 ? round($bounces / $sessions * 100, 1) : 0,
            'avg_session_duration_seconds' => $avgDuration,
            'pages_per_session' => $sessions > 0 ? round($pv / $sessions, 2) : 0,
        ];
    }

    public function timeseries(string $range): array
    {
        [$from, $to] = $this->rangeDates($range);
        $todayKey = CarbonImmutable::today()->toDateString();

        $stats = DailyStat::whereBetween('date', [$from->toDateString(), $to->toDateString()])
            ->orderBy('date')
            ->get()
            ->keyBy(fn ($row) => $row->date->toDateString());

        $period = CarbonPeriod::create($from, $to);
        $points = [];

        foreach ($period as $day) {
            $key = $day->toDateString();
            if ($key === $todayKey) {
                $live = $this->computeDayLive(CarbonImmutable::parse($key));
                $points[] = [
                    'date' => $key,
                    'unique_visitors' => $live['unique_visitors'],
                    'total_pageviews' => $live['total_pageviews'],
                ];
            } elseif ($stats->has($key)) {
                $row = $stats[$key];
                $points[] = [
                    'date' => $key,
                    'unique_visitors' => (int) $row->unique_visitors,
                    'total_pageviews' => (int) $row->total_pageviews,
                ];
            } else {
                $points[] = [
                    'date' => $key,
                    'unique_visitors' => 0,
                    'total_pageviews' => 0,
                ];
            }
        }

        return $points;
    }

    public function topPages(string $range, int $limit = 20): array
    {
        [$from, $to] = $this->rangeDates($range);

        $rows = PageView::query()
            ->whereBetween('viewed_at', [$from->startOfDay(), $to->endOfDay()])
            ->groupBy('path')
            ->selectRaw('path, COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors, AVG(duration_ms) as avg_ms')
            ->orderByDesc('views')
            ->limit($limit)
            ->get();

        return $rows->map(fn ($row) => [
            'path' => $row->path,
            'views' => (int) $row->views,
            'visitors' => (int) $row->visitors,
            'avg_seconds' => $row->avg_ms ? (int) round($row->avg_ms / 1000) : 0,
        ])->toArray();
    }

    public function topReferers(string $range, int $limit = 10): array
    {
        [$from, $to] = $this->rangeDates($range);

        $rows = PageView::query()
            ->whereBetween('viewed_at', [$from->startOfDay(), $to->endOfDay()])
            ->whereNotNull('referer')
            ->where('referer', '!=', '')
            ->groupBy('referer')
            ->selectRaw('referer, COUNT(*) as views')
            ->orderByDesc('views')
            ->limit($limit)
            ->get();

        return $rows->map(fn ($row) => [
            'referer' => $this->shortenReferer($row->referer),
            'full' => $row->referer,
            'views' => (int) $row->views,
        ])->toArray();
    }

    public function deviceBreakdown(string $range): array
    {
        [$from, $to] = $this->rangeDates($range);

        $rows = PageView::query()
            ->whereBetween('viewed_at', [$from->startOfDay(), $to->endOfDay()])
            ->whereNotNull('device_type')
            ->groupBy('device_type')
            ->selectRaw('device_type, COUNT(DISTINCT visitor_id) as visitors')
            ->get();

        $result = ['mobile' => 0, 'desktop' => 0, 'tablet' => 0];
        foreach ($rows as $row) {
            $result[$row->device_type] = (int) $row->visitors;
        }
        return $result;
    }

    public function realtime(int $minutes = 30): array
    {
        $since = now()->subMinutes($minutes);

        $activeVisitors = PageView::query()
            ->where('viewed_at', '>=', $since)
            ->distinct('visitor_id')
            ->count('visitor_id');

        $activePages = PageView::query()
            ->where('viewed_at', '>=', $since)
            ->groupBy('path')
            ->selectRaw('path, COUNT(DISTINCT visitor_id) as visitors')
            ->orderByDesc('visitors')
            ->limit(10)
            ->get()
            ->map(fn ($row) => [
                'path' => $row->path,
                'visitors' => (int) $row->visitors,
            ])->toArray();

        $onlineUsers = User::query()
            ->whereIn('role', ['admin', 'editor', 'author'])
            ->whereNotNull('last_seen_at')
            ->where('last_seen_at', '>=', now()->subMinutes(5))
            ->orderByDesc('last_seen_at')
            ->get(['id', 'name', 'avatar', 'role', 'last_seen_at'])
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'avatar' => $u->avatar,
                'role' => $u->role,
                'last_seen_at' => $u->last_seen_at?->toIso8601String(),
            ])->toArray();

        return [
            'active_visitors' => $activeVisitors,
            'active_pages' => $activePages,
            'online_authors' => $onlineUsers,
            'window_minutes' => $minutes,
        ];
    }

    public function authors(): array
    {
        return User::query()
            ->whereIn('role', ['admin', 'editor', 'author'])
            ->withCount('posts')
            ->orderByDesc('last_seen_at')
            ->get(['id', 'name', 'email', 'avatar', 'role', 'last_login_at', 'last_seen_at', 'login_count'])
            ->map(function (User $u) {
                $postViews = (int) DB::table('posts')
                    ->where('user_id', $u->id)
                    ->sum('view_count');

                $views7d = (int) PageView::query()
                    ->whereNotNull('post_id')
                    ->whereIn('post_id', function ($q) use ($u) {
                        $q->select('id')->from('posts')->where('user_id', $u->id);
                    })
                    ->where('viewed_at', '>=', now()->subDays(7))
                    ->count();

                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'avatar' => $u->avatar,
                    'role' => $u->role,
                    'is_online' => $u->isOnline(5),
                    'last_login_at' => $u->last_login_at?->toIso8601String(),
                    'last_seen_at' => $u->last_seen_at?->toIso8601String(),
                    'login_count' => (int) $u->login_count,
                    'posts_count' => (int) $u->posts_count,
                    'total_post_views' => $postViews,
                    'post_views_7d' => $views7d,
                ];
            })->toArray();
    }

    private function computeDayLive(CarbonInterface $day): array
    {
        $start = $day->copy()->startOfDay();
        $end = $day->copy()->endOfDay();

        $row = PageView::query()
            ->whereBetween('viewed_at', [$start, $end])
            ->selectRaw('COUNT(*) as pv, COUNT(DISTINCT visitor_id) as uv, COUNT(DISTINCT NULLIF(user_id, NULL)) as auth_uv, COUNT(DISTINCT session_id) as sessions')
            ->first();

        $sessions = (int) ($row->sessions ?? 0);

        $bounces = $sessions > 0
            ? (int) DB::table('page_views')
                ->whereBetween('viewed_at', [$start, $end])
                ->whereNotNull('session_id')
                ->select('session_id')
                ->groupBy('session_id')
                ->havingRaw('COUNT(*) = 1')
                ->get()
                ->count()
            : 0;

        $avgDuration = (int) round((float) (PageView::query()
            ->whereBetween('viewed_at', [$start, $end])
            ->whereNotNull('duration_ms')
            ->avg('duration_ms') ?? 0) / 1000);

        return [
            'unique_visitors' => (int) ($row->uv ?? 0),
            'total_pageviews' => (int) ($row->pv ?? 0),
            'authenticated_visitors' => (int) ($row->auth_uv ?? 0),
            'sessions' => $sessions,
            'bounces' => $bounces,
            'avg_session_duration_seconds' => $avgDuration,
        ];
    }

    private function shortenReferer(?string $url): string
    {
        if (! $url) {
            return '(direct)';
        }
        $host = parse_url($url, PHP_URL_HOST);
        return $host ?: $url;
    }
}
