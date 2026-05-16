<?php

namespace App\Services;

use App\Models\GuestPushSubscriber;
use App\Models\User;
use App\Notifications\FlashNewsDigestNotification;
use Illuminate\Support\Facades\Log;

class FlashNewsDigestSender
{
    /**
     * Verilen başlık/gövdeyle tüm push abonelerine (üye + misafir) flash digest gönderir.
     *
     * @return array{recipients:int, failed:int}
     */
    public function send(string $title, string $body, string $date): array
    {
        $notification = new FlashNewsDigestNotification(
            title: $title,
            body: $body,
            date: $date,
        );

        $sent = 0;
        $failed = 0;

        foreach (User::has('pushSubscriptions')->cursor() as $user) {
            try {
                $user->notify($notification);
                $sent++;
            } catch (\Throwable $e) {
                $failed++;
                Log::warning('[flash-digest] user failed', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            }
        }

        foreach (GuestPushSubscriber::has('pushSubscriptions')->cursor() as $guest) {
            try {
                $guest->notify($notification);
                $sent++;
            } catch (\Throwable $e) {
                $failed++;
                Log::warning('[flash-digest] guest failed', ['guest_id' => $guest->id, 'error' => $e->getMessage()]);
            }
        }

        Log::info('[flash-digest] sent', [
            'date' => $date,
            'recipients' => $sent,
            'failed' => $failed,
            'title' => $title,
            'body' => $body,
        ]);

        return ['recipients' => $sent, 'failed' => $failed];
    }
}
