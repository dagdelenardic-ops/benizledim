<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminPageController extends Controller
{
    public function index(): Response
    {
        $pages = Page::latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|alpha_dash|unique:pages,slug',
            'content' => 'nullable|string',
        ]);

        Page::create([
            'title' => $validated['title'],
            'slug' => $validated['slug'] ?: $this->generateUniqueSlug($validated['title']),
            'content' => $validated['content'] ?? null,
        ]);

        return back()->with('success', 'Sayfa oluşturuldu.');
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|alpha_dash|unique:pages,slug,' . $page->id,
            'content' => 'nullable|string',
        ]);

        $page->update([
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'content' => $validated['content'] ?? null,
        ]);

        return back()->with('success', 'Sayfa güncellendi.');
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return back()->with('success', 'Sayfa silindi.');
    }

    private function generateUniqueSlug(string $title): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 2;

        while (Page::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}
