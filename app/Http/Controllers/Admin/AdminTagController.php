<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTagController extends Controller
{
    public function index(): Response
    {
        $tags = Tag::withCount('posts')->orderBy('name')->get();

        return Inertia::render('Admin/Tags/Index', [
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:tags,name',
        ]);

        Tag::create(['name' => $request->name]);

        return back()->with('success', 'Etiket oluşturuldu!');
    }

    public function update(Request $request, Tag $tag)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:tags,name,' . $tag->id,
        ]);

        $tag->update(['name' => $request->name]);

        return back()->with('success', 'Etiket güncellendi!');
    }

    public function destroy(Tag $tag)
    {
        $tag->delete();

        return back()->with('success', 'Etiket silindi.');
    }
}
