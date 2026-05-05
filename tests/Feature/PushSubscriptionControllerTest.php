<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\Entry;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use App\Notifications\NewCommentOnYourPost;
use App\Notifications\NewEntryOnYourPost;
use App\Notifications\PostHitLikeMilestone;
use App\Notifications\PushSubscriptionTest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PushSubscriptionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_subscribe_and_unsubscribe_to_push(): void
    {
        $author = User::factory()->author()->create();

        $payload = [
            'endpoint' => 'https://fcm.googleapis.com/fcm/send/abc',
            'keys' => [
                'p256dh' => 'public-key',
                'auth' => 'auth-token',
            ],
            'contentEncoding' => 'aes128gcm',
        ];

        $this->actingAs($author)
            ->postJson(route('push.subscribe'), $payload)
            ->assertCreated();

        $this->assertDatabaseHas('push_subscriptions', [
            'subscribable_id' => $author->id,
            'subscribable_type' => $author->getMorphClass(),
            'endpoint' => $payload['endpoint'],
        ]);

        $this->actingAs($author)
            ->deleteJson(route('push.unsubscribe'), ['endpoint' => $payload['endpoint']])
            ->assertOk();

        $this->assertDatabaseMissing('push_subscriptions', [
            'endpoint' => $payload['endpoint'],
        ]);
    }

    public function test_test_push_notifies_the_current_user(): void
    {
        Notification::fake();

        $author = User::factory()->author()->create();

        $this->actingAs($author)
            ->postJson(route('push.test'))
            ->assertOk();

        Notification::assertSentTo($author, PushSubscriptionTest::class);
    }

    public function test_comment_and_entry_observers_notify_post_author(): void
    {
        Notification::fake();

        $author = User::factory()->author()->create();
        $reader = User::factory()->reader()->create();
        $post = Post::factory()->for($author)->published()->create();

        Comment::create([
            'user_id' => $reader->id,
            'post_id' => $post->id,
            'content' => 'Guzel yazi',
            'sentiment_score' => 0.4,
            'sentiment_label' => 'pozitif',
        ]);

        Entry::create([
            'user_id' => $reader->id,
            'post_id' => $post->id,
            'content' => 'Katiliyorum',
            'is_spoiler' => false,
        ]);

        Notification::assertSentTo($author, NewCommentOnYourPost::class);
        Notification::assertSentTo($author, NewEntryOnYourPost::class);
    }

    public function test_like_observer_sends_milestone_only_once(): void
    {
        Notification::fake();

        $author = User::factory()->author()->create();
        $post = Post::factory()->for($author)->published()->create();

        User::factory()->count(10)->create()->each(function (User $reader) use ($post) {
            Like::create([
                'user_id' => $reader->id,
                'post_id' => $post->id,
            ]);
        });

        Notification::assertSentToTimes($author, PostHitLikeMilestone::class, 1);

        Like::create([
            'user_id' => User::factory()->reader()->create()->id,
            'post_id' => $post->id,
        ]);

        Notification::assertSentToTimes($author, PostHitLikeMilestone::class, 1);
        $this->assertSame([10], $post->fresh()->meta['notified_milestones']);
    }
}