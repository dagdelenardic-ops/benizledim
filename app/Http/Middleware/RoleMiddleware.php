<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        $user = $request->user();

        if (!$user) {
            abort(403, 'Bu işlem için giriş yapmalısınız.');
        }

        $allowedRoles = array_values(array_filter(array_map('trim', $roles)));

        if ($allowedRoles === [] || !in_array($user->role, $allowedRoles, true)) {
            abort(403, 'Bu işlem için yetkiniz yok.');
        }

        return $next($request);
    }
}
