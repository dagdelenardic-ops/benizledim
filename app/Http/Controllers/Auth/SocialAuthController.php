<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(): RedirectResponse
    {
        try {
            $socialUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect('/')->with('error', 'Google girişi başarısız.');
        }

        if (empty($socialUser->email)) {
            return redirect('/')->with('error', 'Google hesabınızdan e-posta bilgisi alınamadı.');
        }

        $adminEmails = config('benizledim.admin_emails', []);
        $socialEmail = strtolower((string) $socialUser->email);
        $isAdminEmail = in_array($socialEmail, $adminEmails, true);

        // Önce e-mail ile bul (hesap birleştirme)
        $user = User::where('email', $socialUser->email)->first();

        if ($user) {
            // Mevcut kullanıcıya Google bilgilerini ekle
            $user->update([
                'provider' => 'google',
                'provider_id' => $socialUser->id,
                'avatar' => $user->avatar ?? $socialUser->avatar,
            ]);
        } else {
            $role = $isAdminEmail ? 'admin' : 'reader';
            $user = User::create([
                'name' => $socialUser->name,
                'email' => $socialUser->email,
                'avatar' => $socialUser->avatar,
                'provider' => 'google',
                'provider_id' => $socialUser->id,
                'role' => $role,
            ]);
        }

        // Admin emailse her zaman admin yap
        if (in_array(strtolower((string) $user->email), $adminEmails, true) && $user->role !== 'admin') {
            $user->update(['role' => 'admin']);
        }

        Auth::login($user);

        return redirect($user->isAdmin() ? '/admin' : '/');
    }

    public function redirectToFacebook(): RedirectResponse
    {
        return Socialite::driver('facebook')->redirect();
    }

    public function handleFacebookCallback(): RedirectResponse
    {
        $socialUser = Socialite::driver('facebook')->user();

        $user = User::where('provider', 'facebook')
            ->where('provider_id', $socialUser->id)
            ->first();

        if (!$user) {
            $user = User::create([
                'name' => $socialUser->name,
                'email' => $socialUser->email,
                'avatar' => $socialUser->avatar,
                'provider' => 'facebook',
                'provider_id' => $socialUser->id,
                'role' => 'reader',
            ]);
        }

        Auth::login($user);

        return redirect('/');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
