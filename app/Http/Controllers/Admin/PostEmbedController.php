<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostEmbedController extends Controller
{
    public function oembed(Request $request): JsonResponse
    {
        $url = $request->string('url')->toString();

        if (!preg_match('#^https?://#i', $url)) {
            return response()->json(['error' => 'Geçersiz URL.'], 422);
        }

        $embed = $this->resolveEmbed($url);

        if (!$embed) {
            return response()->json(['error' => 'Bu URL için embed desteklenmiyor.'], 422);
        }

        return response()->json($embed);
    }

    private function resolveEmbed(string $url): ?array
    {
        $host = parse_url($url, PHP_URL_HOST);

        $patterns = [
            'youtube' => [
                're' => '#(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([\w-]+)#',
                'embed_url' => 'https://www.youtube.com/embed/{id}',
            ],
            'vimeo' => [
                're' => '#vimeo\.com/(\d+)#',
                'embed_url' => 'https://player.vimeo.com/video/{id}',
            ],
            'spotify' => [
                're' => '#spotify\.com/embed/(.+)#',
                'embed_url' => 'https://open.spotify.com/embed/{id}',
            ],
        ];

        foreach ($patterns as $service => $config) {
            if (preg_match($config['re'], $url, $m)) {
                $embedUrl = str_replace('{id}', $m[1], $config['embed_url']);

                return [
                    'service' => $service,
                    'embed_url' => $embedUrl,
                    'original_url' => $url,
                ];
            }
        }

        return null;
    }
}
