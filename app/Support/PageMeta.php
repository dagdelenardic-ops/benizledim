<?php

namespace App\Support;

use Illuminate\Http\Request;

/**
 * Pages 2..N of every listing used to repeat page one's title and description
 * verbatim. Search Console reports that as duplicate metadata, and it leaves
 * the deeper pages with nothing of their own to rank on.
 */
class PageMeta
{
    public static function title(string $title, Request $request): string
    {
        $page = $request->integer('page', 1);

        return $page > 1 ? $title.' - Sayfa '.$page : $title;
    }

    public static function description(string $description, Request $request): string
    {
        $page = $request->integer('page', 1);

        return $page > 1 ? rtrim($description, '.').' - sayfa '.$page.'.' : $description;
    }
}
