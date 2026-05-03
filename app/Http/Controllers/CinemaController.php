<?php

namespace App\Http\Controllers;

use App\Models\Cinema;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CinemaController extends Controller
{
    public function index(Request $request)
    {
        $query = Cinema::active()
            ->withCount('reviews')
            ->with(['currentScreenings']);

        if ($request->has('district')) {
            $query->where('district', $request->district);
        }

        $cinemas = $query->orderBy('name')->paginate(20);

        $districts = Cinema::active()
            ->select('district')
            ->distinct()
            ->orderBy('district')
            ->pluck('district');

        return Inertia::render('Cinema/Index', [
            'cinemas' => $cinemas,
            'districts' => $districts,
            'filters' => $request->only(['district']),
        ]);
    }

    public function show(Cinema $cinema)
    {
        $cinema->load([
            'screenings' => fn ($q) => $q->where('starts_at', '>=', now())->where('starts_at', '<=', now()->addDays(30))->orderBy('starts_at'),
            'reviews.user',
        ]);
        $cinema->loadCount('reviews');

        $userReview = null;
        if (auth()->check()) {
            $userReview = $cinema->reviews()->where('user_id', auth()->id())->first();
        }

        return Inertia::render('Cinema/Show', [
            'cinema' => $cinema,
            'averageRating' => $cinema->averageRating(),
            'userReview' => $userReview,
        ]);
    }
}
