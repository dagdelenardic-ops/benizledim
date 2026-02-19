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
        $socialUser = Socialite::driver('google')->user();

        $user = User::where('provider', 'google')
            ->where('provider_id', $socialUser->id)
            ->first();

        if (!$user) {
            $user = User::create([
                'name' => $socialUser->name,
                'email' => $socialUser->email,
                'avatar' => $socialUser->avatar,
                'provider' => 'google',
                'provider_id' => $socialUser->id,
                'role' => 'reader',
            ]);
        }

        Auth::login($user);

        return redirect('/');
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
