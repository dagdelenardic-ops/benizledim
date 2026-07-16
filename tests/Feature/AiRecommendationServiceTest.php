<?php

namespace Tests\Feature;

use App\Models\AiConversation;
use App\Models\Category;
use App\Models\Post;
use App\Services\AiRecommendationService;
use App\Services\VertexAiSearchService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AiRecommendationServiceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_uses_vertex_and_returns_recommended_posts(): void
    {
        config(['services.gcp.search_enabled' => true]);

        $category = Category::create(['name' => 'Sinema', 'slug' => 'sinema']);
        $post = Post::factory()->published()->create([
            'title' => 'Sessiz Bir Film',
            'excerpt' => 'Kisa ve sakin bir izleme onerisi.',
        ]);
        $post->categories()->attach($category);

        $vertex = Mockery::mock(VertexAiSearchService::class);
        $vertex->shouldReceive('answer')
            ->once()
            ->with('Kisa bir sey oner', null)
            ->andReturn([
                'answer' => 'Buna bakabilirsin: Sessiz Bir Film.',
                'citations' => [['id' => $post->id]],
                'session' => 'vertex-session',
            ]);
        $this->app->instance(VertexAiSearchService::class, $vertex);

        $conversation = AiConversation::create(['session_id' => 'test-session']);

        $result = app(AiRecommendationService::class)->chat($conversation, 'Kisa bir sey oner');

        $this->assertSame('assistant', $result['message']->role);
        $this->assertSame([$post->id], $result['message']->recommended_post_ids);
        $this->assertSame('vertex', $result['message']->meta['engine']);
        $this->assertCount(1, $result['recommended_posts']);
        $this->assertSame($post->id, $result['recommended_posts'][0]['id']);
    }

    #[Test]
    public function it_creates_a_friendly_fallback_when_vertex_fails(): void
    {
        config(['services.gcp.search_enabled' => true]);

        $vertex = Mockery::mock(VertexAiSearchService::class);
        $vertex->shouldReceive('answer')
            ->once()
            ->andThrow(new \RuntimeException('failed'));
        $this->app->instance(VertexAiSearchService::class, $vertex);

        $conversation = AiConversation::create(['session_id' => 'test-session']);

        $result = app(AiRecommendationService::class)->chat($conversation, 'Merhaba');

        $this->assertSame('assistant', $result['message']->role);
        $this->assertStringContainsString('Tam senlik birkaç seçenek çıkardım.', $result['message']->content);
        $this->assertSame([], $result['recommended_posts']);
        $this->assertCount(3, $result['message']->meta['external_suggestions']);
    }
}
