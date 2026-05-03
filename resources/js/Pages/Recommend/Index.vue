<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import axios from 'axios';

const props = defineProps({
    messages: { type: Array, default: () => [] },
    conversationId: { type: Number, default: null },
});

const messages = ref([...props.messages]);
const input = ref('');
const isLoading = ref(false);
const error = ref('');
const chatContainer = ref(null);
const recommendedPosts = ref([]);

const scrollToBottom = async () => {
    await nextTick();
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

const sendMessage = async () => {
    const text = input.value.trim();
    if (!text || isLoading.value) return;

    error.value = '';
    input.value = '';
    isLoading.value = true;

    messages.value.push({
        id: Date.now(),
        role: 'user',
        content: text,
        created_at: new Date().toISOString(),
    });
    scrollToBottom();

    try {
        const response = await axios.post('/ne-izlesem/chat', { message: text });

        messages.value.push(response.data.message);
        recommendedPosts.value = response.data.recommended_posts || [];
    } catch (err) {
        if (err.response?.status === 429) {
            error.value = err.response.data.error;
        } else {
            error.value = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        }
    } finally {
        isLoading.value = false;
        scrollToBottom();
    }
};

const quickPrompts = [
    'Bugün kısa ve hafif bir şey izlemek istiyorum',
    'Düşündürücü bir belgesel önerir misin?',
    'Gerilimli bir dizi arıyorum',
    'Ailecek izlenecek bir film?',
];

const sendQuickPrompt = (prompt) => {
    input.value = prompt;
    sendMessage();
};

onMounted(scrollToBottom);
</script>

<template>
    <AppLayout title="Ne İzlesem?" description="Ruh haline göre film ve dizi önerisi">
        <div class="min-h-screen bg-gray-50 flex flex-col">
            <!-- Header -->
            <div class="bg-white border-b border-gray-200">
                <div class="max-w-3xl mx-auto px-4 py-6">
                    <h1 class="text-2xl font-bold text-gray-900">Ne İzlesem?</h1>
                    <p class="text-gray-500 text-sm mt-1">Ruh haline ve zamanına göre kişiselleştirilmiş öneriler</p>
                </div>
            </div>

            <!-- Chat Area -->
            <div class="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col">
                <div ref="chatContainer" class="flex-1 overflow-y-auto space-y-4 mb-4" style="max-height: calc(100vh - 320px)">
                    <!-- Empty State -->
                    <div v-if="messages.length === 0" class="text-center py-12">
                        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h2 class="text-lg font-semibold text-gray-800 mb-2">Merhaba! Ne izlemek istersin?</h2>
                        <p class="text-sm text-gray-500 mb-6">Ruh halini, zamanını veya tercihlerini yaz, sana özel öneriler sunayım.</p>

                        <!-- Quick Prompts -->
                        <div class="flex flex-wrap justify-center gap-2">
                            <button
                                v-for="prompt in quickPrompts"
                                :key="prompt"
                                @click="sendQuickPrompt(prompt)"
                                class="px-4 py-2 bg-white border border-gray-200 text-sm text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                                {{ prompt }}
                            </button>
                        </div>
                    </div>

                    <!-- Messages -->
                    <div
                        v-for="msg in messages"
                        :key="msg.id"
                        class="flex"
                        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
                    >
                        <div
                            class="max-w-[80%] rounded-2xl px-4 py-3 text-sm"
                            :class="msg.role === 'user'
                                ? 'bg-red-600 text-white rounded-br-sm'
                                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'"
                        >
                            <p class="whitespace-pre-line">{{ msg.content }}</p>
                        </div>
                    </div>

                    <!-- Loading indicator -->
                    <div v-if="isLoading" class="flex justify-start">
                        <div class="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
                            <div class="flex gap-1">
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recommended Posts -->
                <div v-if="recommendedPosts.length > 0" class="mb-4">
                    <h3 class="text-sm font-semibold text-gray-600 mb-2">Önerilen Yazılar</h3>
                    <div class="flex gap-3 overflow-x-auto pb-2">
                        <Link
                            v-for="post in recommendedPosts"
                            :key="post.id"
                            :href="`/yazi/${post.slug}`"
                            class="flex-shrink-0 w-48 bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <img v-if="post.cover_image" :src="post.cover_image" class="w-full h-28 object-cover" />
                            <div class="p-3">
                                <h4 class="text-sm font-semibold text-gray-900 line-clamp-2">{{ post.title }}</h4>
                                <p class="text-xs text-gray-500 mt-1">{{ post.user?.name }}</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <!-- Error -->
                <div v-if="error" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {{ error }}
                </div>

                <!-- Input -->
                <form @submit.prevent="sendMessage" class="flex gap-2">
                    <input
                        v-model="input"
                        type="text"
                        placeholder="Ruh halini veya ne izlemek istediğini yaz..."
                        maxlength="500"
                        :disabled="isLoading"
                        class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm"
                        @keydown.enter.prevent="sendMessage"
                    />
                    <button
                        type="submit"
                        :disabled="isLoading || !input.trim()"
                        class="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    </AppLayout>
</template>
