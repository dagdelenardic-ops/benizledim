<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthorDirectoryControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_author_directory_supports_search(): void
    {
        User::factory()->author()->create(['name' => 'Ayse Sinema']);
        User::factory()->author()->create(['name' => 'Baska Yazar']);
        User::factory()->reader()->create(['name' => 'Reader Person']);

        $this->get(route('authors.index', ['q' => 'Ayse']))
            ->assertOk()
            ->assertViewHas('page.component', 'Author/Index')
            ->assertViewHas('page.props.authors', function (array $authors) {
                return count($authors['data']) === 1 && $authors['data'][0]['name'] === 'Ayse Sinema';
            });
    }

    public function test_directory_marks_following_for_authenticated_user(): void
    {
        $reader = User::factory()->reader()->create();
        $author = User::factory()->author()->create(['name' => 'Takip Edilen']);
        $reader->following()->attach($author->id);

        $this->actingAs($reader)
            ->get(route('authors.index'))
            ->assertOk()
            ->assertViewHas('page.props.authors', function (array $authors) use ($author) {
                $row = collect($authors['data'])->firstWhere('id', $author->id);

                return $row && $row['is_following'] === true;
            });
    }
}
