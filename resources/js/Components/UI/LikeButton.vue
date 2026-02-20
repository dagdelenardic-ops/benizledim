<script setup>
import { ref } from 'vue';
import { router, usePage } from '@inertiajs/vue3';

const props = defineProps({
    postSlug: {
        type: String,
        required: true,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['open-login']);

const page = usePage();
const authUser = page.props.auth?.user;
const isAnimating = ref(false);

const toggleLike = () => {
    if (!authUser) {
        emit('open-login');
        return;
    }
    
    isAnimating.value = true;
    setTimeout(() => isAnimating.value = false, 200);
    
    router.post(`/yazi/${props.postSlug}/begen`, {}, {
        preserveScroll: true,
    });
};
</script>

<template>
    <button
        @click="toggleLike"
        class="flex items-center gap-2 transition-all duration-200"
        :class="[
            isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500',
            isAnimating ? 'scale-125' : 'scale-100'
        ]"
    >
        <svg
            class="w-6 h-6 transition-transform duration-200"
            :class="{ 'scale-110': isAnimating }"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                :fill="isLiked ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
        <span class="font-medium">{{ likesCount }} beğeni</span>
    </button>
</template>
