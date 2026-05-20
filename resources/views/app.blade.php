<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#dc2626">
    <meta name="color-scheme" content="light">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Ben/İzledim">
    <meta name="application-name" content="Ben/İzledim">
    <meta name="msapplication-TileColor" content="#dc2626">
    <meta name="msapplication-TileImage" content="/icons/144.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/192.png">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/180.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/icons/152.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/icons/144.png">
    <link rel="manifest" href="/build/manifest.webmanifest">
    @php
        use Illuminate\Support\Str;

        $ip = $page ?? [];
        $component = $ip['component'] ?? '';
        $props = $ip['props'] ?? [];

        $base = 'https://benizledim.com';
        $defaultTitle = 'Ben İzledim - Film, Dizi ve Belgesel Eleştiri Platformu';
        $defaultDesc = 'Film, dizi ve belgeseller hakkında eleştiri, inceleme ve tavsiye yazıları. Ne izleyeceğine Ben İzledim ile karar ver.';
        $defaultImage = $base . '/images/og-default.png';

        $clean = function ($v, $limit = 0) {
            $v = trim(preg_replace('/\s+/', ' ', html_entity_decode(strip_tags((string) $v), ENT_QUOTES, 'UTF-8')));
            if ($limit > 0 && mb_strlen($v) > $limit) {
                $v = rtrim(mb_substr($v, 0, $limit - 1)) . '…';
            }
            return $v;
        };
        $abs = function ($url) use ($base) {
            $url = trim((string) $url);
            if ($url === '') return '';
            if (Str::startsWith($url, ['http://', 'https://'])) return $url;
            return $base . '/' . ltrim($url, '/');
        };

        // Path-tabanlı canonical: tracking query'leri (fbclid, utm_*, ref) at,
        // sadece sayfalama ?page=N koru. getRequestUri query'yi içeriyordu ve
        // Facebook/UTM paylaşımlarında "duplicate canonical" hatasına yol açıyordu.
        $path = rtrim((string) request()->getPathInfo(), '/');
        $path = $path === '' ? '/' : $path;
        $pageNum = (int) request()->query('page', 0);
        $canonical = $base . $path;
        if ($pageNum > 1) { $canonical .= '?page=' . $pageNum; }

        $title = $defaultTitle;
        $desc = $defaultDesc;
        $image = $defaultImage;
        $ogType = 'website';
        $authorName = null;
        $publishedTime = null;

        $schema = [[
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => 'Ben İzledim',
            'url' => $base,
            'description' => $defaultDesc,
            'inLanguage' => 'tr-TR',
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => $base . '/ara?q={search_term_string}',
                'query-input' => 'required name=search_term_string',
            ],
        ]];

        if ($component === 'Post/Show' && ! empty($props['post'])) {
            $post = $props['post'];
            $t = $clean($post['title'] ?? '');
            $title = $t !== '' ? $t . ' - Ben İzledim' : $defaultTitle;
            $ex = $clean($post['excerpt'] ?? '', 160);
            $desc = $ex !== '' ? $ex : $defaultDesc;
            $image = $abs($post['cover_image'] ?? '') ?: $defaultImage;
            $canonical = $base . '/yazi/' . ($post['slug'] ?? '');
            $ogType = 'article';
            $authorName = data_get($post, 'user.name');
            $publishedTime = $post['published_at'] ?? null;
            $schema[] = array_filter([
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $t,
                'description' => $ex,
                'image' => $image ? [$image] : null,
                'datePublished' => $post['published_at'] ?? null,
                'dateModified' => $post['updated_at'] ?? ($post['published_at'] ?? null),
                'inLanguage' => 'tr-TR',
                'author' => ['@type' => 'Person', 'name' => $authorName ?: 'Ben İzledim'],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => 'Ben İzledim',
                    'url' => $base,
                    'logo' => ['@type' => 'ImageObject', 'url' => $base . '/icons/512.png'],
                ],
                'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $canonical],
                'articleSection' => data_get($post, 'categories.0.name'),
            ], fn ($v) => $v !== null && $v !== '');
        } elseif ($component === 'FlashNews/Show' && ! empty($props['item'])) {
            $it = $props['item'];
            $t = $clean($it['title_tr'] ?? '');
            $title = $t !== '' ? $t . ' - Ben İzledim' : $defaultTitle;
            $sd = $clean($it['summary_tr'] ?? '', 160);
            $desc = $sd !== '' ? $sd : $defaultDesc;
            $image = $abs($it['image_url'] ?? '') ?: $defaultImage;
            $canonical = $base . '/haber/' . ($it['slug'] ?? '');
            $ogType = 'article';
            $publishedTime = $it['published_at'] ?? null;
            $schema[] = array_filter([
                '@context' => 'https://schema.org',
                '@type' => 'NewsArticle',
                'headline' => $t,
                'description' => $sd,
                'image' => $image ? [$image] : null,
                'datePublished' => $it['published_at'] ?? null,
                'inLanguage' => 'tr-TR',
                'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $canonical],
                'publisher' => [
                    '@type' => 'Organization',
                    'name' => 'Ben İzledim',
                    'url' => $base,
                    'logo' => ['@type' => 'ImageObject', 'url' => $base . '/icons/512.png'],
                ],
            ], fn ($v) => $v !== null && $v !== '');
        } else {
            if (! empty($props['title'])) {
                $title = $clean($props['title']) . ' - Ben İzledim';
            }
            if (! empty($props['description'])) {
                $desc = $clean($props['description'], 200);
            }
            if (! empty($props['ogImage'])) {
                $image = $abs($props['ogImage']) ?: $defaultImage;
            }
            if (! empty($props['canonicalUrl'])) {
                $canonical = $props['canonicalUrl'];
            }
        }

        $jsonLd = function ($node) {
            return str_replace('</', '<\/', json_encode($node, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
        };
    @endphp
    <title>{{ $title }}</title>
    <meta name="description" content="{{ $desc }}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
    <meta name="googlebot" content="index, follow">
    <link rel="canonical" href="{{ $canonical }}">
    <meta property="og:site_name" content="Ben İzledim">
    <meta property="og:locale" content="tr_TR">
    <meta property="og:type" content="{{ $ogType }}">
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:description" content="{{ $desc }}">
    <meta property="og:url" content="{{ $canonical }}">
    <meta property="og:image" content="{{ $image }}">
    @if($ogType === 'article' && $publishedTime)
    <meta property="article:published_time" content="{{ $publishedTime }}">
    @endif
    @if($authorName)
    <meta name="author" content="{{ $authorName }}">
    @endif
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ $title }}">
    <meta name="twitter:description" content="{{ $desc }}">
    <meta name="twitter:image" content="{{ $image }}">
    @foreach($schema as $node)
    <script type="application/ld+json">{!! $jsonLd($node) !!}</script>
    @endforeach
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @inertiaHead
</head>
<body class="font-sans antialiased bg-white text-gray-900">
    @inertia
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          // Register at root so scope = '/'. Push subscriptions and
          // navigator.serviceWorker.ready need the worker to control the page;
          // scoping it to /build/ caused the "yeni yazılardan haberdar ol"
          // prompt to hang forever on subscribe (ready never resolved).
          navigator.serviceWorker.register('/sw.js').catch((err) => {
            console.warn('SW register failed', err);
          });
        });
      }
    </script>
</body>
</html>
