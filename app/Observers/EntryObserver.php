<?php

namespace App\Observers;

use App\Models\Entry;
use App\Notifications\NewEntryOnYourPost;
use App\Observers\Concerns\FlushesAuthorStatsCache;
use App\Services\ActivityService;
use App\Services\MentionService;

class EntryObserver
{
    use FlushesAuthorStatsCache;

    public function created(Entry $entry): void
    {
        $post = $entry->post()->with('user')->first();

        if ($post && $entry->user) {
            app(ActivityService::class)->record('entry_created', $entry->user, [
                'subject_user_id' => $post->user_id,
                'post_id' => $post->id,
                'entry_id' => $entry->id,
            ]);

            app(MentionService::class)->notifyMentions($entry->content, $entry->user, [
                'post_id' => $post->id,
                'entry_id' => $entry->id,
            ]);
        }

        if ($post && $entry->user_id !== $post->user_id) {
            $post->user->notify(new NewEntryOnYourPost($entry->loadMissing('post', 'user')));
        }

        if ($post) {
            $this->flushAuthorStatsCache($post->user_id);
        }
    }
}
