<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index()
    {
        abort_unless(auth()->user()?->isAdmin(), 403, 'Kullanıcı yönetimi sadece admin için açıktır.');

        $users = User::withCount(['posts', 'comments'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        abort_unless(auth()->user()?->isAdmin(), 403, 'Rol yönetimi sadece admin için açıktır.');

        $request->validate([
            'role' => 'required|in:admin,editor,author,reader',
        ]);

        // Kendini reader yapmasını engelle
        if ($user->id === auth()->id() && $request->role !== 'admin') {
            return back()->with('error', 'Kendi admin rolünüzü değiştiremezsiniz!');
        }

        $user->update(['role' => $request->role]);

        return back()->with('success', "Kullanıcı rolü güncellendi: {$request->role}");
    }

    public function updatePassword(Request $request, User $user)
    {
        abort_unless(auth()->user()?->isAdmin(), 403, 'Şifre yönetimi sadece admin için açıktır.');

        $validated = $request->validate([
            'password' => [
                'required',
                'confirmed',
                Password::min(10)->letters()->mixedCase()->numbers()->symbols(),
            ],
        ], [
            'password.required' => 'Yeni şifre zorunludur.',
            'password.confirmed' => 'Şifre tekrarı eşleşmiyor.',
        ]);

        $user->update([
            'password' => $validated['password'],
            'provider' => $user->provider ?: 'email',
        ]);

        return back()->with('success', "Şifre güncellendi: {$user->email}");
    }
}
