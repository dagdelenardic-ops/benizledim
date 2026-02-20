<script setup>
import { Link } from '@inertiajs/vue3';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
});

const { timeAgo } = useDate();

const formatReadingTime = (minutes) => {
    if (!minutes) return '2 dk';
    return `${minutes} dk`;
};
</script>

<template>
    <Link
        :href="`/yazi/${post.slug}`"
        class="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
        <!-- Cover Image -->
        <div class="relative aspect-[16/10] overflow-hidden bg-gray-100">
            <img
                v-if="post.cover_image"
                :src="post.cover_image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
                v-else
                class="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center"
            >
                <span class="text-white text-4xl font-bold">Bİ</span>
            </div>

            <!-- Category Badges -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-1">
                <span
                    v-for="category in post.categories?.slice(0, 2)"
                    :key="category.id"
                    class="px-2 py-1 bg-red-600 text-white text-xs font-medium rounded"
                >
                    {{ category.name }}
                </span>
            </div>
        </div>

        <!-- Content -->
        <div class="p-4">
            <h3 class="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 mb-2">
                {{ post.title }}
            </h3>
            <p class="text-gray-600 text-sm line-clamp-2 mb-4">
                {{ post.excerpt }}
            </p>

            <!-- Meta -->
            <div class="flex items-center justify-between text-xs text-gray-500">
                <div class="flex items-center gap-2">
                    <img
                        v-if="post.user?.avatar"
                        :src="post.user.avatar"
                        :alt="post.user.name"
                        class="w-6 h-6 rounded-full object-cover"
                    />
                    <div
                        v-else
                        class="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs"
                    >
                        {{ post.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                    </div>
                    <span class="font-medium text-gray-700">{{ post.user?.name }}</span>
                </div>
                <span>{{ timeAgo(post.published_at) }}</span>
            </div>

            <!-- Stats -->
            <div class="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ formatReadingTime(post.reading_time_minutes) }}
                </span>
                <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {{ post.likes_count || 0 }}
                </span>
                <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {{ post.comments_count || 0 }}
                </span>
            </div>
        </div>
    </Link>
</template>
