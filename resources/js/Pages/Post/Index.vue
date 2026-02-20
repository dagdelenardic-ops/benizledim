<script setup>
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
</script>

<template>
    <AppLayout :title="getPageTitle()">
        <div class="bg-gray-50 min-h-screen">
            <!-- Header -->
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 py-8">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {{ getPageTitle() }}
                    </h1>
                    <p class="text-gray-600">
                        Film, dizi ve belgesel dünyasından eleştiri ve tavsiyeler
                    </p>
                </div>
            </div>

            <!-- Categories Filter -->
            <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div class="max-w-7xl mx-auto px-4 py-4">
                    <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <Link
                            href="/yazilar"
                            :class="[
                                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                                !filters.category && !filters.tag
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            ]"
                        >
                            Tümü
                        </Link>
                        <Link
                            v-for="category in categories"
                            :key="category.id"
                            :href="`/yazilar?category=${category.slug}`"
                            :class="[
                                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                                isActiveCategory(category.slug)
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            ]"
                        >
                            {{ category.name }}
                        </Link>
                    </div>

                    <!-- Active Filter Badge -->
                    <div v-if="filters.category || filters.tag" class="mt-4">
                        <Link
                            href="/yazilar"
                            class="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full hover:bg-red-200 transition-colors"
                        >
                            Filtreyi Temizle
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            <!-- Posts Grid -->
            <div class="max-w-7xl mx-auto px-4 py-8">
                <PostGrid :posts="posts.data" />

                <!-- Empty State -->
                <div v-if="posts.data.length === 0" class="text-center py-16">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Sonuç bulunamadı</h3>
                    <p class="text-gray-500">Seçtiğiniz kriterlere uygun yazı bulunmuyor.</p>
                    <Link
                        href="/yazilar"
                        class="inline-flex items-center gap-2 mt-4 text-red-600 font-medium hover:text-red-700"
                    >
                        Tüm yazıları gör
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <!-- Pagination -->
                <div v-if="posts.links && posts.data.length > 0" class="mt-12 flex justify-center">
                    <div class="flex items-center gap-2">
                        <Link
                            v-for="(link, index) in posts.links"
                            :key="index"
                            :href="link.url || '#'
                            "
                            :class="[
                                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                link.active
                                    ? 'bg-red-600 text-white'
                                    : link.url
                                        ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
