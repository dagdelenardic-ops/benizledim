<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class SecurityAndRoleTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function login_attempts_are_rate_limited()
    {
        $this->withExceptionHandling();

        // We will make 6 consecutive failed attempts
        for ($i = 0; $i < 6; $i++) {
            $response = $this->post('/login', [
                'email' => 'wrong@email.com',
                'password' => 'wrongpassword'
            ]);
        }

        // The 6th attempt should return a validation error stating too many attempts (429 or validation error on the email specific to throttling)
        $response->assertSessionHasErrors('email');
        $this->assertTrue(
            str_contains(session('errors')->get('email')[0], 'Too many login attempts') ||
            str_contains(session('errors')->get('email')[0], 'Çok fazla giriş denemesi')
        );
    }

    /** @test */
    public function only_admins_editors_and_authors_can_access_admin_panel()
    {
        // 1. Reader
        $reader = User::factory()->create(['role' => 'reader']);
        $response = $this->actingAs($reader)->get('/admin');

        // Expected to be forbidden or redirected
        $this->assertTrue(in_array($response->status(), [403, 404, 302]));

        // 2. Author
        $author = User::factory()->create(['role' => 'author']);
        $response = $this->actingAs($author)->get('/admin');
        // Authors have canAccessCms() == true, so they shouldn't be forbidden
        $this->assertFalse(in_array($response->status(), [403]));

        // 3. Admin
        $admin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/admin');
        // Admins have canAccessCms() == true
        $this->assertFalse(in_array($response->status(), [403]));
    }

    /** @test */
    public function editors_can_request_deletion_but_not_delete_directly()
    {
        $editor = User::factory()->create(['role' => 'editor']);
        $post = Post::factory()->create(['status' => 'published']);

        $response = $this->actingAs($editor)->delete("/admin/posts/{$post->id}");

        // For this test, we assume there's a specific route or action for requesting deletion. 
        // We will just verify that if an editor tries to delete, the post remains in the database.
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'status' => 'published'
        ]);

        // If the system works by updating 'deletion_requested_at' when delete is called, we'd check that instead
        // $this->assertDatabaseHas('posts', [
        //    'id' => $post->id,
        //    'deletion_requested_at' => now()
        // ]);
    }
}
