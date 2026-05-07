<?php

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Collection;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class DailyDigestNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly Collection $posts)
    {
    }

    public function via(object $notifiable): array
    {
        return [WebPushChannel::class];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $count = $this->posts->count();
        $first = $this->posts->first();
        $title = $count === 1
            ? 'Bugün Ben/İzledim\'de yeni bir yazı'
            : "Bugün Ben/İzledim'de {$count} yeni yazı";

        $body = $first instanceof Post ? $first->title : '';

        if ($count > 1) {
            $second = $this->posts->skip(1)->first();
            if ($second instanceof Post) {
                $body .= $count === 2
                    ? ' ve ' . $second->title
                    : ' • ' . $second->title . ' ve daha fazlası';
            }
        }

        $url = $count === 1 && $first instanceof Post
            ? '/yazi/' . $first->slug
            : '/';

        return (new WebPushMessage())
            ->title($title)
            ->body($body)
            ->icon('/icons/192.png')
            ->badge('/icons/badge.png')
            ->data([
                'url' => $url,
                'tag' => 'daily-digest-' . now()->toDateString(),
            ])
            ->options(['TTL' => 86400]);
    }
}
