<?php

namespace App\Support;

use App\Models\FlashNews;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Structured data for the public pages.
 *
 * The Article node used to be built twice — once in app.blade.php for crawlers
 * that read the raw HTML, once in Post/Show.vue for the rendered DOM — and the
 * two had already drifted apart. Both now render the nodes the controller puts
 * in the `schemaNodes` prop, so there is one description of the page.
 */
class SchemaGraph
{
    public const BASE = 'https://benizledim.com';

    /**
     * @return array<string, mixed>
     */
    public static function website(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => 'Ben İzledim',
            'url' => self::BASE,
            'description' => 'Film, dizi ve belgeseller hakkında eleştiri, inceleme ve tavsiye yazıları. Ne izleyeceğine Ben İzledim ile karar ver.',
            'inLanguage' => 'tr-TR',
            'publisher' => self::organization(),
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => self::BASE.'/ara?q={search_term_string}',
                'query-input' => 'required name=search_term_string',
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function organization(): array
    {
        return [
            '@type' => 'Organization',
            'name' => 'Ben İzledim',
            'url' => self::BASE,
            'logo' => ['@type' => 'ImageObject', 'url' => self::BASE.'/icons/512.png'],
        ];
    }

    /**
     * @param  list<array{name: string, url: string}>  $trail
     * @return array<string, mixed>
     */
    public static function breadcrumbs(array $trail): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => array_values(array_map(
                fn (int $index, array $crumb) => [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'name' => $crumb['name'],
                    'item' => $crumb['url'],
                ],
                array_keys($trail),
                $trail,
            )),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function article(Post $post, string $canonicalUrl): array
    {
        $author = $post->relationLoaded('user') ? $post->user : null;
        $text = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $post->content)));

        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'Article',
            'headline' => $post->title,
            'description' => self::excerpt($post->excerpt),
            'image' => $post->cover_image ? [self::absolute($post->cover_image)] : null,
            'datePublished' => optional($post->published_at)->toIso8601String(),
            'dateModified' => optional($post->updated_at ?? $post->published_at)->toIso8601String(),
            'inLanguage' => 'tr-TR',
            'wordCount' => $text === '' ? null : count(preg_split('/\s+/u', $text)),
            'author' => $author
                ? array_filter([
                    '@type' => 'Person',
                    'name' => $author->name,
                    // Entity link: ties the byline to a page that describes the
                    // author, which both rich results and AI answers rely on.
                    'url' => self::BASE.'/profile/'.$author->getRouteKey(),
                ])
                : ['@type' => 'Person', 'name' => 'Ben İzledim'],
            'publisher' => self::organization(),
            'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $canonicalUrl],
            'articleSection' => $post->relationLoaded('categories')
                ? optional($post->categories->first())->name
                : null,
            'keywords' => $post->relationLoaded('tags') && $post->tags->isNotEmpty()
                ? $post->tags->pluck('name')->filter()->implode(', ')
                : null,
        ], fn ($value) => $value !== null && $value !== '' && $value !== []);
    }

    /**
     * @return array<string, mixed>
     */
    public static function newsArticle(FlashNews $item, string $canonicalUrl): array
    {
        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'NewsArticle',
            'headline' => $item->title_tr,
            'description' => self::excerpt($item->summary_tr),
            'image' => $item->image_url ? [$item->image_url] : null,
            'datePublished' => optional($item->published_at)->toIso8601String(),
            'dateModified' => optional($item->updated_at ?? $item->published_at)->toIso8601String(),
            'inLanguage' => 'tr-TR',
            'author' => $item->source_name
                ? ['@type' => 'Organization', 'name' => $item->source_name]
                : self::organization(),
            'publisher' => self::organization(),
            'isBasedOn' => $item->source_url,
            'mainEntityOfPage' => ['@type' => 'WebPage', '@id' => $canonicalUrl],
        ], fn ($value) => $value !== null && $value !== '' && $value !== []);
    }

    /**
     * Author profiles had no entity of their own, so nothing tied a byline to
     * the person behind it.
     *
     * @return array<string, mixed>
     */
    public static function profilePage(User $user, string $canonicalUrl, int $postCount): array
    {
        return array_filter([
            '@context' => 'https://schema.org',
            '@type' => 'ProfilePage',
            'url' => $canonicalUrl,
            'inLanguage' => 'tr-TR',
            'isPartOf' => ['@type' => 'WebSite', 'name' => 'Ben İzledim', 'url' => self::BASE],
            'mainEntity' => array_filter([
                '@type' => 'Person',
                'name' => $user->name,
                'url' => $canonicalUrl,
                'description' => self::excerpt($user->bio, 300),
                'image' => $user->avatar ? self::absolute($user->avatar) : null,
                'jobTitle' => 'Film ve dizi yazarı',
                'worksFor' => self::organization(),
                'interactionStatistic' => $postCount > 0 ? [
                    '@type' => 'InteractionCounter',
                    'interactionType' => 'https://schema.org/WriteAction',
                    'userInteractionCount' => $postCount,
                ] : null,
            ], fn ($value) => $value !== null && $value !== ''),
        ], fn ($value) => $value !== null && $value !== '');
    }

    /**
     * @param  list<array{name: string, url: string}>  $items
     * @return array<string, mixed>
     */
    public static function collectionPage(string $name, string $description, string $canonicalUrl, array $items): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'CollectionPage',
            'name' => $name,
            'description' => $description,
            'url' => $canonicalUrl,
            'inLanguage' => 'tr-TR',
            'isPartOf' => ['@type' => 'WebSite', 'name' => 'Ben İzledim', 'url' => self::BASE],
            'mainEntity' => [
                '@type' => 'ItemList',
                'itemListElement' => array_values(array_map(
                    fn (int $index, array $item) => [
                        '@type' => 'ListItem',
                        'position' => $index + 1,
                        'name' => $item['name'],
                        'url' => $item['url'],
                    ],
                    array_keys($items),
                    $items,
                )),
            ],
        ];
    }

    private static function excerpt(?string $value, int $limit = 160): string
    {
        $clean = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $value)));

        return $clean === '' ? '' : Str::limit($clean, $limit, '…');
    }

    private static function absolute(string $url): string
    {
        return Str::startsWith($url, ['http://', 'https://'])
            ? $url
            : self::BASE.'/'.ltrim($url, '/');
    }
}
