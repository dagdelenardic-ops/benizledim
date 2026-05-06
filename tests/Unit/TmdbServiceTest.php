<?php

namespace Tests\Unit;

use App\Services\TmdbService;
use Illuminate\Http\Client\Request;
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

    public function test_it_supports_access_token_and_append_to_response_for_details(): void
    {
        Cache::flush();

        config([
            'services.tmdb.access_token' => 'tmdb-access-token',
            'services.tmdb.api_key' => null,
            'services.tmdb.base' => 'https://api.themoviedb.org/3',
            'services.tmdb.image_base' => 'https://image.tmdb.org/t/p',
        ]);

        Http::fake([
            'api.themoviedb.org/*' => Http::response([
                'id' => 11,
                'title' => 'Star Wars',
                'release_date' => '1977-05-25',
                'poster_path' => '/star-wars.jpg',
                'overview' => 'Bir galaksi macerasi.',
                'genres' => [
                    ['id' => 12, 'name' => 'Macera'],
                ],
                'videos' => [
                    'results' => [
                        ['key' => 'abc123'],
                    ],
                ],
                'images' => [
                    'backdrops' => [
                        ['file_path' => '/backdrop.jpg'],
                    ],
                ],
            ]),
        ]);

        $details = app(TmdbService::class)->details(11, 'movie', ['videos', 'images'], [
            'include_image_language' => 'null,en,tr',
        ]);

        Http::assertSent(function (Request $request): bool {
            parse_str(parse_url($request->url(), PHP_URL_QUERY) ?? '', $query);

            return $request->hasHeader('Authorization', 'Bearer tmdb-access-token')
                && $request->method() === 'GET'
                && str_contains($request->url(), '/movie/11')
                && ($query['append_to_response'] ?? null) === 'videos,images'
                && ($query['include_image_language'] ?? null) === 'null,en,tr'
                && ! array_key_exists('api_key', $query);
        });

        $this->assertSame(11, $details['id']);
        $this->assertSame('movie', $details['type']);
        $this->assertSame('Star Wars', $details['title']);
        $this->assertSame('https://image.tmdb.org/t/p/w342/star-wars.jpg', $details['poster_url']);
        $this->assertSame('abc123', $details['videos']['results'][0]['key']);
        $this->assertSame('/backdrop.jpg', $details['images']['backdrops'][0]['file_path']);
    }
}
