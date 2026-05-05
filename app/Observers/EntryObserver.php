<?php

namespace App\Observers;

use App\Models\Entry;
use App\Notifications\NewEntryOnYourPost;
use App\Observers\Concerns\FlushesAuthorStatsCache;

class EntryObserver
{
    use FlushesAuthorStatsCache;

    public function created(Entry $entry): void
    {
        $post = $entry->post()->with('user')->first();

        if ($post && $entry->user_id !== $post->user_id) {
            $post->user->notify(new NewEntryOnYourPost($entry->loadMissing('post', 'user')));
        }

        if ($post) {
            $this->flushAuthorStatsCache($post->user_id);
        }
    }
}