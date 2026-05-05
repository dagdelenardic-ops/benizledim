<?php

namespace Tests\Unit;

use App\Models\Post;
use App\Models\User;
use App\Services\LetterboxdSyncService;
use App\Services\TmdbService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Mockery;
use Tests\TestCase;

class LetterboxdSyncServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_syncs_letterboxd_entries_and_respects_throttle(): void
    {
        config([
            'services.letterboxd.sync_throttle_minutes' => 60,
            'services.letterboxd.base' => 'https://letterboxd.com',
        ]);

        Http::fake([
            'letterboxd.com/*' => Http::response($this->rssFeed()),
        ]);

        $this->mock(TmdbService::class, function ($mock): void {
            $mock->shouldReceive('search')
                ->once()
                ->with('Inception', 'multi')
                ->andReturn([
                    [
                        'id' => 27205,
                        'type' => 'movie',
                        'title' => 'Inception',
                        'year' => 2010,
                        'poster_url' => 'https://image.tmdb.org/t/p/w342/abc.jpg',
                    ],
                ]);
        });

        $user = User::factory()->author()->create([
            'letterboxd_username' => 'gurur',
            'letterboxd_sync_enabled' => true,
        ]);

        $service = app(LetterboxdSyncService::class);

        $first = $service->syncForUser($user);
        $second = $service->syncForUser($user);

        $this->assertSame(['created' => 1, 'skipped' => 0], $first);
        $this->assertSame(['created' => 0, 'skipped' => 0], $second);
        $this->assertDatabaseHas('posts', [
            'user_id' => $user->id,
            'format' => 'watch_log',
            'letterboxd_uri' => 'lbx-guid-1',
            'tmdb_id' => 27205,
        ]);
        $this->assertNotNull($user->fresh()->last_letterboxd_sync_at);
    }

    private function rssFeed(): string
    {
        return <<<'XML'
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:letterboxd="letterboxd">
  <channel>
    <item>
      <guid>lbx-guid-1</guid>
      <title>Inception (2010)</title>
      <link>https://letterboxd.com/gurur/film/inception/</link>
      <pubDate>Tue, 05 May 2026 10:00:00 +0000</pubDate>
      <letterboxd:watchedDate>2026-05-05</letterboxd:watchedDate>
      <letterboxd:rewatch>false</letterboxd:rewatch>
      <letterboxd:memberRating>4.0</letterboxd:memberRating>
    </item>
  </channel>
</rss>
XML;
    }
}