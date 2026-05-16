<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
    items: {
        type: Array,
        default: () => [],
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
</script>

<template>
    <section v-if="items.length" class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]">
        <div class="bi-wrap py-8">
            <div class="mb-5 flex items-end justify-between border-b border-[var(--bi-ink)] pb-4">
                <div class="flex items-center gap-3">
                    <span class="inline-flex items-center gap-2 bg-red-600 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white bi-mono">
                        <span class="inline-block h-2 w-2 animate-pulse rounded-full bg-white"></span>
                        Canlı
                    </span>
                    <div>
                        <span class="bi-kicker">Sinema dünyasından</span>
                        <h2 class="bi-serif mt-1 text-3xl font-bold text-[var(--bi-ink)] md:text-4xl">Flash Haberler</h2>
                    </div>
                </div>
                <Link
                    href="/haberler"
                    class="hidden items-center gap-1 border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-ink)] transition hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono md:inline-flex"
                >
                    Tüm haberler →
                </Link>
            </div>

            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link
                    v-for="item in items"
                    :key="item.id"
                    :href="`/haber/${item.slug}`"
                    class="group flex flex-col overflow-hidden border border-[var(--bi-ink)] bg-[var(--bi-paper)] text-left transition hover:bg-white"
                >
                    <div class="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--bi-ink)] bg-[var(--bi-ink)]">
                        <img
                            v-if="item.image_url"
                            :src="item.image_url"
                            :alt="item.title_tr"
                            class="h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            referrerpolicy="no-referrer"
                        />
                        <div v-else class="grid h-full place-items-center text-3xl font-bold text-[var(--bi-paper)] bi-serif">
                            Bİ
                        </div>
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

            <div class="mt-6 flex justify-center md:hidden">
                <Link
                    href="/haberler"
                    class="inline-flex items-center gap-1 border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-ink)] transition hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono"
                >
                    Tüm haberler →
                </Link>
            </div>
        </div>
    </section>
</template>
