<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use App\Models\EntryVote;
use App\Models\Post;
use Illuminate\Http\Request;

class EntryController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $isAuthenticated = auth()->check();

        $rules = [
            'content' => 'required|string|max:500',
            'is_spoiler' => 'boolean',
        ];

        if (!$isAuthenticated) {
            $rules['display_name'] = 'required|string|max:50';

            $recentCount = Entry::where('ip_address', $request->ip())
                ->where('created_at', '>=', now()->subMinutes(5))
                ->count();

            if ($recentCount >= 3) {
                return back()->withErrors([
                    'content' => 'Çok fazla entry gönderdiniz. Lütfen birkaç dakika bekleyin.',
                ]);
            }
        }

        $request->validate($rules);

        $post->entries()->create([
            'user_id' => $isAuthenticated ? auth()->id() : null,
            'display_name' => $isAuthenticated ? null : $request->display_name,
            'content' => $request->content,
            'is_spoiler' => $request->boolean('is_spoiler'),
            'ip_address' => $isAuthenticated ? null : $request->ip(),
        ]);

        return back();
    }

    public function vote(Request $request, Entry $entry)
    {

        $request->validate([
            'vote' => 'required|integer|in:-1,1',
        ]);

        $userId = auth()->id();

        $existing = $entry->votes()->where('user_id', $userId)->first();

        if ($existing) {
            if ($existing->vote === (int) $request->vote) {
                $existing->delete();
            } else {
                $existing->update(['vote' => $request->vote]);
            }
        } else {
            $entry->votes()->create([
                'user_id' => $userId,
                'vote' => $request->vote,
                'created_at' => now(),
            ]);
        }

        $entry->recalculateScore();

        return back();
    }

    public function destroy(Entry $entry)
    {
        if (!auth()->check()) {
            abort(403);
        }

        $isOwner = auth()->id() === $entry->user_id;
        $isAdmin = auth()->user()->isAdmin();

        if (!$isOwner && !$isAdmin) {
            abort(403);
        }

        $entry->delete();

        return back();
    }
}
