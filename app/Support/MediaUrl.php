<?php

namespace App\Support;

class MediaUrl
{
    public static function upgradeToOriginal(?string $url): ?string
    {
        if (!$url) {
            return $url;
        }

        // Wix CDN: strip /v1/(fill|fit|crop|focus|...)/<params>/<filename> tail
        // before:  https://static.wixstatic.com/media/abc~mv2.jpg/v1/fill/w_1000,h_541,.../abc~mv2.jpg
        // after:   https://static.wixstatic.com/media/abc~mv2.jpg
        if (preg_match('@^(https?://static\.wixstatic\.com/media/[^/]+)/v1/[^?]*@i', $url, $m)) {
            $url = $m[1];
        }

        // TMDB: /t/p/wNNN/ or /t/p/hNNN/ -> /t/p/original/
        $url = preg_replace('@(image\.tmdb\.org/t/p/)(?:w\d+|h\d+)/@i', '$1original/', $url);

        return $url;
    }

    public static function isUpgradable(?string $url): bool
    {
        return $url !== self::upgradeToOriginal($url);
    }

    public static function extension(string $url, string $default = 'jpg'): string
    {
        $ext = strtolower((string) pathinfo(parse_url($url, PHP_URL_PATH) ?? '', PATHINFO_EXTENSION));
        return preg_match('/^(jpg|jpeg|png|webp|gif|avif)$/', $ext) ? $ext : $default;
    }
}
