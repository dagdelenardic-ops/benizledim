<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingsController extends Controller
{
    public function index(): Response
    {
        abort_unless(auth()->user()?->isAdmin(), 403, 'Ayar yönetimi sadece admin için açıktır.');

        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'gemini_text_model' => (string) config('services.gemini.text_model', 'gemini-2.5-flash'),
                'google_redirect_uri' => (string) config('services.google.redirect', ''),
                'facebook_redirect_uri' => (string) config('services.facebook.redirect', ''),
            ],
            'status' => [
                'gemini_api_key' => filled(config('services.gemini.api_key')),
                'google_client_id' => filled(config('services.google.client_id')),
                'google_client_secret' => filled(config('services.google.client_secret')),
                'facebook_client_id' => filled(config('services.facebook.client_id')),
                'facebook_client_secret' => filled(config('services.facebook.client_secret')),
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()?->isAdmin(), 403, 'Ayar yönetimi sadece admin için açıktır.');

        $validated = $request->validate([
            'gemini_api_key' => 'nullable|string|max:500',
            'gemini_text_model' => 'required|string|max:120',
            'google_client_id' => 'nullable|string|max:255',
            'google_client_secret' => 'nullable|string|max:255',
            'google_redirect_uri' => 'nullable|url|max:255',
            'facebook_client_id' => 'nullable|string|max:255',
            'facebook_client_secret' => 'nullable|string|max:255',
            'facebook_redirect_uri' => 'nullable|url|max:255',
        ]);

        $updates = [
            'GEMINI_TEXT_MODEL' => $validated['gemini_text_model'],
            'GOOGLE_REDIRECT_URI' => $validated['google_redirect_uri'] ?? '',
            'FACEBOOK_REDIRECT_URI' => $validated['facebook_redirect_uri'] ?? '',
        ];

        foreach (['gemini_api_key', 'google_client_id', 'google_client_secret', 'facebook_client_id', 'facebook_client_secret'] as $secretKey) {
            if (filled($validated[$secretKey] ?? null)) {
                $updates[strtoupper($secretKey)] = (string) $validated[$secretKey];
            }
        }

        if (!$this->updateEnv($updates)) {
            return back()->with('error', '.env dosyası güncellenemedi. Dosya yazma iznini kontrol edin.');
        }

        Artisan::call('config:clear');

        return back()->with('success', 'Ayarlar güncellendi. Yeni değerler uygulanmaya hazır.');
    }

    private function updateEnv(array $updates): bool
    {
        $envPath = base_path('.env');

        if (!is_file($envPath) || !is_writable($envPath)) {
            return false;
        }

        $content = (string) file_get_contents($envPath);

        foreach ($updates as $key => $value) {
            $escapedValue = $this->escapeEnvValue((string) $value);
            $pattern = "/^{$key}=.*$/m";

            if (preg_match($pattern, $content) === 1) {
                $content = preg_replace($pattern, "{$key}={$escapedValue}", $content) ?? $content;
                continue;
            }

            $content .= PHP_EOL."{$key}={$escapedValue}";
        }

        return file_put_contents($envPath, $content) !== false;
    }

    private function escapeEnvValue(string $value): string
    {
        if ($value === '') {
            return '""';
        }

        if (preg_match('/\s|#|=|"/', $value)) {
            return '"'.addcslashes($value, '"').'"';
        }

        return $value;
    }
}
