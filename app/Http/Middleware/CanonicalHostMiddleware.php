<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CanonicalHostMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $canonicalUrl = rtrim((string) config('benizledim.canonical_url', config('app.url')), '/');
        $canonicalHost = strtolower((string) parse_url($canonicalUrl, PHP_URL_HOST));

        if ($canonicalUrl === '' || $canonicalHost === '') {
            return $next($request);
        }

        $currentHost = strtolower($request->getHost());
        $redirectHosts = config('benizledim.canonical_redirect_hosts', []);
        $targetScheme = (string) (parse_url($canonicalUrl, PHP_URL_SCHEME) ?: 'https');
        $shouldRedirectHost = $currentHost !== $canonicalHost && in_array($currentHost, $redirectHosts, true);
        $shouldRedirectScheme = $currentHost === $canonicalHost && $request->getScheme() !== $targetScheme;

        if (! $shouldRedirectHost && ! $shouldRedirectScheme) {
            return $next($request);
        }

        return new RedirectResponse($canonicalUrl.$request->getRequestUri(), 301);
    }
}
