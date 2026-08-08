<?php

namespace Tests\Feature;

use App\Jobs\RecordPageView;
use App\Models\PageView;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * view_count had two writers: this controller and RecordPageView. A first view
 * counted twice wherever the queue runs inline, and the controller — unlike the
 * tracking middleware — never screened crawlers, so Googlebot counted as a
 * reader. PostController::show is now the only writer.
 */
class PostViewCountTest extends TestCase
{
    use RefreshDatabase;

    private const HUMAN_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

    protected function setUp(): void
    {
        parent::setUp();

        config(['inertia.ssr.enabled' => false]);
    }

    private function publishedPost(): Post
    {
        return Post::factory()->published()->create([
            'user_id' => User::factory()->create()->id,
            'view_count' => 0,
        ]);
    }

    /**
     * @param  array<string, string>  $headers
     */
    private function visit(Post $post, array $headers = []): void
    {
        $this->withHeaders($headers + ['User-Agent' => self::HUMAN_AGENT])
            ->get('/yazi/'.$post->slug)
            ->assertOk();
    }

    #[Test]
    public function one_view_counts_once(): void
    {
        $post = $this->publishedPost();

        $this->visit($post);

        $this->assertSame(1, $post->fresh()->view_count);
    }

    #[Test]
    public function a_refresh_within_the_same_session_does_not_count_again(): void
    {
        $post = $this->publishedPost();

        $this->visit($post);
        $this->visit($post);
        $this->visit($post);

        $this->assertSame(1, $post->fresh()->view_count);
    }

    #[Test]
    public function a_new_session_counts_again(): void
    {
        $post = $this->publishedPost();

        $this->visit($post);
        $this->flushSession();
        $this->visit($post);

        $this->assertSame(2, $post->fresh()->view_count);
    }

    #[Test]
    public function crawlers_do_not_count(): void
    {
        $post = $this->publishedPost();

        foreach ([
            'Googlebot/2.1 (+http://www.google.com/bot.html)',
            'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
            'facebookexternalhit/1.1',
            'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/126.0.0.0',
            'ClaudeBot/1.0',
        ] as $agent) {
            $this->flushSession();
            $this->withHeaders(['User-Agent' => $agent])
                ->get('/yazi/'.$post->slug)
                ->assertOk();
        }

        $this->assertSame(0, $post->fresh()->view_count);
    }

    #[Test]
    public function the_analytics_job_records_the_visit_without_touching_the_counter(): void
    {
        $post = $this->publishedPost();
        $post->forceFill(['view_count' => 7])->saveQuietly();

        (new RecordPageView([
            'visitor_id' => 'visitor-1',
            'user_id' => null,
            'session_id' => 'session-1',
            'url' => 'https://benizledim.com/yazi/'.$post->slug,
            'path' => '/yazi/'.$post->slug,
            'route_name' => 'posts.show',
            'referer' => null,
            'user_agent' => self::HUMAN_AGENT,
            'device_type' => 'desktop',
            'viewed_at' => now()->toDateTimeString(),
        ]))->handle();

        $this->assertSame(1, PageView::where('post_id', $post->id)->count(), 'The job still records analytics.');
        $this->assertSame(7, $post->fresh()->view_count, 'The job must not be a second writer.');
    }
}
