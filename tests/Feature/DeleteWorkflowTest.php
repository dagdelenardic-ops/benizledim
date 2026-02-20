<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteWorkflowTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test admin can hard delete post.
     */
    public function test_admin_can_hard_delete_post(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $post = Post::factory()->create();

        $response = $this->actingAs($admin)->delete(route('admin.posts.destroy', $post));

        $response->assertRedirect();
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    /**
     * Test editor can request post deletion.
     */
    public function test_editor_can_request_post_deletion(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);
        $post = Post::factory()->create(['user_id' => $editor->id, 'status' => 'published', 'published_at' => now()]);

        $response = $this->actingAs($editor)->delete(route('admin.posts.destroy', $post));

        $response->assertRedirect();
        
        $post->refresh();
        $this->assertNotNull($post->deletion_requested_at);
        $this->assertEquals($editor->id, $post->deletion_requested_by);
    }

    /**
     * Test author can request own post deletion.
     */
    public function test_author_can_request_own_post_deletion(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create(['user_id' => $author->id, 'status' => 'published', 'published_at' => now()]);

        $response = $this->actingAs($author)->delete(route('admin.posts.destroy', $post));

        $response->assertRedirect();
        
        $post->refresh();
        $this->assertNotNull($post->deletion_requested_at);
        $this->assertEquals($author->id, $post->deletion_requested_by);
    }

    /**
     * Test author cannot request deletion of others post.
     */
    public function test_author_cannot_request_deletion_of_others_post(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $otherUser = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($author)->delete(route('admin.posts.destroy', $post));

        $response->assertStatus(403);
        
        $post->refresh();
        $this->assertNull($post->deletion_requested_at);
    }

    /**
     * Test admin can approve deletion request.
     */
    public function test_admin_can_approve_deletion_request(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $author = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create([
            'user_id' => $author->id,
            'deletion_requested_at' => now(),
            'deletion_requested_by' => $author->id,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.posts.approveDeletion', $post));

        $response->assertRedirect();
        
        // Post onaylandıktan sonra silinmiş olmalı
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    /**
     * Test admin can reject deletion request.
     */
    public function test_admin_can_reject_deletion_request(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $author = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create([
            'user_id' => $author->id,
            'deletion_requested_at' => now(),
            'deletion_requested_by' => $author->id,
        ]);

        $response = $this->actingAs($admin)->post(route('admin.posts.rejectDeletion', $post));

        $response->assertRedirect();
        
        $post->refresh();
        $this->assertNull($post->deletion_requested_at);
        $this->assertNull($post->deletion_requested_by);
    }

    /**
     * Test editor cannot approve deletion request.
     */
    public function test_editor_cannot_approve_deletion_request(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);
        $author = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create([
            'user_id' => $author->id,
            'deletion_requested_at' => now(),
            'deletion_requested_by' => $author->id,
        ]);

        $response = $this->actingAs($editor)->post(route('admin.posts.approveDeletion', $post));

        $response->assertStatus(403);
        
        // Post hala silinmemiş olmalı
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }

    /**
     * Test pending deletion posts not visible to regular users.
     */
    public function test_pending_deletion_posts_not_visible_to_regular_users(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create([
            'user_id' => $author->id,
            'status' => 'published',
            'published_at' => now(),
            'deletion_requested_at' => now(),
        ]);

        // Unauthenticated user should not see pending deletion posts
        $response = $this->get(route('posts.show', $post));
        $response->assertStatus(404);

        // Authenticated but not admin/editor should not see
        $regularUser = User::factory()->create(['role' => 'reader']);
        $response = $this->actingAs($regularUser)->get(route('posts.show', $post));
        $response->assertStatus(404);
    }

    /**
     * Test cannot request deletion twice.
     */
    public function test_cannot_request_deletion_twice(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create([
            'user_id' => $author->id,
            'status' => 'published',
            'published_at' => now(),
            'deletion_requested_at' => now(),
            'deletion_requested_by' => $author->id,
        ]);

        $response = $this->actingAs($author)->delete(route('admin.posts.destroy', $post));

        $response->assertRedirect();
        $response->assertSessionHas('error');
    }
}
