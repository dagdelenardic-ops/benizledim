<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Services\VertexAiSearchService;
use App\Support\PostCard;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        if ($request->filled('category')) {
            $category = Category::where('slug', (string) $request->query('category'))->firstOrFail();
            $routeParameters = ['category' => $category];

            if ($request->integer('page', 1) > 1) {
                $routeParameters['page'] = $request->integer('page');
            }

            return redirect()->away(route('posts.category', $routeParameters, false), 301);
        }

        $query = Post::articles()
            ->select(PostCard::COLUMNS)
            ->with(PostCard::RELATIONS)
            ->withCount(['comments', 'likes'])
            ->latest('published_at');

        // Tag filtresi
        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', (string) $request->query('tag'));
            });
        }

        $posts = $query
            ->paginate(12)
            ->appends($request->only('tag'))
            ->through(fn (Post $post) => PostCard::make($post));
        $categories = Category::select('id', 'name', 'slug')->withCount('posts')->get();

        $listTitle = 'Tüm Yazılar';
        $listDescription = 'Ben İzledim arşivindeki tüm film, dizi ve belgesel yazıları.';
        if ($request->filled('tag')) {
            $listTitle = 'Etiket: '.$request->tag;
            $listDescription = $request->tag.' etiketiyle işaretlenmiş Ben İzledim yazıları.';
        }

        $canonicalParameters = [];
        if ($request->filled('tag')) {
            $canonicalParameters['tag'] = (string) $request->query('tag');
        }
        if ($request->integer('page', 1) > 1) {
            $canonicalParameters['page'] = $request->integer('page');
        }

        $canonicalUrl = 'https://benizledim.com/yazilar';
        if ($canonicalParameters !== []) {
            $canonicalUrl .= '?'.http_build_query($canonicalParameters, '', '&', PHP_QUERY_RFC3986);
        }

        return Inertia::render('Post/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => $request->only(['category', 'tag']),
            'title' => $listTitle,
            'description' => $listDescription,
            'canonicalUrl' => $canonicalUrl,
        ]);
    }

    public function indexByCategory(Request $request, Category $category)
    {
        $posts = Post::articles()
            ->select(PostCard::COLUMNS)
            ->with(PostCard::RELATIONS)
            ->withCount(['comments', 'likes'])
            ->whereHas('categories', fn ($q) => $q->where('categories.id', $category->id))
            ->latest('published_at')
            ->paginate(12)
            ->through(fn (Post $post) => PostCard::make($post));

        $categories = Category::select('id', 'name', 'slug')->withCount('posts')->get();

        $canonicalUrl = 'https://benizledim.com/yazilar/'.$category->slug;
        if ($request->integer('page', 1) > 1) {
            $canonicalUrl .= '?page='.$request->integer('page');
        }

        return Inertia::render('Post/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => ['category' => $category->slug],
            'title' => $category->name.' Yazıları',
            'description' => $category->name.' kategorisindeki film, dizi ve belgesel eleştiri ve tavsiye yazıları.',
            'canonicalUrl' => $canonicalUrl,
        ]);
    }

    public function show(Request $request, Post $post, VertexAiSearchService $vertex)
    {
        if (! $post->published_at || $post->status !== 'published' || $post->deletion_requested_at) {
            abort(404);
        }

        // View count: session-based dedup to prevent bot/refresh inflation
        $viewKey = 'viewed_post_'.$post->id;
        if (! $request->session()->has($viewKey)) {
            $post->increment('view_count');
            $request->session()->put($viewKey, true);
        }

        // Author relations are column-narrowed: a public page must never carry
        // e-mail addresses or login metadata in its Inertia payload.
        $post->load([
            'user:id,name,avatar,bio', 'categories:id,name,slug', 'tags',
            'comments.user:id,name,avatar',
            'entries.user:id,name,avatar', 'entries.votes',
            'originalPost:id,title,slug,published_at',
            'revisits' => fn ($q) => $q->published()->select('id', 'title', 'slug', 'published_at', 'parent_post_id'),
            'secondaryAuthor:id,name,avatar',
            'dialogueExchanges.user:id,name,avatar',
            'visualEssayBlocks',
        ]);
        $post->loadCount('likes');

        $isLiked = auth()->check()
            ? $post->likes()->where('user_id', auth()->id())->exists()
            : false;
        $isWatchlisted = auth()->check()
            ? $post->watchlistedBy()->where('users.id', auth()->id())->exists()
            : false;

        $relatedPosts = $this->resolveRelatedPosts($post, $vertex);

        $userEntryVotes = [];
        if (auth()->check()) {
            $userEntryVotes = \App\Models\EntryVote::whereIn('entry_id', $post->entries->pluck('id'))
                ->where('user_id', auth()->id())
                ->pluck('vote', 'entry_id')
                ->toArray();
        }

        return Inertia::render('Post/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
            'isLiked' => $isLiked,
            'isWatchlisted' => $isWatchlisted,
            'userEntryVotes' => $userEntryVotes,
        ]);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function resolveRelatedPosts(Post $post, VertexAiSearchService $vertex): array
    {
        $limit = 4;

        if (config('services.gcp.search_enabled')) {
            $moodTags = is_array($post->mood_tags) ? $post->mood_tags : [];
            $signal = trim($post->title.' '.implode(' ', $moodTags));
            $hits = $vertex->search($signal, $limit + 4);
            $ids = collect($hits)->pluck('id')->filter()->map(fn ($id) => (int) $id)
                ->reject(fn ($id) => $id === $post->id)
                ->take($limit)
                ->values();

            if ($ids->isNotEmpty()) {
                $posts = Post::articles()
                    ->select(PostCard::COLUMNS)
                    ->whereIn('id', $ids)
                    ->with(PostCard::RELATIONS)
                    ->withCount(['comments', 'likes'])
                    ->get()
                    ->keyBy('id');

                $ordered = $ids->map(fn ($id) => $posts->get($id))->filter()->values();
                if ($ordered->isNotEmpty()) {
                    return PostCard::collection($ordered);
                }
            }
        }

        $fallback = Post::articles()
            ->select(PostCard::COLUMNS)
            ->where('id', '!=', $post->id)
            ->whereHas('categories', function ($q) use ($post) {
                $q->whereIn('categories.id', $post->categories->pluck('id'));
            })
            ->with(PostCard::RELATIONS)
            ->withCount(['comments', 'likes'])
            ->limit($limit)
            ->latest('published_at')
            ->get();

        return PostCard::collection($fallback);
    }
}
