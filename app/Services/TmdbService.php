<?php

namespace App\Services;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class TmdbService
{
    public function search(string $query, string $type = 'multi'): array
    {
        $query = trim($query);

        if ($query === '' || mb_strlen($query) < 2 || blank(config('services.tmdb.api_key'))) {
            return [];
        }

        return Cache::remember($this->cacheKey('search', $query, $type), 86400, function () use ($query, $type) {
            $response = Http::baseUrl((string) config('services.tmdb.base'))
                ->acceptJson()
                ->get("/search/{$type}", [
                    'api_key' => config('services.tmdb.api_key'),
                    'query' => $query,
                    'language' => 'tr-TR',
                ]);

            if (! $response->successful()) {
                return [];
            }

            return collect($response->json('results', []))
                ->map(fn (array $item) => $this->normalize($item, $type))
                ->filter()
                ->values()
                ->all();
        });
    }

    public function details(int $id, string $type): array
    {
        if ($id < 1 || ! in_array($type, ['movie', 'tv'], true) || blank(config('services.tmdb.api_key'))) {
            return [];
        }

        return Cache::remember($this->cacheKey('details', (string) $id, $type), 86400, function () use ($id, $type) {
            $response = Http::baseUrl((string) config('services.tmdb.base'))
                ->acceptJson()
                ->get("/{$type}/{$id}", [
                    'api_key' => config('services.tmdb.api_key'),
                    'language' => 'tr-TR',
                ]);

            if (! $response->successful()) {
                return [];
            }

            return $this->normalize($response->json(), $type) ?? [];
        });
    }

    private function cacheKey(string $prefix, string $value, string $type): string
    {
        return sprintf('tmdb:%s:%s:%s', $prefix, md5(mb_strtolower($value)), $type);
    }

    private function normalize(array $item, string $fallbackType): ?array
    {
        $type = Arr::get($item, 'media_type', $fallbackType);

        if (! in_array($type, ['movie', 'tv'], true)) {
            return null;
        }

        $title = $type === 'tv'
            ? Arr::get($item, 'name')
            : Arr::get($item, 'title');

        if (! is_string($title) || $title === '') {
            return null;
        }

        $date = $type === 'tv'
            ? Arr::get($item, 'first_air_date')
            : Arr::get($item, 'release_date');

        $posterPath = Arr::get($item, 'poster_path');

        return [
            'id' => (int) Arr::get($item, 'id'),
            'type' => $type,
            'title' => $title,
            'year' => $this->extractYear($date),
            'poster_path' => $posterPath,
            'poster_url' => is_string($posterPath) && $posterPath !== ''
                ? rtrim((string) config('services.tmdb.image_base'), '/').'/w342'.$posterPath
                : null,
            'overview' => Arr::get($item, 'overview'),
            'genres' => collect(Arr::get($item, 'genres', []))
                ->map(fn ($genre) => is_array($genre) ? Arr::get($genre, 'name') : null)
                ->filter()
                ->values()
                ->all(),
        ];
    }

    private function extractYear(mixed $date): ?int
    {
        if (! is_string($date) || $date === '') {
            return null;
        }

        $year = substr($date, 0, 4);

        return ctype_digit($year) ? (int) $year : null;
    }
}