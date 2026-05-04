<script setup>
import { computed } from 'vue';
import DOMPurify from 'dompurify';

const props = defineProps({
    html: {
        type: String,
        default: '',
    },
});

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
            'src', 'alt', 'width', 'height', 'loading', 'srcset', 'sizes',
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
    <div class="bi-article-body" v-html="sanitized" />
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

.bi-article-body :deep(blockquote) {
    border-left: 3px solid #DC2626;
    padding: 0.25rem 0 0.25rem 1.5rem;
    font-style: italic;
    color: #374151;
    margin: 1.75rem 0;
}

.bi-article-body :deep(blockquote p) {
    margin-bottom: 0.5rem;
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
