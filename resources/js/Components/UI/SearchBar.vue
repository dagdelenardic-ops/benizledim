<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { router } from '@inertiajs/vue3';

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Ara...',
    },
});

const searchQuery = ref('');
const isOpen = ref(false);
const suggestions = ref([]);
const showSuggestions = ref(false);
const highlight = ref(-1);
let fetchTimer = null;
let lastController = null;

const submitTo = (term) => {
    const q = (term ?? searchQuery.value).trim();
    if (q.length < 2) return;
    showSuggestions.value = false;
    suggestions.value = [];
    searchQuery.value = q;
    router.get('/ara', { q });
    isOpen.value = false;
};

const handleSubmit = () => {
    if (highlight.value >= 0 && suggestions.value[highlight.value]) {
        submitTo(suggestions.value[highlight.value]);
        return;
    }
    submitTo();
};

const fetchSuggestions = async (term) => {
    if (term.length < 2) {
        suggestions.value = [];
        showSuggestions.value = false;
        return;
    }
    if (lastController) lastController.abort();
    lastController = new AbortController();
    try {
        const res = await fetch(`/api/search/complete?q=${encodeURIComponent(term)}`, {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
            signal: lastController.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        suggestions.value = data.suggestions || [];
        showSuggestions.value = suggestions.value.length > 0;
        highlight.value = -1;
    } catch (e) {
        // aborted or network error — silent
    }
};

watch(searchQuery, (v) => {
    clearTimeout(fetchTimer);
    fetchTimer = setTimeout(() => fetchSuggestions(v.trim()), 180);
});

const onKeydown = (e) => {
    if (!showSuggestions.value || suggestions.value.length === 0) return;
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlight.value = (highlight.value + 1) % suggestions.value.length;
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlight.value = (highlight.value - 1 + suggestions.value.length) % suggestions.value.length;
    } else if (e.key === 'Escape') {
        showSuggestions.value = false;
    }
};

const hideSoon = () => {
    setTimeout(() => { showSuggestions.value = false; }, 150);
};

const toggleSearch = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        setTimeout(() => {
            document.getElementById('mobile-search-input')?.focus();
        }, 100);
    }
};

onBeforeUnmount(() => {
    clearTimeout(fetchTimer);
    if (lastController) lastController.abort();
});
</script>

<template>
    <!-- Desktop Search -->
    <form @submit.prevent="handleSubmit" class="relative hidden md:block">
        <input
            v-model="searchQuery"
            type="text"
            :placeholder="placeholder"
            autocomplete="off"
            @focus="showSuggestions = suggestions.length > 0"
            @blur="hideSoon"
            @keydown="onKeydown"
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

        <ul
            v-if="showSuggestions"
            class="absolute left-0 right-0 top-full z-40 mt-1 max-h-80 overflow-auto border border-[var(--bi-ink)] bg-white shadow-lg"
        >
            <li
                v-for="(s, i) in suggestions"
                :key="i"
                @mousedown.prevent="submitTo(s)"
                @mouseenter="highlight = i"
                :class="[
                    'cursor-pointer px-4 py-2 text-sm',
                    highlight === i ? 'bg-red-50 text-red-700' : 'text-gray-800 hover:bg-gray-50',
                ]"
            >
                {{ s }}
            </li>
        </ul>
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
                            autocomplete="off"
                            @keydown="onKeydown"
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

                    <ul
                        v-if="showSuggestions"
                        class="mt-2 max-h-72 overflow-auto border border-[var(--bi-ink)] bg-white"
                    >
                        <li
                            v-for="(s, i) in suggestions"
                            :key="i"
                            @mousedown.prevent="submitTo(s)"
                            class="cursor-pointer px-4 py-3 text-sm text-gray-800 hover:bg-red-50 hover:text-red-700 border-b last:border-b-0"
                        >
                            {{ s }}
                        </li>
                    </ul>
                </div>
            </div>
        </Transition>
    </div>
</template>
