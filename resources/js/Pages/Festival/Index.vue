<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    events: {
        type: Array,
        required: true,
    },
});

const { formatDate } = useDate();

const currentSlide = ref(0);
let intervalId = null;

const nextSlide = () => {
    if (props.events.length === 0) return;
    currentSlide.value = (currentSlide.value + 1) % props.events.length;
};

const prevSlide = () => {
    if (props.events.length === 0) return;
    currentSlide.value = (currentSlide.value - 1 + props.events.length) % props.events.length;
};

const goToSlide = (index) => {
    currentSlide.value = index;
    resetInterval();
};

const resetInterval = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = setInterval(nextSlide, 5000);
    }
};

onMounted(() => {
    if (props.events.length > 0) {
        intervalId = setInterval(nextSlide, 5000);
    }
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<template>
    <AppLayout title="İstanbul Film Festivali">
        <div class="min-h-screen bg-gray-900">
            <!-- Hero Section -->
            <div class="bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white py-16">
                <div class="max-w-7xl mx-auto px-4 text-center">
                    <h1 class="text-4xl md:text-6xl font-bold mb-4">İstanbul Film Festivali</h1>
                    <p class="text-xl text-gray-300 max-w-2xl mx-auto">
                        Dünya sinemasından seçme filmler, özel gösterimler ve söyleşiler İstanbul'da sinemaseverlerle buluşuyor.
                    </p>
                </div>
            </div>

            <!-- Slider Section -->
            <div class="max-w-6xl mx-auto px-4 py-12">
                <div v-if="events.length > 0" class="relative">
                    <!-- Slider Container -->
                    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 aspect-[16/9] md:aspect-[21/9]">
                        <!-- Slides -->
                        <TransitionGroup
                            enter-active-class="transition duration-500 ease-out"
                            enter-from-class="opacity-0 translate-x-full"
                            enter-to-class="opacity-100 translate-x-0"
                            leave-active-class="transition duration-500 ease-in"
                            leave-from-class="opacity-100 translate-x-0"
                            leave-to-class="opacity-0 -translate-x-full"
                        >
                            <div
                                v-for="(event, index) in events"
                                :key="event.id"
                                v-show="currentSlide === index"
                                class="absolute inset-0 flex items-center justify-center p-8 md:p-16"
                            >
                                <div class="text-center max-w-3xl">
                                    <!-- Event Image or Placeholder -->
                                    <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                                        <svg class="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                        </svg>
                                    </div>
                                    
                                    <h2 class="text-2xl md:text-4xl font-bold text-white mb-4">{{ event.title }}</h2>
                                    <p class="text-gray-300 text-lg mb-6">{{ event.description }}</p>
                                    
                                    <div class="flex items-center justify-center gap-2 text-red-400 font-medium">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{{ formatDate(event.event_date) }}</span>
                                    </div>
                                </div>
                            </div>
                        </TransitionGroup>

                        <!-- Navigation Arrows -->
                        <button
                            @click="prevSlide"
                            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                            aria-label="Önceki slayt"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            @click="nextSlide"
                            class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                            aria-label="Sonraki slayt"
                        >
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        <!-- Dot Indicators -->
                        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                            <button
                                v-for="(event, index) in events"
                                :key="event.id"
                                @click="goToSlide(index)"
                                class="w-3 h-3 rounded-full transition-all"
                                :class="currentSlide === index ? 'bg-red-500 w-8' : 'bg-white/30 hover:bg-white/50'"
                                :aria-label="`Slayt ${index + 1}`"
                            ></button>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-16">
                    <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    <h3 class="text-xl font-semibold text-white mb-2">Henüz etkinlik yok</h3>
                    <p class="text-gray-400">Yakında festival programı açıklanacak.</p>
                </div>
            </div>

            <!-- Info Section -->
            <div class="max-w-4xl mx-auto px-4 py-12 border-t border-gray-800">
                <div class="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-xl font-bold text-white mb-3">Festival Hakkında</h3>
                        <p class="text-gray-400">
                            İstanbul Film Festivali, her yıl dünya sinemasından ödüllü filmleri, 
                            klasik başyapıtları ve özel gösterimleri sinemaseverlerle buluşturuyor.
                        </p>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-white mb-3">İletişim</h3>
                        <p class="text-gray-400">
                            Festival programı ve biletler hakkında bilgi almak için 
                            bizi sosyal medyadan takip edebilirsiniz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
