<script setup>
import { ref, watch } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import PostGrid from '../../Components/Post/PostGrid.vue';

const props = defineProps({
    posts: {
        type: Object,
        default: () => ({}),
    },
    query: {
        type: String,
        default: '',
    },
});

const searchQuery = ref(props.query);

const handleSearch = () => {
    if (searchQuery.value.trim().length >= 2) {
        router.get('/ara', { q: searchQuery.value.trim() }, {
            preserveState: true,
            replace: true,
        });
    }
};

const hasResults = () => {
    return props.posts.data && props.posts.data.length > 0;
};

const resultCount = () => {
    return props.posts.total || 0;
};
</script>

<template>
    <AppLayout title="Arama">
        <div class="min-h-screen bg-gray-50">
            <!-- Search Header -->
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-4xl mx-auto px-4 py-12">
                    <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">Yazı Ara</h1>
                    
                    <!-- Search Form -->
                    <form @submit.prevent="handleSearch" class="relative max-w-2xl mx-auto">
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Film, dizi veya belgesel ara..."
                            class="w-full px-6 py-4 pr-14 text-lg rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                        />
                        <button
                            type="submit"
                            class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    <!-- Search Tips -->
                    <p class="text-center text-gray-500 mt-4 text-sm">
                        En az 2 karakter girerek arama yapabilirsiniz
                    </p>
                </div>
            </div>

            <!-- Results -->
            <div class="max-w-7xl mx-auto px-4 py-8">
                <!-- Results Header -->
                <div v-if="query" class="mb-6">
                    <h2 class="text-xl font-semibold text-gray-900">
                        "{{ query }}" için arama sonuçları
                        <span v-if="resultCount() > 0" class="text-gray-500 font-normal">
                            ({{ resultCount() }} sonuç)
                        </span>
                    </h2>
                </div>

                <!-- Results Grid -->
                <PostGrid v-if="hasResults()" :posts="posts.data" />

                <!-- No Results -->
                <div v-else-if="query && query.length >= 2" class="text-center py-16">
                    <svg class="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="text-2xl font-semibold text-gray-900 mb-3">
                        Sonuç bulunamadı
                    </h3>
                    <p class="text-gray-500 max-w-md mx-auto mb-6">
                        "{{ query }}" aramanızla eşleşen yazı bulunamadı. Farklı bir kelime deneyin veya yazımı kontrol edin.
                    </p>
                    <Link
                        href="/yazilar"
                        class="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
                    >
                        Tüm yazıları gör
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <!-- Empty State (No Query) -->
                <div v-else-if="!query" class="text-center py-16">
                    <svg class="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p class="text-gray-500 text-lg">
                        Aramaya başlamak için yukarıya bir kelime yazın
                    </p>
                </div>

                <!-- Pagination -->
                <div v-if="hasResults() && posts.links" class="mt-12 flex justify-center">
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
