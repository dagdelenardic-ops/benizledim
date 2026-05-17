<?php

namespace App\Http\Controllers;

use App\Models\FestivalEvent;
use Inertia\Inertia;

class FestivalController extends Controller
{
    public function index()
    {
        $events = FestivalEvent::orderBy('slider_order')
            ->get();

        return Inertia::render('Festival/Index', [
            'events' => $events,
            'title' => 'İstanbul Film Festivali',
            'description' => 'İstanbul Film Festivali seçkileri, gösterim notları ve hangi etkinlik neden önemli rehberi - Ben İzledim.',
            'canonicalUrl' => 'https://benizledim.com/festival',
        ]);
    }
}
