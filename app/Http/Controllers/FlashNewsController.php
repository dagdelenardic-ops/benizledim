<?php

namespace App\Http\Controllers;

use App\Models\FlashNews;
use App\Services\FlashNewsFetchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class FlashNewsController extends Controller
{
    public function show(string $slug): InertiaResponse
    {
        $item = FlashNews::published()->where('slug', $slug)->firstOrFail();

        $related = FlashNews::published()
            ->where('id', '!=', $item->id)
            ->orderByDesc('published_at')
            ->take(6)
            ->get(['id', 'title_tr', 'slug', 'summary_tr', 'source_name', 'image_url', 'published_at']);

        return Inertia::render('FlashNews/Show', [
            'item' => $item,
            'related' => $related,
        ]);
    }

    public function fetch(Request $request, FlashNewsFetchService $service): JsonResponse
    {
        $token = config('services.flashnews.token');
        $given = (string) ($request->query('token') ?: $request->input('token'));
        if (! $token || ! hash_equals($token, $given)) {
            return response()->json(['error' => 'unauthorized'], 401);
        }

        @set_time_limit(0);
        @ini_set('max_execution_time', '0');

        $maxSeconds = (int) ($request->query('seconds') ?: 50);
        $maxSeconds = max(15, min(240, $maxSeconds));

        $stats = $service->fetchAndStore($maxSeconds);

        return response()->json(['ok' => true, 'stats' => $stats]);
    }
}
