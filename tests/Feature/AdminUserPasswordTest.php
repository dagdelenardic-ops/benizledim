<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminUserPasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_update_a_users_password(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->reader()->create([
            'password' => 'old-password',
            'provider' => null,
        ]);

        $response = $this->actingAs($admin)->put(route('admin.users.updatePassword', $user), [
            'password' => 'ValidPass123!',
            'password_confirmation' => 'ValidPass123!',
        ]);

        $response
            ->assertRedirect()
            ->assertSessionHasNoErrors()
            ->assertSessionHas('success');

        $user->refresh();

        $this->assertTrue(Hash::check('ValidPass123!', $user->password));
        $this->assertSame('email', $user->provider);
    }

    public function test_admin_sees_validation_error_for_weak_password(): void
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->reader()->create();

        $this->actingAs($admin)->put(route('admin.users.updatePassword', $user), [
            'password' => 'weakpass',
            'password_confirmation' => 'weakpass',
        ])->assertSessionHasErrors('password');
    }
}
