<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class MentionService
{
    public function extractUsernames(string $text): array
    {
        preg_match_all('/(^|\s)@([a-z0-9][a-z0-9-]{1,80})/iu', $text, $matches);

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

        $users = $this->resolveUsers($usernames, $actor);

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

    private function resolveUsers(array $handles, User $actor): Collection
    {
        $users = User::query()
            ->select(['id', 'name'])
            ->whereKeyNot($actor->id)
            ->get();

        $usersById = $users->keyBy('id');
        $usersByBaseHandle = $users->groupBy(fn (User $user) => $user->mentionBaseHandle());

        return collect($handles)
            ->map(fn (string $handle) => $this->resolveHandle($handle, $usersById, $usersByBaseHandle))
            ->filter()
            ->unique('id')
            ->values();
    }

    private function resolveHandle(string $handle, Collection $usersById, Collection $usersByBaseHandle): ?User
    {
        if (preg_match('/^(.+)-([1-9][0-9]*)$/', $handle, $matches) === 1) {
            $user = $usersById->get((int) $matches[2]);

            if ($user instanceof User && $user->mentionBaseHandle() === $matches[1]) {
                return $user;
            }
        }

        $matches = $usersByBaseHandle->get($handle, collect());

        return $matches->count() === 1 ? $matches->first() : null;
    }
}
