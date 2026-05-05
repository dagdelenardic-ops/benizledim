<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureVisitorId
{
    public function handle(Request $request, Closure $next): Response
    {
        $visitorId = $request->cookie('bi_visitor_id');

        if (!$visitorId) {
            $visitorId = Str::uuid()->toString();
        }

        $request->attributes->set('visitor_id', $visitorId);

        $response = $next($request);

        if (!$request->cookie('bi_visitor_id')) {
            $response->headers->setCookie(cookie(
                'bi_visitor_id',
                $visitorId,
                60 * 24 * 365,
                '/',
                null,
                null,
                true,
                false,
                'lax',
            ));
        }

        return $response;
    }
}
