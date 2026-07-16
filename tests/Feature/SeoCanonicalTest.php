<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SeoCanonicalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['inertia.ssr.enabled' => false]);
    }

    #[Test]
    public function legacy_category_query_redirects_to_the_clean_category_path(): void
    {
        $category = Category::create(['name' => 'Sinema', 'slug' => 'sinema']);

        $response = $this->get('/yazilar?category=sinema&page=2');

        $response->assertStatus(301);
        $response->assertRedirect(route('posts.category', [
            'category' => $category,
            'page' => 2,
        ], false));
    }

    #[Test]
    public function clean_category_page_uses_a_single_self_referencing_canonical(): void
    {
        Category::create(['name' => 'Sinema', 'slug' => 'sinema']);

        $response = $this->get('/yazilar/sinema?page=2');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Post/Index')
            ->where('canonicalUrl', 'https://benizledim.com/yazilar/sinema?page=2'));

        $html = $response->getContent();
        $this->assertSame(1, substr_count($html, '<title'));
        $this->assertSame(1, substr_count($html, 'name="description"'));
        $this->assertSame(1, substr_count($html, 'rel="canonical"'));
        $this->assertSame(1, substr_count($html, 'property="og:url"'));
        $this->assertStringNotContainsString('visibility: hidden', $html);
        $this->assertStringContainsString(
            '<link data-bi-seo-fallback rel="canonical" href="https://benizledim.com/yazilar/sinema?page=2">',
            $html,
        );
    }

    #[Test]
    public function tag_and_pagination_filters_are_reflected_in_the_archive_canonical(): void
    {
        $response = $this->get('/yazilar?tag=dram&page=3');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Post/Index')
            ->where('canonicalUrl', 'https://benizledim.com/yazilar?tag=dram&page=3'));
    }

    #[Test]
    public function flash_news_pagination_uses_a_self_referencing_canonical(): void
    {
        $response = $this->get('/haberler?page=7');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('FlashNews/Index')
            ->where('canonicalUrl', 'https://benizledim.com/haberler?page=7'));
        $this->assertStringContainsString(
            '<link data-bi-seo-fallback rel="canonical" href="https://benizledim.com/haberler?page=7">',
            $response->getContent(),
        );
    }

    #[Test]
    public function first_pagination_page_redirects_to_the_bare_archive_url(): void
    {
        $response = $this->get('/yazilar?page=1');

        $response->assertStatus(301);
        $response->assertRedirect('https://benizledim.com/yazilar');
    }

    #[Test]
    public function profile_variants_and_pagination_have_stable_canonicals(): void
    {
        $author = User::factory()->author()->create();
        Post::factory()->published()->count(13)->for($author)->create([
            'format' => 'standard',
        ]);

        $this->get("/profile/{$author->id}?page=2")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('activeTab', 'standard')
                ->where('canonicalUrl', "https://benizledim.com/profile/{$author->id}?page=2"));

        $this->get("/profile/{$author->id}?format=watch_log")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('activeTab', 'watch_log')
                ->where('canonicalUrl', "https://benizledim.com/profile/{$author->id}?format=watch_log"));

        $this->get("/profile/{$author->id}?format=invalid")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('activeTab', 'standard')
                ->where('canonicalUrl', "https://benizledim.com/profile/{$author->id}"));
    }

    #[Test]
    public function internal_search_results_are_noindex_and_use_the_search_canonical(): void
    {
        config(['services.gcp.search_enabled' => false]);

        $response = $this->get('/ara?q=sinema');

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Search/Index')
            ->where('canonicalUrl', 'https://benizledim.com/ara')
            ->where('robots', 'noindex, follow'));
        $this->assertStringContainsString(
            '<meta data-bi-seo-fallback name="robots" content="noindex, follow">',
            $response->getContent(),
        );
    }
}
