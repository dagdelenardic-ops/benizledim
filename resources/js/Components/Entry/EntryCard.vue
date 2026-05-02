<script setup>
import { computed } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    entry: { type: Object, required: true },
    userVote: { type: Number, default: 0 }, // -1, 0, or 1
});

const emit = defineEmits(['open-login']);

const page = usePage();
const authUser = page.props.auth?.user;
const { timeAgo } = useDate();

const authorName = computed(() => {
    return props.entry.user?.name ?? props.entry.display_name ?? 'Anonim';
});

const authorInitial = computed(() => {
    return authorName.value.charAt(0).toUpperCase();
});

const isOwner = computed(() => {
    return authUser && props.entry.user_id === authUser.id;
});

const canDelete = computed(() => {
    return isOwner.value || authUser?.role === 'admin';
});

const vote = (value) => {
    if (!authUser) {
        emit('open-login');
        return;
    }
    router.post(`/entry/${props.entry.id}/vote`, { vote: value }, {
        preserveScroll: true,
    });
};

const deleteEntry = () => {
    if (!confirm('Bu entry silinsin mi?')) return;
    router.delete(`/entry/${props.entry.id}`, {
        preserveScroll: true,
    });
};
</script>

<template>
    <div class="group flex gap-3 py-4 border-b border-gray-100 last:border-0">
        <!-- Vote Buttons -->
        <div class="flex flex-col items-center gap-1 pt-1">
            <button
                @click="vote(1)"
                class="p-1 rounded transition-colors"
                :class="userVote === 1 ? 'text-green-600' : 'text-gray-300 hover:text-green-500'"
                :title="authUser ? 'Yukarı oy' : 'Oy vermek için giriş yapın'"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
            </button>
            <span
                class="text-sm font-semibold min-w-[2ch] text-center"
                :class="{
                    'text-green-600': entry.score > 0,
                    'text-red-500': entry.score < 0,
                    'text-gray-400': entry.score === 0,
                }"
            >
                {{ entry.score }}
            </span>
            <button
                @click="vote(-1)"
                class="p-1 rounded transition-colors"
                :class="userVote === -1 ? 'text-red-500' : 'text-gray-300 hover:text-red-400'"
                :title="authUser ? 'Aşağı oy' : 'Oy vermek için giriş yapın'"
            >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
                <!-- Avatar -->
                <img
                    v-if="entry.user?.avatar"
                    :src="entry.user.avatar"
                    :alt="authorName"
                    class="w-6 h-6 rounded-full object-cover"
                />
                <div
                    v-else
                    class="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold"
                >
                    {{ authorInitial }}
                </div>

                <span class="text-sm font-medium text-gray-700">{{ authorName }}</span>
                <span class="text-xs text-gray-400">{{ timeAgo(entry.created_at) }}</span>

                <!-- Spoiler Badge -->
                <span v-if="entry.is_spoiler" class="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                    Spoiler
                </span>
            </div>

            <p class="text-gray-800 text-sm leading-relaxed whitespace-pre-line">{{ entry.content }}</p>

            <!-- Delete -->
            <button
                v-if="canDelete"
                @click="deleteEntry"
                class="mt-1 text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                Sil
            </button>
        </div>
    </div>
</template>
