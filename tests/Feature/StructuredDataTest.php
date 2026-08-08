<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class StructuredDataTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['inertia.ssr.enabled' => false]);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function jsonLd(string $url): array
    {
        $response = $this->get($url);
        $response->assertOk();

        preg_match_all(
            '#<script data-bi-seo-fallback type="application/ld\+json">(.*?)</script>#s',
            $response->getContent(),
            $matches,
        );

        return array_map(
            fn (string $raw) => json_decode(str_replace('<\/', '</', $raw), true, 512, JSON_THROW_ON_ERROR),
            $matches[1],
        );
    }

    private function publishedPost(): Post
    {
        $author = User::factory()->create(['name' => 'Test Yazar', 'role' => 'author']);
        $category = Category::create(['name' => 'Sinema', 'slug' => 'sinema']);

        $post = Post::factory()->published()->create([
            'user_id' => $author->id,
            'title' => 'Yapılandırılmış Veri Testi',
            'excerpt' => 'Kısa özet.',
            'content' => '<p>Bir iki üç dört beş.</p>',
        ]);
        $post->categories()->attach($category);

        return $post->fresh();
    }

    #[Test]
    public function an_article_carries_article_and_breadcrumb_nodes(): void
    {
        $post = $this->publishedPost();

        $nodes = collect($this->jsonLd('/yazi/'.$post->slug))->keyBy('@type');

        $this->assertTrue($nodes->has('Article'));
        $this->assertTrue($nodes->has('BreadcrumbList'));

        $article = $nodes['Article'];
        $this->assertSame('Test Yazar', $article['author']['name']);
        $this->assertSame(
            'https://benizledim.com/profile/'.$post->user_id,
            $article['author']['url'],
            'The byline must link to the author entity.',
        );
        $this->assertSame('Sinema', $article['articleSection']);
        $this->assertSame(5, $article['wordCount']);

        $this->assertSame(
            ['Ana Sayfa', 'Yazılar', 'Sinema', 'Yapılandırılmış Veri Testi'],
            array_column($nodes['BreadcrumbList']['itemListElement'], 'name'),
        );
    }

    #[Test]
    public function a_view_does_not_move_the_articles_modification_date(): void
    {
        $post = $this->publishedPost();
        $before = $post->updated_at;

        $this->get('/yazi/'.$post->slug)->assertOk();
        $this->flushSession();
        $this->get('/yazi/'.$post->slug)->assertOk();

        $post->refresh();

        $this->assertGreaterThan(0, $post->view_count, 'The counter should still count views.');
        $this->assertTrue(
            $before->equalTo($post->updated_at),
            'view_count must not bump updated_at: it feeds Article.dateModified and sitemap <lastmod>.',
        );
    }

    #[Test]
    public function an_author_profile_describes_the_person(): void
    {
        $post = $this->publishedPost();

        $nodes = collect($this->jsonLd('/profile/'.$post->user_id))->keyBy('@type');

        $this->assertTrue($nodes->has('ProfilePage'));
        $this->assertSame('Test Yazar', $nodes['ProfilePage']['mainEntity']['name']);
        $this->assertSame('Person', $nodes['ProfilePage']['mainEntity']['@type']);
        $this->assertTrue($nodes->has('BreadcrumbList'));
    }

    #[Test]
    public function listing_pages_beyond_the_first_get_their_own_title_and_description(): void
    {
        Category::create(['name' => 'Sinema', 'slug' => 'sinema']);

        $first = $this->get('/yazilar')->getContent();
        $second = $this->get('/yazilar?page=2')->getContent();

        $this->assertStringContainsString('<title data-bi-seo-fallback>Tüm Yazılar - Ben İzledim</title>', $first);
        $this->assertStringContainsString('<title data-bi-seo-fallback>Tüm Yazılar - Sayfa 2 - Ben İzledim</title>', $second);
        $this->assertStringContainsString('sayfa 2.', $second);
    }

    #[Test]
    public function llms_txt_describes_the_site_for_answer_engines(): void
    {
        $post = $this->publishedPost();

        $response = $this->get('/llms.txt');

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/plain; charset=UTF-8');
        $response->assertSee('# Ben İzledim', false);
        $response->assertSee('https://benizledim.com/yazi/'.$post->slug, false);
        $response->assertSee('https://benizledim.com/sitemap.xml', false);
    }
}
