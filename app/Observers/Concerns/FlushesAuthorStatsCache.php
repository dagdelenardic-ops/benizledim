<?php

namespace App\Observers\Concerns;

use Illuminate\Support\Facades\Cache;

trait FlushesAuthorStatsCache
{
    protected function flushAuthorStatsCache(int $userId): void
    {
        $store = Cache::getStore();

        if (method_exists($store, 'tags')) {
            Cache::tags(["user.{$userId}.stats"])->flush();
        }
    }
}