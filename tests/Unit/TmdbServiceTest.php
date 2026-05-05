<?php

namespace Tests\Unit;

use App\Services\TmdbService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TmdbServiceTest extends TestCase
{
    public function test_it_normalizes_search_results(): void
    {
        Cache::flush();

        config([
            'services.tmdb.api_key' => 'tmdb-test-key',
            'services.tmdb.base' => 'https://api.themoviedb.org/3',
            'services.tmdb.image_base' => 'https://image.tmdb.org/t/p',
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
                        'overview' => 'Ruyalar icinde bir operasyon.',
                        'genres' => [
                            ['id' => 28, 'name' => 'Aksiyon'],
                            ['id' => 878, 'name' => 'Bilim Kurgu'],
                        ],
                    ],
                    [
                        'id' => 42,
                        'media_type' => 'person',
                        'name' => 'Leonardo DiCaprio',
                    ],
                ],
            ]),
        ]);

        $results = app(TmdbService::class)->search('inception');

        $this->assertCount(1, $results);
        $this->assertSame(27205, $results[0]['id']);
        $this->assertSame('movie', $results[0]['type']);
        $this->assertSame('Inception', $results[0]['title']);
        $this->assertSame(2010, $results[0]['year']);
        $this->assertSame('https://image.tmdb.org/t/p/w342/abc.jpg', $results[0]['poster_url']);
        $this->assertSame(['Aksiyon', 'Bilim Kurgu'], $results[0]['genres']);
    }
}