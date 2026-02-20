<script setup>
import { router, usePage } from '@inertiajs/vue3';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    comments: {
        type: Array,
        required: true,
    },
});

const page = usePage();
const authUser = page.props.auth?.user;
const { timeAgo } = useDate();

const canDelete = (comment) => {
    if (!authUser) return false;
    return authUser.id === comment.user_id || authUser.role === 'admin';
};

const deleteComment = (comment) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    
    router.delete(`/yorum/${comment.id}`, {
        preserveScroll: true,
    });
};
</script>

<template>
    <div class="mt-8">
        <h3 class="text-xl font-bold text-gray-900 mb-6">
            Yorumlar ({{ comments.length }})
        </h3>
        
        <!-- Comments List -->
        <div v-if="comments.length > 0" class="space-y-6">
            <div
                v-for="comment in comments"
                :key="comment.id"
                class="flex gap-4"
            >
                <!-- Avatar -->
                <div class="flex-shrink-0">
                    <img
                        v-if="comment.user?.avatar"
                        :src="comment.user.avatar"
                        :alt="comment.user.name"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                        v-else
                        class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold"
                    >
                        {{ comment.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
                    </div>
                </div>
                
                <!-- Comment Content -->
                <div class="flex-1 min-w-0">
                    <div class="bg-gray-50 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-semibold text-gray-900">
                                {{ comment.user?.name }}
                            </span>
                            <span class="text-sm text-gray-500">
                                {{ timeAgo(comment.created_at) }}
                            </span>
                        </div>
                        <p class="text-gray-700 whitespace-pre-wrap">{{ comment.content }}</p>
                    </div>
                    
                    <!-- Actions -->
                    <div v-if="canDelete(comment)" class="mt-2 flex items-center gap-4">
                        <button
                            @click="deleteComment(comment)"
                            class="text-sm text-red-600 hover:text-red-700 transition-colors"
                        >
                            Sil
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
            <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-gray-500">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
        </div>
    </div>
</template>
