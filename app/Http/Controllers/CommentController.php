<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Services\SentimentAnalyzer;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function store(Request $request, Post $post, SentimentAnalyzer $sentimentAnalyzer)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $sentiment = $sentimentAnalyzer->analyze($request->content);

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
            'sentiment_score' => $sentiment['score'],
            'sentiment_label' => $sentiment['label'],
        ]);

        return back();
    }

    public function destroy(Comment $comment)
    {
        // Sadece yorum sahibi veya admin silebilir
        if (auth()->id() !== $comment->user_id && !auth()->user()->isAdmin()) {
            abort(403);
        }

        $comment->delete();

        return back();
    }
}
