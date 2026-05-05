<?php

namespace App\Http\Controllers;

use App\Notifications\PushSubscriptionTest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint' => ['required', 'url'],
            'keys.p256dh' => ['nullable', 'string'],
            'keys.auth' => ['nullable', 'string'],
            'contentEncoding' => ['nullable', 'string'],
        ]);

        $request->user()->updatePushSubscription(
            $data['endpoint'],
            $data['keys']['p256dh'] ?? null,
            $data['keys']['auth'] ?? null,
            $data['contentEncoding'] ?? null,
        );

        return response()->json(['saved' => true], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint' => ['required', 'url'],
        ]);

        $request->user()->deletePushSubscription($data['endpoint']);

        return response()->json(['deleted' => true]);
    }

    public function vapidKey(): JsonResponse
    {
        return response()->json([
            'publicKey' => config('services.webpush.vapid_public'),
        ]);
    }

    public function test(Request $request): JsonResponse
    {
        $request->user()->notify(new PushSubscriptionTest());

        return response()->json(['sent' => true]);
    }
}