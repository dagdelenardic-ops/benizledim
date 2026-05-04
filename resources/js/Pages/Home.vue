<script setup>
import { computed } from 'vue';
import { Link, useForm, usePage } from '@inertiajs/vue3';
import AppLayout from '../Components/Layout/AppLayout.vue';
import PostGrid from '../Components/Post/PostGrid.vue';
import { buildResponsiveImage } from '@/Utils/responsiveImage';

const props = defineProps({
    posts: {
        type: Array,
        default: () => [],
    },
    categories: {
        type: Array,
        default: () => [],
    },
    spotlights: {
        type: Array,
        default: () => [],
    },
});

const form = useForm({ email: '' });
const page = usePage();
const newsletterMessage = computed(() => page.props.flash?.newsletter_message);
const featuredPost = computed(() => props.posts[0] || null);
const gridPosts = computed(() => props.posts.slice(1, 7));
const railPosts = computed(() => props.posts.slice(0, 5));
const secondarySpotlights = computed(() => props.spotlights.filter((item) => item.label !== 'Ne İzlesem'));
const featuredImage = computed(() => buildResponsiveImage(featuredPost.value?.cover_image, {
    widths: [480, 768, 1280, 1600],
    sizes: '100vw',
    fallbackWidth: 1280,
}));
const homeDescription = 'Film, dizi ve belgesel eleştirileri, izleme önerileri, podcast notları ve festival rehberi.';

const firstCategoryName = (post) => {
    return post?.categories?.[0]?.name || 'Yazı';
};

const formatReadingTime = (minutes) => {
    return minutes ? `${minutes} dk okuma` : '2 dk okuma';
};

const coverImageStyle = (post) => ({
    '--hero-image-position-mobile': `${post?.cover_image_mobile_focus_x ?? post?.cover_image_focus_x ?? 50}% ${post?.cover_image_mobile_focus_y ?? post?.cover_image_focus_y ?? 50}%`,
    '--hero-image-position-desktop': `${post?.cover_image_focus_x ?? 50}% ${post?.cover_image_focus_y ?? 50}%`,
});

const subscribe = () => {
    form.post('/newsletter', {
        preserveScroll: true,
        onSuccess: () => form.reset(),
    });
};
</script>

