<?php

namespace App\Http\Controllers;

use App\Models\GuestPushSubscriber;
use App\Notifications\PushSubscriptionTest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Cookie;

class PushSubscriptionController extends Controller
{
    private const GUEST_COOKIE = 'guest_push_id';

    private const GUEST_COOKIE_LIFETIME_MINUTES = 525600;

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint' => ['required', 'url'],
            'keys.p256dh' => ['nullable', 'string'],
            'keys.auth' => ['nullable', 'string'],
            'contentEncoding' => ['nullable', 'string'],
        ]);

        [$subscribable, $cookie] = $this->resolveSubscribable($request);

        $subscribable->updatePushSubscription(
            $data['endpoint'],
            $data['keys']['p256dh'] ?? null,
            $data['keys']['auth'] ?? null,
            $data['contentEncoding'] ?? null,
        );

        $response = response()->json(['saved' => true], 201);

        if ($cookie) {
            $response->withCookie($cookie);
        }

        return $response;
    }

    public function destroy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'endpoint' => ['required', 'url'],
        ]);

        [$subscribable] = $this->resolveSubscribable($request, createIfMissing: false);

        $subscribable?->deletePushSubscription($data['endpoint']);

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
        [$subscribable, $cookie] = $this->resolveSubscribable($request);

        $subscribable->notify(new PushSubscriptionTest());

        $response = response()->json(['sent' => true]);

        if ($cookie) {
            $response->withCookie($cookie);
        }

        return $response;
    }

    /**
     * @return array{0: \App\Models\User|\App\Models\GuestPushSubscriber|null, 1: \Symfony\Component\HttpFoundation\Cookie|null}
     */
    private function resolveSubscribable(Request $request, bool $createIfMissing = true): array
    {
        if ($user = $request->user()) {
            return [$user, null];
        }

        $fingerprint = $request->cookie(self::GUEST_COOKIE);

        if ($fingerprint) {
            $guest = GuestPushSubscriber::where('fingerprint', $fingerprint)->first();

            if ($guest) {
                $guest->forceFill(['last_seen_at' => now()])->save();

                return [$guest, null];
            }
        }

        if (! $createIfMissing) {
            return [null, null];
        }

        $fingerprint = (string) Str::uuid();
        $guest = GuestPushSubscriber::create([
            'fingerprint' => $fingerprint,
            'last_seen_at' => now(),
        ]);

        $cookie = cookie(
            self::GUEST_COOKIE,
            $fingerprint,
            self::GUEST_COOKIE_LIFETIME_MINUTES,
            '/',
            null,
            $request->isSecure(),
            true,
            false,
            'lax',
        );

        return [$guest, $cookie];
    }
}
