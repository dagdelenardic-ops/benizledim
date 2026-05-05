<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\TmdbService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LetterboxdControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_previews_confirms_and_syncs_letterboxd_account(): void
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

        $author = User::factory()->author()->create();

        $this->actingAs($author)
            ->postJson(route('letterboxd.connect'), ['username' => 'gurur'])
            ->assertOk()
            ->assertJsonPath('confirmed', false)
            ->assertJsonPath('preview.0.title', 'Inception');

        $this->actingAs($author)
            ->postJson(route('letterboxd.confirm'), ['username' => 'gurur'])
            ->assertOk();

        $this->assertDatabaseHas('users', [
            'id' => $author->id,
            'letterboxd_username' => 'gurur',
            'letterboxd_sync_enabled' => true,
        ]);

        $this->actingAs($author)
            ->postJson(route('letterboxd.sync'))
            ->assertOk()
            ->assertJsonPath('created', 1)
            ->assertJsonPath('skipped', 0);

        $this->assertDatabaseHas('posts', [
            'user_id' => $author->id,
            'letterboxd_uri' => 'lbx-guid-1',
        ]);
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