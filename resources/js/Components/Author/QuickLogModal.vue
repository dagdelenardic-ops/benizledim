<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useForm } from '@inertiajs/vue3';
import axios from 'axios';

const emit = defineEmits(['close', 'submitted']);
const open = ref(false);

const step = ref(1);
const searchQuery = ref('');
const searchResults = ref([]);
const searchLoading = ref(false);
const selectedTmdb = ref(null);
let debounceTimer = null;

const moodOptions = ['romantik', 'gerilim', 'melankolik', 'vintage', 'suç', 'zihin-bükücü', 'retro', 'cesur', 'duygusal', 'sessiz'];

const form = useForm({
    tmdb_id: null,
    external_title: '',
    external_year: '',
    cover_image: '',
    rating: null,
    mood_tags: [],
    note: '',
    watched_at: new Date().toISOString().slice(0, 10),
    status: 'published',
});

const isMobile = ref(window.innerWidth < 768);

const onResize = () => { isMobile.value = window.innerWidth < 768; };
onMounted(() => window.addEventListener('resize', onResize));
onUnmounted(() => window.removeEventListener('resize', onResize));

const show = () => { open.value = true; };
const close = () => { open.value = false; step.value = 1; searchQuery.value = ''; searchResults.value = []; selectedTmdb.value = null; form.reset(); emit('close'); };

const searchTmdb = () => {
    clearTimeout(debounceTimer);
    const q = searchQuery.value.trim();
    if (q.length < 2) { searchResults.value = []; return; }
    debounceTimer = setTimeout(async () => {
        searchLoading.value = true;
        try { const { data } = await axios.get('/api/tmdb/search', { params: { q, type: 'multi' } }); searchResults.value = data.results || data || []; } catch { searchResults.value = []; }
        searchLoading.value = false;
    }, 300);
};

const selectTmdb = (item) => {
    selectedTmdb.value = item;
    step.value = 2;
    form.tmdb_id = item.id;
    form.external_title = item.title || item.name || '';
    form.external_year = (item.release_date || item.first_air_date || '').slice(0, 4);
    form.cover_image = item.poster_path ? `https://image.tmdb.org/t/p/w780${item.poster_path}` : '';
    searchResults.value = [];
    searchQuery.value = '';
};

const toggleMood = (mood) => {
    if (form.mood_tags.includes(mood)) {
        form.mood_tags = form.mood_tags.filter(m => m !== mood);
    } else if (form.mood_tags.length < 3) {
        form.mood_tags = [...form.mood_tags, mood];
    }
};

const setRating = (val) => { form.rating = val; };

const submit = () => {
    form.post('/api/quick-log', {
        onSuccess: () => { emit('submitted', form.data()); close(); },
    });
};

const starLabels = ['Berbat', 'Çok Kötü', 'Kötü', 'İdare Eder', 'Orta', 'Ortanın Üstü', 'İyi', 'Çok İyi', 'Harika', 'Başyapıt'];
const ratingLabel = computed(() => form.rating ? starLabels[form.rating - 1] : '');

