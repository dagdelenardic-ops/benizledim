<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminManagementPagesAccessTest extends TestCase
{
    use RefreshDatabase;

    public static function managementRoutes(): array
    {
        return [
            'categories' => ['admin.categories.index'],
            'tags' => ['admin.tags.index'],
            'podcasts' => ['admin.podcasts.index'],
            'festival' => ['admin.festival.index'],
            'pages' => ['admin.pages.index'],
            'comments' => ['admin.comments.index'],
            'newsletters' => ['admin.newsletters.index'],
        ];
    }

    #[Test]
    #[DataProvider('managementRoutes')]
    public function admin_can_open_management_pages(string $routeName): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)
            ->get(route($routeName))
            ->assertOk();
    }

    #[Test]
    #[DataProvider('managementRoutes')]
    public function editor_can_open_management_pages(string $routeName): void
    {
        $editor = User::factory()->editor()->create();

        $this->actingAs($editor)
            ->get(route($routeName))
            ->assertOk();
    }
}