<?php

namespace App\Services;

use App\Models\AiConversation;
use App\Models\AiMessage;
use App\Models\Post;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AiRecommendationService
{
    public function chat(AiConversation $conversation, string $userMessage): array
    {
        $conversation->messages()->create([
            'role' => 'user',
            'content' => $userMessage,
            'created_at' => now(),
        ]);

        $userTurns = (int) $conversation->messages()->where('role', 'user')->count();
        $postContext = $this->buildPostContext($userMessage);

        // Birincil yol: Vertex AI Search Discovery Engine
        if (config('services.gcp.search_enabled')) {
            $vertexResult = $this->vertexChat($conversation, $userMessage, $postContext, $userTurns);
            if ($vertexResult !== null) {
                return $vertexResult;
            }
        }

        // Vertex kapalı veya başarısız olursa: statik fallback (DB'den keyword eşleşmesi)
        return $this->createFallbackResponse($conversation, $userMessage, $postContext, $userTurns);
    }

    /**
     * Vertex AI Search Discovery Engine ile grounded cevap üret.
     * AiMessage create eder, Vue'nun beklediği shape döner.
     * Vertex tamamen başarısızsa null döner (fallback'e bırak).
     */
    private function vertexChat(AiConversation $conversation, string $userMessage, array $postContext, int $userTurns): ?array
    {
        try {
            // Çoklu turn için session sürekliliği: ilk assistant mesajındaki meta'da saklı
            $sessionId = optional(
                $conversation->messages()->where('role', 'assistant')->whereNotNull('meta')->latest()->first()
            )?->meta['vertex_session'] ?? null;

            $vertex = app(\App\Services\VertexAiSearchService::class);
            $result = $vertex->answer($userMessage, $sessionId);

            $answerText = trim((string) ($result['answer'] ?? ''));
            if ($answerText === '') {
                return null;
            }

            // Citations → site_posts (id, slug, title)
            $citationIds = collect($result['citations'] ?? [])
                ->pluck('id')
                ->filter()
                ->map(fn ($id) => (int) $id)
                ->unique()
                ->values()
                ->all();

            $sitePosts = [];
            $recommendedIds = [];
            if (!empty($citationIds)) {
                $posts = Post::whereIn('id', $citationIds)
                    ->published()
                    ->get(['id', 'slug', 'title', 'excerpt'])
                    ->keyBy('id');

                foreach ($citationIds as $cid) {
                    if (!$posts->has($cid)) {
                        continue;
                    }
                    $p = $posts->get($cid);
                    $sitePosts[] = [
                        'id' => $p->id,
                        'slug' => $p->slug,
                        'title' => $p->title,
                        'excerpt' => $p->excerpt,
                    ];
                    $recommendedIds[] = $p->id;
                }
            }

            // Vue UI follow-up önerileri bekliyor — mevcut helper'la üret
            $followUps = $this->defaultFollowUpOptions($userMessage);

            $meta = [
                'site_posts' => $sitePosts,
                'external_suggestions' => [], // Vertex external önermez, sadece grounding
                'follow_up_options' => $followUps,
                'engine' => 'vertex',
                'vertex_session' => $result['session'] ?? $sessionId,
            ];

            $assistantMsg = $conversation->messages()->create([
                'role' => 'assistant',
                'content' => $answerText,
                'recommended_post_ids' => $recommendedIds ?: null,
                'meta' => $meta,
                'created_at' => now(),
            ]);

            return [
                'message' => $assistantMsg,
                'recommended_posts' => $sitePosts,
            ];
        } catch (\Throwable $e) {
            Log::error('Vertex chat failed in Ne İzlesem', ['error' => $e->getMessage()]);
            return null;
        }
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
