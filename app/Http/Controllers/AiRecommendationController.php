<?php

namespace App\Http\Controllers;

use App\Models\AiConversation;
use App\Models\AiMessage;
use App\Services\AiRecommendationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AiRecommendationController extends Controller
{
    public function index(Request $request)
    {
        [$userId, $visitorId] = $this->resolveOwner($request);

        $conversationId = $request->integer('conversation_id') ?: null;

        if ($conversationId) {
            $conversation = AiConversation::forOwner($userId, $visitorId)
                ->where('id', $conversationId)
                ->with('messages')
                ->first();
        } else {
            $conversation = AiConversation::forOwner($userId, $visitorId)
                ->with('messages')
                ->latest('updated_at')
                ->first();
        }

        $conversations = AiConversation::forOwner($userId, $visitorId)
            ->withCount('messages')
            ->latest('updated_at')
            ->limit(20)
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'title' => $c->title ?: 'Sohbet #'.$c->id,
                'created_at' => $c->created_at?->diffForHumans(),
                'message_count' => $c->messages_count,
            ]);

        return Inertia::render('Recommend/Index', [
            'messages' => $conversation?->messages ?? collect(),
            'conversationId' => $conversation?->id,
            'conversations' => $conversations,
        ]);
    }

    public function chat(Request $request, AiRecommendationService $service)
    {
        $request->validate([
            'message' => 'required|string|max:500',
            'conversation_id' => 'nullable|integer|exists:ai_conversations,id',
        ]);

        [$userId, $visitorId] = $this->resolveOwner($request);

        $todayCount = AiMessage::whereHas('conversation', fn ($q) => $q->forOwner($userId, $visitorId))
            ->where('role', 'user')
            ->where('created_at', '>=', now()->startOfDay())
            ->count();

        if ($todayCount >= 10) {
            return response()->json([
                'error' => 'Günlük mesaj limitinize ulaştınız (10/gün). Yarın tekrar deneyin!',
            ], 429);
        }

        $conversation = null;

        if ($request->filled('conversation_id')) {
            $conversation = AiConversation::forOwner($userId, $visitorId)
                ->whereKey($request->integer('conversation_id'))
                ->first();
        }

        $conversation ??= AiConversation::create([
            'user_id' => $userId,
            'visitor_id' => $visitorId,
            'session_id' => $request->session()->getId(),
        ]);

        $result = $service->chat($conversation, $request->message);

        if (!$conversation->title && $conversation->messages()->where('role', 'user')->count() === 1) {
            $conversation->update([
                'title' => mb_substr($request->message, 0, 50),
            ]);
        }

        $conversation->touch();

        return response()->json($result);
    }

    public function newConversation(Request $request)
    {
        [$userId, $visitorId] = $this->resolveOwner($request);

        $conversation = AiConversation::create([
            'user_id' => $userId,
            'visitor_id' => $visitorId,
            'session_id' => $request->session()->getId(),
        ]);

        return response()->json(['conversationId' => $conversation->id]);
    }

    private function resolveOwner(Request $request): array
    {
        $userId = auth()->id();
        $visitorId = $request->attributes->get('visitor_id');

        return [$userId, $visitorId];
    }
}
