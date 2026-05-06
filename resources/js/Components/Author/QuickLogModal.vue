<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';

const emit = defineEmits(['close', 'submitted']);
const open = ref(false);

const step = ref(1);
const searchQuery = ref('');
const searchResults = ref([]);
const searchLoading = ref(false);
const searchMessage = ref('');
const searchMessageTone = ref('muted');
const selectedTmdb = ref(null);
let debounceTimer = null;

const moodOptions = ['romantik', 'gerilim', 'melankolik', 'vintage', 'suç', 'zihin-bükücü', 'retro', 'cesur', 'duygusal', 'sessiz'];

const todayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const defaultForm = () => ({
    tmdb_id: null,
    tmdb_type: 'movie',
    external_title: '',
    external_year: '',
    cover_image: '',
    rating: null,
    mood_tags: [],
    note: '',
    watched_on: todayString(),
    status: 'published',
    errors: {},
    processing: false,
});

const form = reactive(defaultForm());
const isMobile = ref(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

const onResize = () => { isMobile.value = window.innerWidth < 768; };
onMounted(() => window.addEventListener('resize', onResize));
onUnmounted(() => window.removeEventListener('resize', onResize));

const show = () => { open.value = true; };
const resetForm = () => Object.assign(form, defaultForm());
const close = () => {
    open.value = false;
    step.value = 1;
    searchQuery.value = '';
    searchResults.value = [];
    searchMessage.value = '';
    searchMessageTone.value = 'muted';
    selectedTmdb.value = null;
    resetForm();
    emit('close');
};

const titleOf = (item) => item.title || item.name || '';
const typeOf = (item) => item.type || item.media_type || (item.name ? 'tv' : 'movie');
const yearOf = (item) => item.year || (item.release_date || item.first_air_date || '').slice(0, 4);
const posterPathOf = (item) => item.poster_path || '';

const searchTmdb = () => {
    clearTimeout(debounceTimer);
    const q = searchQuery.value.trim();
    searchMessage.value = '';
    searchMessageTone.value = 'muted';

    if (q.length < 2) {
        searchResults.value = [];
        return;
    }

    debounceTimer = setTimeout(async () => {
        searchLoading.value = true;
        try {
            const { data } = await axios.get('/api/tmdb/search', { params: { q, type: 'multi' } });

            searchResults.value = Array.isArray(data?.results) ? data.results : [];

            if (data?.available === false) {
                searchMessageTone.value = 'warning';
                searchMessage.value = data?.message || 'TMDB aramasi su an kullanilamiyor.';
            } else if (searchResults.value.length === 0) {
                searchMessageTone.value = 'muted';
                searchMessage.value = 'Sonuc bulunamadi. Istersen manuel olarak devam edebilirsin.';
            }
        } catch (error) {
            searchResults.value = [];
            searchMessageTone.value = 'error';
            searchMessage.value = error.response?.data?.message || 'Arama sirasinda bir sorun olustu.';
        }

        searchLoading.value = false;
    }, 300);
};

const selectTmdb = (item) => {
    const posterPath = posterPathOf(item);

    selectedTmdb.value = item;
    step.value = 2;
    form.tmdb_id = item.id;
    form.tmdb_type = typeOf(item);
    form.external_title = titleOf(item);
    form.external_year = yearOf(item) || '';
    form.cover_image = posterPath ? `https://image.tmdb.org/t/p/w780${posterPath}` : '';
    form.errors = {};
    searchResults.value = [];
    searchQuery.value = '';
    searchMessage.value = '';
    searchMessageTone.value = 'muted';
};

const continueManually = () => {
    if (!form.external_title.trim()) {
        form.errors = { external_title: 'Film veya dizi adı girin.' };
        return;
    }

    selectedTmdb.value = null;
    form.tmdb_id = null;
    form.cover_image = '';
    form.errors = {};
    step.value = 2;
};

const clearSelection = () => {
    selectedTmdb.value = null;
    form.tmdb_id = null;
    form.tmdb_type = 'movie';
    form.external_title = '';
    form.external_year = '';
    form.cover_image = '';
    searchMessage.value = '';
    searchMessageTone.value = 'muted';
    step.value = 1;
};

const toggleMood = (mood) => {
    if (form.mood_tags.includes(mood)) {
        form.mood_tags = form.mood_tags.filter(m => m !== mood);
    } else if (form.mood_tags.length < 3) {
        form.mood_tags = [...form.mood_tags, mood];
    }
};

const setRating = (val) => { form.rating = val; };

const payload = () => ({
    tmdb_id: form.tmdb_id,
    tmdb_type: form.tmdb_type,
    external_title: form.external_title.trim(),
    external_year: form.external_year || null,
    cover_image: form.cover_image || null,
    rating: form.rating,
    mood_tags: form.mood_tags,
    note: form.note,
    watched_on: form.watched_on,
    status: form.status,
});

const submit = async () => {
    if (form.processing) return;

    form.processing = true;
    form.errors = {};

    try {
        const { data } = await axios.post('/api/quick-log', payload());
        emit('submitted', data.post);
        close();
    } catch (error) {
        form.errors = error.response?.data?.errors || { form: error.response?.data?.message || 'Not kaydedilemedi.' };
    } finally {
        form.processing = false;
    }
};

const starLabels = ['Berbat', 'Çok Kötü', 'Kötü', 'İdare Eder', 'Orta', 'Ortanın Üstü', 'İyi', 'Çok İyi', 'Harika', 'Başyapıt'];
const ratingLabel = computed(() => form.rating ? starLabels[form.rating - 1] : '');
const firstError = computed(() => Object.values(form.errors || {})?.flat?.()?.[0] || '');

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
                        <div v-if="firstError" class="bg-red-50 border border-red-200 text-red-700 text-sm p-3">
                            {{ firstError }}
                        </div>

                        <template v-if="step === 1">
                            <div class="relative">
                                <input v-model="searchQuery" @input="searchTmdb" type="text" placeholder="Film veya dizi ara..." class="w-full border-2 border-[var(--bi-ink)] px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-700/20" />
                                <div v-if="searchLoading" class="absolute right-3 top-3"><svg class="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg></div>
                            </div>

                            <div v-if="searchResults.length" class="border-2 border-[var(--bi-ink)] divide-y divide-[var(--bi-rule-soft)] max-h-80 overflow-y-auto">
                                <button v-for="item in searchResults" :key="item.id" @click="selectTmdb(item)" class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bi-paper)] transition-colors">
                                    <img v-if="posterPathOf(item)" :src="`https://image.tmdb.org/t/p/w92${posterPathOf(item)}`" class="w-10 h-14 object-cover border border-gray-200" />
                                    <div v-else class="w-10 h-14 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                                    <div class="flex-1 min-w-0">
                                        <div class="font-medium text-sm truncate">{{ titleOf(item) }}</div>
                                        <div class="text-xs text-gray-500">{{ yearOf(item) }} · {{ typeOf(item) === 'tv' ? 'Dizi' : 'Film' }}</div>
                                    </div>
                                </button>
                            </div>

                            <div v-else-if="searchMessage" :class="[
                                'border px-3 py-2 text-sm',
                                searchMessageTone === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-900' : '',
                                searchMessageTone === 'error' ? 'border-red-200 bg-red-50 text-red-700' : '',
                                searchMessageTone === 'muted' ? 'border-gray-200 bg-gray-50 text-gray-500' : '',
                            ]">
                                {{ searchMessage }}
                            </div>

                            <div class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-3 space-y-3">
                                <p class="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Manuel giriş</p>
                                <input v-model="form.external_title" type="text" placeholder="TMDB'de bulamadıysan adını yaz..." class="w-full border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20" />
                                <div class="grid grid-cols-[1fr_auto] gap-2">
                                    <input v-model="form.external_year" type="number" min="1880" max="2100" placeholder="Yıl" class="min-w-0 border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20" />
                                    <div class="flex border border-[var(--bi-ink)] bg-white">
                                        <button type="button" @click="form.tmdb_type = 'movie'" :class="['px-3 py-2 text-xs font-bold', form.tmdb_type === 'movie' ? 'bg-[var(--bi-ink)] text-white' : 'text-[var(--bi-ink)]']">Film</button>
                                        <button type="button" @click="form.tmdb_type = 'tv'" :class="['px-3 py-2 text-xs font-bold border-l border-[var(--bi-ink)]', form.tmdb_type === 'tv' ? 'bg-[var(--bi-ink)] text-white' : 'text-[var(--bi-ink)]']">Dizi</button>
                                    </div>
                                </div>
                                <button type="button" @click="continueManually" class="w-full border-2 border-[var(--bi-ink)] bg-white py-2 text-sm font-bold text-[var(--bi-ink)] transition-colors hover:bg-[var(--bi-ink)] hover:text-white">
                                    Manuel Devam Et
                                </button>
                            </div>
                        </template>

                        <template v-if="step === 2">
                            <div class="flex items-center gap-3 bg-[var(--bi-paper)] border-2 border-[var(--bi-ink)] p-3">
                                <img v-if="selectedTmdb && posterPathOf(selectedTmdb)" :src="`https://image.tmdb.org/t/p/w185${posterPathOf(selectedTmdb)}`" class="w-12 h-16 object-cover border border-gray-200" />
                                <div v-else class="flex h-16 w-12 items-center justify-center border border-gray-200 bg-white text-xs text-gray-400">Bİ</div>
                                <div class="flex-1 min-w-0">
                                    <div class="font-bold truncate">{{ form.external_title }}</div>
                                    <div class="text-xs text-gray-500">{{ form.external_year || 'Yıl yok' }} · {{ form.tmdb_type === 'tv' ? 'Dizi' : 'Film' }}</div>
                                </div>
                                <button @click="clearSelection" class="text-gray-400 hover:text-red-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
                            </div>

                            <div>
                                <label class="block text-sm font-bold mb-2">Puanın (1-10)</label>
                                <div class="flex items-center gap-1">
                                    <button v-for="i in 10" :key="i" @click="setRating(i)" class="text-2xl transition-colors" :class="form.rating && i <= form.rating ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'">★</button>
                                </div>
                                <p v-if="ratingLabel" class="mt-1 text-xs font-medium text-yellow-700">{{ ratingLabel }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-bold mb-2">Mod (en fazla 3)</label>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="mood in moodOptions" :key="mood" @click="toggleMood(mood)" :class="['px-3 py-1 rounded-full text-xs font-medium border transition-colors', form.mood_tags.includes(mood) ? 'border-red-600 bg-red-100 text-red-700' : 'border-gray-300 text-gray-600 hover:border-gray-400']">{{ mood }}</button>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-bold mb-2">Notun</label>
                                <textarea v-model="form.note" maxlength="280" rows="3" class="w-full border-2 border-[var(--bi-ink)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-700/20" placeholder="Ne düşündün?"></textarea>
                                <div class="text-right text-xs" :class="form.note.length > 240 ? 'text-red-600 font-bold' : 'text-gray-400'">{{ form.note.length }}/280</div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-bold mb-1">Tarih</label>
                                    <input v-model="form.watched_on" type="date" class="w-full border-2 border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20" />
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
