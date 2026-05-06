<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { useDate } from '../../Composables/useDate';

const props = defineProps({
    post: { type: Object, required: true },
});

const { formatDate } = useDate();

const formattedWatchedOn = computed(() => (
    props.post?.watched_on ? formatDate(props.post.watched_on) : null
));

const visibleMoods = computed(() => (
    Array.isArray(props.post?.mood_tags) ? props.post.mood_tags.slice(0, 3) : []
));

const fallbackMonogram = computed(() => (
    props.post?.title?.charAt(0)?.toUpperCase() || 'B'
));
</script>

<template>
    <Link :href="`/yazi/${post.slug}`" class="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div class="relative aspect-[2/3] bg-gray-100">
            <img v-if="post.cover_image" :src="post.cover_image" :alt="post.title" class="w-full h-full object-cover" loading="lazy" />
            <div v-else class="flex h-full w-full items-end bg-gradient-to-br from-stone-100 via-white to-stone-200 p-3">
                <div>
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">Watch Log</p>
                    <p class="mt-2 text-4xl font-black text-gray-800">{{ fallbackMonogram }}</p>
                </div>
            </div>
            <div v-if="post.rating" class="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-yellow-700 shadow-sm">
                {{ post.rating }}/10
            </div>
        </div>
        <div class="flex flex-1 flex-col p-3">
            <h3 class="line-clamp-2 text-sm font-bold text-gray-900">{{ post.title }}</h3>
            <p v-if="formattedWatchedOn" class="mt-1 text-xs text-gray-400">{{ formattedWatchedOn }}</p>
            <p v-if="post.excerpt" class="mt-2 line-clamp-3 text-xs leading-5 text-gray-600">{{ post.excerpt }}</p>
            <div v-if="visibleMoods.length" class="mt-3 flex flex-wrap gap-1">
                <span v-for="mood in visibleMoods" :key="mood" class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600">{{ mood }}</span>
            </div>
        </div>
    </Link>
</template>
