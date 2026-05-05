<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TmdbSearchControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_normalized_tmdb_results(): void
    {
        Cache::flush();

        config([
            'services.tmdb.api_key' => 'tmdb-test-key',
            'services.tmdb.base' => 'https://api.themoviedb.org/3',
        ]);

        Http::fake([
            'api.themoviedb.org/*' => Http::response([
                'results' => [
                    [
                        'id' => 27205,
                        'media_type' => 'movie',
                        'title' => 'Inception',
                        'release_date' => '2010-07-16',
                        'poster_path' => '/abc.jpg',
                        'overview' => 'Dream heist.',
                        'genres' => [
                            ['name' => 'Aksiyon'],
                        ],
                    ],
                ],
            ]),
        ]);

        $user = User::factory()->author()->create();

        $this->actingAs($user)
            ->getJson(route('tmdb.search', ['q' => 'inception', 'type' => 'multi']))
            ->assertOk()
            ->assertJsonPath('results.0.id', 27205)
            ->assertJsonPath('results.0.title', 'Inception')
            ->assertJsonPath('results.0.poster_url', 'https://image.tmdb.org/t/p/w342/abc.jpg');
    }

    public function test_it_rejects_short_queries(): void
    {
        $user = User::factory()->author()->create();

        $this->actingAs($user)
            ->getJson(route('tmdb.search', ['q' => 'i']))
            ->assertStatus(400)
            ->assertJsonStructure(['message', 'errors' => ['q']]);
    }
}