<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    originalPost: { type: Object, default: null },
    revisits: { type: Array, default: () => [] },
    isRevisit: { type: Boolean, default: false },
    currentPublishedAt: { type: String, default: null },
});

const { formatDate } = useDate();

const timeDifference = computed(() => {
    if (!props.isRevisit || !props.originalPost?.published_at || !props.currentPublishedAt) return '';
    const original = new Date(props.originalPost.published_at);
    const revisit = new Date(props.currentPublishedAt);
    const months = Math.round((revisit - original) / (1000 * 60 * 60 * 24 * 30));
    if (months >= 12) {
        const years = Math.floor(months / 12);
        const remaining = months % 12;
        return remaining > 0 ? `${years} yil ${remaining} ay sonra` : `${years} yil sonra`;
    }
    return `${months} ay sonra`;
});
</script>

<template>
    <!-- This is a revisit post — link to original -->
    <div v-if="isRevisit && originalPost" class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <div class="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <div>
            <p class="text-sm font-semibold text-amber-800">Zaman Kapsulu</p>
            <p class="text-sm text-amber-700 mt-0.5">
                Bu yazı,
                <Link :href="`/yazi/${originalPost.slug}`" class="font-medium underline hover:text-amber-900">
                    "{{ originalPost.title }}"
                </Link>
                yazısının {{ timeDifference }} sonra tekrar değerlendirmesidir.
            </p>
            <p class="text-xs text-amber-500 mt-1">
                Orijinal: {{ formatDate(originalPost.published_at) }}
            </p>
        </div>
    </div>

    <!-- This post has revisits — link to them -->
    <div v-if="!isRevisit && revisits.length > 0" class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        </div>
        <div>
            <p class="text-sm font-semibold text-blue-800">Tekrar Degerlendirme Mevcut</p>
            <div v-for="revisit in revisits" :key="revisit.id" class="mt-1">
                <Link :href="`/yazi/${revisit.slug}`" class="text-sm text-blue-700 font-medium underline hover:text-blue-900">
                    {{ revisit.title }}
                </Link>
                <span class="text-xs text-blue-500 ml-1">({{ formatDate(revisit.published_at) }})</span>
            </div>
        </div>
    </div>
</template>
