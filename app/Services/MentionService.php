<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;

class MentionService
{
    public function extractUsernames(string $text): array
    {
        preg_match_all('/(^|\s)@([a-z0-9][a-z0-9-]{1,40})/iu', $text, $matches);

        return collect($matches[2] ?? [])
            ->map(fn ($username) => Str::lower($username))
            ->unique()
            ->values()
            ->all();
    }

    public function notifyMentions(string $text, User $actor, array $context = []): void
    {
        $usernames = $this->extractUsernames($text);

        if ($usernames === []) {
            return;
        }

        $users = User::query()
            ->select(['id', 'name'])
            ->get()
            ->filter(fn (User $user) => in_array(Str::slug($user->name), $usernames, true) && $user->id !== $actor->id);

        foreach ($users as $user) {
            app(ActivityService::class)->record('mentioned', $actor, [
                'subject_user_id' => $user->id,
                'post_id' => $context['post_id'] ?? null,
                'entry_id' => $context['entry_id'] ?? null,
                'comment_id' => $context['comment_id'] ?? null,
                'meta' => ['excerpt' => Str::limit($text, 120)],
            ]);
        }
    }
}
