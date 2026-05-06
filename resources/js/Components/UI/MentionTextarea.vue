<script setup>
import { computed, nextTick, ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    modelValue: { type: String, default: '' },
    rows: { type: [String, Number], default: 4 },
    placeholder: { type: String, default: '' },
    maxLength: { type: Number, default: 1000 },
    disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const textarea = ref(null);
const suggestions = ref([]);
const showSuggestions = ref(false);
const activeIndex = ref(0);
const mentionRange = ref(null);
let searchTimer = null;

const value = computed({
    get: () => props.modelValue,
    set: (nextValue) => emit('update:modelValue', nextValue),
});

function slugifyName(name) {
    return (name || '')
        .toLocaleLowerCase('tr-TR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function closeSuggestions() {
    showSuggestions.value = false;
    suggestions.value = [];
    activeIndex.value = 0;
    mentionRange.value = null;
}

async function fetchSuggestions(query) {
    if (!query) {
        closeSuggestions();
        return;
    }

    try {
        const { data } = await axios.get('/api/authors/search', { params: { q: query } });
        suggestions.value = Array.isArray(data) ? data : [];
        showSuggestions.value = suggestions.value.length > 0;
        activeIndex.value = 0;
    } catch {
        closeSuggestions();
    }
}

function detectMention(target) {
    const cursor = target.selectionStart ?? 0;
    const beforeCursor = value.value.slice(0, cursor);
    const match = beforeCursor.match(/(^|\s)@([a-z0-9-]{1,80})$/i);

    if (!match) {
        closeSuggestions();
        return;
    }

    const query = match[2];
    const start = cursor - query.length - 1;
    mentionRange.value = { start, end: cursor };

    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => fetchSuggestions(query), 120);
}

function onInput(event) {
    value.value = event.target.value;
    detectMention(event.target);
}

function applySuggestion(author) {
    if (!mentionRange.value) return;

    const handle = author.username || slugifyName(author.name);
    const before = value.value.slice(0, mentionRange.value.start);
    const after = value.value.slice(mentionRange.value.end);
    const nextValue = `${before}@${handle} ${after}`;
    const nextCursor = before.length + handle.length + 2;

    value.value = nextValue;
    closeSuggestions();

    nextTick(() => {
        if (!textarea.value) return;
        textarea.value.focus();
        textarea.value.setSelectionRange(nextCursor, nextCursor);
    });
}

function onKeydown(event) {
    if (!showSuggestions.value || suggestions.value.length === 0) {
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        activeIndex.value = (activeIndex.value + 1) % suggestions.value.length;
        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();
        activeIndex.value = (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length;
        return;
    }

    if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        applySuggestion(suggestions.value[activeIndex.value]);
        return;
    }

    if (event.key === 'Escape') {
        closeSuggestions();
    }
}
</script>

<template>
    <div class="relative">
        <textarea
            ref="textarea"
            :value="value"
            :rows="rows"
            :placeholder="placeholder"
            :maxlength="maxLength"
            :disabled="disabled"
            class="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 transition-all focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
            @input="onInput"
            @keydown="onKeydown"
            @blur="() => setTimeout(closeSuggestions, 120)"
            @focus="detectMention($event.target)"
            @click="detectMention($event.target)"
        />

        <div
            v-if="showSuggestions"
            class="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        >
            <button
                v-for="(author, index) in suggestions"
                :key="author.id"
                type="button"
                class="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors"
                :class="index === activeIndex ? 'bg-red-50' : 'hover:bg-gray-50'"
                @mousedown.prevent="applySuggestion(author)"
            >
                <img v-if="author.avatar" :src="author.avatar" :alt="author.name" class="h-8 w-8 rounded-full object-cover">
                <div v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-xs font-black text-red-700">
                    {{ author.name.charAt(0) }}
                </div>
                <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-gray-900">{{ author.name }}</p>
                    <p class="truncate text-xs text-gray-500">@{{ author.username || slugifyName(author.name) }}</p>
                </div>
            </button>
        </div>
    </div>
</template>
