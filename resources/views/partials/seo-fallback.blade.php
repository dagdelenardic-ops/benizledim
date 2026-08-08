{{-- First-paint HTML for clients that do not run our JavaScript.

     Included two ways from app.blade.php: rendered directly for crawlers, and
     wrapped in <noscript> for everyone else. It used to render for every
     visitor, so a browser painted this unstyled markup and then Vue replaced
     it a beat later -- a visible flash of raw article text on every page load.

     Inherits $component, $props, $base, $clean, $fmtDate and $defaultDesc
     from the including view. --}}
@if ($component === 'Post/Show' && ! empty($props['post']))
    @php $p = $props['post']; @endphp
    <main>
        <article>
            <h1>{{ $clean($p['title'] ?? '') }}</h1>
            @if (! empty($p['excerpt']))
                <p>{{ $clean($p['excerpt']) }}</p>
            @endif
            <p>
                @if (! empty($p['user']['name']))
                    <span>Yazar:
                        @if (! empty($p['user']['id']))
                            <a href="{{ $base }}/profile/{{ $p['user']['id'] }}">{{ $clean($p['user']['name']) }}</a>
                        @else
                            {{ $clean($p['user']['name']) }}
                        @endif
                    </span>
                @endif
                @if (! empty($p['published_at']) && ($d = $fmtDate($p['published_at'])))
                    <time datetime="{{ $p['published_at'] }}">{{ $d }}</time>
                @endif
            </p>
            @if (! empty($p['categories']))
                <p>
                    @foreach ($p['categories'] as $cat)
                        <a href="{{ $base }}/yazilar/{{ $cat['slug'] }}">{{ $clean($cat['name']) }}</a>
                    @endforeach
                </p>
            @endif
            @if (! empty($p['content']))
                <div>{{ $clean($p['content']) }}</div>
            @endif
        </article>
    </main>
@elseif ($component === 'FlashNews/Show' && ! empty($props['item']))
    @php $it = $props['item']; @endphp
    <main>
        <article>
            <h1>{{ $clean($it['title_tr'] ?? '') }}</h1>
            @if (! empty($it['published_at']) && ($d = $fmtDate($it['published_at'])))
                <p><time datetime="{{ $it['published_at'] }}">{{ $d }}</time>@if (! empty($it['source_name'])) — Kaynak: {{ $clean($it['source_name']) }}@endif</p>
            @endif
            @if (! empty($it['summary_tr']))
                <p>{{ $clean($it['summary_tr']) }}</p>
            @endif
            @if (! empty($it['content_tr']))
                <div>{{ $clean($it['content_tr']) }}</div>
            @endif
        </article>
    </main>
@elseif ($component === 'Post/Index')
    <main>
        <h1>{{ $clean($props['title'] ?? 'Yazılar') }}</h1>
        @if (! empty($props['description']))
            <p>{{ $clean($props['description']) }}</p>
        @endif
        @php $postList = $props['posts']['data'] ?? ($props['posts'] ?? []); @endphp
        @if (! empty($postList))
            <ul>
                @foreach ($postList as $p)
                    <li>
                        <a href="{{ $base }}/yazi/{{ $p['slug'] ?? '' }}"><strong>{{ $clean($p['title'] ?? '') }}</strong></a>
                        @if (! empty($p['excerpt']))
                            <p>{{ $clean($p['excerpt'], 200) }}</p>
                        @endif
                    </li>
                @endforeach
            </ul>
        @endif
    </main>
@elseif ($component === 'FlashNews/Index')
    <main>
        <h1>{{ $clean($props['title'] ?? 'Sinema ve Dizi Haberleri') }}</h1>
        @if (! empty($props['description']))
            <p>{{ $clean($props['description']) }}</p>
        @endif
        @php $newsList = $props['items']['data'] ?? ($props['items'] ?? []); @endphp
        @if (! empty($newsList))
            <ul>
                @foreach ($newsList as $it)
                    <li>
                        <a href="{{ $base }}/haber/{{ $it['slug'] ?? '' }}"><strong>{{ $clean($it['title_tr'] ?? '') }}</strong></a>
                        @if (! empty($it['summary_tr']))
                            <p>{{ $clean($it['summary_tr'], 200) }}</p>
                        @endif
                    </li>
                @endforeach
            </ul>
        @endif
    </main>
@elseif ($component === 'Profile/Show' && ! empty($props['author']))
    @php $a = $props['author']; @endphp
    <main>
        <h1>{{ $clean($a['name'] ?? 'Yazar') }}</h1>
        @if (! empty($a['bio']))
            <p>{{ $clean($a['bio']) }}</p>
        @endif
        @php $authorPosts = $props['posts']['data'] ?? ($props['posts'] ?? []); @endphp
        @if (! empty($authorPosts))
            <section>
                <h2>{{ $clean($a['name'] ?? '') }} Yazıları</h2>
                <ul>
                    @foreach ($authorPosts as $p)
                        <li>
                            <a href="{{ $base }}/yazi/{{ $p['slug'] ?? '' }}"><strong>{{ $clean($p['title'] ?? '') }}</strong></a>
                            @if (! empty($p['excerpt']))
                                <p>{{ $clean($p['excerpt'], 180) }}</p>
                            @endif
                        </li>
                    @endforeach
                </ul>
            </section>
        @endif
    </main>
@elseif ($component === 'Home')
    <main>
        <h1>Ben İzledim</h1>
        <p>{{ $defaultDesc }}</p>
        @php $homePosts = $props['posts']['data'] ?? ($props['posts'] ?? []); @endphp
        @if (! empty($homePosts))
            <section>
                <h2>Son Yazılar</h2>
                <ul>
                    @foreach (array_slice($homePosts, 0, 12) as $p)
                        <li>
                            <a href="{{ $base }}/yazi/{{ $p['slug'] ?? '' }}">{{ $clean($p['title'] ?? '') }}</a>
                            @if (! empty($p['excerpt']))
                                — {{ $clean($p['excerpt'], 140) }}
                            @endif
                        </li>
                    @endforeach
                </ul>
            </section>
        @endif
        @php $homeNews = $props['flashNews']['data'] ?? ($props['flashNews'] ?? []); @endphp
        @if (! empty($homeNews))
            <section>
                <h2>Sinema ve Dizi Haberleri</h2>
                <ul>
                    @foreach (array_slice($homeNews, 0, 10) as $it)
                        <li><a href="{{ $base }}/haber/{{ $it['slug'] ?? '' }}">{{ $clean($it['title_tr'] ?? '') }}</a></li>
                    @endforeach
                </ul>
            </section>
        @endif
    </main>
@endif
