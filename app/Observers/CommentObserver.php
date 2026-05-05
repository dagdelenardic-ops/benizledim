<?php

namespace App\Observers;

use App\Models\Comment;
use App\Notifications\NewCommentOnYourPost;
use App\Observers\Concerns\FlushesAuthorStatsCache;

class CommentObserver
{
    use FlushesAuthorStatsCache;

    public function created(Comment $comment): void
    {
        $post = $comment->post()->with('user')->first();

        if ($post && $comment->user_id !== $post->user_id) {
            $post->user->notify(new NewCommentOnYourPost($comment->loadMissing('post', 'user')));
        }

        if ($post) {
            $this->flushAuthorStatsCache($post->user_id);
        }
    }
}