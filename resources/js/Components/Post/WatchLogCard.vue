<script setup>
import { Link } from '@inertiajs/vue3';

const props = defineProps({
    post: { type: Object, required: true },
});
</script>

<template>
    <Link :href="`/yazi/${post.slug}`" class="block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div class="relative aspect-[2/3] bg-gray-100">
            <img v-if="post.cover_image" :src="post.cover_image" :alt="post.title" class="w-full h-full object-cover" loading="lazy" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <div class="absolute top-2 left-2 flex items-center gap-1.5">
                <img v-if="post.user?.avatar" :src="post.user.avatar" class="w-6 h-6 rounded-full border border-white" />
                <span class="text-[10px] font-medium text-white drop-shadow">{{ post.user?.name }}</span>
            </div>
            <div v-if="post.rating" class="absolute top-2 right-2 bg-white/90 rounded px-1.5 py-0.5 text-xs font-bold text-yellow-600">
                {{ '★'.repeat(post.rating) }}
            </div>
        </div>
        <div class="p-3">
            <h3 class="text-sm font-bold text-gray-900 truncate">{{ post.title }}</h3>
            <p v-if="post.watched_at" class="text-xs text-gray-400 mt-0.5">{{ post.watched_at }}</p>
            <div v-if="post.mood_tags?.length" class="flex flex-wrap gap-1 mt-1.5">
                <span v-for="mood in post.mood_tags.slice(0, 2)" :key="mood" class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded">{{ mood }}</span>
            </div>
        </div>
    </Link>
</template>
