<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class WixRedirectController extends Controller
{
    public function post(string $slug)
    {
        $post = Post::where('slug', $slug)->first();

        if ($post) {
            return redirect("/yazi/{$post->slug}", 301);
        }

        $laravelSlug = $this->resolveFromMap($slug);

        if ($laravelSlug && Post::where('slug', $laravelSlug)->exists()) {
            return redirect("/yazi/{$laravelSlug}", 301);
        }

        $asciiSlug = Str::slug($slug);

        if ($asciiSlug !== $slug && Post::where('slug', $asciiSlug)->exists()) {
            return redirect("/yazi/{$asciiSlug}", 301);
        }

        return redirect('/yazilar', 301);
    }

    public function category(string $slug)
    {
        return redirect("/yazilar/{$slug}", 301);
    }

    private function resolveFromMap(string $wixSlug): ?string
    {
        $map = Cache::rememberForever('wix_redirect_map', function () {
            $path = database_path('data/wix-redirect-map.json');

            if (!file_exists($path)) {
                return [];
            }

            return json_decode(file_get_contents($path), true) ?: [];
        });

        return $map[$wixSlug] ?? null;
    }
}
