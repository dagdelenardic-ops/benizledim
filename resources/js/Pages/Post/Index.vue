<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import PostGrid from '../../Components/Post/PostGrid.vue';

const props = defineProps({
    posts: {
        type: Object,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
});

const getPageTitle = () => {
    if (props.filters.category) {
        const category = props.categories.find(c => c.slug === props.filters.category);
        return category ? `${category.name} Yazıları` : 'Yazılar';
    }
    if (props.filters.tag) {
        return `Etiket: ${props.filters.tag}`;
    }
    return 'Tüm Yazılar';
};

const isActiveCategory = (slug) => {
    return props.filters.category === slug;
};

const pageDescription = computed(() => {
    if (props.filters.category) {
        const category = props.categories.find((item) => item.slug === props.filters.category);
        return category
            ? `${category.name} kategorisindeki film, dizi ve belgesel yazıları.`
            : 'Ben İzledim arşivindeki tüm yazılar.';
    }

    if (props.filters.tag) {
        return `${props.filters.tag} etiketiyle işaretlenmiş Ben İzledim yazıları.`;
    }

    return 'Ben İzledim arşivindeki tüm film, dizi ve belgesel yazıları.';
});

const currentCanonical = computed(() => {
    const params = new URLSearchParams();

    if (props.filters.category) params.set('category', props.filters.category);
    if (props.filters.tag) params.set('tag', props.filters.tag);

    const queryString = params.toString();

    return queryString
        ? `https://benizledim.com/yazilar?${queryString}`
        : 'https://benizledim.com/yazilar';
});
</script>

<template>
    <AppLayout :title="getPageTitle()" :description="pageDescription" :canonical-url="currentCanonical">
        <div class="min-h-screen bg-[var(--bi-paper)]">
            <div class="border-b-2 border-[var(--bi-ink)]">
                <div class="bi-wrap py-8">
                    <span class="bi-kicker">Arşiv</span>
                    <h1 class="bi-serif mt-3 text-5xl font-bold leading-none text-[var(--bi-ink)] md:text-7xl">
                        {{ getPageTitle() }}
                    </h1>
                    <p class="mt-4 max-w-2xl text-[var(--bi-muted)]">
                        Film, dizi ve belgesel dünyasından eleştiri ve tavsiyeler
                    </p>
                </div>
            </div>

            <div class="sticky top-0 z-10 border-b border-[var(--bi-ink)] bg-[var(--bi-paper)]/95 backdrop-blur">
                <div class="bi-wrap py-4">
                    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <Link
                            href="/yazilar"
                            :class="[
                                'bi-chip whitespace-nowrap',
                                !filters.category && !filters.tag
                                    ? 'is-active'
                                    : ''
                            ]"
                        >
                            Tümü
                        </Link>
                        <Link
                            v-for="category in categories"
                            :key="category.id"
                            :href="`/yazilar?category=${category.slug}`"
                            :class="[
                                'bi-chip whitespace-nowrap',
                                isActiveCategory(category.slug)
                                    ? 'is-active'
                                    : ''
                            ]"
                        >
                            {{ category.name }}
                        </Link>
                    </div>

                    <div v-if="filters.category || filters.tag" class="mt-4">
                        <Link
                            href="/yazilar"
                            class="inline-flex items-center gap-2 border border-red-700 px-3 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-700 hover:text-white"
                        >
                            Filtreyi Temizle
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <div class="bi-wrap py-8">
                <PostGrid :posts="posts.data" />

                <div v-if="posts.data.length === 0" class="bi-rule-box mt-6 text-center py-16">
                    <svg class="w-16 h-16 mx-auto text-[var(--bi-rule-soft)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="bi-serif text-3xl font-bold text-[var(--bi-ink)] mb-2">Sonuç bulunamadı</h3>
                    <p class="text-[var(--bi-muted)]">Seçtiğiniz kriterlere uygun yazı bulunmuyor.</p>
                    <Link
                        href="/yazilar"
                        class="mt-4 inline-flex items-center gap-2 text-red-700 font-bold hover:text-red-900"
                    >
                        Tüm yazıları gör
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div v-if="posts.links && posts.data.length > 0" class="mt-12 flex justify-center">
                    <div class="flex items-center gap-2">
                        <Link
                            v-for="(link, index) in posts.links"
                            :key="index"
                            :href="link.url || '#'
                            "
                            :class="[
                                'border px-4 py-2 text-sm font-bold transition-colors',
                                link.active
                                    ? 'border-red-700 bg-red-700 text-white'
                                    : link.url
                                        ? 'border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]'
                                        : 'border-[var(--bi-rule-soft)] text-[var(--bi-muted)] cursor-not-allowed'
                            ]"
                            v-html="link.label"
                        />
                    </div>
                </div>
            </div>
        </div>
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
