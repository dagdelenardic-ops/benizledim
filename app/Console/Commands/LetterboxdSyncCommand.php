<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\LetterboxdSyncService;
use Illuminate\Console\Command;

class LetterboxdSyncCommand extends Command
{
    protected $signature = 'letterboxd:sync {user? : User ID veya null=hepsi} {--force}';

    protected $description = 'Sync Letterboxd watch logs for one user or all enabled users';

    public function handle(LetterboxdSyncService $sync): int
    {
        $force = (bool) $this->option('force');
        $userId = $this->argument('user');

        $users = User::query()
            ->when($userId, fn ($query) => $query->whereKey($userId), fn ($query) => $query->where('letterboxd_sync_enabled', true))
            ->get();

        foreach ($users as $user) {
            $result = $sync->syncForUser($user, $force);

            $this->line(sprintf(
                'user=%d created=%d skipped=%d',
                $user->id,
                $result['created'],
                $result['skipped'],
            ));
        }

        return self::SUCCESS;
    }
}