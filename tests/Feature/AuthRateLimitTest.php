<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthRateLimitTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that login rate limiting is working.
     */
    public function test_login_rate_limiting(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        $loginUrl = route('login.attempt');

        // 5 başarısız deneme
        for ($i = 0; $i < 5; $i++) {
            $response = $this->post($loginUrl, [
                'email' => 'test@example.com',
                'password' => 'wrong-password',
            ]);

            $response->assertSessionHasErrors('email');
        }

        // 6. deneme rate limit hatası vermeli
        $response = $this->post($loginUrl, [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');

        $errors = session('errors');
        $this->assertNotNull($errors);
        $errorMessages = $errors->get('email');
        $this->assertTrue(
            collect($errorMessages)->contains(fn ($error) => str_contains($error, 'Çok fazla giriş denemesi')),
            'Rate limit devreye girmeli ve "Çok fazla giriş denemesi" hatası vermeli.'
        );
    }

    /**
     * Test that different emails have separate rate limits.
     */
    public function test_different_emails_have_separate_rate_limits(): void
    {
        User::factory()->create([
            'email' => 'user1@example.com',
            'password' => Hash::make('password'),
        ]);

        User::factory()->create([
            'email' => 'user2@example.com',
            'password' => Hash::make('password'),
        ]);

        $loginUrl = route('login.attempt');

        // user1 için 5 başarısız deneme
        for ($i = 0; $i < 5; $i++) {
            $this->post($loginUrl, [
                'email' => 'user1@example.com',
                'password' => 'wrong-password',
            ]);
        }

        // user2 için deneme yapınca rate limit olmamalı
        $response = $this->post($loginUrl, [
            'email' => 'user2@example.com',
            'password' => 'wrong-password',
        ]);

        $errors = session('errors');
        $this->assertNotNull($errors);
        $errorMessages = $errors->get('email');
        $this->assertFalse(
            collect($errorMessages)->contains(fn ($error) => str_contains($error, 'Çok fazla giriş denemesi')),
            'Farklı email için rate limit devreye girmemeli.'
        );
    }

    public function test_successful_inertia_reader_login_redirects_to_home(): void
    {
        User::factory()->create([
            'email' => 'reader@example.com',
            'password' => Hash::make('ValidPass123!'),
            'role' => 'reader',
        ]);

        $response = $this
            ->withHeader('X-Inertia', 'true')
            ->from('https://benizledim.com/')
            ->post(route('login.attempt'), [
                'email' => 'reader@example.com',
                'password' => 'ValidPass123!',
            ]);

        $response->assertRedirect('https://benizledim.com');
        $this->assertAuthenticated();
    }

    public function test_successful_inertia_cms_login_redirects_to_intended_admin_page(): void
    {
        User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('ValidPass123!'),
            'role' => 'admin',
        ]);

        $response = $this
            ->withSession(['url.intended' => 'https://benizledim.com/admin'])
            ->withHeader('X-Inertia', 'true')
            ->post(route('login.attempt'), [
                'email' => 'admin@example.com',
                'password' => 'ValidPass123!',
            ]);

        $response->assertRedirect('https://benizledim.com/admin');
        $this->assertAuthenticated();
    }
}
