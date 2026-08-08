<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * The first-paint fallback markup exists for clients that do not run our
 * JavaScript. It used to render for every visitor, so a browser painted the
 * unstyled article text and Vue replaced it a beat later -- a visible flash on
 * every page load. Crawlers still get it inline; browsers get it inside
 * <noscript>, which they do not paint.
 */
class SeoFallbackVisibilityTest extends TestCase
{
    use RefreshDatabase;

    private const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

    private const CRAWLER_UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

    protected function setUp(): void
    {
        parent::setUp();

        config(['inertia.ssr.enabled' => false]);
    }

    private function publishedPost(): Post
    {
        return Post::factory()->published()->create([
            'user_id' => User::factory()->create(['role' => 'author'])->id,
            'title' => 'Fallback Testi',
            'excerpt' => 'FALLBACK-OZET-METNI',
        ]);
    }

    /**
     * What a browser actually paints: the body minus the regions it never
     * renders. <head> carries the same title and excerpt in meta tags, and the
     * Inertia page object is a JSON script element, so both have to come out
     * before asking whether any fallback text is left on screen.
     */
    private function paintedMarkup(string $html): string
    {
        return preg_replace(
            [
                '/<head>.*?<\/head>/s',
                '/<script\b[^>]*>.*?<\/script>/s',
                '/<noscript>.*?<\/noscript>/s',
            ],
            '',
            $html
        );
    }

    #[Test]
    public function a_browser_never_paints_the_fallback_markup(): void
    {
        $post = $this->publishedPost();

        $html = $this->withHeader('User-Agent', self::BROWSER_UA)
            ->get('/yazi/'.$post->slug)
            ->assertOk()
            ->getContent();

        $this->assertStringContainsString('<noscript>', $html, 'The no-JS copy should still be served.');
        $this->assertStringContainsString('FALLBACK-OZET-METNI', $html);
        $this->assertStringNotContainsString(
            'FALLBACK-OZET-METNI',
            $this->paintedMarkup($html),
            'Fallback text outside <noscript> is what caused the flash.'
        );
    }

    #[Test]
    public function a_crawler_gets_the_fallback_inline(): void
    {
        $post = $this->publishedPost();

        $html = $this->withHeader('User-Agent', self::CRAWLER_UA)
            ->get('/yazi/'.$post->slug)
            ->assertOk()
            ->getContent();

        $this->assertStringContainsString(
            'FALLBACK-OZET-METNI',
            $this->paintedMarkup($html),
            'Crawlers must keep reading the fallback without executing JavaScript.'
        );
    }

    #[Test]
    public function listing_pages_follow_the_same_split(): void
    {
        $this->publishedPost();

        foreach (['/', '/yazilar'] as $url) {
            $browser = $this->withHeader('User-Agent', self::BROWSER_UA)->get($url)->getContent();
            $crawler = $this->withHeader('User-Agent', self::CRAWLER_UA)->get($url)->getContent();

            $this->assertStringNotContainsString(
                'Fallback Testi',
                $this->paintedMarkup($browser),
                "Browser painted fallback markup on {$url}"
            );
            $this->assertStringContainsString(
                'Fallback Testi',
                $this->paintedMarkup($crawler),
                "Crawler lost the fallback on {$url}"
            );
        }
    }

    #[Test]
    public function the_public_cache_header_varies_on_user_agent(): void
    {
        $post = $this->publishedPost();

        $response = $this->withHeader('User-Agent', self::BROWSER_UA)->get('/yazi/'.$post->slug);

        $response->assertOk();
        $this->assertStringContainsString('s-maxage', (string) $response->headers->get('Cache-Control'));
        $this->assertStringContainsString('User-Agent', (string) $response->headers->get('Vary'));
    }
}
