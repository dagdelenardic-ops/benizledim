<script setup>
import { computed, ref } from 'vue';
import { useForm, usePage } from '@inertiajs/vue3';

const props = defineProps({
    postSlug: { type: String, required: true },
});

const emit = defineEmits(['open-login']);

const page = usePage();
const authUser = page.props.auth?.user;

const form = useForm({
    content: '',
    is_spoiler: false,
    display_name: '',
});

const maxLength = 500;
const charCount = computed(() => form.content.length);
const isNearLimit = computed(() => charCount.value > maxLength * 0.9);
const isOverLimit = computed(() => charCount.value > maxLength);

const submit = () => {
    if (isOverLimit.value || !form.content.trim()) return;
    if (!authUser && !form.display_name.trim()) return;

    form.post(`/yazi/${props.postSlug}/entry`, {
        preserveScroll: true,
        onSuccess: () => form.reset(),
    });
};
</script>

<template>
    <div class="bg-gray-50 rounded-lg p-4">
        <form @submit.prevent="submit">
            <!-- Display Name (anonymous only) -->
            <div v-if="!authUser" class="mb-3">
                <input
                    v-model="form.display_name"
                    type="text"
                    placeholder="Takma ad *"
                    maxlength="50"
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                />
                <p v-if="form.errors.display_name" class="mt-1 text-xs text-red-600">{{ form.errors.display_name }}</p>
            </div>

            <!-- Content -->
            <div class="relative">
                <textarea
                    v-model="form.content"
                    rows="3"
                    placeholder="Bu film/dizi hakkında kısa görüşünüz..."
                    class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                    :class="{ 'border-red-400': isOverLimit }"
                ></textarea>
                <div
                    class="absolute bottom-2 right-3 text-xs"
                    :class="{
                        'text-gray-400': !isNearLimit && !isOverLimit,
                        'text-orange-500': isNearLimit && !isOverLimit,
                        'text-red-500 font-medium': isOverLimit,
                    }"
                >
                    {{ charCount }}/{{ maxLength }}
                </div>
            </div>
            <p v-if="form.errors.content" class="mt-1 text-xs text-red-600">{{ form.errors.content }}</p>

            <!-- Options Row -->
            <div class="mt-3 flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        v-model="form.is_spoiler"
                        type="checkbox"
                        class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span class="text-sm text-gray-600">Spoiler iceriyor</span>
                </label>

                <button
                    type="submit"
                    :disabled="form.processing || isOverLimit || !form.content.trim() || (!authUser && !form.display_name.trim())"
                    class="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span v-if="form.processing">...</span>
                    <span v-else>Gonder</span>
                </button>
            </div>
        </form>
    </div>
</template>
