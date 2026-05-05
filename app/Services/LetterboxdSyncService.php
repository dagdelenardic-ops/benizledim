<?php

namespace App\Services;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use SimpleXMLElement;

class LetterboxdSyncService
{
    public function __construct(private readonly TmdbService $tmdb)
    {
    }

    public function previewForUsername(string $username, int $limit = 5): array
    {
        return array_slice($this->fetchFeedItems($username), 0, $limit);
    }

    public function syncForUser(User $user, bool $force = false): array
    {
        if (blank($user->letterboxd_username)) {
            return ['created' => 0, 'skipped' => 0];
        }

        if (! $force && $this->isThrottled($user)) {
            return ['created' => 0, 'skipped' => 0];
        }

        $items = array_slice($this->fetchFeedItems($user->letterboxd_username), 0, 50);
        $created = 0;
        $skipped = 0;

        foreach ($items as $item) {
            if (Post::where('letterboxd_uri', $item['guid'])->exists()) {
                $skipped++;
                continue;
            }

            $tmdbMatch = $this->resolveTmdbMatch($item['title'], $item['year']);

            Post::create([
                'user_id' => $user->id,
                'title' => $this->buildPostTitle($item['title'], $item['year']),
                'excerpt' => 'Synced from Letterboxd',
                'content' => 'Synced from Letterboxd',
                'cover_image' => $tmdbMatch['poster_url'] ?? null,
                'reading_time_minutes' => 1,
                'status' => 'draft',
                'format' => 'watch_log',
                'external_title' => $item['title'],
                'external_year' => $item['year'],
                'watched_on' => $item['watchedDate'],
                'rating' => $item['rating'],
                'tmdb_id' => $tmdbMatch['id'] ?? null,
                'tmdb_type' => $tmdbMatch['type'] ?? null,
                'letterboxd_uri' => $item['guid'],
                'meta' => ['rewatch' => $item['rewatch']],
            ]);

            $created++;
        }

        $user->forceFill([
            'last_letterboxd_sync_at' => now(),
        ])->save();

        return ['created' => $created, 'skipped' => $skipped];
    }

    private function fetchFeedItems(string $username): array
    {
        $response = Http::withHeaders([
            'User-Agent' => 'BenIzledim-Sync/1.0',
        ])->get(rtrim((string) config('services.letterboxd.base'), '/').'/'.trim($username, '/').'/rss/');

        if (! $response->successful()) {
            throw new RuntimeException('Letterboxd feed could not be fetched.');
        }

        $xml = simplexml_load_string($response->body(), SimpleXMLElement::class, LIBXML_NOCDATA);

        if (! $xml instanceof SimpleXMLElement || ! isset($xml->channel->item)) {
            throw new RuntimeException('Letterboxd feed is invalid.');
        }

        $items = [];

        foreach ($xml->channel->item as $item) {
            $namespaced = $item->children('letterboxd', true);
            [$title, $year] = $this->extractTitleAndYear((string) $item->title);
            $guid = (string) $item->guid ?: (string) $item->link;

            $items[] = [
                'guid' => $guid,
                'title' => $title,
                'year' => $year,
                'link' => (string) $item->link,
                'watchedDate' => $this->normalizeDate((string) ($namespaced->watchedDate ?? '')),
                'rewatch' => filter_var((string) ($namespaced->rewatch ?? 'false'), FILTER_VALIDATE_BOOLEAN),
                'rating' => $this->normalizeRating((string) ($namespaced->memberRating ?? '')),
                'publishedAt' => $this->normalizeDate((string) $item->pubDate),
            ];
        }

        return $items;
    }

    private function resolveTmdbMatch(string $title, ?int $year): ?array
    {
        $results = $this->tmdb->search($title, 'multi');

        if ($results === []) {
            return null;
        }

        if ($year !== null) {
            $exact = collect($results)->first(fn (array $result) => ($result['year'] ?? null) === $year);

            if ($exact) {
                return $exact;
            }
        }

        return Arr::first($results);
    }

    private function extractTitleAndYear(string $rawTitle): array
    {
        if (preg_match('/^(.*?)(?:\s*\((\d{4})\))?$/', trim($rawTitle), $matches) === 1) {
            return [trim($matches[1]), isset($matches[2]) ? (int) $matches[2] : null];
        }

        return [$rawTitle, null];
    }

    private function buildPostTitle(string $title, ?int $year): string
    {
        return $year ? sprintf('%s (%d)', $title, $year) : $title;
    }

    private function normalizeDate(string $value): ?string
    {
        if ($value === '') {
            return null;
        }

        return Carbon::parse($value)->toDateString();
    }

    private function normalizeRating(string $value): ?int
    {
        if ($value === '' || ! is_numeric($value)) {
            return null;
        }

        $rating = (float) $value;

        if ($rating <= 5) {
            $rating *= 2;
        }

        return max(1, min(10, (int) round($rating)));
    }

    private function isThrottled(User $user): bool
    {
        if (! $user->last_letterboxd_sync_at) {
            return false;
        }

        return now()->diffInMinutes($user->last_letterboxd_sync_at) < config('services.letterboxd.sync_throttle_minutes');
    }
}