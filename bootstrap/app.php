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

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        then: function () {
            require __DIR__.'/../routes/auth.php';
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
