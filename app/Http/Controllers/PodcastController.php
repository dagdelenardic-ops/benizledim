<?php

namespace App\Http\Controllers;

use App\Models\Podcast;
use Inertia\Inertia;

class PodcastController extends Controller
{
    public function index()
    {
        $podcasts = Podcast::whereNotNull('published_at')
            ->latest('published_at')
            ->get();

        return Inertia::render('Podcast/Index', [
            'podcasts' => $podcasts,
            'title' => 'Podcast',
            'description' => 'Ben İzledim podcast bölümleri: film, dizi ve festival üzerine sesli sohbetler ve editör notları.',
            'canonicalUrl' => 'https://benizledim.com/podcast',
        ]);
    }
}
