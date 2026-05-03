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
        $this->apiKey = config('services.gemini.api_key', '');
        $this->model = config('services.gemini.text_model', 'gemini-2.5-flash');
    }

    public function chat(AiConversation $conversation, string $userMessage): array
    {
        $userMsg = $conversation->messages()->create([
            'role' => 'user',
            'content' => $userMessage,
            'created_at' => now(),
        ]);

        if (blank($this->apiKey)) {
            Log::error('Gemini API key is not configured');
            return $this->createErrorResponse($conversation);
        }

        $postContext = $this->buildPostContext($userMessage);
        $conversationHistory = $this->buildConversationHistory($conversation);

        try {
            $response = Http::timeout(30)->post($this->endpoint(), [
                'systemInstruction' => [
                    'parts' => [
                        ['text' => $this->buildSystemPrompt($postContext)],
                    ],
                ],
                'contents' => $conversationHistory,
                'generationConfig' => [
                    'maxOutputTokens' => 2048,
                    'temperature' => 0.8,
                ],
            ]);

            if (!$response->successful()) {
                Log::error('Gemini API error', ['status' => $response->status(), 'body' => $response->body()]);
                return $this->createErrorResponse($conversation);
            }

            $data = $response->json();
            $assistantContent = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Bir hata oluştu, lütfen tekrar deneyin.';

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

    private function endpoint(): string
    {
        return 'https://generativelanguage.googleapis.com/v1beta/models/'.$this->model.':generateContent?key='.$this->apiKey;
    }

    private function buildSystemPrompt(array $posts): string
    {
        $postList = collect($posts)->map(function ($p) {
            $cats = collect($p['categories'] ?? [])->pluck('name')->join(', ');
            $moods = is_array($p['mood_tags'] ?? null) ? implode(', ', $p['mood_tags']) : '';
            return "[ID:{$p['id']}] {$p['title']} | Kategori: {$cats} | Ruh hali: {$moods} | Süre: {$p['duration_category']} | Yoğunluk: {$p['intensity_level']} | Özet: {$p['excerpt']}";
        })->join("\n");

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

Mevcut yazılar:
{$postList}

Kurallar:
- Sitedeki yazılardan önerirken [ID:X] formatını kullan (örn: [ID:42])
- En fazla 3-4 öneri ver, her biri için 1-2 cümle açıklama ekle
- **Spoiler verme** — kesinlikle hikaye detayı paylaşma
- Önerileri **kalın** yazarak vurgula (örn: **Film Adı**)
- Kullanıcı selamlama yaparsa kısa ve sıcak karşılık ver, sonra ne tarz bir şey izlemek istediğini sor
- Cevaplarını düzenli ve okunabilir yaz, uzun paragraflar yerine kısa maddeler kullan
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

    private function createErrorResponse(AiConversation $conversation): array
    {
        $msg = $conversation->messages()->create([
            'role' => 'assistant',
            'content' => 'Üzgünüm, şu anda önerilerime ulaşılamıyor. Lütfen biraz sonra tekrar deneyin.',
            'created_at' => now(),
        ]);

        return ['message' => $msg, 'recommended_posts' => []];
    }
}
