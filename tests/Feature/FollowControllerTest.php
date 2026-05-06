<?php

namespace Tests\Feature;

use App\Models\ActivityItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FollowControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_follow_and_unfollow_an_author(): void
    {
        $reader = User::factory()->reader()->create();
        $author = User::factory()->author()->create();

        $this->actingAs($reader)
            ->postJson(route('users.follow', $author))
            ->assertOk()
            ->assertJsonPath('following', true)
            ->assertJsonPath('followers_count', 1);

        $this->assertTrue($reader->isFollowing($author));
        $this->assertSame('followed_user', ActivityItem::firstOrFail()->type);

        $this->actingAs($reader)
            ->deleteJson(route('users.unfollow', $author))
            ->assertOk()
            ->assertJsonPath('following', false)
            ->assertJsonPath('followers_count', 0);

        $this->assertFalse($reader->fresh()->isFollowing($author));
    }

    public function test_user_cannot_follow_self(): void
    {
        $user = User::factory()->reader()->create();

        $this->actingAs($user)
            ->postJson(route('users.follow', $user))
            ->assertStatus(422);
    }
}
