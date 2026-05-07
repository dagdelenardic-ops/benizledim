<?php

namespace App\Console\Commands;

use App\Services\FlashNewsFetchService;
use Illuminate\Console\Command;

class FetchFlashNews extends Command
{
    protected $signature = 'flashnews:fetch';

    protected $description = 'Fetch latest film/TV news from RSS sources, translate to Turkish, store in DB.';

    public function handle(FlashNewsFetchService $service): int
    {
        $this->info('Fetching flash news...');
        $stats = $service->fetchAndStore();
        $this->info(sprintf(
            'Done. Fetched: %d, Created: %d, Skipped: %d, Errors: %d',
            $stats['fetched'],
            $stats['created'],
            $stats['skipped'],
            $stats['errors']
        ));

        return self::SUCCESS;
    }
}
