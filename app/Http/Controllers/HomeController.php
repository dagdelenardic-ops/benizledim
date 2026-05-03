<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Cinema;
use App\Models\FestivalEvent;
use App\Models\Podcast;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        $posts = Post::published()
            ->with(['user', 'categories', 'tags'])
            ->withCount(['comments', 'likes'])
            ->latest('published_at')
            ->take(8)
            ->get();

        $categories = Category::withCount('posts')->get();
        $latestPodcast = Podcast::query()->latest('published_at')->first();
        $nextFestivalEvent = FestivalEvent::query()->orderBy('event_date')->first();
        $featuredCinema = Cinema::query()->active()->withCount('reviews')->latest()->first();

        $spotlights = [
            [
                'label' => 'Ne Izlesem',
                'title' => 'Ruh haline gore aninda oneriler',
                'description' => 'Kisa bir mesajla film ve dizi onerileri al, sonra ilgili Ben Izledim yazilarina gec.',
                'href' => '/ne-izlesem',
                'cta' => 'Ne Izlesem? ac',
                'metric' => 'AI destekli rehber',
                'tone' => 'red',
            ],
            [
                'label' => 'Podcast',
                'title' => $latestPodcast?->title ?? 'Editor masasi kayitlari',
                'description' => $latestPodcast?->description ?: 'Film, dizi ve festival notlarini sesli formatta takip et.',
                'href' => '/podcast',
                'cta' => 'Podcastlere git',
                'metric' => $latestPodcast?->published_at?->format('d.m.Y') ?? 'Yeni bolumler',
                'tone' => 'ink',
            ],
            [
                'label' => 'Festival',
                'title' => $nextFestivalEvent?->title ?? 'Takvimdeki gosterimleri kacirma',
                'description' => $nextFestivalEvent?->description ?: 'Festival seckileri, kisa notlar ve hangi etkinlik neden onemli rehberi.',
                'href' => '/festival',
                'cta' => 'Festival sayfasina git',
                'metric' => $nextFestivalEvent?->event_date?->format('d.m.Y') ?? 'Guncel secki',
                'tone' => 'paper',
            ],
            [
                'label' => 'Sinemalar',
                'title' => $featuredCinema?->name ?? 'Salonlari da takip et',
                'description' => $featuredCinema?->description ?: 'Nerede ne izlenir, hangi salon ne hissettirir, izleme mekanlarini kesfet.',
                'href' => '/sinemalar',
                'cta' => 'Sinemalari kesfet',
                'metric' => $featuredCinema ? $featuredCinema->reviews_count.' yorum' : 'Salon rehberi',
                'tone' => 'stone',
            ],
        ];

        return Inertia::render('Home', [
            'posts' => $posts,
            'categories' => $categories,
            'spotlights' => $spotlights,
        ]);
    }
}
