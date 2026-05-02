<script setup>
import { computed } from 'vue';

const props = defineProps({
    exchanges: { type: Array, required: true },
    primaryAuthor: { type: Object, required: true },
    secondaryAuthor: { type: Object, default: null },
    intro: { type: String, default: '' },
});

const getAuthorColor = (userId) => {
    if (userId === props.primaryAuthor?.id) return 'red';
    return 'blue';
};

const getAuthor = (exchange) => {
    if (exchange.user) return exchange.user;
    if (exchange.user_id === props.primaryAuthor?.id) return props.primaryAuthor;
    return props.secondaryAuthor;
};
</script>

<template>
    <div>
        <!-- Intro text if present -->
        <div v-if="intro" class="prose prose-lg max-w-none mb-8 prose-p:text-gray-700">
            <div v-html="intro"></div>
        </div>

        <!-- Authors Legend -->
        <div v-if="primaryAuthor && secondaryAuthor" class="flex items-center gap-6 mb-6 pb-4 border-b border-gray-200">
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <img v-if="primaryAuthor.avatar" :src="primaryAuthor.avatar" class="w-6 h-6 rounded-full" />
                <span class="text-sm font-medium text-gray-700">{{ primaryAuthor.name }}</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                <img v-if="secondaryAuthor.avatar" :src="secondaryAuthor.avatar" class="w-6 h-6 rounded-full" />
                <span class="text-sm font-medium text-gray-700">{{ secondaryAuthor.name }}</span>
            </div>
        </div>

        <!-- Dialogue Exchanges -->
        <div class="space-y-4">
            <div
                v-for="(exchange, index) in exchanges"
                :key="exchange.id || index"
                class="flex gap-3"
                :class="getAuthorColor(exchange.user_id) === 'blue' ? 'flex-row-reverse' : ''"
            >
                <!-- Avatar -->
                <div class="flex-shrink-0">
                    <img
                        v-if="getAuthor(exchange)?.avatar"
                        :src="getAuthor(exchange).avatar"
                        :alt="getAuthor(exchange)?.name"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <div
                        v-else
                        class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        :class="getAuthorColor(exchange.user_id) === 'red' ? 'bg-red-500' : 'bg-blue-500'"
                    >
                        {{ getAuthor(exchange)?.name?.charAt(0)?.toUpperCase() || '?' }}
                    </div>
                </div>

                <!-- Bubble -->
                <div
                    class="max-w-[75%] rounded-2xl px-4 py-3"
                    :class="getAuthorColor(exchange.user_id) === 'red'
                        ? 'bg-red-50 border border-red-100 rounded-tl-sm'
                        : 'bg-blue-50 border border-blue-100 rounded-tr-sm'"
                >
                    <p class="text-xs font-semibold mb-1"
                        :class="getAuthorColor(exchange.user_id) === 'red' ? 'text-red-600' : 'text-blue-600'"
                    >
                        {{ getAuthor(exchange)?.name }}
                    </p>
                    <div class="text-sm text-gray-800 leading-relaxed whitespace-pre-line" v-html="exchange.content"></div>
                </div>
            </div>
        </div>
    </div>
</template>
