<script setup>
import { Link } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import ActivityItem from '../../Components/Social/ActivityItem.vue';

defineProps({
    items: { type: Object, required: true },
});
</script>

<template>
    <AppLayout title="Akış">
        <section class="mx-auto max-w-3xl px-4 py-8">
            <h1 class="mb-4 text-2xl font-black text-[var(--bi-ink)]">Akış</h1>
            <div v-if="items.data.length" class="bg-white">
                <ActivityItem v-for="item in items.data" :key="item.id" :item="item" />
            </div>
            <div v-else class="rounded-md border-2 border-[var(--bi-ink)] bg-white p-6 text-center">
                <p class="font-bold text-[var(--bi-ink)]">Akışın henüz boş.</p>
                <Link href="/yazarlar" class="mt-3 inline-flex rounded-md bg-red-600 px-4 py-2 text-sm font-black text-white">
                    Yazar keşfet
                </Link>
            </div>
        </section>
    </AppLayout>
</template>
