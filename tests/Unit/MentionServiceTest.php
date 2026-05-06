<?php

namespace Tests\Unit;

use App\Models\ActivityItem;
use App\Models\Post;
use App\Models\User;
use App\Services\MentionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MentionServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_mentions_are_deduped_and_self_mentions_are_skipped(): void
    {
        $actor = User::factory()->reader()->create(['name' => 'Ben Yazar']);
        $mentioned = User::factory()->author()->create(['name' => 'Ayse Sinema']);
        $post = Post::factory()->published()->create();

        app(MentionService::class)->notifyMentions(
            '@ayse-sinema kesin baksin, @ayse-sinema ve @ben-yazar degil',
            $actor,
            ['post_id' => $post->id]
        );

        $this->assertSame(1, ActivityItem::where('type', 'mentioned')->count());
        $this->assertDatabaseHas('activity_items', [
            'type' => 'mentioned',
            'actor_id' => $actor->id,
            'subject_user_id' => $mentioned->id,
            'post_id' => $post->id,
        ]);
    }
}
