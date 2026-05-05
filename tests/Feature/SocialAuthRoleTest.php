<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SocialAuthRoleTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function new_google_users_start_as_readers(): void
    {
        config()->set('benizledim.admin_emails', ['admin@benizledim.test']);

        $this->mockGoogleUser('google-reader-1', 'reader@example.com', 'Yeni Okuyucu');

        $this->get('/auth/google/callback')->assertRedirect('/');

        $this->assertDatabaseHas('users', [
            'email' => 'reader@example.com',
            'provider' => 'google',
            'provider_id' => 'google-reader-1',
            'role' => 'reader',
        ]);
    }

    #[Test]
    public function existing_wix_placeholder_role_is_preserved_when_google_account_links(): void
    {
        config()->set('benizledim.admin_emails', ['admin@benizledim.test']);

        $placeholder = User::factory()->author()->create([
            'name' => 'Eski Yazar',
            'email' => 'wix-author+eski-yazar@benizledim.local',
            'provider' => 'email',
            'provider_id' => null,
        ]);

        $this->mockGoogleUser('google-author-1', 'writer@example.com', 'Eski Yazar');

        $this->get('/auth/google/callback')->assertRedirect('/admin');

        $placeholder->refresh();

        $this->assertSame('writer@example.com', $placeholder->email);
        $this->assertSame('google', $placeholder->provider);
        $this->assertSame('google-author-1', $placeholder->provider_id);
        $this->assertSame('author', $placeholder->role);
    }

    private function mockGoogleUser(string $id, string $email, string $name): void
    {
        config()->set('services.google.client_id', 'google-client');
        config()->set('services.google.client_secret', 'google-secret');
        config()->set('services.google.redirect', 'https://benizledim.test/auth/google/callback');

        $socialUser = (new SocialiteUser())->map([
            'id' => $id,
            'email' => $email,
            'name' => $name,
            'avatar' => 'https://example.com/avatar.png',
        ]);

        $provider = Mockery::mock();
        $provider->shouldReceive('user')->once()->andReturn($socialUser);

        Socialite::shouldReceive('driver')
            ->once()
            ->with('google')
            ->andReturn($provider);
    }
}
