<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
    <channel>
        <title>Ben İzledim</title>
        <link>https://benizledim.com</link>
        <description>Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazıları</description>
        <language>tr</language>
        <lastBuildDate>{{ now()->toRfc2822String() }}</lastBuildDate>
        <atom:link href="https://benizledim.com/feed" rel="self" type="application/rss+xml" />
        <image>
            <url>https://benizledim.com/images/og-default.png</url>
            <title>Ben İzledim</title>
            <link>https://benizledim.com</link>
        </image>
        @foreach($posts as $post)
        <item>
            <title>{{ htmlspecialchars($post->title, ENT_XML1, 'UTF-8') }}</title>
            <link>https://benizledim.com/yazi/{{ $post->slug }}</link>
            <guid isPermaLink="true">https://benizledim.com/yazi/{{ $post->slug }}</guid>
            <description>{{ htmlspecialchars($post->excerpt ?? '', ENT_XML1, 'UTF-8') }}</description>
            <dc:creator>{{ htmlspecialchars($post->user?->name ?? 'Ben İzledim', ENT_XML1, 'UTF-8') }}</dc:creator>
            @foreach($post->categories as $category)
            <category>{{ htmlspecialchars($category->name, ENT_XML1, 'UTF-8') }}</category>
            @endforeach
            <pubDate>{{ $post->published_at->toRfc2822String() }}</pubDate>
            @if($post->cover_image)
            <enclosure url="{{ $post->cover_image }}" type="image/jpeg" />
            @endif
        </item>
        @endforeach
    </channel>
</rss>