<template>
    <AppLayout title="Ana Sayfa" :description="homeDescription" :canonical-url="'https://benizledim.com/'" :og-image="featuredPost?.cover_image || '/images/og-default.png'">
        <section class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)]">
            <div v-if="featuredPost" class="bi-wrap py-5">
                <div class="grid gap-5">
                    <Link :href="`/yazi/${featuredPost.slug}`" class="group overflow-hidden border border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]">
                        <div class="relative h-[150px] overflow-hidden border-b border-[var(--bi-ink)] bg-[var(--bi-ink)] md:h-[174px] lg:h-[190px]">
                            <img
                                v-if="featuredPost.cover_image"
                                :src="featuredImage.src"
                                :srcset="featuredImage.srcset || undefined"
                                :sizes="featuredImage.sizes || undefined"
                                :alt="featuredPost.title"
                                :style="coverImageStyle(featuredPost)"
                                class="featured-hero-image h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105"
                                loading="eager"
                                fetchpriority="high"
                                decoding="async"
                                width="1600"
                                height="900"
                            />
                            <div v-else class="grid h-full place-items-center text-7xl font-bold text-[var(--bi-paper)] bi-serif">
                                Bİ
                            </div>
                            <div class="absolute bottom-0 left-0 border-r border-t border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3">
                                <span class="block text-3xl font-bold leading-none bi-serif">Manşet</span>
                                <span class="block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">Bu haftanın yazısı</span>
                            </div>
                        </div>
                        <div class="relative flex flex-col p-5 md:p-6">
                            <div>
                                <div class="flex items-start justify-between gap-4">
                                    <div>
                                        <span class="bi-kicker">{{ firstCategoryName(featuredPost) }}</span>
                                        <h1 class="bi-serif mt-3 max-w-4xl text-[clamp(2rem,4.2vw,3.9rem)] font-bold leading-[0.96] text-[var(--bi-ink)]">
                                            {{ featuredPost.title }}
                                        </h1>
                                    </div>
                                    <span class="hidden text-6xl font-bold leading-none text-black/5 bi-serif md:block">01</span>
                                </div>

                                <p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--bi-muted)] md:text-base md:leading-7">
                                    {{ featuredPost.excerpt }}
                                </p>
                            </div>

                            <div class="mt-5 flex flex-wrap items-center gap-3">
                                <span class="inline-flex items-center gap-3 bg-[var(--bi-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] transition group-hover:bg-red-700 bi-mono">
                                    Yazıyı oku
                                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M13 6l6 6-6 6" />
                                    </svg>
                                </span>
                                <div class="text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">
                                    {{ featuredPost.user?.name || 'Ben İzledim' }}
                                    <span class="mx-2 text-black/20">/</span>
                                    {{ formatReadingTime(featuredPost.reading_time_minutes) }}
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div v-else class="bi-wrap py-16">
                <div class="bi-rule-box p-8 text-center">
                    <h1 class="bi-serif text-5xl font-bold">Ben İzledim</h1>
                    <p class="mt-4 text-[var(--bi-muted)]">Yazılar hazırlanıyor.</p>
                </div>
            </div>
        </section>

        <section class="bi-wrap grid gap-8 py-8 lg:grid-cols-[1fr_320px]">
            <div>
                <div class="mb-6 flex items-end justify-between border-b border-[var(--bi-ink)] pb-4">
                    <div>
                        <span class="bi-kicker">01</span>
                        <h2 class="bi-serif mt-2 text-4xl font-bold text-[var(--bi-ink)] md:text-5xl">Son Yazılar</h2>
                    </div>
                    <Link href="/yazilar" class="hidden text-sm font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900 bi-mono md:inline-flex">
                        Tüm yazılar
                    </Link>
                </div>
                <PostGrid :posts="gridPosts.length ? gridPosts : posts" />
            </div>

            <aside class="h-fit border border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]">
                <div class="border-b border-[var(--bi-ink)] bg-[var(--bi-ink)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] bi-mono">
                    En Yeni
                </div>
                <Link
                    v-for="(post, index) in railPosts"
                    :key="post.id"
                    :href="`/yazi/${post.slug}`"
                    class="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[var(--bi-rule-soft)] p-4 last:border-b-0 hover:bg-[var(--bi-paper)]"
                >
                    <span class="text-3xl font-bold leading-none text-red-700 bi-serif">{{ String(index + 1).padStart(2, '0') }}</span>
                    <span>
                        <span class="bi-mono block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">{{ firstCategoryName(post) }}</span>
                        <span class="bi-serif mt-1 block text-xl font-bold leading-tight">{{ post.title }}</span>
                    </span>
                </Link>
            </aside>
        </section>

        <section class="border-y border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]">
            <div class="bi-wrap py-10">
                <div class="mb-6 flex items-end justify-between gap-4 border-b border-[var(--bi-ink)] pb-4">
                    <div>
                        <span class="bi-kicker">Aşağıda Daha Fazlası Var</span>
                        <h2 class="bi-serif mt-2 text-3xl font-bold text-[var(--bi-ink)] md:text-4xl">İncelemelerin Yanında Bunlar da Var</h2>
                    </div>
                    <span class="hidden text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono md:block">Scroll ettikçe keşfet</span>
                </div>

                <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Link
                        v-for="item in secondarySpotlights"
                        :key="item.label"
                        :href="item.href"
                        class="group flex min-h-[220px] flex-col justify-between border border-[var(--bi-ink)] bg-white p-5 transition-transform duration-300 hover:-translate-y-1 hover:bg-[var(--bi-paper)]"
                        :class="{
                            'shadow-[10px_10px_0_rgba(176,0,32,0.08)]': item.tone === 'red',
                            'shadow-[10px_10px_0_rgba(17,17,17,0.08)]': item.tone === 'ink',
                            'shadow-[10px_10px_0_rgba(120,113,108,0.12)]': item.tone === 'stone',
                        }"
                    >
                        <div>
                            <span class="bi-kicker">{{ item.label }}</span>
                            <h3 class="bi-serif mt-3 text-3xl font-bold leading-tight text-[var(--bi-ink)]">{{ item.title }}</h3>
                            <p class="mt-3 text-sm leading-6 text-[var(--bi-muted)]">{{ item.description }}</p>
                        </div>

                        <div class="mt-6 flex items-end justify-between gap-3 border-t border-[var(--bi-rule-soft)] pt-4">
                            <div class="text-xs font-bold uppercase tracking-[0.08em] text-red-700 bi-mono">{{ item.metric }}</div>
                            <span class="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--bi-ink)] bi-mono group-hover:text-red-700">
                                {{ item.cta }}
                                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>

        <section class="border-y-2 border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]">
            <div class="bi-wrap grid gap-8 py-12 md:grid-cols-[1fr_1.1fr] md:items-center">
                <div>
                    <span class="bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-300">Bülten</span>
                    <h2 class="bi-serif mt-2 text-4xl font-bold md:text-5xl">Önce Siz Okuyun</h2>
                    <p class="mt-4 max-w-xl text-stone-300">
                        Yeni yazılar, festival notları ve izleme önerileri. Kısa, seçilmiş, gürültüsüz.
                    </p>
                </div>
                <div>
                    <div v-if="newsletterMessage" class="mb-4 border border-green-200 bg-green-100 px-4 py-3 text-green-700">
                        {{ newsletterMessage }}
                    </div>
                    <form @submit.prevent="subscribe" class="flex flex-col gap-3 sm:flex-row" novalidate>
                        <input
                            v-model="form.email"
                            type="email"
                            placeholder="E-posta adresiniz"
                            class="min-w-0 flex-1 border border-stone-500 bg-transparent px-4 py-3 text-white placeholder-stone-400 focus:border-red-400 focus:outline-none"
                            :class="{ 'border-red-500': form.errors.email }"
                        />
                        <button
                            type="submit"
                            :disabled="form.processing"
                            class="bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
                        >
                            <span v-if="form.processing">Gönderiliyor...</span>
                            <span v-else>Abone Ol</span>
                        </button>
                    </form>
                    <p v-if="form.errors.email" class="mt-2 text-sm text-red-300">{{ form.errors.email }}</p>
                </div>
            </div>
        </section>

        <section class="border-t border-[var(--bi-rule-soft)] bg-[var(--bi-paper)]">
            <div class="bi-wrap py-8">
                <details class="border border-[var(--bi-rule-soft)] bg-[var(--bi-paper-deep)] open:bg-[var(--bi-paper)]">
                    <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left">
                        <span>
                            <span class="block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">İstersen bak</span>
                            <span class="bi-serif mt-1 block text-2xl font-bold text-[var(--bi-ink)]">Keşfet</span>
                        </span>
                        <span class="text-xs font-bold uppercase tracking-[0.08em] text-red-700 bi-mono">Kategorileri Aç</span>
                    </summary>

                    <div class="border-t border-[var(--bi-rule-soft)] px-4 py-4">
                        <div class="flex flex-wrap items-center gap-3">
                            <Link
                                v-for="category in categories"
                                :key="category.id"
                                :href="`/yazilar?category=${category.slug}`"
                                class="bi-chip whitespace-nowrap"
                            >
                                {{ category.name }}
                                <span class="text-current/60">{{ category.posts_count }}</span>
                            </Link>
                        </div>
                    </div>
                </details>
            </div>
        </section>
    </AppLayout>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.featured-hero-image {
    object-position: var(--hero-image-position-mobile, 50% 50%);
}

@media (min-width: 768px) {
    .featured-hero-image {
        object-position: var(--hero-image-position-desktop, 50% 50%);
    }
}

</style>
