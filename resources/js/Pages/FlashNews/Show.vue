<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';

const props = defineProps({
    item: { type: Object, required: true },
    related: { type: Array, default: () => [] },
});

const canonicalUrl = computed(() => `https://benizledim.com/haber/${props.item.slug}`);

const paragraphs = computed(() => {
    const c = props.item.content_tr || '';
    return String(c)
        .split(/\n{2,}|\r\n\r\n/)
        .map((p) => p.trim())
        .filter(Boolean);
});

const formatDate = (date) => {
    if (!date) return '';
    try {
        return new Date(date).toLocaleString('tr-TR', {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    } catch (e) { return ''; }
};

const articleSchema = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: props.item.title_tr,
    description: props.item.summary_tr,
    image: props.item.image_url ? [props.item.image_url] : undefined,
    datePublished: props.item.published_at,
    dateModified: props.item.updated_at || props.item.published_at,
    author: { '@type': 'Organization', name: props.item.source_name },
    publisher: {
        '@type': 'Organization',
        name: 'Ben İzledim',
        logo: { '@type': 'ImageObject', url: 'https://benizledim.com/images/og-default.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl.value },
    isBasedOn: props.item.source_url,
    inLanguage: 'tr-TR',
}));
</script>

<template>
    <AppLayout
        :title="item.title_tr"
        :description="item.summary_tr"
        :og-image="item.image_url || '/images/og-default.png'"
        :canonical-url="canonicalUrl"
        og-type="article"
        :schema-nodes="[articleSchema]"
    >
        <article class="bg-[var(--bi-paper)]">
            <header class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]">
                <div class="bi-wrap py-6">
                    <div class="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">
                        <Link href="/" class="text-red-700 hover:text-red-900">Anasayfa</Link>
                        <span>/</span>
                        <span>Flash Haberler</span>
                        <span>/</span>
                        <span class="bg-red-600 px-2 py-0.5 text-white">{{ item.source_name }}</span>
                    </div>
                    <h1 class="bi-serif text-3xl font-bold leading-tight text-[var(--bi-ink)] md:text-5xl">
                        {{ item.title_tr }}
                    </h1>
                    <p class="mt-4 max-w-3xl text-base leading-7 text-[var(--bi-muted)] md:text-lg md:leading-8">
                        {{ item.summary_tr }}
                    </p>
                    <div class="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">
                        <time :datetime="item.published_at">{{ formatDate(item.published_at) }}</time>
                        <span>•</span>
                        <span>Kaynak: {{ item.source_name }}</span>
                    </div>
                </div>
            </header>

            <div v-if="item.image_url" class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-ink)]">
                <div class="bi-wrap py-0">
                    <div class="relative aspect-[16/9] w-full overflow-hidden">
                        <img
                            :src="item.image_url"
                            :alt="item.title_tr"
                            class="h-full w-full object-cover"
                            loading="eager"
                            fetchpriority="high"
                            decoding="async"
                            referrerpolicy="no-referrer"
                        />
                    </div>
                </div>
            </div>

            <div class="bi-wrap grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
                <div class="prose-bi max-w-none space-y-5 text-base leading-8 text-[var(--bi-ink)] md:text-lg md:leading-9">
                    <p v-for="(p, idx) in paragraphs" :key="idx">{{ p }}</p>

                    <div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t-2 border-[var(--bi-ink)] pt-6">
                        <div class="text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">
                            Bu haber otomatik olarak {{ item.source_name }} kaynağından çevrilmiştir.
                        </div>
                        <a
                            :href="item.source_url"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            class="inline-flex items-center gap-2 bg-[var(--bi-ink)] px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] transition hover:bg-red-700 bi-mono"
                        >
                            Orijinal habere git
                            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3h7v7M10 14L21 3M21 14v7H3V3h7"/></svg>
                        </a>
                    </div>
                </div>

                <aside v-if="related.length" class="h-fit border border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]">
                    <div class="border-b border-[var(--bi-ink)] bg-[var(--bi-ink)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] bi-mono">
                        Diğer Flash Haberler
                    </div>
                    <Link
                        v-for="r in related"
                        :key="r.id"
                        :href="`/haber/${r.slug}`"
                        class="block border-b border-[var(--bi-ink)]/20 p-4 transition hover:bg-[var(--bi-paper)]"
                    >
                        <div class="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-red-700 bi-mono">{{ r.source_name }}</div>
                        <div class="mt-1 bi-serif text-sm font-bold leading-snug text-[var(--bi-ink)] line-clamp-3">{{ r.title_tr }}</div>
                        <div class="mt-2 text-[0.6rem] uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">{{ formatDate(r.published_at) }}</div>
                    </Link>
                </aside>
            </div>
        </article>
    </AppLayout>
</template>
