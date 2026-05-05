<?php

namespace App\Services;

use App\Models\AiConversation;
use App\Models\AiMessage;
use App\Models\Post;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiRecommendationService
{
    private string $apiKey;
    private string $model;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key', '');
        $this->model = config('services.gemini.text_model', 'gemini-2.5-flash');
    }

    public function chat(AiConversation $conversation, string $userMessage): array
    {
        $conversation->messages()->create([
            'role' => 'user',
            'content' => $userMessage,
            'created_at' => now(),
        ]);

        $userTurns = (int) $conversation->messages()->where('role', 'user')->count();
        $postContext = $this->buildPostContext($userMessage);

        if (blank($this->apiKey)) {
            return $this->createFallbackResponse($conversation, $userMessage, $postContext, $userTurns);
        }

        $conversationHistory = $this->buildConversationHistory($conversation);

        try {
            $response = Http::timeout(30)->post($this->endpoint(), [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => $this->buildSystemPrompt($postContext, $userTurns)],
                    ],
                ],
                'contents' => $conversationHistory,
                'generationConfig' => [
                    'maxOutputTokens' => 2048,
                    'temperature' => 0.8,
                    'responseMimeType' => 'application/json',
                ],
            ]);

            if (!$response->successful()) {
                Log::error('Gemini API error', ['status' => $response->status(), 'body' => $response->body()]);
                return $this->createFallbackResponse($conversation, $userMessage, $postContext, $userTurns);
            }

            $data = $response->json();
            $assistantContent = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
            $normalized = $this->normalizeAiPayload($assistantContent, $postContext, $userMessage, $userTurns);

            $assistantMsg = $conversation->messages()->create([
                'role' => 'assistant',
                'content' => $normalized['reply'],
                'recommended_post_ids' => $normalized['recommended_post_ids'] ?: null,
                'meta' => $normalized['meta'],
                'created_at' => now(),
            ]);

            return [
                'message' => $assistantMsg,
                'recommended_posts' => $normalized['meta']['site_posts'] ?? [],
            ];
        } catch (\Exception $e) {
            Log::error('AI recommendation error', ['error' => $e->getMessage()]);
            return $this->createFallbackResponse($conversation, $userMessage, $postContext, $userTurns);
        }
    }

    private function endpoint(): string
    {
        return 'https://generativelanguage.googleapis.com/v1beta/models/'.$this->model.':generateContent?key='.$this->apiKey;
    }

        private function buildSystemPrompt(array $posts, int $userTurns): string
    {
        $postList = collect($posts)->map(function ($p) {
            $cats = collect($p['categories'] ?? [])->pluck('name')->join(', ');
            $moods = is_array($p['mood_tags'] ?? null) ? implode(', ', $p['mood_tags']) : '';
                        return "[ID:{$p['id']}] {$p['title']} | Slug: {$p['slug']} | Kategori: {$cats} | Ruh hali: {$moods} | Süre: {$p['duration_category']} | Yoğunluk: {$p['intensity_level']} | Özet: {$p['excerpt']}";
        })->join("\n");

                $followUpRule = $userTurns < 4
                        ? 'follow_up_options alanina kullaniciyi yonlendirecek 2 ile 4 kisa secenek koy.'
                        : 'follow_up_options alanini bos dizi olarak don.';

        return <<<PROMPT
Sen "Ben İzledim" sitesinin sinema tutkunu öneri asistanısın. Adın yok, sadece "Ben İzledim asistanı" olarak tanıtıyorsun kendini.

Kişiliğin:
- Sinema ve dizi konusunda tutkulu, bilgili bir arkadaş gibi konuşuyorsun
- Türkçe konuşuyorsun, samimi ve sıcak bir dil kullanıyorsun
- Önerilerini heyecanla yapıyorsun, sanki bir arkadaşına film öneriyormuş gibi
- Kısa ama etkileyici cümleler kuruyorsun

Görevlerin:
1. Kullanıcının ruh haline, zamanına ve tercihlerine göre film/dizi önermek
2. Sitedeki mevcut yazıları öncelikli olarak önermek (aşağıdaki liste)
3. Listede uygun içerik yoksa genel sinema bilgine dayanarak öneri yapmak
4. Önerdiğin filmlerin neden o an için uygun olduğunu kısaca açıklamak
5. Siteden olmayan öneriler için yine de film veya dizi öner ve kullaniciya takip sorulari ac

Mevcut yazılar:
{$postList}

Kurallar:
- Yanitini yalnizca gecerli JSON olarak don
- JSON formati su olsun:
    {
        "reply": "Kullaniciya gosterilecek kisa ama sicak cevap",
        "site_post_ids": [12, 27],
        "external_suggestions": [
            {"title": "The Last of Us", "year": 2023, "type": "series", "reason": "..."}
        ],
        "follow_up_options": ["Daha karanlik olsun", "Film olsun, dizi degil"],
        "waiting_label": "Gerilim tartiyor"
    }
- site_post_ids alaninda yalnizca mevcut listeden ID kullan
- external_suggestions alaninda 1 ile 3 arasi site disi film/dizi onerisi ver
- Her oneride spoiler vermeden kisa neden yaz
- reply icinde [ID:X] kullanma, yalnizca duz okunur metin yaz
- En fazla 3-4 oneriden bahset
- **Spoiler verme** — kesinlikle hikaye detayı paylaşma
- Önerileri **kalın** yazarak vurgula (örn: **Film Adı**) — sistem bunları otomatik olarak link haline getirecek, sen sadece bold yaz
- Hem site_post_ids ile sectiklerini hem external_suggestions icindekileri reply metninde **kalın** olarak adlandır (sistem tutarlılık için her birini link yapacak)
- Kullanıcı selamlama yaparsa kısa ve sıcak karşılık ver, sonra ne tarz bir şey izlemek istediğini sor
- Cevaplarını düzenli ve okunabilir yaz, uzun paragraflar yerine kısa maddeler kullan
- {$followUpRule}
PROMPT;
    }

    private function buildPostContext(string $query): array
    {
        return Post::published()
            ->with('categories')
            ->select('id', 'slug', 'title', 'excerpt', 'cover_image', 'mood_tags', 'duration_category', 'intensity_level')
            ->latest('published_at')
            ->limit(30)
            ->get()
            ->toArray();
    }

    private function buildConversationHistory(AiConversation $conversation): array
    {
        return $conversation->messages()
            ->orderBy('created_at')
            ->get()
            ->map(fn ($m) => [
                'role' => $m->role === 'assistant' ? 'model' : $m->role,
                'parts' => [['text' => $m->content]],
            ])
            ->toArray();
    }

    private function extractPostIds(string $content, array $posts): array
    {
        preg_match_all('/\[ID:(\d+)\]/', $content, $matches);
        $ids = array_map('intval', $matches[1] ?? []);
        $validIds = collect($posts)->pluck('id')->toArray();
        return array_values(array_intersect($ids, $validIds));
    }

    private function normalizeAiPayload(string $payloadText, array $postContext, string $userMessage, int $userTurns): array
    {
        $decoded = json_decode($payloadText, true);

        if (!is_array($decoded)) {
            return $this->finalizePayload(
                trim($payloadText) ?: 'Sana birkaç iyi seçenek çıkardım.',
                $this->extractPostIds($payloadText, $postContext),
                [],
                [],
                $userMessage,
                $postContext,
                $userTurns,
            );
        }

        $recommendedIds = array_values(array_intersect(
            array_map('intval', $decoded['site_post_ids'] ?? []),
            collect($postContext)->pluck('id')->all(),
        ));

        if (empty($recommendedIds)) {
            $recommendedIds = $this->extractPostIds($payloadText, $postContext);
        }

        return $this->finalizePayload(
            trim((string) ($decoded['reply'] ?? '')) ?: 'Sana birkaç iyi seçenek çıkardım.',
            $recommendedIds,
            $decoded['external_suggestions'] ?? [],
            $decoded['follow_up_options'] ?? [],
            $userMessage,
            $postContext,
            $userTurns,
        );
    }

    private function finalizePayload(
        string $reply,
        array $recommendedIds,
        array $externalSuggestions,
        array $followUpOptions,
        string $userMessage,
        array $postContext,
        int $userTurns,
    ): array {
        $sitePosts = $this->loadRecommendedPosts($recommendedIds);
        $normalizedExternal = $this->normalizeExternalSuggestions($externalSuggestions);

        if (count($normalizedExternal) < 2) {
            $normalizedExternal = $this->mergeExternalSuggestions(
                $normalizedExternal,
                $this->pickExternalSuggestions($userMessage),
            );
        }

        $normalizedFollowUps = $userTurns < 4
            ? $this->normalizeFollowUpOptions($followUpOptions, $userMessage)
            : [];

        $enrichedReply = $this->enrichReplyWithLinks($reply, $sitePosts, $normalizedExternal);

        return [
            'reply' => $enrichedReply,
            'recommended_post_ids' => $recommendedIds,
            'meta' => [
                'site_posts' => $sitePosts,
                'external_suggestions' => $normalizedExternal,
                'follow_up_options' => $normalizedFollowUps,
                'turn_count' => $userTurns,
            ],
        ];
    }

    private function enrichReplyWithLinks(string $reply, array $sitePosts, array $externalSuggestions): string
    {
        $linkMap = [];

        foreach ($sitePosts as $post) {
            $title = trim((string) ($post['title'] ?? ''));
            $slug = trim((string) ($post['slug'] ?? ''));
            if ($title === '' || $slug === '') {
                continue;
            }
            $linkMap[$title] = '/yazi/' . $slug;
        }

        foreach ($externalSuggestions as $item) {
            $title = trim((string) ($item['title'] ?? ''));
            $url = trim((string) ($item['url'] ?? ''));
            if ($title === '' || $url === '') {
                continue;
            }
            if (!isset($linkMap[$title])) {
                $linkMap[$title] = $url;
            }
        }

        if (empty($linkMap)) {
            return $reply;
        }

        $titles = array_keys($linkMap);
        usort($titles, fn ($a, $b) => mb_strlen($b) <=> mb_strlen($a));

        foreach ($titles as $title) {
            $url = $linkMap[$title];
            $quoted = preg_quote($title, '/');

            $boldPattern = '/(?<!\[)\*\*\s*' . $quoted . '\s*\*\*(?!\])/u';
            $reply = preg_replace_callback($boldPattern, function () use ($title, $url) {
                return '[**' . $title . '**](' . $url . ')';
            }, $reply, 1);

            if (!str_contains($reply, '](' . $url . ')')) {
                $bareWordPattern = '/(?<![\w\[*\/])' . $quoted . '(?![\w\]\(*])/u';
                $reply = preg_replace_callback($bareWordPattern, function () use ($title, $url) {
                    return '[' . $title . '](' . $url . ')';
                }, $reply, 1);
            }
        }

        return $reply;
    }

    private function loadRecommendedPosts(array $recommendedIds): array
    {
        if (empty($recommendedIds)) {
            return [];
        }

        return Post::whereIn('id', $recommendedIds)
            ->published()
            ->with(['user', 'categories'])
            ->get()
            ->sortBy(fn (Post $post) => array_search($post->id, $recommendedIds, true))
            ->values()
            ->toArray();
    }

    private function normalizeExternalSuggestions(array $suggestions): array
    {
        return collect($suggestions)
            ->map(function ($item) {
                if (!is_array($item) || blank($item['title'] ?? null)) {
                    return null;
                }

                $title = trim((string) $item['title']);
                $year = isset($item['year']) ? (int) $item['year'] : null;
                $type = in_array(($item['type'] ?? 'film'), ['film', 'series'], true) ? $item['type'] : 'film';
                $reason = trim((string) ($item['reason'] ?? ''));

                return [
                    'title' => $title,
                    'year' => $year,
                    'type' => $type,
                    'reason' => $reason,
                    'url' => 'https://www.themoviedb.org/search?query='.urlencode($year ? $title.' '.$year : $title),
                ];
            })
            ->filter()
            ->unique(fn ($item) => Str::lower($item['title']))
            ->take(3)
            ->values()
            ->all();
    }

    private function normalizeFollowUpOptions(array $options, string $userMessage): array
    {
        $normalized = collect($options)
            ->filter(fn ($option) => is_string($option) && trim($option) !== '')
            ->map(fn ($option) => trim($option))
            ->unique()
            ->take(4)
            ->values()
            ->all();

        if (!empty($normalized)) {
            return $normalized;
        }

        return $this->defaultFollowUpOptions($userMessage);
    }

    private function createFallbackResponse(AiConversation $conversation, string $userMessage, array $postContext, int $userTurns): array
    {
        $payload = $this->buildFallbackPayload($userMessage, $postContext, $userTurns);

        $msg = $conversation->messages()->create([
            'role' => 'assistant',
            'content' => $payload['reply'],
            'recommended_post_ids' => $payload['recommended_post_ids'] ?: null,
            'meta' => $payload['meta'],
            'created_at' => now(),
        ]);

        return ['message' => $msg, 'recommended_posts' => $payload['meta']['site_posts'] ?? []];
    }

    private function buildFallbackPayload(string $userMessage, array $postContext, int $userTurns): array
    {
        $recommendedIds = $this->pickRelevantPostIds($userMessage, $postContext);
        $externalSuggestions = $this->pickExternalSuggestions($userMessage);
        $reply = $this->buildFallbackReply($userMessage, $recommendedIds, $externalSuggestions, $postContext);

        return $this->finalizePayload(
            $reply,
            $recommendedIds,
            $externalSuggestions,
            $this->defaultFollowUpOptions($userMessage),
            $userMessage,
            $postContext,
            $userTurns,
        );
    }

    private function pickRelevantPostIds(string $userMessage, array $postContext): array
    {
        $keywords = $this->keywordPool($userMessage);

        return collect($postContext)
            ->map(function ($post) use ($keywords) {
                $haystack = Str::lower(implode(' ', array_filter([
                    $post['title'] ?? '',
                    $post['excerpt'] ?? '',
                    implode(' ', array_column($post['categories'] ?? [], 'name')),
                    implode(' ', $post['mood_tags'] ?? []),
                    $post['duration_category'] ?? '',
                    $post['intensity_level'] ?? '',
                ])));

                $score = collect($keywords)->sum(fn ($keyword) => Str::contains($haystack, $keyword) ? 3 : 0);

                if (Str::contains($haystack, 'netflix') && in_array('netflix', $keywords, true)) {
                    $score += 2;
                }

                return ['id' => $post['id'], 'score' => $score];
            })
            ->sortByDesc('score')
            ->filter(fn ($item) => $item['score'] > 0)
            ->take(3)
            ->pluck('id')
            ->values()
            ->all();
    }

    private function pickExternalSuggestions(string $userMessage): array
    {
        $keywords = $this->keywordPool($userMessage);

        return collect($this->externalCatalog())
            ->map(function ($item) use ($keywords) {
                $score = collect($keywords)->sum(fn ($keyword) => in_array($keyword, $item['keywords'], true) ? 3 : 0);

                if (in_array($item['type'], $keywords, true)) {
                    $score += 2;
                }

                return $item + ['score' => $score];
            })
            ->sortByDesc('score')
            ->take(3)
            ->map(fn ($item) => [
                'title' => $item['title'],
                'year' => $item['year'],
                'type' => $item['type'],
                'reason' => $item['reason'],
            ])
            ->values()
            ->all();
    }

    private function buildFallbackReply(string $userMessage, array $recommendedIds, array $externalSuggestions, array $postContext): string
    {
        $siteTitles = collect($postContext)
            ->whereIn('id', $recommendedIds)
            ->pluck('title')
            ->take(2)
            ->map(fn ($title) => '**'.$title.'**')
            ->values();

        $externalTitles = collect($externalSuggestions)
            ->take(2)
            ->map(fn ($item) => '**'.$item['title'].'**')
            ->values();

        $parts = ['Tam senlik birkaç seçenek çıkardım.'];

        if ($siteTitles->isNotEmpty()) {
            $parts[] = 'Ben İzledim içinde '.$siteTitles->join(' ve ').' yazılarını açabilirsin.';
        }

        if ($externalTitles->isNotEmpty()) {
            $parts[] = 'Site dışında da '.$externalTitles->join(' ve ').' iyi gider.';
        }

        $parts[] = 'İstersen tonu daha karanlık, daha kısa ya da daha sert bir yere çekebilirim.';

        return implode(' ', $parts);
    }

    private function defaultFollowUpOptions(string $userMessage): array
    {
        $keywords = $this->keywordPool($userMessage);

        if (in_array('gerilim', $keywords, true)) {
            return ['Daha karanlık olsun', 'Dizi değil film olsun', 'Biraz daha psikolojik ver', 'Daha kısa bir şey öner'];
        }

        if (in_array('komedi', $keywords, true) || in_array('hafif', $keywords, true)) {
            return ['Daha absürt olsun', 'Ailece izlenebilsin', 'Dizi olsun', '90 dakika civarı olsun'];
        }

        return ['Film olsun', 'Dizi olsun', 'Biraz daha sertleşsin', 'Daha yeni yapımlar ver'];
    }

    private function mergeExternalSuggestions(array $primary, array $fallback): array
    {
        return collect([...$primary, ...$fallback])
            ->unique(fn ($item) => Str::lower($item['title']))
            ->take(3)
            ->values()
            ->all();
    }

    private function keywordPool(string $userMessage): array
    {
        $query = Str::lower($userMessage);

        $keywords = [
            'gerilim', 'korku', 'zombi', 'kıyamet', 'post-apokaliptik', 'psikolojik',
            'komedi', 'romantik', 'dram', 'suç', 'gizem', 'bilim kurgu', 'sci-fi',
            'anime', 'netflix', 'film', 'dizi', 'mini dizi', 'hafif', 'karanlık', 'aksiyon',
        ];

        return array_values(array_filter($keywords, fn ($keyword) => Str::contains($query, $keyword)));
    }

    private function externalCatalog(): array
    {
        return [
            ['title' => 'The Last of Us', 'year' => 2023, 'type' => 'series', 'keywords' => ['gerilim', 'zombi', 'kıyamet', 'post-apokaliptik', 'dizi'], 'reason' => 'Yüksek gerilim ve karakter ağırlığı birlikte gelsin istiyorsan tam bu çizgi.'],
            ['title' => 'The Walking Dead', 'year' => 2010, 'type' => 'series', 'keywords' => ['gerilim', 'zombi', 'kıyamet', 'dizi'], 'reason' => 'Daha uzun soluklu ve hayatta kalma hissi güçlü bir dünya kuruyor.'],
            ['title' => 'Severance', 'year' => 2022, 'type' => 'series', 'keywords' => ['gerilim', 'psikolojik', 'gizem', 'dizi'], 'reason' => 'Daha soğuk, daha tuhaf ve zihne oynayan bir gerilim istiyorsan çalışır.'],
            ['title' => 'Prisoners', 'year' => 2013, 'type' => 'film', 'keywords' => ['gerilim', 'karanlık', 'suç', 'gizem', 'film'], 'reason' => 'Karanlık ton ve diken üstünde tutan atmosfer arıyorsan çok sağlam gider.'],
            ['title' => 'Gone Girl', 'year' => 2014, 'type' => 'film', 'keywords' => ['gerilim', 'psikolojik', 'gizem', 'film'], 'reason' => 'Daha sinsi ve psikolojik bir gerilim damarı taşıyor.'],
            ['title' => 'The Bear', 'year' => 2022, 'type' => 'series', 'keywords' => ['dram', 'hafif', 'dizi'], 'reason' => 'Gerilim yerine yoğun ama akıcı bir karakter draması istiyorsan iyi çalışır.'],
            ['title' => 'Palm Springs', 'year' => 2020, 'type' => 'film', 'keywords' => ['komedi', 'romantik', 'hafif', 'film'], 'reason' => 'Hafif ama zeki bir şey arıyorsan çok rahat akar.'],
            ['title' => 'Knives Out', 'year' => 2019, 'type' => 'film', 'keywords' => ['gizem', 'komedi', 'film'], 'reason' => 'Daha eğlenceli ve parlak bir gizem istiyorsan temiz seçim.'],
            ['title' => 'Dune: Part Two', 'year' => 2024, 'type' => 'film', 'keywords' => ['bilim kurgu', 'sci-fi', 'film', 'aksiyon'], 'reason' => 'Büyük ölçekli bir dünya ve yoğun atmosfer arıyorsan bunu aç.'],
            ['title' => 'Blue Eye Samurai', 'year' => 2023, 'type' => 'series', 'keywords' => ['anime', 'aksiyon', 'dram', 'dizi'], 'reason' => 'Animasyon ama yetişkin tonu güçlü, tempolu ve şık.'],
        ];
    }
}
