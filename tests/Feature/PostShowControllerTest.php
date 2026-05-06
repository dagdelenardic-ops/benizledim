<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostShowControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_show_includes_watchlist_state_for_authenticated_user(): void
    {
        $user = User::factory()->reader()->create();
        $post = Post::factory()->published()->create();
        $user->watchlistItems()->create(['post_id' => $post->id, 'status' => 'planned']);

        $this->actingAs($user)
            ->get(route('posts.show', $post))
            ->assertOk()
            ->assertViewHas('page.props.isWatchlisted', true);
    }
}
