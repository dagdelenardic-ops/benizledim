<?php

namespace App\Notifications;

use App\Models\Post;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class PostHitLikeMilestone extends Notification
{
    use Queueable;

    public function __construct(private readonly Post $post, private readonly int $milestone)
    {
    }

    public function via(object $notifiable): array
    {
        return [WebPushChannel::class];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        return (new WebPushMessage())
            ->title(sprintf('🎉 %d begeni!', $this->milestone))
            ->body(mb_strimwidth($this->post->title, 0, 80, '...'))
            ->data(['url' => route('posts.show', $this->post)]);
    }
}