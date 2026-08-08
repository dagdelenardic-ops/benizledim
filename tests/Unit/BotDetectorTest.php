<?php

namespace Tests\Unit;

use App\Support\BotDetector;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

class BotDetectorTest extends TestCase
{
    /**
     * @return list<array{0: ?string}>
     */
    public static function automatedAgents(): array
    {
        return [
            ['Googlebot/2.1 (+http://www.google.com/bot.html)'],
            ['Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'],
            ['Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)'],
            ['facebookexternalhit/1.1'],
            ['Twitterbot/1.0'],
            ['Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/126.0.0.0'],
            ['Mozilla/5.0 AppleWebKit/537.36 Chrome-Lighthouse'],
            // Browsers always send a user agent, so an absent one is automated.
            [''],
            ['   '],
            [null],
        ];
    }

    /**
     * @return list<array{0: string}>
     */
    public static function browserAgents(): array
    {
        return [
            ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'],
            ['Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'],
            ['Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0'],
        ];
    }

    #[Test]
    #[DataProvider('automatedAgents')]
    public function automated_agents_are_screened_out(?string $agent): void
    {
        $this->assertTrue(BotDetector::isBot($agent));
        $this->assertFalse(BotDetector::isHuman($agent));
    }

    #[Test]
    #[DataProvider('browserAgents')]
    public function browsers_are_not_screened_out(string $agent): void
    {
        $this->assertFalse(BotDetector::isBot($agent));
        $this->assertTrue(BotDetector::isHuman($agent));
    }
}
