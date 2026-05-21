<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Redirect URLs with ?page=1 to the bare path, so Google does not treat
 * "/yazilar?page=1" and "/yazilar" as separate, duplicate pages. This was
 * showing up in Search Console as "Kullanıcı tarafından seçilen standart
 * sayfa olmadan kopya" because the canonical tag and the requested URL
 * disagreed for the first page.
 */
class CanonicalQueryRedirect
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->isMethod('GET') || $request->headers->has('X-Inertia')) {
            return $next($request);
        }

        if ($request->query('page') === '1') {
            $params = $request->except('page');
            $url = $request->url();
            if (! empty($params)) {
                $url .= '?' . http_build_query($params);
            }
            return redirect($url, 301);
        }

        return $next($request);
    }
}
