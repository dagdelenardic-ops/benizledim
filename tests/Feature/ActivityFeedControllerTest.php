<?php

namespace Tests\Feature;

use App\Models\ActivityItem;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityFeedControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_feed_shows_followed_author_activity_and_hides_unrelated_activity(): void
    {
        $reader = User::factory()->reader()->create();
        $followed = User::factory()->author()->create();
        $unrelated = User::factory()->author()->create();
        $visiblePost = Post::factory()->for($followed)->published()->create(['title' => 'Visible']);
        $hiddenPost = Post::factory()->for($unrelated)->published()->create(['title' => 'Hidden']);

        $reader->following()->attach($followed->id);

        $this->actingAs($reader)
            ->get(route('activity.index'))
            ->assertOk()
            ->assertViewHas('page.component', 'Activity/Index')
            ->assertViewHas('page.props.items', function (array $items) use ($visiblePost) {
                return count($items['data']) === 1 && $items['data'][0]['post']['id'] === $visiblePost->id;
            });
    }

    public function test_feed_shows_published_watch_logs_and_hides_drafts(): void
    {
        $reader = User::factory()->reader()->create();
        $followed = User::factory()->reader()->create();

        $reader->following()->attach($followed->id);

        $publishedResponse = $this->actingAs($followed)->postJson(route('quick-log.store'), [
            'external_title' => 'Published Log',
            'tmdb_type' => 'movie',
            'rating' => 8,
            'status' => 'published',
        ]);

        $publishedResponse->assertCreated();

        $this->actingAs($followed)->postJson(route('quick-log.store'), [
            'external_title' => 'Draft Log',
            'tmdb_type' => 'movie',
            'rating' => 6,
            'status' => 'draft',
        ])->assertCreated();

        $this->assertSame(1, ActivityItem::where('type', 'watch_log_created')->count());

        $this->actingAs($reader)
            ->get(route('activity.index'))
            ->assertOk()
            ->assertViewHas('page.props.items', function (array $items) {
                return count($items['data']) === 1
                    && $items['data'][0]['type'] === 'watch_log_created'
                    && $items['data'][0]['post']['title'] === 'Published Log';
            });
    }
}
