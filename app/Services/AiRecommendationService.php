<?php

namespace App\Services;

use App\Models\AiConversation;
use App\Models\AiMessage;
use App\Models\Post;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiRecommendationService
{
    private string $apiKey;
    private string $model;

    public function __construct()
    {
        $this->apiKey = config('services.anthropic.api_key', '');
        $this->model = config('services.anthropic.model', 'claude-sonnet-4-5-20250514');
    }

    public function chat(AiConversation $conversation, string $userMessage): array
    {
        $userMsg = $conversation->messages()->create([
            'role' => 'user',
            'content' => $userMessage,
            'created_at' => now(),
        ]);

        $postContext = $this->buildPostContext($userMessage);
        $conversationHistory = $this->buildConversationHistory($conversation);

        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type' => 'application/json',
            ])->timeout(30)->post('https://api.anthropic.com/v1/messages', [
                'model' => $this->model,
                'max_tokens' => 1024,
                'system' => $this->buildSystemPrompt($postContext),
                'messages' => $conversationHistory,
            ]);

            if (!$response->successful()) {
                Log::error('Anthropic API error', ['status' => $response->status(), 'body' => $response->body()]);
                return $this->createErrorResponse($conversation);
            }

            $data = $response->json();
            $assistantContent = $data['content'][0]['text'] ?? 'Bir hata olustu, lutfen tekrar deneyin.';

            $recommendedIds = $this->extractPostIds($assistantContent, $postContext);

            $assistantMsg = $conversation->messages()->create([
                'role' => 'assistant',
                'content' => $assistantContent,
                'recommended_post_ids' => $recommendedIds ?: null,
                'created_at' => now(),
            ]);

            $recommendedPosts = [];
            if ($recommendedIds) {
                $recommendedPosts = Post::whereIn('id', $recommendedIds)
                    ->published()
                    ->with(['user', 'categories'])
                    ->get()
                    ->toArray();
            }

            return [
                'message' => $assistantMsg,
                'recommended_posts' => $recommendedPosts,
            ];
        } catch (\Exception $e) {
            Log::error('AI recommendation error', ['error' => $e->getMessage()]);
            return $this->createErrorResponse($conversation);
        }
    }

    private function buildSystemPrompt(array $posts): string
    {
        $postList = collect($posts)->map(function ($p) {
            $cats = collect($p['categories'] ?? [])->pluck('name')->join(', ');
            $moods = is_array($p['mood_tags'] ?? null) ? implode(', ', $p['mood_tags']) : '';
            return "[ID:{$p['id']}] {$p['title']} | Kategori: {$cats} | Ruh hali: {$moods} | Sure: {$p['duration_category']} | Yogunluk: {$p['intensity_level']} | Ozet: {$p['excerpt']}";
        })->join("\n");

        return <<<PROMPT
Sen "Ben Izledim" sitesinin film ve dizi oneri asistanisin. Turkce konusuyorsun.

Gorevlerin:
1. Kullanicinin ruh haline, zamanina ve tercihlerine gore film/dizi onermek
2. Sitedeki mevcut yazilari oncelikli olarak onermek (asagidaki liste)
3. Listede uygun icerik yoksa genel bilgine dayanarak oneri yapmak
4. Kisa, samimi ve eglenceli bir dilde yazmak

Mevcut yazilar:
{$postList}

Onemli kurallar:
- Sitedeki yazilardan onerirken [ID:X] formatini kullan ki sisteme baglayabilelim
- Kullaniciya en fazla 3-4 oneri ver, aciklama ekle
- Spoiler verme
- Kullanici "merhaba" veya genel sohbet yaparsa kisa ve sicak karsilik ver, hemen film sormaya basla
PROMPT;
    }

    private function buildPostContext(string $query): array
    {
        return Post::published()
            ->with('categories')
            ->select('id', 'title', 'excerpt', 'mood_tags', 'duration_category', 'intensity_level')
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
            ->map(fn ($m) => ['role' => $m->role, 'content' => $m->content])
            ->toArray();
    }

    private function extractPostIds(string $content, array $posts): array
    {
        preg_match_all('/\[ID:(\d+)\]/', $content, $matches);
        $ids = array_map('intval', $matches[1] ?? []);
        $validIds = collect($posts)->pluck('id')->toArray();
        return array_values(array_intersect($ids, $validIds));
    }

    private function createErrorResponse(AiConversation $conversation): array
    {
        $msg = $conversation->messages()->create([
            'role' => 'assistant',
            'content' => 'Uzgunum, su anda onerilerime ulasilamadi. Lutfen biraz sonra tekrar deneyin.',
            'created_at' => now(),
        ]);

        return ['message' => $msg, 'recommended_posts' => []];
    }
}
