<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';

const props = defineProps({
    items: {
        type: Object,
        required: true,
    },
});

const formatDate = (date) => {
    if (!date) return '';
    try {
        return new Date(date).toLocaleString('tr-TR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        return '';
    }
};

const canonicalUrl = computed(() => {
    const page = props.items?.current_page ?? 1;
    return page > 1
        ? `https://benizledim.com/haberler?page=${page}`
        : 'https://benizledim.com/haberler';
});
</script>

<template>
    <AppLayout
        title="Haberler"
        description="Sinema dünyasından flash haberlerin tam arşivi — yabancı ve yerli kaynaklardan film, dizi, festival haberleri."
        :canonical-url="canonicalUrl"
    >
        <div class="min-h-screen bg-[var(--bi-paper)]">
            <div class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]">
                <div class="bi-wrap py-10">
                    <div class="flex items-center gap-3">
                        <span class="inline-flex items-center gap-2 bg-red-600 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white bi-mono">
                            <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-white"></span>
                            Canlı
                        </span>
                        <span class="bi-kicker">Arşiv</span>
                    </div>
                    <h1 class="bi-serif mt-3 text-5xl font-bold leading-none text-[var(--bi-ink)] md:text-7xl">
                        Haberler
                    </h1>
                    <p class="mt-4 max-w-2xl text-[var(--bi-muted)]">
                        Sinema dünyasından flash haberlerin tam arşivi. Yabancı ve yerli kaynaklardan film, dizi ve festival haberleri.
                    </p>
                </div>
            </div>

            <div class="bi-wrap py-10">
                <div v-if="items.data.length === 0" class="bi-rule-box text-center py-16">
                    <h3 class="bi-serif text-3xl font-bold text-[var(--bi-ink)] mb-2">Henüz haber yok</h3>
                    <p class="text-[var(--bi-muted)]">Yakında burada arşivlenmiş haberleri göreceksin.</p>
                </div>

                <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link
                        v-for="item in items.data"
                        :key="item.id"
                        :href="`/haber/${item.slug}`"
                        class="group flex flex-col overflow-hidden border border-[var(--bi-ink)] bg-[var(--bi-paper)] text-left transition hover:bg-white"
                    >
                        <div class="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--bi-ink)] bg-[var(--bi-ink)]">
                            <img
                                :src="item.image_url"
                                :alt="item.title_tr"
                                class="h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105"
                                loading="lazy"
                                decoding="async"
                                referrerpolicy="no-referrer"
                            />
                            <span class="absolute left-0 top-0 bg-red-600 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-white bi-mono">
                                {{ item.source_name }}
                            </span>
                        </div>
                        <div class="flex flex-1 flex-col gap-2 p-4">
                            <h3 class="bi-serif text-base font-bold leading-snug text-[var(--bi-ink)] line-clamp-3 md:text-lg">
                                {{ item.title_tr }}
                            </h3>
                            <p class="text-xs leading-5 text-[var(--bi-muted)] line-clamp-4">
                                {{ item.summary_tr }}
                            </p>
                            <div class="mt-auto flex items-center justify-between pt-2 text-[0.65rem] uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">
                                <span>{{ formatDate(item.published_at) }}</span>
                                <span class="text-red-700 group-hover:text-red-900">Devamını oku →</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div v-if="items.links && items.data.length > 0" class="mt-12 flex justify-center">
                    <div class="flex items-center gap-2 flex-wrap justify-center">
                        <Link
                            v-for="(link, index) in items.links"
                            :key="index"
                            :href="link.url || '#'"
                            :class="[
                                'border px-4 py-2 text-sm font-bold transition-colors',
                                link.active
                                    ? 'border-red-700 bg-red-700 text-white'
                                    : link.url
                                        ? 'border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]'
                                        : 'border-[var(--bi-rule-soft)] text-[var(--bi-muted)] cursor-not-allowed'
                            ]"
                            v-html="link.label"
                        />
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
