<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://benizledim.com</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://benizledim.com/yazilar</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://benizledim.com/podcast</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://benizledim.com/festival</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    @foreach($categories as $category)
    <url>
        <loc>https://benizledim.com/yazilar?category={{ $category->slug }}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach
    @foreach($posts as $post)
    <url>
        <loc>https://benizledim.com/yazi/{{ $post->slug }}</loc>
        <lastmod>{{ $post->updated_at->toIso8601String() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    @endforeach
</urlset>
