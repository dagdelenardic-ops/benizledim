<script setup>
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    comments: {
        type: Array,
        default: () => [],
    },
});

const { formatDate } = useDate();
</script>

<template>
    <div v-if="comments.length > 0" class="mt-12 pt-8 border-t border-gray-200">
        <h3 class="text-xl font-bold text-gray-900 mb-6">
            Wix Yorumları ({{ comments.length }})
        </h3>
        
        <div class="space-y-6">
            <div
                v-for="comment in comments"
                :key="comment.id"
                class="bg-gray-50 rounded-xl p-6"
            >
                <!-- Comment Header -->
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <!-- Avatar -->
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center font-bold text-sm">
                            {{ comment.author?.charAt(0)?.toUpperCase() || 'U' }}
                        </div>
                        
                        <!-- Author Info -->
                        <div>
                            <span class="font-semibold text-gray-900">{{ comment.author || 'Misafir' }}</span>
                            <p v-if="comment.created_at" class="text-sm text-gray-500">
                                {{ formatDate(comment.created_at) }}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Wix Badge -->
                    <span class="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                        Wix
                    </span>
                </div>
                
                <!-- Comment Content -->
                <div class="text-gray-700 leading-relaxed">
                    {{ comment.content }}
                </div>
            </div>
        </div>
        
        <p class="mt-6 text-sm text-gray-500 text-center">
            Bu yorumlar Wix platformundan aktarılmıştır.
        </p>
    </div>
</template>
