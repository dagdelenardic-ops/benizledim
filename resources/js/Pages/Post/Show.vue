<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import RelatedPosts from '../../Components/Post/RelatedPosts.vue';
import CommentForm from '../../Components/Comment/CommentForm.vue';
import CommentList from '../../Components/Comment/CommentList.vue';
import WixComments from '../../Components/Comment/WixComments.vue';
import LikeButton from '../../Components/UI/LikeButton.vue';
import ShareButtons from '../../Components/Post/ShareButtons.vue';
import EntrySection from '../../Components/Entry/EntrySection.vue';
import TimeCapsuleBanner from '../../Components/Post/TimeCapsuleBanner.vue';
import DialogueView from '../../Components/Post/DialogueView.vue';
import VisualEssayView from '../../Components/Post/VisualEssayView.vue';
import LoginModal from '../../Components/Auth/LoginModal.vue';
import ArticleBody from '../../Components/Article/ArticleBody.vue';
import WatchlistButton from '../../Components/Social/WatchlistButton.vue';
import { useDate } from '@/Composables/useDate';
import { buildResponsiveImage } from '@/Utils/responsiveImage';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
    relatedPosts: {
        type: Array,
        default: () => [],
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isWatchlisted: {
        type: Boolean,
        default: false,
    },
    userEntryVotes: {
        type: Object,
        default: () => ({}),
    },
});

const { formatDate, timeAgo } = useDate();
const showLoginModal = ref(false);
const page = usePage();
const authUser = computed(() => page.props.auth?.user);
const readingProgress = ref(0);
const articleBody = ref(null);
let readingProgressFrame = null;
const coverImage = computed(() => buildResponsiveImage(props.post.cover_image, {
    widths: [768, 1280, 1600],
    sizes: '100vw',
    fallbackWidth: 1280,
}));

const canonicalUrl = computed(() => `https://benizledim.com/yazi/${props.post.slug}`);

const toAbsoluteUrl = (value) => {
    if (!value) return 'https://benizledim.com/images/og-default.png';
    return value.startsWith('http') ? value : `https://benizledim.com${value}`;
};

