<?php

namespace App\Console\Commands;

use App\Models\Post;
use App\Models\User;
use App\Support\WixTitleNormalizer;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ApplyWixAuthorReport extends Command
{
    protected $signature = 'wix:apply-author-report
        {report : Path to the wix author resolution CSV report}
        {--dry-run : Preview updates without persisting them}';

    protected $description = 'Apply resolved Wix author mappings from a CSV report to local posts.';

    private Collection $postsByExactTitle;

    private Collection $postsByNormalizedTitle;

    public function handle(): int
    {
        $reportPath = (string) $this->argument('report');
        $dryRun = (bool) $this->option('dry-run');

        if (! is_file($reportPath)) {
            $this->error("Report not found: {$reportPath}");

            return self::FAILURE;
        }

        $rows = $this->readReportRows($reportPath);

        if ($rows === []) {
            $this->warn('The report is empty. Nothing to apply.');

            return self::SUCCESS;
        }

        $this->primePostIndexes();

        $summary = [
            'users_created' => 0,
            'users_reused' => 0,
            'posts_updated' => 0,
            'rows_skipped' => 0,
            'posts_unchanged' => 0,
        ];

        $runner = function () use ($rows, $dryRun, &$summary): void {
            foreach ($rows as $row) {
                $title = trim((string) ($row['Yazı başlığı'] ?? ''));
                $status = trim((string) ($row['resolution_status'] ?? ''));

                if ($status !== 'resolved') {
                    $summary['rows_skipped']++;
                    $this->line("SKIP [{$status}] {$title}");

                    continue;
                }

                $postMatch = $this->matchPostForRow($row);

                if ($postMatch['status'] !== 'matched') {
                    $summary['rows_skipped']++;
                    $this->line("SKIP [{$postMatch['status']}] {$title}");

                    continue;
                }

                $authorName = trim((string) ($row['wix_visible_author'] ?? ''));
                if ($authorName === '') {
                    $summary['rows_skipped']++;
                    $this->line("SKIP [missing_author_name] {$title}");

                    continue;
                }

                $userResolution = $this->resolveUserForRow($authorName, (string) ($row['wix_author_profile_url'] ?? ''), $dryRun);
                if ($userResolution['action'] === 'created') {
                    $summary['users_created']++;
                } else {
                    $summary['users_reused']++;
                }

                /** @var Post $post */
                $post = $postMatch['post'];
                /** @var User $user */
                $user = $userResolution['user'];

                if ($post->user_id === $user->id) {
                    $summary['posts_unchanged']++;
                    $this->line("OK [already_aligned] {$title} -> {$user->name}");

                    continue;
                }

                if (! $dryRun) {
                    $post->user_id = $user->id;
                    $post->save();
                }

                $summary['posts_updated']++;
                $verb = $dryRun ? 'WOULD UPDATE' : 'UPDATED';
                $this->line("{$verb} {$title} -> {$user->name}");
            }
        };

        if ($dryRun) {
            $this->warn('Dry-run mode enabled. No database changes will be saved.');
            $runner();
        } else {
            DB::transaction($runner);
        }

        $this->newLine();
        foreach ($summary as $key => $count) {
            $this->info("{$key}: {$count}");
        }

        return self::SUCCESS;
    }

    private function primePostIndexes(): void
    {
        $posts = Post::query()->get();

        $this->postsByExactTitle = $posts
            ->groupBy(fn (Post $post) => trim($post->title))
            ->map(fn (Collection $group) => $group->values());

        $this->postsByNormalizedTitle = $posts
            ->groupBy(fn (Post $post) => WixTitleNormalizer::normalize($post->title))
            ->map(fn (Collection $group) => $group->values());
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function readReportRows(string $reportPath): array
    {
        $handle = fopen($reportPath, 'rb');

        if ($handle === false) {
            throw new \RuntimeException("Unable to open report: {$reportPath}");
        }

        $headers = fgetcsv($handle);

        if ($headers === false) {
            fclose($handle);

            return [];
        }

        $headers = array_map(
            fn ($header) => $this->sanitizeHeader((string) $header),
            $headers
        );

        $rows = [];

        while (($row = fgetcsv($handle)) !== false) {
            if ($row === [null] || $row === []) {
                continue;
            }

            $row = array_pad($row, count($headers), '');
            $assoc = array_combine($headers, array_slice($row, 0, count($headers)));

            if (! is_array($assoc)) {
                continue;
            }

            $rows[] = array_map(
                fn ($value) => trim((string) $value),
                $assoc
            );
        }

        fclose($handle);

        return $rows;
    }

    private function sanitizeHeader(string $header): string
    {
        return preg_replace('/^\xEF\xBB\xBF/', '', trim($header)) ?? trim($header);
    }

    /**
     * @param  array<string, string>  $row
     * @return array{status: string, post?: Post, method?: string}
     */
    private function matchPostForRow(array $row): array
    {
        $title = trim((string) ($row['Yazı başlığı'] ?? ''));
        $publishedDate = $this->parseCsvDate($row['Yayınlama tarihi'] ?? '');

        $exactCandidates = $this->postsByExactTitle->get($title, collect());
        $matchedExact = $this->reduceCandidates($exactCandidates, $publishedDate, 'exact_title');
        if ($matchedExact['status'] === 'matched') {
            return $matchedExact;
        }

        $normalizedTitle = WixTitleNormalizer::normalize($title);
        $normalizedCandidates = $this->postsByNormalizedTitle->get($normalizedTitle, collect());
        $matchedNormalized = $this->reduceCandidates($normalizedCandidates, $publishedDate, 'normalized_title');
        if ($matchedNormalized['status'] === 'matched') {
            return $matchedNormalized;
        }

        if (
            $matchedExact['status'] === 'ambiguous_post_match'
            || $matchedNormalized['status'] === 'ambiguous_post_match'
        ) {
            return ['status' => 'ambiguous_post_match'];
        }

        return ['status' => 'missing_post_match'];
    }

    /**
     * @param  Collection<int, Post>  $candidates
     * @return array{status: string, post?: Post, method?: string}
     */
    private function reduceCandidates(Collection $candidates, ?Carbon $publishedDate, string $method): array
    {
        if ($candidates->isEmpty()) {
            return ['status' => 'missing_post_match'];
        }

        if ($candidates->count() === 1) {
            return [
                'status' => 'matched',
                'post' => $candidates->first(),
                'method' => $method,
            ];
        }

        if ($publishedDate !== null) {
            $dateMatched = $candidates
                ->filter(function (Post $post) use ($publishedDate): bool {
                    return $post->published_at !== null
                        && $post->published_at->copy()->startOfDay()->equalTo($publishedDate);
                })
                ->values();

            if ($dateMatched->count() === 1) {
                return [
                    'status' => 'matched',
                    'post' => $dateMatched->first(),
                    'method' => "{$method}+published_date",
                ];
            }
        }

        return ['status' => 'ambiguous_post_match'];
    }

    private function parseCsvDate(?string $value): ?Carbon
    {
        $value = trim((string) $value);

        if ($value === '') {
            return null;
        }

        try {
            return Carbon::createFromFormat('d.m.Y', $value)->startOfDay();
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * @return array{action: string, user: User}
     */
    private function resolveUserForRow(string $authorName, string $profileUrl, bool $dryRun): array
    {
        $existingUsers = User::query()
            ->where('name', $authorName)
            ->get();

        if ($existingUsers->count() === 1) {
            return [
                'action' => 'reused',
                'user' => $existingUsers->first(),
            ];
        }

        $syntheticEmail = $this->buildSyntheticEmail($profileUrl, $authorName);
        $existingByEmail = User::query()
            ->where('email', $syntheticEmail)
            ->first();

        if ($existingByEmail !== null) {
            return [
                'action' => 'reused',
                'user' => $existingByEmail,
            ];
        }

        if ($dryRun) {
            $user = new User([
                'name' => $authorName,
                'email' => $syntheticEmail,
                'role' => 'author',
                'provider' => 'email',
            ]);
            $user->id = 0;

            return [
                'action' => 'created',
                'user' => $user,
            ];
        }

        $user = User::query()->create([
            'name' => $authorName,
            'email' => $syntheticEmail,
            'password' => Hash::make(Str::random(32)),
            'role' => 'author',
            'provider' => 'email',
            'email_verified_at' => now(),
        ]);

        return [
            'action' => 'created',
            'user' => $user,
        ];
    }

    private function buildSyntheticEmail(string $profileUrl, string $authorName): string
    {
        $identifier = $this->extractProfileIdentifier($profileUrl);

        if ($identifier === '') {
            $identifier = Str::slug(WixTitleNormalizer::normalize($authorName), '-');
        }

        $identifier = strtolower($identifier);
        $identifier = preg_replace('/[^a-z0-9-]+/', '-', $identifier) ?? $identifier;
        $identifier = trim($identifier, '-');

        if ($identifier === '') {
            $identifier = 'author';
        }

        return "wix-author+{$identifier}@benizledim.local";
    }

    private function extractProfileIdentifier(string $profileUrl): string
    {
        $path = parse_url($profileUrl, PHP_URL_PATH);

        if (! is_string($path) || $path === '') {
            return '';
        }

        $segments = array_values(array_filter(explode('/', trim($path, '/'))));
        $profileIndex = array_search('profile', $segments, true);

        if ($profileIndex !== false && isset($segments[$profileIndex + 1])) {
            return (string) $segments[$profileIndex + 1];
        }

        return (string) end($segments);
    }
}
