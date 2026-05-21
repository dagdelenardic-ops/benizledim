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
    @php
        $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page);

        $fmtDate = function ($iso) {
            if (! $iso) return null;
            try { return \Carbon\Carbon::parse($iso)->locale('tr')->translatedFormat('d F Y'); }
            catch (\Throwable $e) { return null; }
        };
        $contentSafe = function ($html) {
            $allowed = '<p><br><h2><h3><h4><strong><em><b><i><a><ul><ol><li><blockquote>';
            $stripped = strip_tags((string) $html, $allowed);
            return preg_replace('/\s+(class|style|id|onclick|onload|onerror)="[^"]*"/i', '', $stripped);
        };
    @endphp

    @if ($__inertiaSsrResponse)
        {!! $__inertiaSsrResponse->body !!}
    @else
        <div id="app" data-page="{{ json_encode($page) }}">
            {{-- SEO fallback: bot ve JS-siz kullanıcılar için ilk-paint HTML içerik. Vue mount edince üzerine yazar. --}}
            @if ($component === 'Post/Show' && ! empty($props['post']))
                @php $p = $props['post']; @endphp
                <main>
                    <article>
                        <h1>{{ $clean($p['title'] ?? '') }}</h1>
                        @if (! empty($p['excerpt']))
                            <p>{{ $clean($p['excerpt']) }}</p>
                        @endif
                        <p>
                            @if (! empty($p['user']['name']))
                                <span>Yazar: <a href="{{ $base }}/yazar/{{ $p['user']['slug'] ?? '' }}">{{ $clean($p['user']['name']) }}</a></span>
                            @endif
                            @if (! empty($p['published_at']) && ($d = $fmtDate($p['published_at'])))
                                <time datetime="{{ $p['published_at'] }}">{{ $d }}</time>
                            @endif
                        </p>
                        @if (! empty($p['categories']))
                            <p>
                                @foreach ($p['categories'] as $cat)
                                    <a href="{{ $base }}/yazilar/{{ $cat['slug'] }}">{{ $clean($cat['name']) }}</a>
                                @endforeach
                            </p>
                        @endif
                        @if (! empty($p['content']))
                            <div>{!! $contentSafe($p['content']) !!}</div>
                        @endif
                    </article>
                </main>
            @elseif ($component === 'FlashNews/Show' && ! empty($props['item']))
                @php $it = $props['item']; @endphp
                <main>
                    <article>
                        <h1>{{ $clean($it['title_tr'] ?? '') }}</h1>
                        @if (! empty($it['published_at']) && ($d = $fmtDate($it['published_at'])))
                            <p><time datetime="{{ $it['published_at'] }}">{{ $d }}</time>@if (! empty($it['source_name'])) — Kaynak: {{ $clean($it['source_name']) }}@endif</p>
                        @endif
                        @if (! empty($it['summary_tr']))
                            <p>{{ $clean($it['summary_tr']) }}</p>
                        @endif
                        @if (! empty($it['content_tr']))
                            <div>{!! $contentSafe($it['content_tr']) !!}</div>
                        @endif
                    </article>
                </main>
            @elseif ($component === 'Post/Index')
                <main>
                    <h1>{{ $clean($props['title'] ?? 'Yazılar') }}</h1>
                    @if (! empty($props['description']))
                        <p>{{ $clean($props['description']) }}</p>
                    @endif
                    @php $postList = $props['posts']['data'] ?? ($props['posts'] ?? []); @endphp
                    @if (! empty($postList))
                        <ul>
                            @foreach ($postList as $p)
                                <li>
                                    <a href="{{ $base }}/yazi/{{ $p['slug'] ?? '' }}"><strong>{{ $clean($p['title'] ?? '') }}</strong></a>
                                    @if (! empty($p['excerpt']))
                                        <p>{{ $clean($p['excerpt'], 200) }}</p>
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                    @endif
                </main>
            @elseif ($component === 'FlashNews/Index')
                <main>
                    <h1>{{ $clean($props['title'] ?? 'Sinema ve Dizi Haberleri') }}</h1>
                    @if (! empty($props['description']))
                        <p>{{ $clean($props['description']) }}</p>
                    @endif
                    @php $newsList = $props['items']['data'] ?? ($props['items'] ?? []); @endphp
                    @if (! empty($newsList))
                        <ul>
                            @foreach ($newsList as $it)
                                <li>
                                    <a href="{{ $base }}/haber/{{ $it['slug'] ?? '' }}"><strong>{{ $clean($it['title_tr'] ?? '') }}</strong></a>
                                    @if (! empty($it['summary_tr']))
                                        <p>{{ $clean($it['summary_tr'], 200) }}</p>
                                    @endif
                                </li>
                            @endforeach
                        </ul>
                    @endif
                </main>
            @elseif ($component === 'Home')
                <main>
                    <h1>Ben İzledim</h1>
                    <p>{{ $defaultDesc }}</p>
                    @php $homePosts = $props['posts']['data'] ?? ($props['posts'] ?? []); @endphp
                    @if (! empty($homePosts))
                        <section>
                            <h2>Son Yazılar</h2>
                            <ul>
                                @foreach (array_slice($homePosts, 0, 12) as $p)
                                    <li>
                                        <a href="{{ $base }}/yazi/{{ $p['slug'] ?? '' }}">{{ $clean($p['title'] ?? '') }}</a>
                                        @if (! empty($p['excerpt']))
                                            — {{ $clean($p['excerpt'], 140) }}
                                        @endif
                                    </li>
                                @endforeach
                            </ul>
                        </section>
                    @endif
                    @php $homeNews = $props['flashNews']['data'] ?? ($props['flashNews'] ?? []); @endphp
                    @if (! empty($homeNews))
                        <section>
                            <h2>Sinema ve Dizi Haberleri</h2>
                            <ul>
                                @foreach (array_slice($homeNews, 0, 10) as $it)
                                    <li><a href="{{ $base }}/haber/{{ $it['slug'] ?? '' }}">{{ $clean($it['title_tr'] ?? '') }}</a></li>
                                @endforeach
                            </ul>
                        </section>
                    @endif
                </main>
            @endif
        </div>
    @endif
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
