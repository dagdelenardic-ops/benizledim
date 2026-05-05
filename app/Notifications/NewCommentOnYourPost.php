<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class NewCommentOnYourPost extends Notification
{
    use Queueable;

    public function __construct(private readonly Comment $comment)
    {
    }

    public function via(object $notifiable): array
    {
        return [WebPushChannel::class];
    }

    public function toWebPush(object $notifiable, Notification $notification): WebPushMessage
    {
        $post = $this->comment->post;
        $commenter = $this->comment->user?->name ?? 'Bir kullanici';

        return (new WebPushMessage())
            ->title('Yorumun var')
            ->body($this->truncateBody(sprintf('%s -> %s', $commenter, $post->title)))
            ->data(['url' => route('posts.show', $post)]);
    }

    private function truncateBody(string $body): string
    {
        return mb_strimwidth($body, 0, 80, '...');
    }
}