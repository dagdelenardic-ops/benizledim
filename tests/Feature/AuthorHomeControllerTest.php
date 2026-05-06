<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorHomeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_author_home_returns_stats_payload(): void
    {
        $author = User::factory()->author()->create();

        Post::factory()->for($author)->published()->create([
            'format' => 'watch_log',
            'rating' => 7,
            'watched_on' => now()->toDateString(),
        ]);

        $response = $this->actingAs($author)->get(route('author.home'));

        $response
            ->assertOk()
            ->assertViewHas('page.component', 'Author/Home')
            ->assertViewHas('page.props.stats', function (array $stats) {
                $keys = [
                    'posts_count',
                    'watch_logs_count',
                    'total_likes_received',
                    'total_comments_received',
                    'total_entries_received',
                    'most_liked_post',
                    'top_mood_tags',
                    'avg_rating',
                    'last_log_at',
                    'current_streak',
                    'followers_count',
                ];

                return empty(array_diff($keys, array_keys($stats)));
            });
    }

    public function test_reader_can_access_personal_author_home(): void
    {
        $reader = User::factory()->reader()->create();

        $this->actingAs($reader)
            ->get(route('author.home'))
            ->assertOk()
            ->assertViewHas('page.component', 'Author/Home');
    }

    public function test_profile_supports_watch_log_filter(): void
    {
        $author = User::factory()->author()->create();

        Post::factory()->for($author)->published()->create([
            'title' => 'Standard',
            'format' => 'standard',
        ]);

        $watchLog = Post::factory()->for($author)->published()->create([
            'title' => 'Newer Watch',
            'format' => 'watch_log',
            'published_at' => now()->subDay(),
            'watched_on' => now()->toDateString(),
        ]);

        Post::factory()->for($author)->published()->create([
            'title' => 'Older Watch',
            'format' => 'watch_log',
            'published_at' => now(),
            'watched_on' => now()->subDays(3)->toDateString(),
        ]);

        $response = $this->get(route('profile.show', ['user' => $author, 'format' => 'watch_log']));

        $response
            ->assertOk()
            ->assertViewHas('page.component', 'Profile/Show')
            ->assertViewHas('page.props.format', 'watch_log')
            ->assertViewHas('page.props.activeTab', 'watch_log')
            ->assertViewHas('page.props.posts', function (array $posts) use ($watchLog) {
                $urls = collect($posts['links'] ?? [])
                    ->pluck('url')
                    ->filter()
                    ->all();

                return count($posts['data']) === 2
                    && $posts['data'][0]['id'] === $watchLog->id
                    && collect($urls)->contains(fn ($url) => str_contains($url, 'format=watch_log'));
            });
    }
}
