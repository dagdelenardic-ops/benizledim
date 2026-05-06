<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WatchlistControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_add_update_and_remove_watchlist_item(): void
    {
        $user = User::factory()->reader()->create();
        $post = Post::factory()->published()->create();

        $this->actingAs($user)
            ->postJson(route('watchlist.store', $post), ['status' => 'planned'])
            ->assertOk()
            ->assertJsonPath('watchlisted', true)
            ->assertJsonPath('item.status', 'planned');

        $this->actingAs($user)
            ->patchJson(route('watchlist.update', $post), ['status' => 'watched', 'note' => 'Bitti'])
            ->assertOk()
            ->assertJsonPath('item.status', 'watched')
            ->assertJsonPath('item.note', 'Bitti');

        $this->assertDatabaseHas('watchlist_items', [
            'user_id' => $user->id,
            'post_id' => $post->id,
            'status' => 'watched',
        ]);

        $this->actingAs($user)
            ->deleteJson(route('watchlist.destroy', $post))
            ->assertOk()
            ->assertJsonPath('watchlisted', false);

        $this->assertDatabaseMissing('watchlist_items', [
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);
    }

    public function test_watchlist_page_only_returns_current_users_items(): void
    {
        $user = User::factory()->reader()->create();
        $other = User::factory()->reader()->create();
        $post = Post::factory()->published()->create(['title' => 'Mine']);
        $otherPost = Post::factory()->published()->create(['title' => 'Other']);

        $user->watchlistItems()->create(['post_id' => $post->id]);
        $other->watchlistItems()->create(['post_id' => $otherPost->id]);

        $this->actingAs($user)
            ->get(route('watchlist.index'))
            ->assertOk()
            ->assertViewHas('page.component', 'Watchlist/Index')
            ->assertViewHas('page.props.items', function (array $items) use ($post) {
                return count($items['data']) === 1 && $items['data'][0]['post']['id'] === $post->id;
            });
    }

    public function test_watchlist_actions_reject_posts_that_are_not_publicly_viewable(): void
    {
        $user = User::factory()->reader()->create();
        $draft = Post::factory()->draft()->create();
        $pendingDeletion = Post::factory()->published()->deletionPending()->create();

        foreach ([$draft, $pendingDeletion] as $post) {
            $this->actingAs($user)
                ->postJson(route('watchlist.store', $post), ['status' => 'planned'])
                ->assertNotFound();

            $this->actingAs($user)
                ->patchJson(route('watchlist.update', $post), ['status' => 'watched'])
                ->assertNotFound();

            $this->actingAs($user)
                ->deleteJson(route('watchlist.destroy', $post))
                ->assertNotFound();

            $this->assertDatabaseMissing('watchlist_items', [
                'user_id' => $user->id,
                'post_id' => $post->id,
            ]);
        }
    }

    public function test_watchlist_page_hides_items_for_posts_that_are_not_publicly_viewable(): void
    {
        $user = User::factory()->reader()->create();
        $published = Post::factory()->published()->create(['title' => 'Public']);
        $draft = Post::factory()->draft()->create(['title' => 'Draft']);
        $pendingDeletion = Post::factory()->published()->deletionPending()->create(['title' => 'Pending Deletion']);

        $user->watchlistItems()->create(['post_id' => $published->id]);
        $user->watchlistItems()->create(['post_id' => $draft->id]);
        $user->watchlistItems()->create(['post_id' => $pendingDeletion->id]);

        $this->actingAs($user)
            ->get(route('watchlist.index'))
            ->assertOk()
            ->assertViewHas('page.props.items', function (array $items) use ($published) {
                return count($items['data']) === 1 && $items['data'][0]['post']['id'] === $published->id;
            });
    }

    public function test_user_can_clear_watchlist_note_with_explicit_null(): void
    {
        $user = User::factory()->reader()->create();
        $post = Post::factory()->published()->create();

        $user->watchlistItems()->create([
            'post_id' => $post->id,
            'status' => 'planned',
            'note' => 'Eski not',
        ]);

        $this->actingAs($user)
            ->patchJson(route('watchlist.update', $post), ['status' => 'planned', 'note' => null])
            ->assertOk()
            ->assertJsonPath('item.note', null);

        $this->assertDatabaseHas('watchlist_items', [
            'user_id' => $user->id,
            'post_id' => $post->id,
            'note' => null,
        ]);
    }
}
