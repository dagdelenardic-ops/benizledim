<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminPostCoverFocusTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function author_can_store_homepage_cover_focus_coordinates(): void
    {
        $author = User::factory()->author()->create();
        $category = Category::create([
            'name' => 'Sinema',
            'slug' => 'sinema',
        ]);

        $response = $this->actingAs($author)->post('/admin/posts', [
            'title' => 'Focus Test Post',
            'excerpt' => 'Short excerpt',
            'content' => '<p>Body content for focus.</p>',
            'status' => 'draft',
            'cover_image_focus_x' => 18,
            'cover_image_focus_y' => 22,
            'cover_image_mobile_focus_x' => 64,
            'cover_image_mobile_focus_y' => 31,
            'categories' => [$category->id],
            'tags' => [],
        ]);

        $response->assertRedirect(route('admin.posts.index'));

        $this->assertDatabaseHas('posts', [
            'title' => 'Focus Test Post',
            'cover_image_focus_x' => 18,
            'cover_image_focus_y' => 22,
            'cover_image_mobile_focus_x' => 64,
            'cover_image_mobile_focus_y' => 31,
        ]);
    }

    #[Test]
    public function author_can_update_homepage_cover_focus_coordinates(): void
    {
        $author = User::factory()->author()->create();
        $category = Category::create([
            'name' => 'Dizi',
            'slug' => 'dizi',
        ]);
        $post = Post::factory()->for($author)->create([
            'cover_image_focus_x' => 50,
            'cover_image_focus_y' => 50,
            'cover_image_mobile_focus_x' => 50,
            'cover_image_mobile_focus_y' => 50,
        ]);
        $post->categories()->sync([$category->id]);

        $response = $this->actingAs($author)->put("/admin/posts/{$post->id}", [
            'title' => $post->title,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'status' => 'draft',
            'cover_image_focus_x' => 72,
            'cover_image_focus_y' => 15,
            'cover_image_mobile_focus_x' => 41,
            'cover_image_mobile_focus_y' => 68,
            'categories' => [$category->id],
            'tags' => [],
        ]);

        $response->assertRedirect(route('admin.posts.index'));

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'cover_image_focus_x' => 72,
            'cover_image_focus_y' => 15,
            'cover_image_mobile_focus_x' => 41,
            'cover_image_mobile_focus_y' => 68,
        ]);
    }
}