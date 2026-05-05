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
        $posts = Post::articles()
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
                'label' => 'Ne İzlesem',
                'title' => 'Ruh haline göre anında öneriler',
                'description' => 'Kısa bir mesajla film ve dizi önerileri al, sonra ilgili Ben İzledim yazılarına geç.',
                'href' => '/ne-izlesem',
                'cta' => 'Ne İzlesem? aç',
                'metric' => 'AI destekli rehber',
                'tone' => 'red',
            ],
            [
                'label' => 'Podcast',
                'title' => $latestPodcast?->title ?? 'Editör masası kayıtları',
                'description' => $latestPodcast?->description ?: 'Film, dizi ve festival notlarını sesli formatta takip et.',
                'href' => '/podcast',
                'cta' => 'Podcastlere git',
                'metric' => $latestPodcast?->published_at?->format('d.m.Y') ?? 'Yeni bölümler',
                'tone' => 'ink',
            ],
            [
                'label' => 'Festival',
                'title' => $nextFestivalEvent?->title ?? 'Takvimdeki gösterimleri kaçırma',
                'description' => $nextFestivalEvent?->description ?: 'Festival seçkileri, kısa notlar ve hangi etkinlik neden önemli rehberi.',
                'href' => '/festival',
                'cta' => 'Festival sayfasına git',
                'metric' => $nextFestivalEvent?->event_date?->format('d.m.Y') ?? 'Güncel seçki',
                'tone' => 'paper',
            ],
            [
                'label' => 'Sinemalar',
                'title' => $featuredCinema?->name ?? 'Salonları da takip et',
                'description' => $featuredCinema?->description ?: 'Nerede ne izlenir, hangi salon ne hissettirir, izleme mekânlarını keşfet.',
                'href' => '/sinemalar',
                'cta' => 'Sinemaları keşfet',
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
