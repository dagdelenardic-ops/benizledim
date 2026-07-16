<?php

namespace App\Http\Controllers;

use App\Models\FlashNews;
use App\Services\FlashNewsDigestSender;
use App\Services\FlashNewsFetchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class FlashNewsController extends Controller
{
    public function index(Request $request): InertiaResponse
    {
        $items = FlashNews::published()
            ->whereNotNull('image_url')
            ->orderByDesc('published_at')
            ->paginate(24)
            ->through(fn ($item) => [
                'id' => $item->id,
                'title_tr' => $item->title_tr,
                'slug' => $item->slug,
                'summary_tr' => $item->summary_tr,
                'source_name' => $item->source_name,
                'image_url' => $item->image_url,
                'published_at' => $item->published_at,
            ]);

        $canonicalUrl = 'https://benizledim.com/haberler';
        if ($request->integer('page', 1) > 1) {
            $canonicalUrl .= '?page='.$request->integer('page');
        }

        return Inertia::render('FlashNews/Index', [
            'items' => $items,
            'title' => 'Sinema ve Dizi Haberleri',
            'description' => 'Güncel film, dizi ve sinema haberleri; vizyon, festival ve platform gelişmeleri - Ben İzledim.',
            'canonicalUrl' => $canonicalUrl,
        ]);
    }

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

    private function authorizeToken(Request $request): bool
    {
        $token = config('services.flashnews.token');
        $given = (string) ($request->query('token') ?: $request->input('token'));

        return $token && hash_equals($token, $given);
    }

    /**
     * Bugün yayınlanan flash haberleri özetleme için ham JSON döner.
     * Lokal Mac rutini bunu çekip claude -p ile özetler.
     */
    public function digestSource(Request $request): JsonResponse
    {
        if (! $this->authorizeToken($request)) {
            return response()->json(['error' => 'unauthorized'], 401);
        }

        $items = FlashNews::query()
            ->published()
            ->whereDate('published_at', now()->startOfDay())
            ->orderByDesc('source_published_at')
            ->limit(8)
            ->get(['title_tr', 'summary_tr']);

        return response()->json([
            'ok' => true,
            'date' => now()->toDateString(),
            'count' => $items->count(),
            'items' => $items->map(fn ($i) => [
                'title' => $i->title_tr,
                'summary' => $i->summary_tr,
            ])->values(),
        ]);
    }

    /**
     * Lokal rutinden gelen hazır özetle tüm push abonelerine bildirim gönderir.
     */
    public function digestSend(Request $request, FlashNewsDigestSender $sender): JsonResponse
    {
        if (! $this->authorizeToken($request)) {
            return response()->json(['error' => 'unauthorized'], 401);
        }

        $body = trim((string) $request->input('body'));
        if ($body === '') {
            return response()->json(['error' => 'body required'], 422);
        }

        $today = now()->startOfDay();
        $count = (int) ($request->input('count')
            ?: FlashNews::published()->whereDate('published_at', $today)->count());

        $title = $count > 0
            ? "🔥 Günün Flash Haberleri ({$count})"
            : '🔥 Günün Flash Haberleri';

        $result = $sender->send($title, $body, $today->toDateString());

        return response()->json([
            'ok' => true,
            'title' => $title,
            'recipients' => $result['recipients'],
            'failed' => $result['failed'],
        ]);
    }
}