defineExpose({ show });
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="open" class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" @click.self="close">
                <div :class="['bg-white overflow-y-auto max-h-[90vh] w-full md:max-w-lg md:rounded-lg md:shadow-xl border-t-2 md:border-2 border-[var(--bi-ink)]', isMobile ? 'rounded-t-xl' : '']">
                    <div class="sticky top-0 z-10 flex items-center justify-between border-b-2 border-[var(--bi-ink)] bg-white px-4 py-3">
                        <h2 class="text-lg font-bold">Hızlı Not</h2>
                        <button @click="close" class="text-gray-500 hover:text-gray-700"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                    </div>

                    <div class="p-4 space-y-4">
                        <div v-if="form.errors && Object.keys(form.errors).length" class="bg-red-50 border border-red-200 text-red-700 text-sm p-3">
                            {{ Object.values(form.errors)[0] }}
                        </div>

                        <!-- Step 1: TMDB Search -->
                        <template v-if="step === 1">
                            <div class="relative">
                                <input v-model="searchQuery" @input="searchTmdb" type="text" placeholder="Film veya dizi ara..." class="w-full border-2 border-[var(--bi-ink)] px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-700/20" />
                                <div v-if="searchLoading" class="absolute right-3 top-3"><svg class="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg></div>
                            </div>

                            <div v-if="searchResults.length" class="border-2 border-[var(--bi-ink)] divide-y divide-[var(--bi-rule-soft)] max-h-80 overflow-y-auto">
                                <button v-for="item in searchResults" :key="item.id" @click="selectTmdb(item)" class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bi-paper)] transition-colors">
                                    <img v-if="item.poster_path" :src="`https://image.tmdb.org/t/p/w92${item.poster_path}`" class="w-10 h-14 object-cover border border-gray-200" />
                                    <div v-else class="w-10 h-14 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                                    <div class="flex-1 min-w-0">
                                        <div class="font-medium text-sm truncate">{{ item.title || item.name }}</div>
                                        <div class="text-xs text-gray-500">{{ (item.release_date || item.first_air_date || '').slice(0, 4) }} · {{ item.media_type === 'tv' ? 'Dizi' : 'Film' }}</div>
                                    </div>
                                </button>
                            </div>

                            <p class="text-xs text-gray-400">TMDB'de bulamadıysanız notu manuel girebilirsiniz.</p>
                        </template>

                        <!-- Step 2: Form -->
                        <template v-if="step === 2">
                            <!-- Selected card -->
                            <div v-if="selectedTmdb" class="flex items-center gap-3 bg-[var(--bi-paper)] border-2 border-[var(--bi-ink)] p-3">
                                <img v-if="selectedTmdb.poster_path" :src="`https://image.tmdb.org/t/p/w185${selectedTmdb.poster_path}`" class="w-12 h-16 object-cover border border-gray-200" />
                                <div class="flex-1 min-w-0">
                                    <div class="font-bold truncate">{{ selectedTmdb.title || selectedTmdb.name }}</div>
                                    <div class="text-xs text-gray-500">{{ (selectedTmdb.release_date || selectedTmdb.first_air_date || '').slice(0, 4) }}</div>
                                </div>
                                <button @click="step = 1; selectedTmdb = null" class="text-gray-400 hover:text-red-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                            </div>

                            <!-- Star Rating -->
                            <div>
                                <label class="block text-sm font-bold mb-2">Puanın (1-10)</label>
                                <div class="flex items-center gap-1">
                                    <button v-for="i in 10" :key="i" @click="setRating(i)" class="text-2xl transition-colors" :class="form.rating && i <= form.rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'">★</button>
                                </div>
                                <p v-if="ratingLabel" class="mt-1 text-xs font-medium text-yellow-700">{{ ratingLabel }}</p>
                            </div>

                            <!-- Mood Tags -->
                            <div>
                                <label class="block text-sm font-bold mb-2">Mod (en fazla 3)</label>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="mood in moodOptions" :key="mood" @click="toggleMood(mood)" :class="['px-3 py-1 rounded-full text-xs font-medium border transition-colors', form.mood_tags.includes(mood) ? 'border-red-600 bg-red-100 text-red-700' : 'border-gray-300 text-gray-600 hover:border-gray-400']">{{ mood }}</button>
                                </div>
                            </div>

                            <!-- Note -->
                            <div>
                                <label class="block text-sm font-bold mb-2">Notun</label>
                                <textarea v-model="form.note" maxlength="280" rows="3" class="w-full border-2 border-[var(--bi-ink)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-700/20" placeholder="Ne düşündün?"></textarea>
                                <div class="text-right text-xs" :class="form.note.length > 240 ? 'text-red-600 font-bold' : 'text-gray-400'">{{ form.note.length }}/280</div>
                            </div>

                            <!-- Date & Status -->
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-bold mb-1">Tarih</label>
                                    <input v-model="form.watched_at" type="date" class="w-full border-2 border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20" />
                                </div>
                                <div class="flex items-end gap-2">
                                    <button type="button" @click="form.status = form.status === 'draft' ? 'published' : 'draft'" :class="['flex-1 border-2 px-3 py-2 text-xs font-bold transition-colors', form.status === 'published' ? 'border-red-700 bg-red-700 text-white' : 'border-[var(--bi-ink)] bg-white text-[var(--bi-ink)]']">
                                        {{ form.status === 'published' ? 'Yayınla' : 'Taslak' }}
                                    </button>
                                </div>
                            </div>

                            <button @click="submit" :disabled="form.processing || !form.rating" class="w-full bg-red-700 text-white py-3 font-bold hover:bg-red-800 disabled:opacity-50 transition-colors">
                                {{ form.processing ? 'Kaydediliyor...' : form.status === 'published' ? 'Yayınla' : 'Taslak Olarak Kaydet' }}
                            </button>
                        </template>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
