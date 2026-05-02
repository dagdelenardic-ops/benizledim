<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminPostReviewWorkflowTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function author_publish_requests_are_sent_to_review(): void
    {
        $author = User::factory()->author()->create();
        $category = Category::create([
            'name' => 'Sinema',
            'slug' => 'sinema',
        ]);

        $response = $this->actingAs($author)->post('/admin/posts', [
            'title' => 'Review Test Post',
            'excerpt' => 'Short excerpt',
            'content' => '<p>Body content for review.</p>',
            'status' => 'published',
            'categories' => [$category->id],
            'tags' => [],
        ]);

        $response->assertRedirect(route('admin.posts.index'));

        $post = Post::where('title', 'Review Test Post')->firstOrFail();

        $this->assertSame('pending_review', $post->status);
        $this->assertNull($post->published_at);
        $this->assertNotNull($post->pending_review_at);
        $this->assertSame($author->id, $post->pending_review_by);
    }

    #[Test]
    public function editor_can_approve_a_pending_review_post(): void
    {
        $author = User::factory()->author()->create();
        $editor = User::factory()->editor()->create();
        $post = Post::factory()->for($author)->create([
            'status' => 'pending_review',
            'pending_review_at' => now(),
            'pending_review_by' => $author->id,
            'published_at' => null,
        ]);

        $response = $this->actingAs($editor)->post("/admin/posts/{$post->id}/approve-review");

        $response->assertRedirect();

        $post->refresh();

        $this->assertSame('published', $post->status);
        $this->assertNotNull($post->published_at);
        $this->assertNull($post->pending_review_at);
        $this->assertNull($post->pending_review_by);
        $this->assertSame($editor->id, $post->reviewed_by);
    }

    #[Test]
    public function admin_can_reassign_post_owner(): void
    {
        $admin = User::factory()->admin()->create();
        $currentOwner = User::factory()->author()->create();
        $newOwner = User::factory()->author()->create();
        $post = Post::factory()->for($currentOwner)->create();

        $response = $this->actingAs($admin)->put("/admin/posts/{$post->id}/owner", [
            'user_id' => $newOwner->id,
        ]);

        $response->assertRedirect();

        $this->assertSame($newOwner->id, $post->refresh()->user_id);
    }
}
