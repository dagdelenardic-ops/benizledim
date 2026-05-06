<script setup>
import { router } from '@inertiajs/vue3';
import axios from 'axios';
import AppLayout from '../../Components/Layout/AppLayout.vue';

const props = defineProps({
    items: { type: Object, required: true },
    filters: { type: Object, default: () => ({}) },
});

const statuses = [
    { value: '', label: 'Hepsi' },
    { value: 'planned', label: 'Planlanan' },
    { value: 'watching', label: 'İzleniyor' },
    { value: 'watched', label: 'İzlendi' },
];

function filter(status) {
    router.get('/watchlist', status ? { status } : {}, { preserveState: true, replace: true });
}

async function update(item, status) {
    await axios.patch(`/api/watchlist/${item.post.slug}`, { status });
    router.reload({ only: ['items'] });
}

async function remove(item) {
    await axios.delete(`/api/watchlist/${item.post.slug}`);
    router.reload({ only: ['items'] });
}
</script>

<template>
    <AppLayout title="Watchlist">
        <section class="mx-auto max-w-5xl px-4 py-8">
            <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 class="text-2xl font-black text-[var(--bi-ink)]">Watchlist</h1>
                <div class="flex flex-wrap gap-2">
                    <button
                        v-for="status in statuses"
                        :key="status.value"
                        class="rounded-md border-2 border-[var(--bi-ink)] px-3 py-1.5 text-sm font-black"
                        :class="(filters.status || '') === status.value ? 'bg-red-600 text-white' : 'bg-white text-[var(--bi-ink)]'"
                        @click="filter(status.value)"
                    >
                        {{ status.label }}
                    </button>
                </div>
            </div>

            <div class="divide-y-2 divide-gray-100 bg-white">
                <article v-for="item in items.data" :key="item.id" class="flex gap-3 py-4">
                    <img v-if="item.post.cover_image" :src="item.post.cover_image" :alt="item.post.title" class="h-24 w-16 rounded object-cover">
                    <div class="min-w-0 flex-1">
                        <a :href="`/yazi/${item.post.slug}`" class="font-black text-[var(--bi-ink)] hover:text-red-700">{{ item.post.title }}</a>
                        <p class="mt-1 text-sm text-gray-500">{{ item.post.author?.name }}</p>
                        <select :value="item.status" class="mt-3 rounded-md border-2 border-[var(--bi-ink)] px-2 py-1 text-sm" @change="update(item, $event.target.value)">
                            <option value="planned">Planlanan</option>
                            <option value="watching">İzleniyor</option>
                            <option value="watched">İzlendi</option>
                        </select>
                    </div>
                    <button class="h-9 rounded-md border-2 border-[var(--bi-ink)] px-3 text-sm font-black hover:bg-red-50" @click="remove(item)">
                        Sil
                    </button>
                </article>
            </div>
        </section>
    </AppLayout>
</template>
