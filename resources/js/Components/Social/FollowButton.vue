<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    user: { type: Object, required: true },
    initialFollowing: { type: Boolean, default: false },
    initialFollowersCount: { type: Number, default: 0 },
});

const following = ref(props.initialFollowing);
const followersCount = ref(props.initialFollowersCount);
const loading = ref(false);

async function toggle() {
    if (loading.value) return;
    loading.value = true;

    try {
        const response = following.value
            ? await axios.delete(`/api/users/${props.user.id}/follow`)
            : await axios.post(`/api/users/${props.user.id}/follow`);

        following.value = response.data.following;
        followersCount.value = response.data.followers_count;
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <button
        type="button"
        :disabled="loading"
        class="inline-flex items-center justify-center rounded-md border-2 border-[var(--bi-ink)] px-3 py-1.5 text-sm font-black transition disabled:opacity-50"
        :class="following ? 'bg-white text-[var(--bi-ink)] hover:bg-gray-50' : 'bg-red-600 text-white hover:bg-red-700'"
        @click="toggle"
    >
        {{ following ? 'Takipte' : 'Takip Et' }}
        <span class="ml-2 text-xs opacity-75">{{ followersCount }}</span>
    </button>
</template>
