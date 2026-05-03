<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AiRecommendationFallbackTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_site_and_external_recommendations_without_gemini_key(): void
    {
        config()->set('services.gemini.api_key', '');

        $category = Category::create([
            'name' => 'Netflix',
            'slug' => 'netflix',
        ]);

        $post = Post::factory()->published()->create([
            'title' => 'Gerilim Dizi Rehberi',
            'excerpt' => 'Gerilimli diziler için hızlı öneriler.',
        ]);
        $post->categories()->sync([$category->id]);

        $response = $this->postJson('/ne-izlesem/chat', [
            'message' => 'Gerilimli bir dizi arıyorum',
        ]);

        $response->assertOk();
        $response->assertJsonPath('message.role', 'assistant');
        $response->assertJsonCount(1, 'message.meta.site_posts');
        $response->assertJsonCount(3, 'message.meta.external_suggestions');
        $response->assertJsonCount(4, 'message.meta.follow_up_options');
    }

    #[Test]
    public function it_stops_follow_up_options_after_four_user_turns(): void
    {
        config()->set('services.gemini.api_key', '');

        $conversationId = null;

        for ($turn = 0; $turn < 4; $turn++) {
            $response = $this->postJson('/ne-izlesem/chat', [
                'message' => 'Biraz daha karanlık olsun',
                'conversation_id' => $conversationId,
            ])->assertOk();

            $conversationId = $response->json('message.conversation_id');
        }

        $response = $this->postJson('/ne-izlesem/chat', [
            'message' => 'Bir tane daha ver',
            'conversation_id' => $conversationId,
        ]);

        $response->assertOk();
        $response->assertJsonCount(0, 'message.meta.follow_up_options');
    }
}