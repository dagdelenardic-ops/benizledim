<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    letterboxd: { type: Object, default: () => ({}) },
});

const step = ref(props.letterboxd?.username ? 'connected' : 'input');
const username = ref(props.letterboxd?.username || '');
const previewEntries = ref([]);
const lastSyncAt = ref(props.letterboxd?.lastSyncAt || null);
const loading = ref(false);
const error = ref('');

const connect = async () => {
    if (!username.value.trim()) return;
    loading.value = true; error.value = '';
    try {
        const { data } = await axios.post('/api/letterboxd/connect', { username: username.value.trim() });
        previewEntries.value = data.entries || data || [];
        step.value = 'preview';
    } catch (e) { error.value = e.response?.data?.error || 'Bağlantı hatası'; }
    loading.value = false;
};

const confirm = async () => {
    loading.value = true;
    try {
        await axios.post('/api/letterboxd/confirm', { username: username.value.trim() });
        step.value = 'connected';
    } catch (e) { error.value = 'Onay hatası'; }
    loading.value = false;
};

const syncNow = async () => {
    loading.value = true;
    try {
        const { data } = await axios.post('/api/letterboxd/sync-now');
        lastSyncAt.value = data.lastSyncAt || new Date().toISOString();
    } catch (e) { error.value = 'Sync hatası'; }
    loading.value = false;
};

const disconnect = async () => {
    if (!confirm('Letterboxd bağlantısını kesmek istiyor musunuz?')) return;
    loading.value = true;
    try { await axios.delete('/api/letterboxd'); step.value = 'input'; username.value = ''; } catch {}
    loading.value = false;
};
</script>

<template>
    <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
        <h3 class="font-bold text-sm flex items-center gap-2">
            <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 16.29L13.17 21.17C13.89 21.89 15 21.36 15 20.41V3.59C15 2.64 13.89 2.11 13.17 2.83L8.29 7.71C7.9 8.1 7.5 8.1 7.11 7.71L2.83 3.41C2.11 2.69 1 3.22 1 4.17V19.83C1 20.78 2.11 21.31 2.83 20.59L7.11 16.29C7.5 15.9 7.9 15.9 8.29 16.29Z"/></svg>
            Letterboxd
        </h3>

        <div v-if="error" class="text-xs text-red-600 bg-red-50 p-2">{{ error }}</div>

        <!-- Not connected -->
        <template v-if="step === 'input'">
            <p class="text-xs text-gray-500">Letterboxd hesabınızı bağlayın, izleme geçmişinizi senkronize edin.</p>
            <div class="flex gap-2">
                <input v-model="username" @keyup.enter="connect" type="text" placeholder="letterboxd.com/ kullanıcı adınız" class="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 rounded-lg" />
                <button @click="connect" :disabled="loading" class="bg-orange-500 text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50">{{ loading ? '...' : 'Bağla' }}</button>
            </div>
        </template>

        <!-- Preview confirm -->
        <template v-if="step === 'preview'">
            <p class="text-xs text-gray-500">Bu siz misiniz? Son 5 entry:</p>
            <div class="divide-y border rounded-lg max-h-48 overflow-y-auto">
                <div v-for="entry in previewEntries.slice(0, 5)" :key="entry.id || entry.title" class="px-3 py-2 text-xs flex justify-between">
                    <span class="truncate">{{ entry.title || entry.name }}</span>
                    <span class="text-gray-400 ml-2 flex-shrink-0">{{ entry.rating ? '★'.repeat(Math.round(entry.rating)) : '' }}</span>
                </div>
            </div>
            <div class="flex gap-2">
                <button @click="confirm" :disabled="loading" class="bg-orange-500 text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50">Evet, Bu Benim</button>
                <button @click="step = 'input'; previewEntries = []" class="border border-gray-300 px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">Hayır</button>
            </div>
        </template>

        <!-- Connected -->
        <template v-if="step === 'connected'">
            <div class="flex items-center gap-2 text-sm">
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                <span class="font-medium">{{ username || letterboxd.username }} bağlı</span>
            </div>
            <p v-if="lastSyncAt" class="text-xs text-gray-400">Son sync: {{ new Date(lastSyncAt).toLocaleString('tr-TR') }}</p>
            <div class="flex gap-2">
                <button @click="syncNow" :disabled="loading" class="border border-gray-300 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50">{{ loading ? '...' : 'Şimdi Sync Et' }}</button>
                <button @click="disconnect" class="text-xs text-red-500 hover:text-red-700">Bağlantıyı Kes</button>
            </div>
        </template>
    </div>
</template>
