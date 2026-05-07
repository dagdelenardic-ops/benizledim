<?php

namespace App\Jobs;

use App\Models\PageView;
use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Carbon\Carbon;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;

class RecordPageView implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 5;

    public function __construct(public array $payload) {}

    public function handle(): void
    {
        $payload = $this->payload;

        $payload['post_id'] = $this->resolvePostId($payload['path'] ?? null);

        $currentViewedAt = isset($payload['viewed_at'])
            ? Carbon::parse($payload['viewed_at'])
            : now();

        if (! empty($payload['session_id'])) {
            $previous = PageView::query()
                ->where('session_id', $payload['session_id'])
                ->whereNull('duration_ms')
                ->orderByDesc('viewed_at')
                ->first();

            if ($previous) {
                $diffMs = (int) abs($currentViewedAt->diffInMilliseconds($previous->viewed_at));
                if ($diffMs > 0 && $diffMs < 30 * 60 * 1000) {
                    $previous->update(['duration_ms' => $diffMs]);
                }
            }
        }

        PageView::create($payload);

        if ($payload['post_id']) {
            DB::table('posts')->where('id', $payload['post_id'])->increment('view_count');
        }
    }

    private function resolvePostId(?string $path): ?int
    {
        if (! $path) {
            return null;
        }

        $path = ltrim($path, '/');
        $segments = explode('/', $path);

        if (count($segments) < 2) {
            return null;
        }

        $first = $segments[0];
        $slug = end($segments);

        if (! in_array($first, ['post', 'p', 'yazi', 'kategori'], true) && count($segments) !== 2) {
            return null;
        }

        if ($first === 'kategori') {
            return null;
        }

        return Post::query()->where('slug', $slug)->value('id');
    }
}
