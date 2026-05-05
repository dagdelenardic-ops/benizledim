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

        $conversation = AiConversation::forOwner($userId, $visitorId)
            ->when($conversationId, fn ($query) => $query->whereKey($conversationId))
            ->with('messages')
            ->latest('updated_at')
            ->first();

        $conversations = AiConversation::forOwner($userId, $visitorId)
            ->withCount('messages')
            ->latest('updated_at')
            ->limit(20)
            ->get()
            ->map(fn (AiConversation $conversation) => [
                'id' => $conversation->id,
                'title' => $conversation->title ?: 'Sohbet #'.$conversation->id,
                'created_at' => $conversation->created_at?->diffForHumans(),
                'updated_at' => $conversation->updated_at?->toIso8601String(),
                'message_count' => $conversation->messages_count,
            ]);

        return Inertia::render('Recommend/Index', [
            'messages' => $conversation?->messages ?? collect(),
            'conversationId' => $conversation?->id,
            'conversations' => $conversations,
        ]);
    }

    public function newConversation(Request $request)
    {
        [$userId, $visitorId] = $this->resolveOwner($request);

        $conversation = AiConversation::create([
            'user_id' => $userId,
            'visitor_id' => $visitorId,
            'session_id' => null,
        ]);

        return response()->json(['conversationId' => $conversation->id]);
    }

    public function chat(Request $request, AiRecommendationService $service)
    {
        $request->validate([
            'message' => 'required|string|max:500',
            'conversation_id' => 'nullable|integer|exists:ai_conversations,id',
        ]);

        [$userId, $visitorId] = $this->resolveOwner($request);

        $todayCount = AiMessage::whereHas(
            'conversation',
            fn ($query) => $query->forOwner($userId, $visitorId),
        )
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
            'session_id' => null,
        ]);

        $result = $service->chat($conversation, $request->message);

        if (!$conversation->title && $conversation->messages()->where('role', 'user')->count() === 1) {
            $conversation->update([
                'title' => mb_substr($request->message, 0, 80),
            ]);
        }

        $conversation->touch();

        return response()->json($result);
    }

    private function resolveOwner(Request $request): array
    {
        return [
            auth()->id(),
            $request->attributes->get('visitor_id') ?? $request->cookie('bi_visitor_id'),
        ];
    }
}
