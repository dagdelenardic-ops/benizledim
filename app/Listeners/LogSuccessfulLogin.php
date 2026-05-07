<?php

namespace App\Listeners;

use App\Models\UserLoginEvent;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class LogSuccessfulLogin
{
    public function handle(Login $event): void
    {
        $user = $event->user;

        if (! $user || ! $user->getKey()) {
            return;
        }

        try {
            DB::table('users')->where('id', $user->getKey())->update([
                'last_login_at' => now(),
                'last_seen_at' => now(),
                'login_count' => DB::raw('login_count + 1'),
            ]);

            UserLoginEvent::create([
                'user_id' => $user->getKey(),
                'ip' => Request::ip(),
                'user_agent' => substr((string) Request::userAgent(), 0, 500),
                'provider' => $user->provider ?? null,
                'logged_in_at' => now(),
            ]);
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
