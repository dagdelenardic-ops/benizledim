<?php

namespace App\Support;

/**
 * Shared user-agent screen for anything that counts a human visit.
 *
 * The list lived privately inside TrackPageView, so PostController's view
 * counter had no way to consult it and happily counted every crawler hit.
 */
class BotDetector
{
    /**
     * @var list<string>
     */
    private const PATTERNS = [
        'bot', 'spider', 'crawler', 'slurp', 'mediapartners',
        'facebookexternalhit', 'whatsapp', 'telegram', 'twitterbot',
        'linkedinbot', 'embedly', 'preview', 'pingdom', 'uptimerobot',
        'headlesschrome', 'phantomjs', 'puppeteer', 'lighthouse',
    ];

    /**
     * An absent user agent counts as automated: browsers always send one.
     */
    public static function isBot(?string $userAgent): bool
    {
        $ua = strtolower(trim((string) $userAgent));

        if ($ua === '') {
            return true;
        }

        foreach (self::PATTERNS as $pattern) {
            if (str_contains($ua, $pattern)) {
                return true;
            }
        }

        return false;
    }

    public static function isHuman(?string $userAgent): bool
    {
        return ! self::isBot($userAgent);
    }
}
