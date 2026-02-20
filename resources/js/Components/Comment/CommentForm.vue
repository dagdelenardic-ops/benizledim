<script setup>
import { computed } from 'vue';
import { useForm, usePage } from '@inertiajs/vue3';

const props = defineProps({
    postSlug: {
        type: String,
        required: true,
    },
});

const page = usePage();
const authUser = page.props.auth?.user;

const form = useForm({
    content: '',
});

const maxLength = 1000;

const charCount = computed(() => form.content.length);
const isNearLimit = computed(() => charCount.value > maxLength * 0.9);
const isOverLimit = computed(() => charCount.value > maxLength);

const submit = () => {
    if (isOverLimit.value) return;
    
    form.post(`/yazi/${props.postSlug}/yorum`, {
        onSuccess: () => form.reset(),
    });
};
</script>

<template>
    <div class="bg-white rounded-xl border border-gray-200 p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">Yorum Yap</h3>
        
        <!-- Guest Message -->
        <div v-if="!authUser" class="text-center py-6 bg-gray-50 rounded-lg">
            <p class="text-gray-600 mb-3">Yorum yapmak için giriş yapmalısınız</p>
            <button
                @click="$emit('open-login')"
                class="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
                Giriş Yap
            </button>
        </div>
        
        <!-- Comment Form -->
        <form v-else @submit.prevent="submit">
            <div class="relative">
                <textarea
                    v-model="form.content"
                    rows="4"
                    placeholder="Düşüncelerinizi paylaşın..."
                    class="w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                    :class="{ 'border-red-500 focus:border-red-500': isOverLimit }"
                ></textarea>
                
                <!-- Character Counter -->
                <div class="absolute bottom-3 right-3 text-sm"
                    :class="{
                        'text-gray-400': !isNearLimit && !isOverLimit,
                        'text-orange-500': isNearLimit && !isOverLimit,
                        'text-red-500 font-medium': isOverLimit
                    }"
                >
                    {{ charCount }}/{{ maxLength }}
                </div>
            </div>
            
            <!-- Error Message -->
            <p v-if="form.errors.content" class="mt-2 text-sm text-red-600">
                {{ form.errors.content }}
            </p>
            
            <!-- Submit Button -->
            <div class="mt-4 flex justify-end">
                <button
                    type="submit"
                    :disabled="form.processing || isOverLimit || !form.content.trim()"
                    class="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span v-if="form.processing">Gönderiliyor...</span>
                    <span v-else>Yorum Yap</span>
                </button>
            </div>
        </form>
    </div>
</template>
