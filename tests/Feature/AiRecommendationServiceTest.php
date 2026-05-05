<?php

namespace Tests\Feature;

use App\Models\AiConversation;
use App\Models\Category;
use App\Models\Post;
use App\Services\AiRecommendationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AiRecommendationServiceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_uses_gemini_and_returns_recommended_posts(): void
    {
        config([
            'services.gemini.api_key' => 'test-key',
            'services.gemini.text_model' => 'gemini-3-pro-preview',
        ]);

        $category = Category::create(['name' => 'Sinema', 'slug' => 'sinema']);
        $post = Post::factory()->published()->create([
            'title' => 'Sessiz Bir Film',
            'excerpt' => 'Kisa ve sakin bir izleme onerisi.',
        ]);
        $post->categories()->attach($category);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => "Buna bakabilirsin: [ID:{$post->id}] Sessiz Bir Film."],
                            ],
                        ],
                    ],
                ],
            ]),
        ]);

        $conversation = AiConversation::create(['session_id' => 'test-session']);

        $result = app(AiRecommendationService::class)->chat($conversation, 'Kisa bir sey oner');

        Http::assertSent(fn ($request) => str_contains($request->url(), 'models/gemini-3-pro-preview:generateContent')
            && $request['contents'][0]['role'] === 'user'
            && $request['contents'][0]['parts'][0]['text'] === 'Kisa bir sey oner'
        );

        $this->assertSame('assistant', $result['message']->role);
        $this->assertSame([$post->id], $result['message']->recommended_post_ids);
        $this->assertCount(1, $result['recommended_posts']);
        $this->assertSame($post->id, $result['recommended_posts'][0]['id']);
    }

    #[Test]
    public function it_creates_a_friendly_error_message_when_gemini_fails(): void
    {
        config([
            'services.gemini.api_key' => 'test-key',
            'services.gemini.text_model' => 'gemini-3-pro-preview',
        ]);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response(['error' => ['message' => 'failed']], 500),
        ]);

        $conversation = AiConversation::create(['session_id' => 'test-session']);

        $result = app(AiRecommendationService::class)->chat($conversation, 'Merhaba');

        $this->assertSame('assistant', $result['message']->role);
        $this->assertStringContainsString('Tam senlik birkaç seçenek çıkardım.', $result['message']->content);
        $this->assertSame([], $result['recommended_posts']);
        $this->assertCount(3, $result['message']->meta['external_suggestions']);
    }
}
