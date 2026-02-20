<script setup>
import AppLayout from '../../Components/Layout/AppLayout.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    podcasts: {
        type: Array,
        required: true,
    },
});

const { formatDate, timeAgo } = useDate();

const formatDuration = (minutes) => {
    if (!minutes) return '30 dk';
    return `${minutes} dk`;
};
</script>

<template>
    <AppLayout title="Podcast">
        <div class="min-h-screen bg-gray-50">
            <!-- Header -->
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 py-12">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Podcast</h1>
                    <p class="text-gray-600 text-lg max-w-2xl">
                        Film, dizi ve belgesel dünyasından sohbetler, eleştiriler ve öneriler. 
                        Spotify üzerinden dinleyebilirsiniz.
                    </p>
                </div>
            </div>

            <!-- Podcasts List -->
            <div class="max-w-4xl mx-auto px-4 py-12">
                <div v-if="podcasts.length > 0" class="space-y-8">
                    <div
                        v-for="podcast in podcasts"
                        :key="podcast.id"
                        class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <!-- Spotify Embed -->
                        <div class="w-full bg-gray-100">
                            <iframe
                                :src="podcast.spotify_embed_url"
                                width="100%"
                                height="232"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                class="w-full"
                            ></iframe>
                        </div>
                        
                        <!-- Info -->
                        <div class="p-6">
                            <h2 class="text-xl font-bold text-gray-900 mb-2">{{ podcast.title }}</h2>
                            <p class="text-gray-600 mb-4">{{ podcast.description }}</p>
                            
                            <div class="flex items-center gap-4 text-sm text-gray-500">
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {{ formatDuration(podcast.duration) }}
                                </span>
                                <span class="flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {{ timeAgo(podcast.published_at) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-16">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Henüz podcast yok</h3>
                    <p class="text-gray-500">Yakında yeni bölümlerle karşınızda olacağız.</p>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
