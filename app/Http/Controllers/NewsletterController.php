<?php

namespace App\Http\Controllers;

use App\Models\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        // Zaten abone mi kontrol et
        $existing = Newsletter::where('email', $request->email)
            ->whereNull('unsubscribed_at')
            ->first();

        if ($existing) {
            return back()->with('newsletter_message', 'Bu e-posta zaten kayıtlı!');
        }

        // Daha önce abone olup çıkmış mı?
        $unsubscribed = Newsletter::where('email', $request->email)
            ->whereNotNull('unsubscribed_at')
            ->first();

        if ($unsubscribed) {
            $unsubscribed->update([
                'unsubscribed_at' => null,
                'subscribed_at' => now(),
            ]);
        } else {
            Newsletter::create([
                'email' => $request->email,
                'subscribed_at' => now(),
            ]);
        }

        return back()->with('newsletter_message', 'Başarıyla abone oldunuz!');
    }
}