const stripHtml = (value = '') => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const slugifyHeading = (value = '') => value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const analyzeContent = (html = '') => {
    const seen = new Map();
    const items = [];

    const processedHtml = html.replace(/<(h2|h3)([^>]*)>(.*?)<\/\1>/gis, (match, tag, attrs = '', inner = '') => {
        const text = stripHtml(inner);

        if (!text) {
            return match;
        }

        const baseId = slugifyHeading(text) || `section-${items.length + 1}`;
        const seenCount = seen.get(baseId) || 0;
        seen.set(baseId, seenCount + 1);
        const id = seenCount ? `${baseId}-${seenCount + 1}` : baseId;
        const cleanedAttrs = attrs.replace(/\sid=(['"]).*?\1/i, '');

        items.push({
            id,
            text,
            level: tag.toLowerCase(),
        });

        return `<${tag}${cleanedAttrs} id="${id}">${inner}</${tag}>`;
    });

    // Inline content images were imported with raw "/storage/..." paths, which are
    // not publicly served on the shared host (no working storage symlink). The rest
    // of the site serves images through the /img/variant proxy; mirror that here so
    // body images render (and get responsive WebP variants) like cover images do.
    const htmlWithImages = processedHtml.replace(/<img\b[^>]*>/gi, (tag) => {
        const srcMatch = tag.match(/\ssrc\s*=\s*(["'])(.*?)\1/i);

        if (!srcMatch) {
            return tag;
        }

        const rawSrc = srcMatch[2].trim().replace(/^https?:\/\/(www\.)?benizledim\.com/i, '');

        if (!rawSrc.startsWith('/storage/')) {
            return tag;
        }

        const responsive = buildResponsiveImage(rawSrc, {
            widths: [768, 960, 1280, 1600],
            fallbackWidth: 1280,
            sizes: '(max-width: 768px) 100vw, 750px',
        });

        let rebuilt = tag
            .replace(/\ssrcset\s*=\s*(["']).*?\1/i, '')
            .replace(/\ssizes\s*=\s*(["']).*?\1/i, '')
            .replace(/\ssrc\s*=\s*(["']).*?\1/i, () => ` src="${responsive.src}"`);

        const injected = ` srcset="${responsive.srcset}" sizes="${responsive.sizes}"`
            + (/\sloading\s*=/i.test(rebuilt) ? '' : ' loading="lazy"')
            + (/\sdecoding\s*=/i.test(rebuilt) ? '' : ' decoding="async"');

        return rebuilt.replace(/<img\b/i, () => `<img${injected}`);
    });

    const wordCount = stripHtml(html).split(/\s+/).filter(Boolean).length;

    return {
        html: htmlWithImages,
        items,
        wordCount,
    };
};

const contentAnalysis = computed(() => analyzeContent(props.post.content || ''));
const processedContent = computed(() => contentAnalysis.value.html);
const tocItems = computed(() => contentAnalysis.value.items);
const shouldShowToc = computed(() => {
    const isStandardPost = !props.post.format || props.post.format === 'standard';

    return isStandardPost && contentAnalysis.value.wordCount > 1500 && tocItems.value.length >= 3;
});

const articleSchema = computed(() => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': props.post.title,
        'description': props.post.excerpt || '',
        'image': [toAbsoluteUrl(props.post.cover_image)],
        'datePublished': props.post.published_at,
        'dateModified': props.post.updated_at || props.post.published_at,
        'inLanguage': 'tr-TR',
        'author': {
            '@type': 'Person',
            'name': props.post.user?.name || 'Ben İzledim',
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'Ben İzledim',
            'url': 'https://benizledim.com',
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': canonicalUrl.value,
        },
    };

    if (contentAnalysis.value?.wordCount) {
        schema.wordCount = contentAnalysis.value.wordCount;
    }

    if (props.post.categories?.length) {
        schema.articleSection = props.post.categories[0].name;
    }

    if (props.post.tags?.length) {
        schema.keywords = props.post.tags.map((t) => t.name).filter(Boolean).join(', ');
    }

    return schema;
});

const articleMeta = computed(() => ([
    { property: 'article:published_time', content: props.post.published_at || '' },
    { property: 'article:modified_time', content: props.post.updated_at || props.post.published_at || '' },
    { property: 'article:author', content: props.post.user?.name || 'Ben İzledim' },
].filter((item) => item.content)));

const formatReadingTime = (minutes) => {
    if (!minutes) return '2 dk okuma';
    return `${minutes} dk okuma`;
};

const openLoginModal = () => {
    showLoginModal.value = true;
};

const closeLoginModal = () => {
    showLoginModal.value = false;
};

const updateReadingProgress = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    const bodyElement = articleBody.value ?? document.querySelector('[data-reading-body]');
    const proseElement = bodyElement?.querySelector('.prose') ?? bodyElement;

    if (!proseElement) {
        readingProgress.value = 0;
        return;
    }

    const rect = proseElement.getBoundingClientRect();
    const totalScrollable = Math.max(rect.height - window.innerHeight * 0.45, 1);
    const consumed = Math.max(-rect.top + 120, 0);

    readingProgress.value = Math.min(Math.max(consumed / totalScrollable, 0), 1);
};

onMounted(() => {
    const syncReadingProgress = () => {
        updateReadingProgress();
        readingProgressFrame = window.requestAnimationFrame(syncReadingProgress);
    };

    syncReadingProgress();
});

onBeforeUnmount(() => {
    if (readingProgressFrame !== null) {
        window.cancelAnimationFrame(readingProgressFrame);
        readingProgressFrame = null;
    }
});
</script>

<template>
    <AppLayout
        :title="post.title"
        :description="post.excerpt || 'Film, Dizi ve Belgesel eleştirileri - Ben İzledim'"
        :og-image="post.cover_image || '/images/og-default.png'"
        :canonical-url="canonicalUrl"
        og-type="article"
        :schema-nodes="[articleSchema]"
        :extra-meta="articleMeta"
    >
        <div class="fixed inset-x-0 top-0 z-[80] h-1 bg-black/5">
            <div class="h-full origin-left bg-red-600 transition-transform duration-150 ease-out" :style="{ transform: `scaleX(${readingProgress})` }"></div>
        </div>

        <article class="min-h-screen bg-white">
            <!-- Cover Image -->
            <div class="w-full h-64 md:h-96 lg:h-[500px] bg-gray-900 relative overflow-hidden">
                <img
                    v-if="post.cover_image"
                    :src="coverImage.src"
                    :srcset="coverImage.srcset || undefined"
                    :sizes="coverImage.sizes || undefined"
                    :alt="post.title"
                    class="w-full h-full object-cover opacity-90"
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    width="1600"
                    height="900"
                />
                <div
                    v-else
                    class="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center"
                >
                    <span class="text-white text-6xl font-bold">Bİ</span>
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            </div>

            <!-- Content Container -->
            <div class="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
                <div class="bg-white rounded-t-2xl md:rounded-2xl shadow-sm p-6 md:p-10">
                    <!-- Categories (en fazla 3 göster) -->
                    <div class="flex flex-wrap gap-2 mb-4">
                        <Link
                            v-for="category in post.categories.slice(0, 3)"
                            :key="category.id"
                            :href="`/yazilar?category=${category.slug}`"
                            class="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors"
                        >
                            {{ category.name }}
                        </Link>
                        <span
                            v-if="post.categories.length > 3"
                            class="px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-full"
                            :title="post.categories.slice(3).map((c) => c.name).join(', ')"
                        >
                            +{{ post.categories.length - 3 }}
                        </span>
                    </div>

                    <!-- Title -->
                    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {{ post.title }}
                    </h1>

                    <!-- Meta -->
                    <div class="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200">
                        <!-- Author -->
                        <Link
                            v-if="post.user"
                            :href="`/profile/${post.user.id}`"
                            class="flex items-center gap-2 hover:text-red-600 transition-colors"
                        >
                            <img
                                v-if="post.user.avatar"
                                :src="post.user.avatar"
                                :alt="post.user.name"
                                class="w-10 h-10 rounded-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                            <div
                                v-else
                                class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold"
                            >
                                {{ post.user.name?.charAt(0)?.toUpperCase() }}
                            </div>
                            <div>
                                <span class="block font-medium text-gray-900">{{ post.user.name }}</span>
                                <span class="text-gray-500">Yazar</span>
                            </div>
                        </Link>

                        <!-- Date -->
                        <div class="flex items-center gap-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{{ formatDate(post.published_at) }}</span>
                        </div>

                        <!-- Reading Time -->
                        <div class="flex items-center gap-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{{ formatReadingTime(post.reading_time_minutes) }}</span>
                        </div>

                        <!-- Views -->
                        <div class="flex items-center gap-1">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{{ post.view_count?.toLocaleString('tr-TR') }} görüntülenme</span>
                        </div>
                    </div>

                    <!-- Time Capsule Banner -->
                    <TimeCapsuleBanner
                        v-if="post.is_revisit || (post.revisits && post.revisits.length > 0)"
                        :original-post="post.original_post"
                        :revisits="post.revisits || []"
                        :is-revisit="post.is_revisit"
                        :current-published-at="post.published_at"
                        class="mb-8"
                    />

                    <!-- Excerpt -->
                    <div v-if="post.excerpt" class="mx-auto mb-8 max-w-[750px] text-xl leading-relaxed text-gray-600 italic">
                        {{ post.excerpt }}
                    </div>

                    <!-- Content: Standard Format -->
                    <div v-if="!post.format || post.format === 'standard'" class="lg:grid lg:grid-cols-[minmax(0,750px)_240px] lg:items-start lg:gap-10">
                        <div ref="articleBody" data-reading-body class="min-w-0">
                            <ArticleBody
                                :html="processedContent"
                                class="prose prose-lg mx-auto max-w-[750px] prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:hover:text-red-700"
                            />
                        </div>

                        <aside v-if="shouldShowToc" class="hidden lg:block">
                            <div class="sticky top-24 border border-gray-200 bg-gray-50 p-4">
                                <div class="text-xs font-bold uppercase tracking-[0.08em] text-gray-500">İçindekiler</div>
                                <nav class="mt-3 space-y-2">
                                    <a
                                        v-for="item in tocItems"
                                        :key="item.id"
                                        :href="`#${item.id}`"
                                        class="block text-sm leading-5 text-gray-600 transition-colors hover:text-red-600"
                                        :class="item.level === 'h3' ? 'pl-4' : ''"
                                    >
                                        {{ item.text }}
                                    </a>
                                </nav>
                            </div>
                        </aside>
                    </div>

                    <!-- Content: Dialogue Format -->
                    <DialogueView
                        v-else-if="post.format === 'dialogue'"
                        :exchanges="post.dialogue_exchanges || []"
                        :primary-author="post.user"
                        :secondary-author="post.secondary_author"
                        :intro="post.content"
                    />

                    <!-- Content: Visual Essay Format -->
                    <VisualEssayView
                        v-else-if="post.format === 'visual_essay'"
                        :blocks="post.visual_essay_blocks || []"
                    />

                    <!-- Tags -->
                    <div v-if="post.tags?.length > 0" class="mx-auto mt-10 max-w-[750px] border-t border-gray-200 pt-8">
                        <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Etiketler</h3>
                        <div class="flex flex-wrap gap-2">
                            <span
                                v-for="tag in post.tags"
                                :key="tag.id"
                                class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                                #{{ tag.name }}
                            </span>
                        </div>
                    </div>

                    <!-- Engagement Stats -->
                    <div class="mx-auto mt-8 flex max-w-[750px] flex-col gap-4 border-t border-gray-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex items-center gap-3">
                            <LikeButton
                                :post-slug="post.slug"
                                :likes-count="post.likes_count || 0"
                                :is-liked="isLiked"
                                @open-login="openLoginModal"
                            />
                            <WatchlistButton
                                v-if="authUser"
                                :post="post"
                                :initial-watchlisted="isWatchlisted"
                            />
                        </div>
                        <ShareButtons
                            :title="post.title"
                            :url="typeof window !== 'undefined' ? window.location.href : ''"
                        />
                    </div>
                </div>
            </div>

            <!-- Entry Section -->
            <div class="max-w-4xl mx-auto px-4 py-8">
                <EntrySection
                    :entries="post.entries || []"
                    :post-slug="post.slug"
                    :user-votes="userEntryVotes"
                    @open-login="openLoginModal"
                />
            </div>

            <!-- Comments Section -->
            <div class="max-w-4xl mx-auto px-4 py-8">
                <CommentForm
                    :post-slug="post.slug"
                    @open-login="openLoginModal"
                />
                <CommentList :comments="post.comments || []" />
                
                <!-- Wix Legacy Comments -->
                <WixComments :comments="post.wix_comments || []" />
            </div>

            <!-- Related Posts -->
            <div class="max-w-7xl mx-auto px-4 py-12">
                <RelatedPosts :posts="relatedPosts" />
            </div>
        </article>

        <!-- Login Modal -->
        <LoginModal :show="showLoginModal" @close="closeLoginModal" />
    </AppLayout>
</template>
