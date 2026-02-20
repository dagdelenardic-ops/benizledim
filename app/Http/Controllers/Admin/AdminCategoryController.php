<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('posts')->get();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        Category::create(['name' => $request->name]);

        return back()->with('success', 'Kategori oluşturuldu!');
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        $category->update(['name' => $request->name]);

        return back()->with('success', 'Kategori güncellendi!');
    }

    public function destroy(Category $category)
    {
        if ($category->posts()->count() > 0) {
            return back()->with('error', 'Bu kategoride yazılar var, silinemez!');
        }

        $category->delete();
        return back()->with('success', 'Kategori silindi.');
    }
}
