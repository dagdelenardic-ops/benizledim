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
}
