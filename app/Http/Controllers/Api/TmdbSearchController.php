<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TmdbService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TmdbSearchController extends Controller
{
    public function __construct(private readonly TmdbService $tmdb) {}

    public function search(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'q' => ['required', 'string', 'min:2'],
                'type' => ['nullable', 'in:multi,movie,tv'],
            ]);
        } catch (ValidationException $exception) {
            return response()->json([
                'message' => 'Invalid TMDB search request.',
                'errors' => $exception->errors(),
            ], 400);
        }

        if (! $this->tmdb->isConfigured()) {
            return response()->json([
                'available' => false,
                'message' => 'TMDB aramasi bu ortamda henuz etkin degil.',
                'results' => [],
            ]);
        }

        return response()->json([
            'available' => true,
            'results' => $this->tmdb->search($validated['q'], $validated['type'] ?? 'multi'),
        ]);
    }
}
