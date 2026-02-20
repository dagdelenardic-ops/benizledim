<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test admin can access admin panel.
     */
    public function test_admin_can_access_admin_panel(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get(route('admin.dashboard'));

        $response->assertStatus(200);
    }

    /**
     * Test editor can access admin panel.
     */
    public function test_editor_can_access_admin_panel(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);

        $response = $this->actingAs($editor)->get(route('admin.dashboard'));

        $response->assertStatus(200);
    }

    /**
     * Test author can access admin panel.
     */
    public function test_author_can_access_admin_panel(): void
    {
        $author = User::factory()->create(['role' => 'author']);

        $response = $this->actingAs($author)->get(route('admin.dashboard'));

        $response->assertStatus(200);
    }

    /**
     * Test reader cannot access admin panel.
     */
    public function test_reader_cannot_access_admin_panel(): void
    {
        $reader = User::factory()->create(['role' => 'reader']);

        $response = $this->actingAs($reader)->get(route('admin.dashboard'));

        $response->assertStatus(403);
    }

    /**
     * Test unauthenticated user cannot access admin panel.
     */
    public function test_unauthenticated_user_cannot_access_admin_panel(): void
    {
        $response = $this->get(route('admin.dashboard'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Test admin can manage all posts.
     */
    public function test_admin_can_manage_all_posts(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        
        $otherUser = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($admin)->get(route('admin.posts.edit', $post));

        $response->assertStatus(200);
    }

    /**
     * Test editor can manage all posts.
     */
    public function test_editor_can_manage_all_posts(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);
        
        $otherUser = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($editor)->get(route('admin.posts.edit', $post));

        $response->assertStatus(200);
    }

    /**
     * Test author can only edit own posts.
     */
    public function test_author_can_only_edit_own_posts(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        
        $otherUser = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->actingAs($author)->get(route('admin.posts.edit', $post));

        $response->assertStatus(403);
    }

    /**
     * Test author can edit own posts.
     */
    public function test_author_can_edit_own_posts(): void
    {
        $author = User::factory()->create(['role' => 'author']);
        $post = Post::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($author)->get(route('admin.posts.edit', $post));

        $response->assertStatus(200);
    }

    /**
     * Test reader cannot edit posts.
     */
    public function test_reader_cannot_edit_posts(): void
    {
        $reader = User::factory()->create(['role' => 'reader']);
        $post = Post::factory()->create();

        $response = $this->actingAs($reader)->get(route('admin.posts.edit', $post));

        $response->assertStatus(403);
    }

    /**
     * Test author cannot manage categories.
     */
    public function test_author_cannot_manage_categories(): void
    {
        $author = User::factory()->create(['role' => 'author']);

        $response = $this->actingAs($author)->get(route('admin.categories.index'));

        $response->assertStatus(403);
    }

    /**
     * Test editor can manage categories.
     */
    public function test_editor_can_manage_categories(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);

        $response = $this->actingAs($editor)->get(route('admin.categories.index'));

        $response->assertStatus(200);
    }

    /**
     * Test editor cannot manage users.
     */
    public function test_editor_cannot_manage_users(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);

        $response = $this->actingAs($editor)->get(route('admin.users.index'));

        $response->assertStatus(403);
    }
}
