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
    <div v-if="posts.length > 0" class="mt-12 pt-8 border-t border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">İlginizi Çekebilir</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PostCard v-for="post in posts" :key="post.id" :post="post" />
        </div>
    </div>
</template>
