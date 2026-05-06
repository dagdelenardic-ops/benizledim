<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    post: { type: Object, required: true },
    initialWatchlisted: { type: Boolean, default: false },
});

const watchlisted = ref(props.initialWatchlisted);
const loading = ref(false);

async function toggle() {
    if (loading.value) return;
    loading.value = true;

    try {
        const response = watchlisted.value
            ? await axios.delete(`/api/watchlist/${props.post.slug}`)
            : await axios.post(`/api/watchlist/${props.post.slug}`, { status: 'planned' });

        watchlisted.value = response.data.watchlisted;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <button
        type="button"
        :disabled="loading"
        class="inline-flex h-9 w-9 items-center justify-center rounded-md border-2 border-[var(--bi-ink)] bg-white text-[var(--bi-ink)] transition hover:bg-red-50 disabled:opacity-50"
        :title="watchlisted ? 'Watchlistten çıkar' : 'Watchliste ekle'"
        @click="toggle"
    >
        <svg class="h-4 w-4" :fill="watchlisted ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
        </svg>
    </button>
</template>
