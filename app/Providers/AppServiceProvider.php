<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (! app()->environment('production')) {
            return;
        }

        $canonicalUrl = rtrim((string) config('benizledim.canonical_url', config('app.url')), '/');

        if ($canonicalUrl === '') {
            return;
        }

        URL::forceRootUrl($canonicalUrl);

        $scheme = parse_url($canonicalUrl, PHP_URL_SCHEME);

        if (is_string($scheme) && $scheme !== '') {
            URL::forceScheme($scheme);
        }
    }
}
