<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Override the "no-cache, private" Cache-Control header that Symfony's session
 * handler appends to any response touching the session. Google can interpret
 * "private" as personalized content and skip indexing public review pages.
 *
 * Registered with `prepend:` so it runs LAST on the response (after the session
 * middleware has set its header), and only for guest GET HTML responses.
 */
class PublicHtmlCache
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $contentType = (string) $response->headers->get('Content-Type', '');
        $status = $response->getStatusCode();

        $eligible = ($request->isMethod('GET') || $request->isMethod('HEAD'))
            && ! $request->user()
            && ! $request->headers->has('X-Inertia')
            && str_contains($contentType, 'text/html')
            && $status >= 200 && $status < 300;

        if ($eligible) {
            $response->headers->set(
                'Cache-Control',
                'public, max-age=0, s-maxage=300, stale-while-revalidate=600'
            );
            $response->headers->remove('Pragma');
            $response->headers->remove('Expires');
        }

        return $response;
    }
}
