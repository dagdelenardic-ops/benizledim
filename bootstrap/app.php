<?php

/*
|--------------------------------------------------------------------------
| Shared Hosting Route Cache Guard
|--------------------------------------------------------------------------
|
| Some FTP-only deployments may leave stale `bootstrap/cache/routes-v*.php`
| files behind. Pinning a deterministic cache path prevents booting from
| orphaned cache files created by older releases.
|
*/
$routeCachePath = __DIR__.'/cache/routes-shared.php';
$_ENV['APP_ROUTES_CACHE'] = $_ENV['APP_ROUTES_CACHE'] ?? $routeCachePath;
$_SERVER['APP_ROUTES_CACHE'] = $_SERVER['APP_ROUTES_CACHE'] ?? $routeCachePath;

$cachePathMap = [
    'APP_CONFIG_CACHE' => __DIR__.'/cache/config-shared.php',
    'APP_EVENTS_CACHE' => __DIR__.'/cache/events-shared.php',
    'APP_PACKAGES_CACHE' => __DIR__.'/cache/packages-shared.php',
    'APP_SERVICES_CACHE' => __DIR__.'/cache/services-shared.php',
];

foreach ($cachePathMap as $envKey => $path) {
    $_ENV[$envKey] = $_ENV[$envKey] ?? $path;
    $_SERVER[$envKey] = $_SERVER[$envKey] ?? $path;
}

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        then: function () {
            Route::middleware('web')->group(__DIR__.'/../routes/auth.php');
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(prepend: [
            // Runs first on the request: 301 redirects "?page=1" to the bare
            // path so Google doesn't see two URLs serving the same first page.
            \App\Http\Middleware\CanonicalQueryRedirect::class,
            // Runs LAST on the response (LIFO) so it overrides the
            // "no-cache, private" header set by the session middleware.
            \App\Http\Middleware\PublicHtmlCache::class,
        ]);
        $middleware->web(append: [
            \App\Http\Middleware\SecurityHeaders::class,
            \App\Http\Middleware\CanonicalHostMiddleware::class,
            \App\Http\Middleware\EnsureVisitorId::class,
            \App\Http\Middleware\UpdateUserLastSeen::class,
            \App\Http\Middleware\TrackPageView::class,
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
        // Token korumalı server-to-server flash news endpoint'leri CSRF'ten muaf
        // (lokal Mac rutini cron'dan POST eder; oturum/cookie yok).
        $middleware->validateCsrfTokens(except: [
            'api/flashnews/*',
            'api/posts/cover-candidates',
            'api/posts/set-cover',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
