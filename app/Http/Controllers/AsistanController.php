<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\VertexAiSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response;

class AsistanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Asistan/Index', [
            'title' => 'Ben İzledim Asistanı',
            'description' => 'Site içeriğine dayanan film, dizi ve belgesel önerileri için Ben İzledim asistanına soru sor.',
            'enabled' => (bool) config('services.gcp.search_enabled'),
        ]);
    }

    public function ask(Request $request, VertexAiSearchService $vertex): JsonResponse
    {
        $data = $request->validate([
            'question' => ['required', 'string', 'min:3', 'max:500'],
            'session' => ['nullable', 'string', 'max:512'],
        ]);

        if (!config('services.gcp.search_enabled')) {
            return response()->json([
                'answer' => 'Asistan şu anda hazırlık aşamasında.',
                'citations' => [],
                'session' => null,
            ], 503);
        }

        $key = 'asistan:' . ($request->user()?->id ?: $request->ip());
        if (RateLimiter::tooManyAttempts($key, 20)) {
            return response()->json([
                'answer' => 'Çok hızlı soruyorsun, biraz nefes al.',
                'citations' => [],
                'session' => $data['session'] ?? null,
            ], 429);
        }
        RateLimiter::hit($key, 60);

        $result = $vertex->answer($data['question'], $data['session'] ?? null);
        $result['citations'] = $this->enrichCitations($result['citations'] ?? []);

        return response()->json($result);
    }

    private function enrichCitations(array $citations): array
    {
        $missing = collect($citations)
            ->filter(fn ($c) => empty($c['slug']) && !empty($c['id']))
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->all();

        if (empty($missing)) {
            return $citations;
        }

        $lookup = Post::whereIn('id', $missing)
            ->get(['id', 'slug', 'title'])
            ->keyBy('id');

        return array_map(function ($c) use ($lookup) {
            if (empty($c['slug']) && !empty($c['id']) && $lookup->has((int) $c['id'])) {
                $post = $lookup->get((int) $c['id']);
                $c['slug'] = $post->slug;
                if (empty($c['title'])) {
                    $c['title'] = $post->title;
                }
            }
            return $c;
        }, $citations);
    }
}
