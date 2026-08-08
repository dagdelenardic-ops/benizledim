<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Response;

/**
 * /llms.txt — the convention answer engines read to learn what a site is and
 * where its material lives, the way robots.txt tells crawlers what they may
 * fetch. Without one, an assistant summarising "Ben İzledim" has to infer the
 * site's scope from whichever page it happened to land on.
 */
class LlmsTxtController extends Controller
{
    public function index(): Response
    {
        $base = \App\Support\SchemaGraph::BASE;

        $categories = Category::query()
            ->select('id', 'name', 'slug')
            ->whereHas('posts', fn ($q) => $q->published())
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->orderByDesc('posts_count')
            ->get();

        $authors = User::query()
            ->select('id', 'name', 'bio')
            ->whereHas('posts', fn ($q) => $q->published())
            ->withCount(['posts' => fn ($q) => $q->published()])
            ->orderByDesc('posts_count')
            ->get();

        $recent = Post::articles()
            ->select('title', 'slug', 'excerpt', 'published_at')
            ->latest('published_at')
            ->limit(30)
            ->get();

        $lines = [];
        $lines[] = '# Ben İzledim';
        $lines[] = '';
        $lines[] = '> Türkçe film, dizi ve belgesel eleştiri ve tavsiye platformu. '
            .'Bağımsız yazar kadrosunun kaleme aldığı incelemeler, festival ve vizyon '
            .'notları, sinema haberleri ve "ne izlesem" rehberleri.';
        $lines[] = '';
        $lines[] = 'Dil: Türkçe (tr-TR). Yayıncı: Ben İzledim. Site: '.$base;
        $lines[] = 'İçerik lisansı: Metinler yazarlarına aittir; alıntılarken yazar adını ve yazı bağlantısını belirtin.';
        $lines[] = '';

        $lines[] = '## Ana bölümler';
        $lines[] = '';
        $lines[] = "- [Tüm yazılar]({$base}/yazilar): Eleştiri ve inceleme arşivi.";
        $lines[] = "- [Haberler]({$base}/haberler): Sinema ve dizi haberleri.";
        $lines[] = "- [Yazarlar]({$base}/yazarlar): Yazar kadrosu ve profilleri.";
        $lines[] = "- [Podcast]({$base}/podcast): Sesli sohbetler.";
        $lines[] = "- [Festival]({$base}/festival): İstanbul Film Festivali seçkileri.";
        $lines[] = "- [Sinemalar]({$base}/sinemalar): Salon rehberi ve izleyici yorumları.";
        $lines[] = "- [Ne İzlesem]({$base}/ne-izlesem): Ruh haline göre öneri aracı.";
        $lines[] = "- [Quiz]({$base}/quiz): Hangi film karakterisin testi.";
        $lines[] = '';

        $lines[] = '## Kategoriler';
        $lines[] = '';
        foreach ($categories as $category) {
            $lines[] = "- [{$category->name}]({$base}/yazilar/{$category->slug}): {$category->posts_count} yazı.";
        }
        $lines[] = '';

        $lines[] = '## Yazarlar';
        $lines[] = '';
        foreach ($authors as $author) {
            $bio = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $author->bio)));
            $bio = $bio === '' ? '' : ' '.\Illuminate\Support\Str::limit($bio, 140, '…');
            $lines[] = "- [{$author->name}]({$base}/profile/{$author->id}): {$author->posts_count} yazı.{$bio}";
        }
        $lines[] = '';

        $lines[] = '## Son yazılar';
        $lines[] = '';
        foreach ($recent as $post) {
            $excerpt = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $post->excerpt)));
            $excerpt = $excerpt === '' ? '' : ' '.\Illuminate\Support\Str::limit($excerpt, 160, '…');
            $date = optional($post->published_at)->format('Y-m-d');
            $lines[] = "- [{$post->title}]({$base}/yazi/{$post->slug}) ({$date}):{$excerpt}";
        }
        $lines[] = '';

        $lines[] = '## Makine okunabilir kaynaklar';
        $lines[] = '';
        $lines[] = "- [Site haritası]({$base}/sitemap.xml): Tüm indekslenebilir adresler.";
        $lines[] = "- [RSS]({$base}/feed): Son 30 yazı.";
        $lines[] = '';

        return response(implode("\n", $lines), 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8')
            ->setPublic()
            ->setMaxAge(3600)
            ->setSharedMaxAge(86400);
    }
}
