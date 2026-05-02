<script setup>
import { ref, computed } from 'vue';
import EntryCard from './EntryCard.vue';
import EntryForm from './EntryForm.vue';

const props = defineProps({
    entries: { type: Array, default: () => [] },
    postSlug: { type: String, required: true },
    userVotes: { type: Object, default: () => ({}) }, // { entryId: vote }
});

const emit = defineEmits(['open-login']);

const activeTab = ref('all'); // 'all', 'nonspoiler', 'spoiler'

const sortedEntries = computed(() => {
    let filtered = [...props.entries];

    if (activeTab.value === 'spoiler') {
        filtered = filtered.filter(e => e.is_spoiler);
    } else if (activeTab.value === 'nonspoiler') {
        filtered = filtered.filter(e => !e.is_spoiler);
    }

    return filtered.sort((a, b) => b.score - a.score || new Date(b.created_at) - new Date(a.created_at));
});

const spoilerCount = computed(() => props.entries.filter(e => e.is_spoiler).length);
const nonspoilerCount = computed(() => props.entries.filter(e => !e.is_spoiler).length);

const tabs = computed(() => [
    { key: 'all', label: 'Tumu', count: props.entries.length },
    { key: 'nonspoiler', label: 'Spoilersiz', count: nonspoilerCount.value },
    { key: 'spoiler', label: 'Spoilerli', count: spoilerCount.value },
]);
</script>

<template>
    <div class="bg-white rounded-xl border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Entry'ler</h3>
            <span class="text-sm text-gray-500">{{ entries.length }} entry</span>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                :class="activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'"
            >
                {{ tab.label }}
                <span class="ml-1 text-xs text-gray-400">({{ tab.count }})</span>
            </button>
        </div>

        <!-- Spoiler Warning -->
        <div
            v-if="activeTab === 'spoiler' && spoilerCount > 0"
            class="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700"
        >
            Bu bolum spoiler icerir. Dikkatli okuyun.
        </div>

        <!-- Entry List -->
        <div v-if="sortedEntries.length > 0" class="divide-y divide-gray-100">
            <EntryCard
                v-for="entry in sortedEntries"
                :key="entry.id"
                :entry="entry"
                :user-vote="userVotes[entry.id] ?? 0"
                @open-login="$emit('open-login')"
            />
        </div>
        <div v-else class="py-8 text-center text-gray-400 text-sm">
            <span v-if="activeTab === 'all'">Henuz entry yok. Ilk siz yazin!</span>
            <span v-else-if="activeTab === 'spoiler'">Spoilerli entry yok.</span>
            <span v-else>Spoilersiz entry yok.</span>
        </div>

        <!-- Entry Form -->
        <div class="mt-6 pt-4 border-t border-gray-200">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">Entry Yaz</h4>
            <EntryForm
                :post-slug="postSlug"
                @open-login="$emit('open-login')"
            />
        </div>
    </div>
</template>
