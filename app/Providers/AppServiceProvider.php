<?php

namespace App\Providers;

use App\Listeners\ClaimGuestConversations;
use App\Listeners\LogSuccessfulLogin;
use App\Models\Comment;
use App\Models\Entry;
use App\Models\Like;
use App\Models\Post;
use App\Observers\CommentObserver;
use App\Observers\EntryObserver;
use App\Observers\LikeObserver;
use App\Observers\PostObserver;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
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
        Event::listen(Login::class, ClaimGuestConversations::class);
        Event::listen(Login::class, LogSuccessfulLogin::class);

        Comment::observe(CommentObserver::class);
        Entry::observe(EntryObserver::class);
        Like::observe(LikeObserver::class);
        Post::observe(PostObserver::class);

        if (! app()->environment('production')) {
            return;
        }

        Vite::createAssetPathsUsing(fn (string $path): string => '/'.ltrim($path, '/'));

        $canonicalUrl = rtrim((string) config('benizledim.canonical_url', config('app.url')), '/');

        if ($canonicalUrl === '') {
            return;
        }

        $canonicalHost = strtolower((string) parse_url($canonicalUrl, PHP_URL_HOST));
        $requestHost = app()->runningInConsole()
            ? $canonicalHost
            : strtolower((string) request()->getHost());

        // A stale or wrong APP_URL must not hijack the whole site: pinning the
        // root URL to a host the visitor did not ask for sends every generated
        // link — including the guest redirect to /login — to another domain.
        // Only pin when the request really arrived on the canonical host;
        // CanonicalHostMiddleware already 301s the known alias hosts here.
        if ($requestHost !== '' && $requestHost !== $canonicalHost) {
            return;
        }

        URL::forceRootUrl($canonicalUrl);

        $scheme = parse_url($canonicalUrl, PHP_URL_SCHEME);

        if (is_string($scheme) && $scheme !== '') {
            URL::forceScheme($scheme);
        }
    }
}
