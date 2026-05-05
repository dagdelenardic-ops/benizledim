<script setup>
import { computed } from 'vue';

const props = defineProps({
    stats: { type: Object, default: () => ({}) },
    year: { type: Number, default: null },
});

const totalLogs = computed(() => (props.stats.posts_count || 0) + (props.stats.watch_logs_count || 0));
const avgRating = computed(() => props.stats.avg_rating ? Number(props.stats.avg_rating).toFixed(1) : null);
const topMoods = computed(() => (props.stats.top_mood_tags || []).slice(0, 3));
</script>

<template>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <!-- Card 1: Bu Yıl -->
        <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div class="text-xs text-gray-500 mb-1">{{ year || 'Bu Yıl' }}</div>
            <div class="text-3xl font-bold text-red-600">{{ totalLogs }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ stats.posts_count || 0 }} yazı, {{ stats.watch_logs_count || 0 }} not</div>
        </div>

        <!-- Card 2: Beğeni -->
        <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div class="text-xs text-gray-500 mb-1">Beğeni</div>
            <div class="text-3xl font-bold text-red-600">{{ stats.total_likes_received || 0 }}</div>
            <div class="text-xs text-gray-400 mt-1">{{ avgRating ? `Ortalama ${avgRating} ★` : '' }}</div>
        </div>

        <!-- Card 3: En Çok Beğenilen -->
        <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div class="text-xs text-gray-500 mb-1">En Çok Beğenilen</div>
            <template v-if="stats.most_liked_post">
                <div class="flex items-center gap-2">
                    <img v-if="stats.most_liked_post.cover_image" :src="stats.most_liked_post.cover_image" class="w-10 h-14 object-cover rounded border" />
                    <div class="text-xs font-medium text-gray-800 line-clamp-2">{{ stats.most_liked_post.title }}</div>
                </div>
            </template>
            <div v-else class="text-xs text-gray-400">Henüz yok</div>
        </div>

        <!-- Card 4: Mood Palette -->
        <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div class="text-xs text-gray-500 mb-1">Mood Paletin</div>
            <div class="flex flex-wrap gap-1">
                <span v-for="mood in topMoods" :key="mood" class="px-2 py-0.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-full">{{ mood }}</span>
                <span v-if="!topMoods.length" class="text-xs text-gray-400">Henüz yok</span>
            </div>
        </div>
    </div>
</template>
