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
    <form @submit.prevent="handleSubmit" class="relative hidden md:block">
        <input
            v-model="searchQuery"
            type="text"
            :placeholder="placeholder"
            class="min-h-11 w-72 border border-[var(--bi-ink)] bg-transparent py-2.5 pl-10 pr-4 text-sm text-[var(--bi-ink)] placeholder-[var(--bi-muted)] transition-all focus:border-red-700 focus:outline-none"
        />
        <svg
            class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-700"
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
            class="inline-flex h-11 w-11 items-center justify-center border border-[var(--bi-ink)] text-[var(--bi-ink)] transition-colors hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]"
            aria-label="Aramayı aç"
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
                class="fixed inset-0 z-50 bg-black/50"
                @click="isOpen = false"
            >
                <div class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-4" @click.stop>
                    <form @submit.prevent="handleSubmit" class="relative">
                        <input
                            id="mobile-search-input"
                            v-model="searchQuery"
                            type="text"
                            placeholder="Yazı ara..."
                            class="min-h-12 w-full border border-[var(--bi-ink)] bg-white py-3 pl-10 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none"
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
                            class="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-gray-400 hover:text-gray-600"
                            aria-label="Aramayı kapat"
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
