<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuickLogControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_author_can_create_a_watch_log_from_manual_title(): void
    {
        $author = User::factory()->author()->create();
        $category = Category::create(['name' => 'Sinema', 'slug' => 'sinema']);

        $response = $this->actingAs($author)->postJson(route('quick-log.store'), [
            'external_title' => 'Inception',
            'external_year' => 2010,
            'tmdb_type' => 'movie',
            'rating' => 8,
            'mood_tags' => ['gerilim', 'sessiz'],
            'note' => 'Yillar sonra hala isliyor.',
            'watched_on' => '2026-05-05',
            'status' => 'published',
            'cover_image' => 'https://image.tmdb.org/t/p/w780/xyz.jpg',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('post.title', 'Inception (2010)')
            ->assertJsonPath('post.format', 'watch_log');

        $post = Post::firstOrFail();

        $this->assertSame('watch_log', $post->format);
        $this->assertSame('high', $post->intensity_level);
        $this->assertSame('Inception', $post->external_title);
        $this->assertSame(2010, $post->external_year);
        $this->assertSame('xyz.jpg', basename((string) $post->cover_image));
        $this->assertTrue($post->categories->contains($category));
    }

    public function test_reader_cannot_create_quick_log(): void
    {
        $reader = User::factory()->reader()->create();

        $this->actingAs($reader)
            ->postJson(route('quick-log.store'), [
                'external_title' => 'Blocked',
                'status' => 'draft',
            ])
            ->assertForbidden();
    }
}