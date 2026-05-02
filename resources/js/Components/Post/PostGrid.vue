<script setup>
import PostCard from './PostCard.vue';

const props = defineProps({
    posts: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <div v-if="posts.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
    <div v-else class="bi-rule-box text-center py-16">
        <svg class="mx-auto mb-4 h-16 w-16 text-[var(--bi-rule-soft)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="bi-serif text-2xl text-[var(--bi-ink)]">Henüz yazı bulunmuyor.</p>
    </div>
</template>
