<script setup>
import { Link } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import PostGrid from '../../Components/Post/PostGrid.vue';

const props = defineProps({
    tag: {
        type: Object,
        required: true,
    },
    posts: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <AppLayout :title="`#${tag.name}`">
        <div class="min-h-screen bg-gray-50">
            <!-- Hero Section -->
            <div class="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-16">
                <div class="max-w-7xl mx-auto px-4 text-center">
                    <!-- Tag Icon -->
                    <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                    </div>
                    
                    <h1 class="text-4xl md:text-5xl font-bold mb-4">#{{ tag.name }}</h1>
                    <p class="text-lg text-gray-300 max-w-2xl mx-auto">
                        {{ tag.name }} etiketli tüm yazılar
                    </p>
                    
                    <div class="mt-6 flex items-center justify-center gap-4 text-gray-400">
                        <span class="flex items-center gap-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {{ posts.total || posts.data.length }} yazı
                        </span>
                    </div>
                </div>
            </div>

            <!-- Posts Section -->
            <div class="max-w-7xl mx-auto px-4 py-12">
                <!-- Breadcrumb -->
                <div class="mb-8">
                    <Link href="/" class="text-gray-500 hover:text-red-600">Ana Sayfa</Link>
                    <span class="mx-2 text-gray-400">/</span>
                    <Link href="/yazilar" class="text-gray-500 hover:text-red-600">Yazılar</Link>
                    <span class="mx-2 text-gray-400">/</span>
                    <span class="text-gray-900 font-medium">#{{ tag.name }}</span>
                </div>

                <PostGrid :posts="posts.data" />

                <!-- Empty State -->
                <div v-if="posts.data.length === 0" class="text-center py-16">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Henüz yazı yok</h3>
                    <p class="text-gray-500 mb-4">Bu etikette henüz yazı bulunmuyor.</p>
                    <Link href="/yazilar" class="inline-flex items-center gap-2 text-red-600 hover:text-red-700">
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
                            :href="link.url || '#'"
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
