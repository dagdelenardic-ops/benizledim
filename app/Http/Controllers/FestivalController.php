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
        ]);
    }
}
