<?php

namespace App\Notifications;

use App\Models\Entry;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class NewEntryOnYourPost extends Notification
{
    use Queueable;

    public function __construct(private readonly Entry $entry)
    {
    }

    public function via(object $notifiable): array
    {
        return [WebPushChannel::class];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $post = $this->entry->post;

        return (new WebPushMessage())
            ->title('Yeni entry')
            ->body($this->truncateBody(sprintf('%s -> %s', $this->entry->authorName(), $post->title)))
            ->data(['url' => route('posts.show', $post)]);
    }

    private function truncateBody(string $body): string
    {
        return mb_strimwidth($body, 0, 80, '...');
    }
}