<?php

namespace App\Http\Controllers;

use App\Services\LetterboxdSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class LetterboxdController extends Controller
{
    public function __construct(private readonly LetterboxdSyncService $sync)
    {
    }

    public function connect(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255'],
        ]);

        try {
            $preview = $this->sync->previewForUsername($data['username']);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json([
            'preview' => array_map(fn (array $item) => [
                'title' => $item['title'],
                'year' => $item['year'],
                'watchedDate' => $item['watchedDate'] ?? $item['publishedAt'],
                'rating' => $item['rating'],
            ], $preview),
            'confirmed' => false,
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:255'],
        ]);

        $request->user()->forceFill([
            'letterboxd_username' => $data['username'],
            'letterboxd_sync_enabled' => true,
        ])->save();

        return response()->json(['saved' => true]);
    }

    public function syncNow(Request $request): JsonResponse
    {
        $result = $this->sync->syncForUser($request->user());
        $request->user()->refresh();

        return response()->json([
            'created' => $result['created'],
            'skipped' => $result['skipped'],
            'last_sync_at' => optional($request->user()->last_letterboxd_sync_at)?->toIso8601String(),
        ]);
    }

    public function disconnect(Request $request): JsonResponse
    {
        $request->user()->forceFill([
            'letterboxd_username' => null,
            'letterboxd_sync_enabled' => false,
            'last_letterboxd_sync_at' => null,
        ])->save();

        return response()->json(['disconnected' => true]);
    }
}