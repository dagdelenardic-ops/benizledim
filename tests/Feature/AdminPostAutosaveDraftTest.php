<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminPostAutosaveDraftTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function author_can_create_a_server_backed_autosave_draft(): void
    {
        $author = User::factory()->author()->create();
        $category = Category::create(['name' => 'Sinema', 'slug' => 'sinema']);

        $response = $this->actingAs($author)->postJson('/admin/posts/autosave-draft', [
            'title' => 'Yarım Kalan Yazı',
            'excerpt' => 'Kısa not',
            'content' => '<p>İlk paragraf.</p>',
            'categories' => [$category->id],
            'tags' => [],
            'reading_time_minutes' => 1,
        ]);

        $response->assertOk()
            ->assertJsonStructure(['post_id', 'edit_url', 'autosave_endpoint', 'saved_at']);

        $post = Post::findOrFail($response->json('post_id'));

        $this->assertSame($author->id, $post->user_id);
        $this->assertSame('draft', $post->status);
        $this->assertSame('Yarım Kalan Yazı', $post->title);
        $this->assertSame([$category->id], $post->categories()->pluck('categories.id')->all());
    }

    #[Test]
    public function reader_cannot_create_an_autosave_draft(): void
    {
        $reader = User::factory()->reader()->create();

        $this->actingAs($reader)->postJson('/admin/posts/autosave-draft', [
            'title' => 'Yetkisiz Taslak',
            'content' => '<p>Kaydedilmemeli.</p>',
        ])->assertForbidden();
    }

    #[Test]
    public function autosave_updates_full_draft_fields_and_refreshes_placeholder_slug(): void
    {
        $author = User::factory()->author()->create();
        $category = Category::create(['name' => 'Dizi', 'slug' => 'dizi']);
        $post = Post::factory()->for($author)->draft()->create([
            'title' => 'Adsız Taslak',
            'slug' => 'adsiz-taslak',
            'content' => '',
        ]);

        $response = $this->actingAs($author)->putJson("/admin/posts/{$post->id}/autosave", [
            'title' => 'Kayıp Olmayan Yazı',
            'excerpt' => 'Autosave özeti',
            'content' => '<p>Güncel içerik.</p>',
            'categories' => [$category->id],
            'tags' => [],
            'reading_time_minutes' => 3,
            'cover_image_focus_x' => 30,
            'cover_image_focus_y' => 70,
            'cover_image_mobile_focus_x' => 45,
            'cover_image_mobile_focus_y' => 55,
        ]);

        $response->assertOk()->assertJsonPath('post_id', $post->id);

        $post->refresh();

        $this->assertSame('Kayıp Olmayan Yazı', $post->title);
        $this->assertSame('kayip-olmayan-yazi', $post->slug);
        $this->assertSame('<p>Güncel içerik.</p>', $post->content);
        $this->assertSame(3, $post->reading_time_minutes);
        $this->assertSame([$category->id], $post->categories()->pluck('categories.id')->all());
    }
}
