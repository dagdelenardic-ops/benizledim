<?php

namespace App\Http\Controllers;

use App\Models\Cinema;
use App\Models\CinemaReview;
use Illuminate\Http\Request;

class CinemaReviewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function store(Request $request, Cinema $cinema)
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'content' => 'required|string|max:500',
        ]);

        $cinema->reviews()->updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'rating' => $request->rating,
                'content' => $request->content,
            ]
        );

        return back();
    }

    public function destroy(CinemaReview $cinemaReview)
    {
        if (auth()->id() !== $cinemaReview->user_id && !auth()->user()->isAdmin()) {
            abort(403);
        }

        $cinemaReview->delete();

        return back();
    }
}
