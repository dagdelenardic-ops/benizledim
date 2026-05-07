<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class UpdateUserLastSeen
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            $cacheKey = 'user-last-seen-'.$user->id;

            if (! Cache::has($cacheKey)) {
                Cache::put($cacheKey, true, now()->addSeconds(60));

                try {
                    DB::table('users')
                        ->where('id', $user->id)
                        ->update(['last_seen_at' => now()]);
                } catch (\Throwable $e) {
                    report($e);
                }
            }
        }

        return $next($request);
    }
}
