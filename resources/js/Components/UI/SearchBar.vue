<script setup>
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Ara...',
    },
});

const searchQuery = ref('');
const isOpen = ref(false);

const handleSubmit = () => {
    if (searchQuery.value.trim().length >= 2) {
        router.get('/ara', { q: searchQuery.value.trim() });
    }
};

const toggleSearch = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        setTimeout(() => {
            document.getElementById('mobile-search-input')?.focus();
        }, 100);
    }
};
</script>

<template>
    <!-- Desktop Search -->
    <form @submit.prevent="handleSubmit" class="hidden md:block relative">
        <input
            v-model="searchQuery"
            type="text"
            :placeholder="placeholder"
            class="w-64 pl-10 pr-4 py-2 rounded-full bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
        />
        <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </form>

    <!-- Mobile Search -->
    <div class="md:hidden">
        <button
            @click="toggleSearch"
            class="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </button>

        <!-- Mobile Search Overlay -->
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="isOpen"
                class="fixed inset-0 bg-black/50 z-50"
                @click="isOpen = false"
            >
                <div class="bg-red-600 p-4" @click.stop>
                    <form @submit.prevent="handleSubmit" class="relative">
                        <input
                            id="mobile-search-input"
                            v-model="searchQuery"
                            type="text"
                            placeholder="Yazı ara..."
                            class="w-full pl-10 pr-12 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
                        />
                        <svg
                            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <button
                            type="button"
                            @click="isOpen = false"
                            class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </Transition>
    </div>
</template>
