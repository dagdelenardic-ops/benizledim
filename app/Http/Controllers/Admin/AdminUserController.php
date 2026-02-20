<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::withCount(['posts', 'comments'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,author,reader',
        ]);

        // Kendini reader yapmasını engelle
        if ($user->id === auth()->id() && $request->role !== 'admin') {
            return back()->with('error', 'Kendi admin rolünüzü değiştiremezsiniz!');
        }

        $user->update(['role' => $request->role]);

        return back()->with('success', "Kullanıcı rolü güncellendi: {$request->role}");
    }
}
