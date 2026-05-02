<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirectToGoogle(): RedirectResponse
    {
        try {
            return Socialite::driver('google')->redirect();
        } catch (\Throwable $e) {
            Log::error('Google auth redirect failed.', ['error' => $e->getMessage()]);

            return redirect('/')->with('error', 'Google girişi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
        }
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

        $user = $this->resolveGoogleUser($socialUser->id, (string) $socialUser->email, (string) $socialUser->name);

        if ($user) {
            $user->update([
                'provider' => 'google',
                'provider_id' => $socialUser->id,
                'email' => $socialUser->email,
                'name' => $user->name ?: $socialUser->name,
                'avatar' => $user->avatar ?? $socialUser->avatar,
            ]);
        } else {
            $role = $isAdminEmail ? 'admin' : 'author';
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

        return redirect($user->canAccessCms() ? '/admin' : '/');
    }

    private function resolveGoogleUser(string $providerId, string $email, string $name): ?User
    {
        $socialEmail = strtolower($email);

        $linkedUser = User::query()
            ->where('provider', 'google')
            ->where('provider_id', $providerId)
            ->first();

        if ($linkedUser) {
            return $linkedUser;
        }

        $emailUser = User::query()
            ->whereRaw('LOWER(email) = ?', [$socialEmail])
            ->first();

        if ($emailUser) {
            return $emailUser;
        }

        $normalizedName = mb_strtolower(trim($name));

        if ($normalizedName === '') {
            return null;
        }

        $placeholderUsers = User::query()
            ->whereRaw('LOWER(name) = ?', [$normalizedName])
            ->where('email', 'like', 'wix-author+%@benizledim.local')
            ->get();

        return $placeholderUsers->count() === 1 ? $placeholderUsers->first() : null;
    }

    public function redirectToFacebook(): RedirectResponse
    {
        try {
            return Socialite::driver('facebook')->redirect();
        } catch (\Throwable $e) {
            Log::error('Facebook auth redirect failed.', ['error' => $e->getMessage()]);

            return redirect('/')->with('error', 'Facebook girişi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
        }
    }

    public function handleFacebookCallback(): RedirectResponse
    {
        try {
            $socialUser = Socialite::driver('facebook')->user();
        } catch (\Exception $e) {
            return redirect('/')->with('error', 'Facebook girişi başarısız.');
        }

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
                'role' => 'author',
            ]);
        }

        Auth::login($user);

        return redirect($user->canAccessCms() ? '/admin' : '/');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
