<?php

namespace App\Http\Controllers;

use App\Services\ActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityFeedController extends Controller
{
    public function index(Request $request, ActivityService $activities): Response
    {
        $items = $activities
            ->feedFor($request->user())
            ->through(fn ($item) => [
                'id' => $item->id,
                'type' => $item->type,
                'created_at' => $item->created_at->toIso8601String(),
                'actor' => $item->actor ? ['id' => $item->actor->id, 'name' => $item->actor->name, 'avatar' => $item->actor->avatar] : null,
                'post' => $item->post ? [
                    'id' => $item->post->id,
                    'slug' => $item->post->slug,
                    'title' => $item->post->title,
                    'cover_image' => $item->post->cover_image,
                    'format' => $item->post->format,
                ] : null,
                'meta' => $item->meta ?? [],
            ]);

        return Inertia::render('Activity/Index', ['items' => $items]);
    }
}
