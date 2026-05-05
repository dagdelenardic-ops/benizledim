<?php

namespace Tests\Unit;

use App\Models\Comment;
use App\Models\Entry;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use App\Services\AuthorStatsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorStatsServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_aggregates_author_stats(): void
    {
        $author = User::factory()->author()->create();
        $reader = User::factory()->reader()->create();

        $standardPost = Post::factory()->for($author)->published()->create([
            'title' => 'Standard Post',
            'format' => 'standard',
            'published_at' => now()->setYear(2026),
        ]);

        $watchLog = Post::factory()->for($author)->published()->create([
            'title' => 'Watch Log',
            'format' => 'watch_log',
            'mood_tags' => ['gerilim', 'sessiz', 'gerilim'],
            'rating' => 8,
            'watched_on' => now()->setYear(2026)->toDateString(),
            'published_at' => now()->setYear(2026),
        ]);

        Like::create(['user_id' => $reader->id, 'post_id' => $standardPost->id]);
        Like::create(['user_id' => $author->id, 'post_id' => $watchLog->id]);

        Comment::create(['user_id' => $reader->id, 'post_id' => $watchLog->id, 'content' => 'Harika']);

        Entry::create([
            'post_id' => $watchLog->id,
            'user_id' => $reader->id,
            'content' => 'Ben de katiliyorum',
            'is_spoiler' => false,
        ]);

        $stats = app(AuthorStatsService::class)->forUser($author, 2026);

        $this->assertSame(2, $stats['posts_count']);
        $this->assertSame(1, $stats['watch_logs_count']);
        $this->assertSame(2, $stats['total_likes_received']);
        $this->assertSame(1, $stats['total_comments_received']);
        $this->assertSame(1, $stats['total_entries_received']);
        $this->assertSame($standardPost->id, $stats['most_liked_post']['id']);
        $this->assertSame('gerilim', $stats['top_mood_tags'][0]['tag']);
        $this->assertSame(8.0, $stats['avg_rating']);
        $this->assertSame(now()->setYear(2026)->toDateString(), $stats['last_log_at']);
        $this->assertSame(0, $stats['current_streak']);
        $this->assertSame(0, $stats['followers_count']);
    }
}