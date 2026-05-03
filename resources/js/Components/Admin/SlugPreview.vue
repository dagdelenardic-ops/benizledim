<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
    modelValue: { type: String, default: '' },
    postId: { type: Number, default: null },
});

const emit = defineEmits(['update:modelValue']);

const slug = ref(props.modelValue || '');
const isLoading = ref(false);
const isAvailable = ref(true);
const errorMsg = ref('');

const turkishToEnglish = (text) => {
    const map = {
        ç: 'c', Ç: 'c', ş: 's', Ş: 's', ğ: 'g', Ğ: 'g',
        ü: 'u', Ü: 'u', ö: 'o', Ö: 'o', ı: 'i', İ: 'i', I: 'i',
    };
    return text
        .replace(/[çÇşŞğĞüÜöÖıİI]/g, (c) => map[c] || c)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const generateSlug = (title) => {
    if (!title) return '';
    return turkishToEnglish(title);
};

let checkTimer = null;
const checkAvailability = async (value) => {
    clearTimeout(checkTimer);
    if (!value) {
        isAvailable.value = true;
        errorMsg.value = '';
        return;
    }
    checkTimer = setTimeout(async () => {
        isLoading.value = true;
        try {
            const params = { slug: value };
            if (props.postId) params.exclude = props.postId;
            const { data } = await axios.get('/admin/posts/check-slug', { params });
            isAvailable.value = data.available;
            errorMsg.value = isAvailable.value ? '' : 'Bu slug kullanımda, farklı bir slug deneyin.';
        } catch {
            isAvailable.value = true;
        } finally {
            isLoading.value = false;
        }
    }, 500);
};

const onInput = (e) => {
    slug.value = e.target.value;
    emit('update:modelValue', slug.value);
    checkAvailability(slug.value);
};

const updateFromTitle = (title) => {
    const generated = generateSlug(title);
    slug.value = generated;
    emit('update:modelValue', slug.value);
    checkAvailability(slug.value);
};

watch(() => props.modelValue, (val) => {
    if (val !== slug.value) {
        slug.value = val || '';
    }
});

defineExpose({ updateFromTitle });
</script>

<template>
    <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">
            Slug
            <span class="text-gray-400 text-xs ml-1">(opsiyonel)</span>
        </label>
        <div class="flex items-center gap-2">
            <span class="text-sm text-gray-400">/yazi/</span>
            <input
                :value="slug"
                @input="onInput"
                type="text"
                class="flex-1 border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                placeholder="yazi-slug-ornegi"
            />
            <span v-if="isLoading" class="text-gray-400 text-xs">⏳</span>
            <span v-else-if="slug && isAvailable" class="text-green-600 text-xs">✓</span>
            <span v-else-if="slug && !isAvailable" class="text-red-600 text-xs">✗</span>
        </div>
        <p v-if="errorMsg" class="text-xs text-red-600">{{ errorMsg }}</p>
    </div>
</template>
