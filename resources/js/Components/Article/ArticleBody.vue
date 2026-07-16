<script setup>
import { computed } from 'vue';
import DOMPurify from 'dompurify';

const props = defineProps({
    html: {
        type: String,
        default: '',
    },
});

const handleImageError = (event) => {
    const image = event.target;
    const fallback = image?.getAttribute?.('data-fallback-src') || '';

    if (!fallback.startsWith('https://static.wixstatic.com/media/')) return;

    image.removeAttribute('data-fallback-src');
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
    image.src = fallback;
};

const sanitized = computed(() => {
    if (!props.html) return '';

    return DOMPurify.sanitize(props.html, {
        ALLOWED_TAGS: [
            'p', 'br', 'hr',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
            'a',
            'ul', 'ol', 'li',
            'blockquote', 'cite', 'q',
            'code', 'pre', 'kbd', 'samp', 'var',
            'figure', 'figcaption',
            'img', 'picture', 'source',
            'video', 'audio',
            'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
            'div', 'span',
            'iframe',
        ],
        ALLOWED_ATTR: [
            'href', 'title', 'target', 'rel', 'name',
            'src', 'alt', 'width', 'height', 'loading', 'srcset', 'sizes', 'data-fallback-src',
            'id', 'class',
            'colspan', 'rowspan',
            'controls', 'autoplay', 'muted', 'loop', 'poster',
            'cite', 'datetime',
            'lang', 'dir',
            'allow', 'allowfullscreen', 'frameborder',
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|spotify):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder'],
    });
});
</script>

<template>
    <div class="bi-article-body" @error.capture="handleImageError" v-html="sanitized" />
</template>

<style scoped>
.bi-article-body {
    hyphens: auto;
    -webkit-hyphens: auto;
    word-break: normal;
    overflow-wrap: break-word;
}

.bi-article-body :deep(p) {
    line-height: 1.75;
    margin-bottom: 1.25rem;
}

.bi-article-body :deep(h2) {
    margin-top: 2.75rem;
    margin-bottom: 1rem;
    line-height: 1.25;
}

.bi-article-body :deep(h3) {
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
}

.bi-article-body :deep(figure) {
    margin: 2.25rem auto;
}

.bi-article-body :deep(figure img) {
    width: 100%;
    height: auto;
    border-radius: 2px;
    display: block;
}

.bi-article-body :deep(figure figcaption) {
    font-style: italic;
    color: #6b7280;
    font-size: 0.875rem;
    text-align: center;
    margin-top: 0.625rem;
    line-height: 1.4;
}

/* Alıntılar (blockquote) — şık editoryal tasarım: kağıt arka plan, kırmızı vurgu,
   dekoratif SVG tırnak ve avangard ama okunabilir Fraunces italik. */
.bi-article-body :deep(blockquote) {
    position: relative;
    margin: 2.5rem 0;
    padding: 2.25rem 2rem 1.75rem 2.25rem;
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(235, 227, 212, 0.35)),
        var(--bi-paper, #f6f1e8);
    border: 1px solid var(--bi-rule-soft, #d8cdbc);
    border-left: 4px solid var(--bi-red, #dc2626);
    border-radius: 2px;
    box-shadow: 0 1px 0 rgba(16, 16, 16, 0.04), 0 18px 40px -32px rgba(16, 16, 16, 0.5);
    font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
    font-optical-sizing: auto;
    font-style: italic;
    font-weight: 500;
    font-size: clamp(1.2rem, 1rem + 0.8vw, 1.55rem);
    line-height: 1.55;
    color: var(--bi-ink-soft, #272727);
}

.bi-article-body :deep(blockquote)::before {
    content: '';
    position: absolute;
    top: -0.6rem;
    left: 1rem;
    width: 84px;
    height: 84px;
    opacity: 0.1;
    background: no-repeat center/contain
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%23dc2626' d='M42 20C25 27 14 42 14 62c0 11 7 18 17 18 9 0 16-7 16-16 0-8-6-15-14-16-1 0-2 0-3 .3 2-8 9-15 18-19zM88 20C71 27 60 42 60 62c0 11 7 18 17 18 9 0 16-7 16-16 0-8-6-15-14-16-1 0-2 0-3 .3 2-8 9-15 18-19z'/%3E%3C/svg%3E");
    pointer-events: none;
}

.bi-article-body :deep(blockquote > *) {
    position: relative;
}

.bi-article-body :deep(blockquote p) {
    margin-bottom: 0.6rem;
}

.bi-article-body :deep(blockquote p:last-child) {
    margin-bottom: 0;
}

.bi-article-body :deep(blockquote cite) {
    display: block;
    margin-top: 0.85rem;
    font-family: var(--bi-mono, ui-monospace, monospace);
    font-style: normal;
    font-size: 0.82rem;
    letter-spacing: 0.02em;
    color: var(--bi-muted, #6d655b);
}

.bi-article-body :deep(ul),
.bi-article-body :deep(ol) {
    margin: 1.25rem 0;
    padding-left: 1.5rem;
}

.bi-article-body :deep(li) {
    margin-bottom: 0.5rem;
    line-height: 1.7;
}

.bi-article-body :deep(a) {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 2px;
}

.bi-article-body :deep(iframe) {
    width: 100%;
    aspect-ratio: 16 / 9;
    margin: 1.5rem 0;
    border: 0;
}

.bi-article-body :deep(img:not(figure img)) {
    max-width: 100%;
    height: auto;
    margin: 1.5rem auto;
    display: block;
}
</style>
