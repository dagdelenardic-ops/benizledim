<script setup>
import { Link } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import PostGrid from '../../Components/Post/PostGrid.vue';

const props = defineProps({
    author: {
        type: Object,
        required: true,
    },
    posts: {
        type: Object,
        required: true,
    },
});

const getRoleLabel = (role) => {
    const labels = {
        admin: 'Admin',
        author: 'Yazar',
        reader: 'Okuyucu',
    };
    return labels[role] || role;
};

const getRoleColor = (role) => {
    const colors = {
        admin: 'bg-red-100 text-red-700',
        author: 'bg-blue-100 text-blue-700',
        reader: 'bg-gray-100 text-gray-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
};
</script>

<template>
    <AppLayout :title="author.name">
        <div class="min-h-screen bg-gray-50">
            <!-- Hero Section -->
            <div class="bg-gradient-to-br from-gray-100 to-gray-200 border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 py-12 md:py-16">
                    <div class="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <!-- Avatar -->
                        <div class="flex-shrink-0">
                            <img
                                v-if="author.avatar"
                                :src="author.avatar"
                                :alt="author.name"
                                class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <div
                                v-else
                                class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg"
                            >
                                {{ author.name.charAt(0).toUpperCase() }}
                            </div>
                        </div>
                        
                        <!-- Info -->
                        <div class="flex-1">
                            <div class="flex flex-col md:flex-row items-center gap-3 mb-2">
                                <h1 class="text-3xl md:text-4xl font-bold text-gray-900">{{ author.name }}</h1>
                                <span
                                    class="px-3 py-1 rounded-full text-sm font-medium"
                                    :class="getRoleColor(author.role)"
                                >
                                    {{ getRoleLabel(author.role) }}
                                </span>
                            </div>
                            <p v-if="author.bio" class="text-gray-600 max-w-2xl">{{ author.bio }}</p>
                            <p v-else class="text-gray-500 italic">Henüz biyografi eklenmemiş.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Posts Section -->
            <div class="max-w-7xl mx-auto px-4 py-12">
                <h2 class="text-2xl font-bold text-gray-900 mb-8">Yazıları</h2>
                
                <PostGrid :posts="posts.data" />

                <!-- Empty State -->
                <div v-if="posts.data.length === 0" class="text-center py-16">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Henüz yazı yok</h3>
                    <p class="text-gray-500">Bu yazar henüz yazı paylaşmamış.</p>
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
