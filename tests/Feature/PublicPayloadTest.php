<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Public pages render cards, not article bodies. Serializing whole Eloquent
 * models used to ship every listed article's `content`, its moderation columns
 * and the author's e-mail address to anyone who read the page source.
 */
class PublicPayloadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['inertia.ssr.enabled' => false]);
    }

    private function author(): User
    {
        return User::factory()->create([
            'name' => 'Test Yazar',
            'email' => 'gizli-adres@example.com',
            'role' => 'author',
        ]);
    }

    private function publishedPost(User $author, ?Category $category = null): Post
    {
        $post = Post::factory()->published()->create([
            'user_id' => $author->id,
            'title' => 'Kart Testi Yazısı',
            'excerpt' => 'Kart özeti.',
            'content' => '<p>GIZLI-GOVDE-METNI</p>',
        ]);

        if ($category) {
            $post->categories()->attach($category);
        }

        return $post;
    }

    /**
     * @return array<string, mixed>
     */
    private function pageProps(string $url): array
    {
        $response = $this->get($url);
        $response->assertOk();

        preg_match('/<script data-page="app" type="application\/json">(.*?)<\/script>/s', $response->getContent(), $matches);
        $this->assertNotEmpty($matches, "No Inertia page element found on {$url}");

        $page = json_decode(str_replace('<\/', '</', $matches[1]), true, 512, JSON_THROW_ON_ERROR);

        return $page['props'];
    }

    #[Test]
    public function listing_payloads_omit_article_bodies_and_author_emails(): void
    {
        $author = $this->author();
        $category = Category::create(['name' => 'Sinema', 'slug' => 'sinema']);
        $this->publishedPost($author, $category);

        foreach (['/', '/yazilar', '/yazilar/sinema', '/profile/'.$author->id] as $url) {
            $props = $this->pageProps($url);
            $encoded = json_encode($props, JSON_UNESCAPED_UNICODE);

            $this->assertStringNotContainsString('GIZLI-GOVDE-METNI', $encoded, "Article body leaked on {$url}");
            $this->assertStringNotContainsString('gizli-adres@example.com', $encoded, "Author e-mail leaked on {$url}");
            $this->assertStringNotContainsString('deletion_requested_by', $encoded, "Moderation column leaked on {$url}");
            $this->assertStringContainsString('Kart Testi Yazısı', $encoded, "Card missing on {$url}");
        }
    }

    #[Test]
    public function post_detail_keeps_its_body_but_drops_related_bodies_and_emails(): void
    {
        $author = $this->author();
        $category = Category::create(['name' => 'Sinema', 'slug' => 'sinema']);
        $post = $this->publishedPost($author, $category);

        $related = Post::factory()->published()->create([
            'user_id' => $author->id,
            'title' => 'Ilgili Yazi',
            'content' => '<p>ILGILI-GOVDE-METNI</p>',
        ]);
        $related->categories()->attach($category);

        $props = $this->pageProps('/yazi/'.$post->slug);

        $this->assertStringContainsString('GIZLI-GOVDE-METNI', json_encode($props['post'], JSON_UNESCAPED_UNICODE));

        $encoded = json_encode($props, JSON_UNESCAPED_UNICODE);
        $this->assertStringNotContainsString('ILGILI-GOVDE-METNI', $encoded);
        $this->assertStringNotContainsString('gizli-adres@example.com', $encoded);

        $this->assertSame('Ilgili Yazi', $props['relatedPosts'][0]['title']);
        $this->assertArrayNotHasKey('content', $props['relatedPosts'][0]);
    }

    #[Test]
    public function the_article_seo_fallback_links_the_author_to_a_reachable_profile(): void
    {
        $author = $this->author();
        $post = $this->publishedPost($author);

        $html = $this->get('/yazi/'.$post->slug)->getContent();

        $this->assertStringContainsString('href="https://benizledim.com/profile/'.$author->id.'"', $html);
        $this->assertStringNotContainsString('https://benizledim.com/yazar/"', $html);
    }
}
