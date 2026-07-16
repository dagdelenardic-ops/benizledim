<script setup>
import { computed } from 'vue';
import { getAuthorAvatar } from '@/Utils/authorAvatars';

const props = defineProps({
    text: { type: String, required: true },
    authorName: { type: String, default: '' },
    authorRole: { type: String, default: 'Yazar' },
    avatar: { type: String, default: '' },
});

const resolvedAvatar = computed(() => props.avatar || getAuthorAvatar(props.authorName));
const initial = computed(() => (props.authorName || 'B').charAt(0).toLocaleUpperCase('tr-TR'));
</script>

<template>
    <aside class="pull-quote" aria-label="Yazı özeti">
        <svg class="pull-quote__mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
            <path d="M42 20C25 27 14 42 14 62c0 11 7 18 17 18 9 0 16-7 16-16 0-8-6-15-14-16-1 0-2 0-3 .3 2-8 9-15 18-19zM88 20C71 27 60 42 60 62c0 11 7 18 17 18 9 0 16-7 16-16 0-8-6-15-14-16-1 0-2 0-3 .3 2-8 9-15 18-19z" />
        </svg>

        <p class="pull-quote__text">{{ text }}</p>

        <div v-if="authorName" class="pull-quote__by">
            <span class="pull-quote__rule" aria-hidden="true"></span>
            <img
                v-if="resolvedAvatar"
                :src="resolvedAvatar"
                :alt="authorName"
                class="pull-quote__avatar"
                width="44"
                height="44"
                loading="lazy"
                decoding="async"
            />
            <span v-else class="pull-quote__avatar pull-quote__avatar--fallback">{{ initial }}</span>
            <span class="pull-quote__meta">
                <span class="pull-quote__name">{{ authorName }}</span>
                <span class="pull-quote__role">{{ authorRole }}</span>
            </span>
        </div>
    </aside>
</template>

<style scoped>
.pull-quote {
    position: relative;
    margin: 2.5rem auto 3rem;
    max-width: 760px;
    padding: 2.75rem 2.5rem 2.25rem;
    background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(235, 227, 212, 0.35)),
        var(--bi-paper, #f6f1e8);
    border: 1px solid var(--bi-rule-soft, #d8cdbc);
    border-left: 4px solid var(--bi-red, #dc2626);
    border-radius: 2px;
    box-shadow: 0 1px 0 rgba(16, 16, 16, 0.04), 0 18px 40px -32px rgba(16, 16, 16, 0.5);
    overflow: hidden;
}

/* Subtle paper texture matching the editorial design system. */
.pull-quote::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(16, 16, 16, 0.035) 1px, transparent 1px);
    background-size: 4px 4px;
    pointer-events: none;
    opacity: 0.7;
}

.pull-quote__mark {
    position: absolute;
    top: -0.75rem;
    left: 1.25rem;
    width: 92px;
    height: 92px;
    fill: var(--bi-red, #dc2626);
    opacity: 0.1;
    pointer-events: none;
}

.pull-quote__text {
    position: relative;
    margin: 0;
    font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
    font-optical-sizing: auto;
    font-style: italic;
    font-weight: 500;
    font-size: clamp(1.3rem, 1.05rem + 1vw, 1.7rem);
    line-height: 1.5;
    letter-spacing: 0.005em;
    color: var(--bi-ink-soft, #272727);
    text-wrap: balance;
}

.pull-quote__by {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin-top: 1.75rem;
}

.pull-quote__rule {
    width: 34px;
    height: 2px;
    background: var(--bi-red, #dc2626);
    flex: none;
}

.pull-quote__avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
    box-shadow: 0 0 0 1px var(--bi-rule-soft, #d8cdbc);
    flex: none;
}

.pull-quote__avatar--fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bi-red, #dc2626);
    color: #fff;
    font-family: var(--bi-mono, ui-monospace, monospace);
    font-weight: 700;
    font-size: 1rem;
}

.pull-quote__meta {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.pull-quote__name {
    font-family: var(--bi-mono, ui-monospace, monospace);
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
    color: var(--bi-ink, #101010);
}

.pull-quote__role {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--bi-muted, #6d655b);
}

@media (max-width: 640px) {
    .pull-quote {
        padding: 2.25rem 1.4rem 1.85rem;
    }
    .pull-quote__mark {
        width: 68px;
        height: 68px;
    }
}
</style>
