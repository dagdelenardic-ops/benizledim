<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FestivalEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminFestivalEventController extends Controller
{
    public function index(): Response
    {
        $events = FestivalEvent::orderBy('slider_order')->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Festival/Index', [
            'events' => $events,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
            'event_date' => 'nullable|date',
            'slider_order' => 'nullable|integer|min:0|max:1000',
        ]);

        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'event_date' => $validated['event_date'] ?? null,
            'slider_order' => $validated['slider_order'] ?? 0,
        ];

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('festival', 'public');
            $data['cover_image'] = '/storage/' . $path;
        }

        FestivalEvent::create($data);

        return back()->with('success', 'Festival etkinliği eklendi.');
    }

    public function update(Request $request, FestivalEvent $festivalEvent)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
            'event_date' => 'nullable|date',
            'slider_order' => 'nullable|integer|min:0|max:1000',
        ]);

        $data = [
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'event_date' => $validated['event_date'] ?? null,
            'slider_order' => $validated['slider_order'] ?? 0,
        ];

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('festival', 'public');
            $data['cover_image'] = '/storage/' . $path;
        }

        $festivalEvent->update($data);

        return back()->with('success', 'Festival etkinliği güncellendi.');
    }

    public function destroy(FestivalEvent $festivalEvent)
    {
        $festivalEvent->delete();

        return back()->with('success', 'Festival etkinliği silindi.');
    }
}
