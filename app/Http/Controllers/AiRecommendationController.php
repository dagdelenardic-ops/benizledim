<?php

namespace App\Http\Controllers;

use App\Models\AiConversation;
use App\Services\AiRecommendationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AiRecommendationController extends Controller
{
    public function index(Request $request)
    {
        $sessionId = $request->session()->getId();

        $conversation = AiConversation::where('session_id', $sessionId)
            ->with('messages')
            ->latest()
            ->first();

        $messages = $conversation?->messages ?? collect();

        return Inertia::render('Recommend/Index', [
            'messages' => $messages,
            'conversationId' => $conversation?->id,
        ]);
    }

    public function chat(Request $request, AiRecommendationService $service)
    {
        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $sessionId = $request->session()->getId();

        // Rate limit: max 10 messages per day per session
        $todayCount = \App\Models\AiMessage::whereHas('conversation', fn ($q) => $q->where('session_id', $sessionId))
            ->where('role', 'user')
            ->where('created_at', '>=', now()->startOfDay())
            ->count();

        if ($todayCount >= 10) {
            return response()->json([
                'error' => 'Gunluk mesaj limitinize ulastiniz (10/gun). Yarin tekrar deneyin!',
            ], 429);
        }

        $conversation = AiConversation::firstOrCreate(
            ['session_id' => $sessionId],
            ['user_id' => auth()->id()],
        );

        $result = $service->chat($conversation, $request->message);

        return response()->json($result);
    }
}
