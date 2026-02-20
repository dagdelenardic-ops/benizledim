<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Podcast;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminPodcastController extends Controller
{
    public function index(): Response
    {
        $podcasts = Podcast::latest('published_at')->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Podcasts/Index', [
            'podcasts' => $podcasts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'spotify_embed_url' => 'nullable|url|max:255',
            'cover_image' => 'nullable|image|max:2048',
            'duration' => 'nullable|integer|min:1|max:600',
            'published_at' => 'nullable|date',
        ]);

        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'spotify_embed_url' => $validated['spotify_embed_url'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'published_at' => $validated['published_at'] ?? null,
        ];

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('podcasts', 'public');
            $data['cover_image'] = '/storage/' . $path;
        }

        Podcast::create($data);

        return back()->with('success', 'Podcast eklendi.');
    }

    public function update(Request $request, Podcast $podcast)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'spotify_embed_url' => 'nullable|url|max:255',
            'cover_image' => 'nullable|image|max:2048',
            'duration' => 'nullable|integer|min:1|max:600',
            'published_at' => 'nullable|date',
        ]);

        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'spotify_embed_url' => $validated['spotify_embed_url'] ?? null,
            'duration' => $validated['duration'] ?? null,
            'published_at' => $validated['published_at'] ?? null,
        ];

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('podcasts', 'public');
            $data['cover_image'] = '/storage/' . $path;
        }

        $podcast->update($data);

        return back()->with('success', 'Podcast güncellendi.');
    }

    public function destroy(Podcast $podcast)
    {
        $podcast->delete();

        return back()->with('success', 'Podcast silindi.');
    }
}
