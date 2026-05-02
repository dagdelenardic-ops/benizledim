<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Tests\TestCase;

class WixApplyAuthorReportCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_dry_run_does_not_persist_changes(): void
    {
        $currentAuthor = User::create([
            'name' => 'Current Author',
            'email' => 'current@example.com',
            'password' => 'secret',
            'role' => 'author',
            'provider' => 'email',
        ]);

        $targetAuthor = User::create([
            'name' => 'Su Evci',
            'email' => 'su@benizledim.com',
            'password' => 'secret',
            'role' => 'author',
            'provider' => 'email',
        ]);

        $post = Post::create([
            'user_id' => $currentAuthor->id,
            'title' => 'Fantastic Four: First Steps – Is Marvel Back?',
            'slug' => 'fantastic-four-first-steps-is-marvel-back',
            'content' => '<p>content</p>',
            'status' => 'published',
            'published_at' => '2025-07-20 10:00:00',
        ]);

        $reportPath = $this->createReport([
            [
                'Yazı başlığı' => 'Fantastic Four: First Steps – Is Marvel Back?',
                'Yayınlama tarihi' => '20.07.2025',
                'wix_visible_author' => 'Su Evci',
                'wix_author_profile_url' => 'https://www.benizledim.com/profile/suevci/profile',
                'resolution_status' => 'resolved',
            ],
        ]);

        Artisan::call('wix:apply-author-report', [
            'report' => $reportPath,
            '--dry-run' => true,
        ]);

        $output = Artisan::output();

        $post->refresh();

        $this->assertSame($currentAuthor->id, $post->user_id);
        $this->assertStringContainsString('users_reused: 1', $output);
        $this->assertStringContainsString('posts_updated: 1', $output);
        $this->assertStringContainsString('rows_skipped: 0', $output);
        $this->assertCount(2, User::all());

        unlink($reportPath);
    }

    public function test_it_creates_a_synthetic_user_and_matches_post_by_normalized_title(): void
    {
        $currentAuthor = User::create([
            'name' => 'Current Author',
            'email' => 'current@example.com',
            'password' => 'secret',
            'role' => 'author',
            'provider' => 'email',
        ]);

        $post = Post::create([
            'user_id' => $currentAuthor->id,
            'title' => 'Fantastic Four: First Steps - Is Marvel Back?',
            'slug' => 'fantastic-four-first-steps-is-marvel-back-2',
            'content' => '<p>content</p>',
            'status' => 'published',
            'published_at' => '2025-07-20 10:00:00',
        ]);

        $reportPath = $this->createReport([
            [
                'Yazı başlığı' => 'Fantastic Four: First Steps – Is Marvel Back?',
                'Yayınlama tarihi' => '20.07.2025',
                'wix_visible_author' => 'Nedir',
                'wix_author_profile_url' => 'https://www.benizledim.com/profile/61a5a6b1-f155-4490-9f1b-26bf2b325514/profile',
                'resolution_status' => 'resolved',
            ],
        ]);

        Artisan::call('wix:apply-author-report', [
            'report' => $reportPath,
        ]);

        $output = Artisan::output();

        $post->refresh();
        $createdUser = User::where('email', 'wix-author+61a5a6b1-f155-4490-9f1b-26bf2b325514@benizledim.local')->first();

        $this->assertNotNull($createdUser);
        $this->assertSame('Nedir', $createdUser->name);
        $this->assertSame('author', $createdUser->role);
        $this->assertSame('email', $createdUser->provider);
        $this->assertSame($createdUser->id, $post->user_id);
        $this->assertStringContainsString('users_created: 1', $output);
        $this->assertStringContainsString('posts_updated: 1', $output);

        unlink($reportPath);
    }

    public function test_it_skips_ambiguous_post_matches(): void
    {
        $currentAuthor = User::create([
            'name' => 'Current Author',
            'email' => 'current@example.com',
            'password' => 'secret',
            'role' => 'author',
            'provider' => 'email',
        ]);

        User::create([
            'name' => 'Su Evci',
            'email' => 'su@benizledim.com',
            'password' => 'secret',
            'role' => 'author',
            'provider' => 'email',
        ]);

        Post::create([
            'user_id' => $currentAuthor->id,
            'title' => 'Duplicate Title',
            'slug' => 'duplicate-title-a',
            'content' => '<p>content</p>',
            'status' => 'published',
            'published_at' => '2025-07-20 10:00:00',
        ]);

        Post::create([
            'user_id' => $currentAuthor->id,
            'title' => 'Duplicate Title',
            'slug' => 'duplicate-title-b',
            'content' => '<p>content</p>',
            'status' => 'published',
            'published_at' => '2025-07-20 11:00:00',
        ]);

        $reportPath = $this->createReport([
            [
                'Yazı başlığı' => 'Duplicate Title',
                'Yayınlama tarihi' => '',
                'wix_visible_author' => 'Su Evci',
                'wix_author_profile_url' => 'https://www.benizledim.com/profile/suevci/profile',
                'resolution_status' => 'resolved',
            ],
        ]);

        Artisan::call('wix:apply-author-report', [
            'report' => $reportPath,
        ]);

        $output = Artisan::output();

        $this->assertStringContainsString('SKIP [ambiguous_post_match] Duplicate Title', $output);
        $this->assertStringContainsString('rows_skipped: 1', $output);
        $this->assertSame(2, Post::where('user_id', $currentAuthor->id)->count());

        unlink($reportPath);
    }

    /**
     * @param  array<int, array<string, string>>  $rows
     */
    private function createReport(array $rows): string
    {
        $path = tempnam(sys_get_temp_dir(), 'wix-author-report-');

        if ($path === false) {
            throw new \RuntimeException('Unable to create temporary report file.');
        }

        $handle = fopen($path, 'wb');

        if ($handle === false) {
            throw new \RuntimeException('Unable to open temporary report file.');
        }

        $headers = [
            'Yazı başlığı',
            'Yayınlama tarihi',
            'wix_url',
            'live_headline',
            'live_published_date',
            'wix_visible_author',
            'wix_author_profile_url',
            'resolution_status',
            'match_method',
            'notes',
            'manual_search_query',
        ];

        fputcsv($handle, $headers);

        foreach ($rows as $row) {
            $record = [];
            foreach ($headers as $header) {
                $record[] = $row[$header] ?? '';
            }
            fputcsv($handle, $record);
        }

        fclose($handle);

        return $path;
    }
}
