<?php

namespace App\Http\Controllers;

use App\Models\Post;

class WixRedirectController extends Controller
{
    public function post(string $slug)
    {
        $post = Post::where('slug', $slug)->first();

        if ($post) {
            return redirect("/yazi/{$post->slug}", 301);
        }

        return redirect('/yazilar', 302);
    }

    public function category(string $slug)
    {
        return redirect("/yazilar?category={$slug}", 301);
    }
}
