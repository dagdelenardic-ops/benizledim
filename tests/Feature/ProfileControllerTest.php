<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_marks_following_for_authenticated_user(): void
    {
        $reader = User::factory()->reader()->create();
        $author = User::factory()->author()->create();
        $reader->following()->attach($author->id);

        $this->actingAs($reader)
            ->get(route('profile.show', $author))
            ->assertOk()
            ->assertViewHas('page.props.author', fn (array $authorProps) => $authorProps['is_following'] === true);
    }
}
