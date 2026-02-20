<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;
use Inertia\Inertia;
use Inertia\Response;

class AdminNewsletterController extends Controller
{
    public function index(): Response
    {
        $this->assertManager();

        $subscribers = Newsletter::orderByDesc('subscribed_at')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Newsletters/Index', [
            'subscribers' => $subscribers,
        ]);
    }

    public function toggle(Newsletter $newsletter)
    {
        $this->assertManager();

        if ($newsletter->unsubscribed_at) {
            $newsletter->update([
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);

            return back()->with('success', 'Abone tekrar aktif edildi.');
        }

        $newsletter->update([
            'unsubscribed_at' => now(),
        ]);

        return back()->with('success', 'Abone pasif hale getirildi.');
    }

    public function destroy(Newsletter $newsletter)
    {
        $this->assertManager();

        $newsletter->delete();

        return back()->with('success', 'Abone kaydı silindi.');
    }

    private function assertManager(): void
    {
        abort_unless(request()->user()?->canManageAllPosts(), 403, 'Bu alan sadece admin/editör için açıktır.');
    }
}
