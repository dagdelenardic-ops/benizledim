<script setup>
import { computed } from 'vue';
import { Link, useForm, usePage } from '@inertiajs/vue3';
import AppLayout from '../Components/Layout/AppLayout.vue';
import PostGrid from '../Components/Post/PostGrid.vue';

const props = defineProps({
    posts: {
        type: Array,
        default: () => [],
    },
    categories: {
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

const firstCategoryName = (post) => {
    return post?.categories?.[0]?.name || 'Yazı';
};

const formatReadingTime = (minutes) => {
    return minutes ? `${minutes} dk okuma` : '2 dk okuma';
};

const subscribe = () => {
    form.post('/newsletter', {
        preserveScroll: true,
        onSuccess: () => form.reset(),
    });
};
</script>

<template>
    <AppLayout title="Ana Sayfa">
        <section class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)]">
            <div v-if="featuredPost" class="bi-wrap grid gap-6 py-8 lg:grid-cols-[1.05fr_1.15fr_0.8fr] lg:items-stretch">
                <div class="relative border border-[var(--bi-ink)] bg-[var(--bi-paper-deep)] p-5 md:p-7">
                    <span class="bi-kicker">{{ firstCategoryName(featuredPost) }}</span>
                    <h1 class="bi-serif mt-4 text-[clamp(2.8rem,8vw,6.4rem)] font-bold leading-none text-[var(--bi-ink)]">
                        {{ featuredPost.title }}
                    </h1>
                    <p class="mt-5 max-w-2xl text-base leading-7 text-[var(--bi-muted)]">
                        {{ featuredPost.excerpt }}
                    </p>
                    <Link
                        :href="`/yazi/${featuredPost.slug}`"
                        class="mt-7 inline-flex items-center gap-3 bg-[var(--bi-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] transition hover:bg-red-700 bi-mono"
                    >
                        Yazıyı oku
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </Link>
                    <span class="absolute right-4 top-4 hidden text-7xl font-bold leading-none text-black/5 bi-serif md:block">01</span>
                </div>

                <Link :href="`/yazi/${featuredPost.slug}`" class="group relative min-h-[320px] overflow-hidden border border-[var(--bi-ink)] bg-[var(--bi-ink)]">
                    <img
                        v-if="featuredPost.cover_image"
                        :src="featuredPost.cover_image"
                        :alt="featuredPost.title"
                        class="h-full min-h-[320px] w-full object-cover opacity-95 transition duration-500 group-hover:scale-105"
                    />
                    <div v-else class="grid h-full min-h-[320px] place-items-center text-7xl font-bold text-[var(--bi-paper)] bi-serif">
                        Bİ
                    </div>
                    <div class="absolute bottom-0 left-0 border-r border-t border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3">
                        <span class="block text-3xl font-bold leading-none bi-serif">Manşet</span>
                        <span class="block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">Bu haftanın yazısı</span>
                    </div>
                </Link>

                <aside class="flex flex-col justify-between border border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5">
                    <div>
                        <span class="bi-kicker">Editör Masası</span>
                        <p class="mt-4 text-lg leading-8 text-[var(--bi-ink)]">
                            Sinemadan dizilere, festivallerden belgesellere: izlediklerimizi yalnızca tavsiye etmiyor, neden izlemeye değer olduklarını da tartışıyoruz.
                        </p>
                    </div>
                    <div class="mt-8 border-t border-[var(--bi-rule-soft)] pt-4 text-sm text-[var(--bi-muted)] bi-mono">
                        <div>{{ featuredPost.user?.name || 'Ben İzledim' }}</div>
                        <div>{{ formatReadingTime(featuredPost.reading_time_minutes) }}</div>
                    </div>
                </aside>
            </div>

            <div v-else class="bi-wrap py-16">
                <div class="bi-rule-box p-8 text-center">
                    <h1 class="bi-serif text-5xl font-bold">Ben İzledim</h1>
                    <p class="mt-4 text-[var(--bi-muted)]">Yazılar hazırlanıyor.</p>
                </div>
            </div>
        </section>

        <section class="border-b border-[var(--bi-ink)] bg-[var(--bi-paper)]">
            <div class="bi-wrap py-5">
                <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <span class="shrink-0 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">Keşfet</span>
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
        </section>

        <section class="bi-wrap grid gap-8 py-10 lg:grid-cols-[1fr_320px]">
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
</style>
