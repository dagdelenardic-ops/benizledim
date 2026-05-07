<?php

namespace App\Http\Middleware;

use App\Jobs\RecordPageView;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPageView
{
    private const BOT_PATTERNS = [
        'bot', 'spider', 'crawler', 'slurp', 'mediapartners',
        'facebookexternalhit', 'whatsapp', 'telegram', 'twitterbot',
        'linkedinbot', 'embedly', 'preview', 'pingdom', 'uptimerobot',
        'headlesschrome', 'phantomjs', 'puppeteer', 'lighthouse',
    ];

    private const IGNORED_PATH_PREFIXES = [
        '/admin',
        '/api/',
        '/build/',
        '/storage/',
        '/sitemap',
        '/feed',
        '/up',
        '/login',
        '/logout',
        '/register',
        '/auth/',
        '/__',
        '/favicon',
        '/robots.txt',
        '/sw.js',
        '/manifest.json',
        '/push',
        '/_debugbar',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        if (! $this->shouldTrack($request, $response)) {
            return;
        }

        try {
            RecordPageView::dispatch([
                'visitor_id' => (string) ($request->attributes->get('visitor_id') ?: $request->cookie('bi_visitor_id')),
                'user_id' => optional($request->user())->id,
                'session_id' => $request->hasSession() ? $request->session()->getId() : null,
                'url' => substr($request->fullUrl(), 0, 500),
                'path' => substr('/'.ltrim($request->path(), '/'), 0, 255),
                'route_name' => optional($request->route())->getName(),
                'referer' => $request->headers->get('referer') ? substr($request->headers->get('referer'), 0, 500) : null,
                'user_agent' => $request->userAgent() ? substr($request->userAgent(), 0, 500) : null,
                'device_type' => $this->detectDevice($request->userAgent() ?? ''),
                'viewed_at' => now()->toDateTimeString(),
            ]);
        } catch (\Throwable $e) {
            report($e);
        }
    }

    private function shouldTrack(Request $request, Response $response): bool
    {
        if (! $request->isMethod('GET')) {
            return false;
        }

        if ($response->getStatusCode() >= 400) {
            return false;
        }

        if ($request->expectsJson() || $request->ajax()) {
            $isInertia = $request->headers->has('X-Inertia');
            if (! $isInertia) {
                return false;
            }
        }

        $path = '/'.ltrim($request->path(), '/');
        foreach (self::IGNORED_PATH_PREFIXES as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return false;
            }
        }

        $ua = strtolower($request->userAgent() ?? '');
        if ($ua === '') {
            return false;
        }
        foreach (self::BOT_PATTERNS as $pattern) {
            if (str_contains($ua, $pattern)) {
                return false;
            }
        }

        return true;
    }

    private function detectDevice(string $userAgent): string
    {
        $ua = strtolower($userAgent);
        if (preg_match('/ipad|tablet|kindle|playbook|silk/i', $ua)) {
            return 'tablet';
        }
        if (preg_match('/iphone|android|mobile|opera mini|iemobile/i', $ua)) {
            return 'mobile';
        }
        return 'desktop';
    }
}
