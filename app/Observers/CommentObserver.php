<?php

namespace App\Observers;

use App\Models\Comment;
use App\Notifications\NewCommentOnYourPost;
use App\Observers\Concerns\FlushesAuthorStatsCache;
use App\Services\ActivityService;
use App\Services\MentionService;

class CommentObserver
{
    use FlushesAuthorStatsCache;

    public function created(Comment $comment): void
    {
        $post = $comment->post()->with('user')->first();

        if ($post && $comment->user) {
            app(ActivityService::class)->record('commented', $comment->user, [
                'subject_user_id' => $post->user_id,
                'post_id' => $post->id,
                'comment_id' => $comment->id,
            ]);

            app(MentionService::class)->notifyMentions($comment->content, $comment->user, [
                'post_id' => $post->id,
                'comment_id' => $comment->id,
            ]);
        }

        if ($post && $comment->user_id !== $post->user_id) {
            $post->user->notify(new NewCommentOnYourPost($comment->loadMissing('post', 'user')));
        }

        if ($post) {
            $this->flushAuthorStatsCache($post->user_id);
        }
    }
}
