<?php

namespace App\Services;

use App\Models\FlashNews;
use Carbon\Carbon;
use Google\Auth\CredentialsLoader;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class FlashNewsFetchService
{
    private const SOURCES = [
        // Yabancı (Sinema/dizi/eğlence)
        ['name' => 'Variety', 'url' => 'https://variety.com/v/film/feed/', 'lang' => 'en'],
        ['name' => 'Variety TV', 'url' => 'https://variety.com/v/tv/feed/', 'lang' => 'en'],
        ['name' => 'The Hollywood Reporter', 'url' => 'https://www.hollywoodreporter.com/feed/', 'lang' => 'en'],
        ['name' => 'Deadline', 'url' => 'https://deadline.com/feed/', 'lang' => 'en'],
        ['name' => 'IndieWire', 'url' => 'https://www.indiewire.com/feed/', 'lang' => 'en'],
        ['name' => 'ScreenDaily', 'url' => 'https://www.screendaily.com/XmlServers/navsectionRSS.aspx?navsectioncode=1000074', 'lang' => 'en'],
        ['name' => 'Collider', 'url' => 'https://collider.com/feed/', 'lang' => 'en'],
        ['name' => 'ScreenRant', 'url' => 'https://screenrant.com/feed/', 'lang' => 'en'],
        ['name' => 'SlashFilm', 'url' => 'https://www.slashfilm.com/feed/', 'lang' => 'en'],
        ['name' => 'Empire', 'url' => 'https://www.empireonline.com/feeds/all/', 'lang' => 'en'],
        ['name' => 'IGN Movies', 'url' => 'https://feeds.feedburner.com/ign/movies-all', 'lang' => 'en'],
        ['name' => 'IGN TV', 'url' => 'https://feeds.feedburner.com/ign/tv-articles', 'lang' => 'en'],
        ['name' => 'RogerEbert', 'url' => 'https://www.rogerebert.com/feed', 'lang' => 'en'],
        ['name' => 'The Wrap', 'url' => 'https://www.thewrap.com/feed/', 'lang' => 'en'],
        ['name' => 'BBC Entertainment', 'url' => 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', 'lang' => 'en'],
        ['name' => 'NYT Movies', 'url' => 'https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml', 'lang' => 'en'],
        ['name' => 'Guardian Film', 'url' => 'https://www.theguardian.com/film/rss', 'lang' => 'en'],
        ['name' => 'Guardian TV', 'url' => 'https://www.theguardian.com/tv-and-radio/rss', 'lang' => 'en'],
        ['name' => 'AV Club', 'url' => 'https://www.avclub.com/rss', 'lang' => 'en'],
        ['name' => 'Vulture', 'url' => 'https://www.vulture.com/rss/index.xml', 'lang' => 'en'],
        ['name' => 'Entertainment Weekly', 'url' => 'https://ew.com/feed/', 'lang' => 'en'],
        ['name' => 'Cartoon Brew', 'url' => 'https://www.cartoonbrew.com/feed', 'lang' => 'en'],
        ['name' => 'Anime News Network', 'url' => 'https://www.animenewsnetwork.com/all/rss.xml', 'lang' => 'en'],
        ['name' => 'Screen International', 'url' => 'https://www.screendaily.com/XmlServers/navsectionRSS.aspx?navsectioncode=1000003', 'lang' => 'en'],
        ['name' => 'Cineuropa', 'url' => 'https://cineuropa.org/rss.aspx?lang=en', 'lang' => 'en'],
        // Yerli
        ['name' => 'Beyazperde', 'url' => 'https://www.beyazperde.com/rss/haberler.xml', 'lang' => 'tr'],
        ['name' => 'Beyazperde Diziler', 'url' => 'https://www.beyazperde.com/rss/dizihaberler.xml', 'lang' => 'tr'],
        ['name' => 'Filmloverss', 'url' => 'https://filmloverss.com/feed/', 'lang' => 'tr'],
        ['name' => 'Sinema Sineması', 'url' => 'https://www.sinemasinemasi.com/feed/', 'lang' => 'tr'],
        ['name' => 'Bant Mag', 'url' => 'https://www.bantmag.com/feed/', 'lang' => 'tr'],
        ['name' => 'Yedinci Gemi', 'url' => 'https://yedincigemi.com/feed/', 'lang' => 'tr'],
        ['name' => 'NTV Sanat', 'url' => 'https://www.ntv.com.tr/sanat.rss', 'lang' => 'tr'],
        ['name' => 'CNN Türk Kültür Sanat', 'url' => 'https://www.cnnturk.com/feed/rss/kultur-sanat/news', 'lang' => 'tr'],
        ['name' => 'Hürriyet Kelebek', 'url' => 'https://www.hurriyet.com.tr/rss/kelebek', 'lang' => 'tr'],
        ['name' => 'Milliyet Magazin', 'url' => 'https://www.milliyet.com.tr/rss/rssNew/magazinRss.xml', 'lang' => 'tr'],
    ];

    private const MAX_PER_SOURCE = 2;

    private const GENERIC_SOURCES = [
        'BBC Entertainment', 'NYT Movies', 'Guardian Film', 'Guardian TV',
        'NTV Sanat', 'CNN Türk Kültür Sanat', 'Hürriyet Kelebek', 'Milliyet Magazin',
        'Vulture', 'Entertainment Weekly', 'AV Club',
    ];

    private const FILM_TV_KEYWORDS = [
        'film', 'movie', 'cinema', 'sinema', 'dizi', 'series', 'season', 'sezon',
        'netflix', 'hbo', 'disney', 'amazon prime', 'apple tv', 'paramount',
        'oscar', 'emmy', 'cannes', 'venice', 'berlinale', 'sundance', 'festival',
        'director', 'yönetmen', 'oyuncu', 'actor', 'actress', 'cast', 'trailer', 'fragman',
        'box office', 'gişe', 'premiere', 'gala', 'belgesel', 'documentary',
        'animasyon', 'animation', 'marvel', 'dc', 'star wars', 'pixar',
    ];

    public function fetchAndStore(int $maxSeconds = 90): array
    {
        $stats = [
            'fetched' => 0,
            'created' => 0,
            'skipped' => 0,
            'skipped_no_image' => 0,
            'errors' => 0,
            'stopped_by_budget' => false,
        ];
        $deadline = microtime(true) + $maxSeconds;

        $sources = self::SOURCES;
        shuffle($sources);

        foreach ($sources as $source) {
            if (microtime(true) >= $deadline) {
                $stats['stopped_by_budget'] = true;
                break;
            }
            try {
                $items = $this->fetchRss($source['url']);
                $stats['fetched'] += count($items);

                $isGeneric = in_array($source['name'], self::GENERIC_SOURCES, true);
                $kept = 0;
                foreach ($items as $item) {
                    if ($kept >= self::MAX_PER_SOURCE) {
                        break;
                    }
                    if (microtime(true) >= $deadline) {
                        $stats['stopped_by_budget'] = true;
                        break 2;
                    }
                    if (! $item['link']) {
                        continue;
                    }

                    if ($isGeneric && ! $this->looksFilmOrTv($item['title'].' '.$item['summary'])) {
                        continue;
                    }

                    if (FlashNews::where('source_url', $item['link'])->exists()) {
                        $stats['skipped']++;
                        $kept++;

                        continue;
                    }

                    $article = $this->fetchArticleData($item['link']);
                    $articleBody = $article['body'];

                    $imageUrl = $item['image'] ?: $article['image'];
                    if (! $imageUrl) {
                        $stats['skipped_no_image']++;

                        continue;
                    }
                    $imageUrl = $this->cleanImageUrl($imageUrl);

                    $titleTr = $item['title'];
                    $summaryTr = $item['summary'];
                    $contentTr = $articleBody ?: $item['summary'];

                    if ($source['lang'] !== 'tr') {
                        $translated = $this->translate($item['title'], $item['summary'], $articleBody);
                        if ($translated) {
                            $titleTr = $translated['title'];
                            $summaryTr = $translated['summary'];
                            $contentTr = $translated['content'] ?: $contentTr;
                        } else {
                            $stats['errors']++;

                            continue;
                        }
                    } elseif ($articleBody) {
                        $contentTr = $articleBody;
                    }

                    FlashNews::create([
                        'title_tr' => Str::limit($titleTr, 250, ''),
                        'title_original' => $source['lang'] !== 'tr' ? $item['title'] : null,
                        'slug' => $this->makeSlug($titleTr),
                        'summary_tr' => $summaryTr,
                        'content_tr' => $contentTr,
                        'source_url' => $item['link'],
                        'source_name' => $source['name'],
                        'image_url' => $imageUrl,
                        'original_language' => $source['lang'],
                        'source_published_at' => $item['pubDate'],
                        'published_at' => now(),
                        'is_published' => true,
                    ]);

                    $stats['created']++;
                    $kept++;
                }
            } catch (\Throwable $e) {
                Log::warning('FlashNews fetch failed', [
                    'source' => $source['name'],
                    'error' => $e->getMessage(),
                ]);
                $stats['errors']++;
            }
        }

        return $stats;
    }

    private function fetchRss(string $url): array
    {
        $response = Http::timeout(20)
            ->withHeaders(['User-Agent' => 'BenIzledimBot/1.0 (+https://benizledim.com)'])
            ->get($url);

        if (! $response->ok()) {
            return [];
        }

        $xml = @simplexml_load_string($response->body(), 'SimpleXMLElement', LIBXML_NOCDATA);
        if (! $xml) {
            return [];
        }

        $items = [];
        $channelItems = $xml->channel->item ?? $xml->item ?? $xml->entry ?? [];

        foreach ($channelItems as $node) {
            $title = trim((string) ($node->title ?? ''));
            $link = trim((string) ($node->link ?? ''));
            if (! $link && isset($node->link['href'])) {
                $link = (string) $node->link['href'];
            }
            $description = (string) ($node->description ?? $node->summary ?? '');
            $pubDate = (string) ($node->pubDate ?? $node->published ?? $node->updated ?? '');

            $image = $this->extractImage($node, $description);
            $summary = trim(strip_tags(html_entity_decode($description, ENT_QUOTES | ENT_HTML5, 'UTF-8')));
            $summary = Str::limit($summary, 600);

            if (! $title || ! $link) {
                continue;
            }

            $items[] = [
                'title' => html_entity_decode($title, ENT_QUOTES | ENT_HTML5, 'UTF-8'),
                'link' => $link,
                'summary' => $summary,
                'image' => $image,
                'pubDate' => $pubDate ? Carbon::parse($pubDate) : null,
            ];
        }

        return $items;
    }

    private function extractImage($node, string $description): ?string
    {
        $namespaces = $node->getNameSpaces(true);

        if (isset($namespaces['media'])) {
            $media = $node->children($namespaces['media']);
            if (isset($media->content) && isset($media->content['url'])) {
                return (string) $media->content['url'];
            }
            if (isset($media->thumbnail) && isset($media->thumbnail['url'])) {
                return (string) $media->thumbnail['url'];
            }
        }

        if (isset($node->enclosure) && isset($node->enclosure['url'])) {
            $type = (string) ($node->enclosure['type'] ?? '');
            if (! $type || str_starts_with($type, 'image/')) {
                return (string) $node->enclosure['url'];
            }
        }

        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $description, $m)) {
            return $m[1];
        }

        return null;
    }

    private function translate(string $title, string $summary, ?string $body = null): ?array
    {
        // Çeviri Vertex AI Gemini üzerinden yapılır (Gemini public API'si sistemden
        // kaldırıldı). Servis hesabı/ADC ile yetkilenir; kota Vertex'e bağlıdır.
        $token = $this->accessToken();
        if (! $token) {
            Log::warning('FlashNews: Vertex access token alınamadı');

            return null;
        }

        $projectId = (string) config('services.gcp.project_id');
        $location = (string) config('services.gcp.location', 'global');
        $model = (string) config('services.gcp.text_model', 'gemini-2.5-flash');
        $host = $location === 'global' ? 'aiplatform.googleapis.com' : "{$location}-aiplatform.googleapis.com";
        $endpoint = "https://{$host}/v1/projects/{$projectId}/locations/{$location}/publishers/google/models/{$model}:generateContent";
        $bodyTrimmed = $body ? Str::limit($body, 8000, '') : '';

        $prompt = "Aşağıdaki sinema/dizi haberini Türkçeye çevir. Akıcı, gazete üslubunda, doğal Türkçe. Film/dizi adlarını orijinal bırak (tırnak içinde, örn. 'The Boys'). Asla İngilizce paragraf bırakma — MAKALE alanındaki HER paragrafı eksiksiz Türkçeye çevir, hiçbirini atlama, kısaltma, özetleme. Tüm metni baştan sona doğal Türkçeye geçir.\n\n".
            "Sadece şu JSON formatında yanıt ver:\n".
            "{\n".
            "  \"title\": \"<Türkçe başlık, 8-15 kelime>\",\n".
            "  \"summary\": \"<3-5 cümlelik Türkçe özet, kart önizlemesi için>\",\n".
            "  \"content\": \"<Türkçe tam makale. Tüm paragraflar Türkçeye çevrilmiş olacak. Paragraflar arasında çift satır sonu (\\n\\n).>\"\n".
            "}\n\n".
            "BAŞLIK: {$title}\n\n".
            "ÖZET: {$summary}\n\n".
            ($bodyTrimmed ? "MAKALE (tüm paragrafları Türkçeye çevir):\n{$bodyTrimmed}\n\n" : '').
            'Eğer MAKALE alanı boşsa, content alanına başlık ve özetten yola çıkarak 2-3 paragraflık doğal Türkçe metin yaz, uydurma bilgi ekleme.';

        try {
            $response = Http::timeout(60)
                ->withToken($token)
                ->post(
                    $endpoint,
                    [
                        'contents' => [
                            ['role' => 'user', 'parts' => [['text' => $prompt]]],
                        ],
                        'generationConfig' => [
                            'temperature' => 0.3,
                            'responseMimeType' => 'application/json',
                            'maxOutputTokens' => 8192,
                        ],
                    ]
                );

            if (! $response->ok()) {
                Log::warning('FlashNews translate http error', ['status' => $response->status(), 'body' => Str::limit($response->body(), 400)]);

                return null;
            }

            $text = $response->json('candidates.0.content.parts.0.text');
            if (! $text) {
                Log::warning('FlashNews gemini empty', ['raw' => Str::limit((string) $response->body(), 300)]);

                return null;
            }

            $data = json_decode($text, true);
            if (! is_array($data) && preg_match('/\{.*\}/s', $text, $m)) {
                $data = json_decode($m[0], true);
            }

            if (! is_array($data)) {
                $title = $this->extractJsonField($text, 'title');
                $summary = $this->extractJsonField($text, 'summary');
                $content = $this->extractJsonField($text, 'content');
                if ($title && $summary) {
                    $data = ['title' => $title, 'summary' => $summary, 'content' => $content];
                }
            }

            if (is_array($data) && ! empty($data['title']) && ! empty($data['summary'])) {
                return [
                    'title' => $data['title'],
                    'summary' => $data['summary'],
                    'content' => $data['content'] ?? '',
                ];
            }

            Log::warning('FlashNews gemini parse fail', ['text_head' => mb_substr($text, 0, 300)]);

            return null;
        } catch (\Throwable $e) {
            Log::warning('FlashNews translate exception', ['error' => $e->getMessage()]);

            return null;
        }
    }

    /**
     * Vertex AI için cloud-platform erişim token'ı (servis hesabı/ADC).
     * VertexAiSearchService ile aynı kimlik bilgisi dosyasını kullanır.
     */
    private function accessToken(): ?string
    {
        $cached = Cache::get('vertex_ai_search_token');
        if (is_string($cached) && $cached !== '') {
            return $cached;
        }

        try {
            $path = config('services.gcp.credentials_path') ?: env('GOOGLE_APPLICATION_CREDENTIALS');
            if (! $path || ! file_exists($path)) {
                Log::error('FlashNews: Vertex credentials dosyası yok', ['path' => (string) $path]);

                return null;
            }

            $json = json_decode((string) file_get_contents($path), true);
            if (! is_array($json)) {
                Log::error('FlashNews: Vertex credentials JSON geçersiz', ['path' => $path]);

                return null;
            }

            $creds = CredentialsLoader::makeCredentials(
                'https://www.googleapis.com/auth/cloud-platform',
                $json
            );
            $token = $creds->fetchAuthToken();
            $accessToken = $token['access_token'] ?? null;

            if ($accessToken) {
                Cache::put('vertex_ai_search_token', $accessToken, now()->addMinutes(50));
            }

            return $accessToken;
        } catch (\Throwable $e) {
            Log::error('FlashNews: Vertex token alınamadı', ['error' => $e->getMessage()]);

            return null;
        }
    }

    private function fetchArticleData(string $url): array
    {
        $empty = ['body' => null, 'image' => null];

        try {
            $response = Http::timeout(10)
                ->withHeaders([
                    'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
                    'Accept' => 'text/html,application/xhtml+xml',
                    'Accept-Language' => 'en-US,en;q=0.9,tr;q=0.8',
                ])
                ->get($url);

            if (! $response->ok()) {
                return $empty;
            }

            $html = $response->body();
            $image = $this->extractImageFromHtml($html, $url);

            if (preg_match('/<article\b[^>]*>(.*?)<\/article>/is', $html, $m)) {
                $chunk = $m[1];
            } elseif (preg_match('/<main\b[^>]*>(.*?)<\/main>/is', $html, $m)) {
                $chunk = $m[1];
            } else {
                $chunk = $html;
            }

            $chunk = preg_replace('/<script\b[^>]*>.*?<\/script>/is', ' ', $chunk);
            $chunk = preg_replace('/<style\b[^>]*>.*?<\/style>/is', ' ', $chunk);
            $chunk = preg_replace('/<(figure|aside|nav|footer|header|form)\b[^>]*>.*?<\/\1>/is', ' ', $chunk);

            preg_match_all('/<p\b[^>]*>(.*?)<\/p>/is', $chunk, $matches);
            $paragraphs = [];
            foreach ($matches[1] as $p) {
                $text = trim(strip_tags(html_entity_decode($p, ENT_QUOTES | ENT_HTML5, 'UTF-8')));
                $text = preg_replace('/\s+/u', ' ', $text);
                if (mb_strlen($text) >= 50) {
                    $paragraphs[] = $text;
                }
                if (count($paragraphs) >= 20) {
                    break;
                }
            }

            $body = $paragraphs ? Str::limit(implode("\n\n", $paragraphs), 8000, '') : null;

            return ['body' => $body, 'image' => $image];
        } catch (\Throwable $e) {
            return $empty;
        }
    }

    private function extractImageFromHtml(string $html, string $pageUrl): ?string
    {
        // 1. og:image (en güvenilir)
        if (preg_match('/<meta[^>]+property=["\']og:image(?::secure_url)?["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $m)) {
            return $this->absoluteUrl($m[1], $pageUrl);
        }
        if (preg_match('/<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image(?::secure_url)?["\']/i', $html, $m)) {
            return $this->absoluteUrl($m[1], $pageUrl);
        }

        // 2. twitter:image
        if (preg_match('/<meta[^>]+name=["\']twitter:image(?::src)?["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $m)) {
            return $this->absoluteUrl($m[1], $pageUrl);
        }
        if (preg_match('/<meta[^>]+content=["\']([^"\']+)["\'][^>]+name=["\']twitter:image(?::src)?["\']/i', $html, $m)) {
            return $this->absoluteUrl($m[1], $pageUrl);
        }

        // 3. JSON-LD "image"
        if (preg_match_all('/<script[^>]+type=["\']application\/ld\+json["\'][^>]*>(.*?)<\/script>/is', $html, $blocks)) {
            foreach ($blocks[1] as $block) {
                $data = json_decode(trim($block), true);
                if (! is_array($data)) {
                    continue;
                }
                $found = $this->findJsonLdImage($data);
                if ($found) {
                    return $this->absoluteUrl($found, $pageUrl);
                }
            }
        }

        // 4. <article> içindeki ilk büyük <img>
        if (preg_match('/<article\b[^>]*>(.*?)<\/article>/is', $html, $m)) {
            if (preg_match_all('/<img\b[^>]+>/i', $m[1], $imgs)) {
                foreach ($imgs[0] as $tag) {
                    if (preg_match('/\b(width|height)\s*=\s*["\']?(\d+)/i', $tag, $dim) && (int) $dim[2] < 200) {
                        continue;
                    }
                    if (preg_match('/\bsrc=["\']([^"\']+)["\']/i', $tag, $src)) {
                        $url = $src[1];
                        if (str_starts_with($url, 'data:')) {
                            continue;
                        }

                        return $this->absoluteUrl($url, $pageUrl);
                    }
                }
            }
        }

        return null;
    }

    private function findJsonLdImage($data): ?string
    {
        if (! is_array($data)) {
            return null;
        }
        if (isset($data['image'])) {
            $img = $data['image'];
            if (is_string($img)) {
                return $img;
            }
            if (is_array($img)) {
                if (isset($img['url']) && is_string($img['url'])) {
                    return $img['url'];
                }
                foreach ($img as $entry) {
                    if (is_string($entry)) {
                        return $entry;
                    }
                    if (is_array($entry) && isset($entry['url']) && is_string($entry['url'])) {
                        return $entry['url'];
                    }
                }
            }
        }
        if (isset($data['@graph']) && is_array($data['@graph'])) {
            foreach ($data['@graph'] as $node) {
                $found = $this->findJsonLdImage($node);
                if ($found) {
                    return $found;
                }
            }
        }

        return null;
    }

    private function absoluteUrl(string $url, string $base): string
    {
        $url = trim($url);
        if (preg_match('#^https?://#i', $url)) {
            return $url;
        }
        if (str_starts_with($url, '//')) {
            return 'https:'.$url;
        }
        $parts = parse_url($base);
        if (! $parts || empty($parts['scheme']) || empty($parts['host'])) {
            return $url;
        }
        $origin = $parts['scheme'].'://'.$parts['host'];
        if (str_starts_with($url, '/')) {
            return $origin.$url;
        }
        $path = $parts['path'] ?? '/';
        $dir = rtrim(substr($path, 0, strrpos($path, '/') + 1), '/');

        return $origin.$dir.'/'.$url;
    }

    private function cleanImageUrl(string $url): string
    {
        $parts = parse_url($url);
        if (! $parts || empty($parts['query'])) {
            return $url;
        }
        parse_str($parts['query'], $params);
        $strip = ['w', 'h', 'width', 'height', 'resize', 'fit', 'crop', 'quality'];
        foreach ($strip as $k) {
            unset($params[$k]);
        }
        $query = http_build_query($params);
        $rebuilt = ($parts['scheme'] ?? 'https').'://'.($parts['host'] ?? '').($parts['path'] ?? '');
        if ($query !== '') {
            $rebuilt .= '?'.$query;
        }

        return $rebuilt;
    }

    private function extractJsonField(string $text, string $field): ?string
    {
        if (! preg_match('/"'.preg_quote($field, '/').'"\s*:\s*"((?:\\\\.|[^"\\\\])*)"/su', $text, $m)) {
            return null;
        }
        $raw = $m[1];
        $raw = str_replace(['\\n', '\\"', '\\\\', '\\/'], ["\n", '"', '\\', '/'], $raw);

        return $raw ?: null;
    }

    private function looksFilmOrTv(string $text): bool
    {
        $haystack = mb_strtolower($text, 'UTF-8');
        foreach (self::FILM_TV_KEYWORDS as $kw) {
            if (str_contains($haystack, $kw)) {
                return true;
            }
        }

        return false;
    }

    private function makeSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'haber';
        $slug = $base;
        $i = 2;
        while (FlashNews::where('slug', $slug)->exists()) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return Str::limit($slug, 200, '');
    }
}
