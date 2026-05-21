<script setup>
import { ref, nextTick } from 'vue';
import { Head, Link, router } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';

const props = defineProps({
    title: { type: String, default: 'Asistan' },
    description: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
});

const question = ref('');
const messages = ref([]);
const loading = ref(false);
const sessionId = ref(null);
const transcriptEl = ref(null);

const suggestions = [
    'Karanlık atmosferli, yavaş tempolu bir film öner',
    'Lynch izlemiş birine ne tavsiye edersin?',
    'Türk yapımı suç-gizem belgeseli var mı?',
    'Bu hafta hangi yazılar yayınlandı?',
];

const scrollToEnd = () => {
    nextTick(() => {
        if (transcriptEl.value) {
            transcriptEl.value.scrollTop = transcriptEl.value.scrollHeight;
        }
    });
};

const ask = async (text) => {
    const q = (text ?? question.value).trim();
    if (q.length < 3 || loading.value) return;

    messages.value.push({ role: 'user', text: q });
    question.value = '';
    loading.value = true;
    scrollToEnd();

    try {
        const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
        const res = await fetch('/asistan/sor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...(csrf ? { 'X-CSRF-TOKEN': csrf } : {}),
            },
            body: JSON.stringify({ question: q, session: sessionId.value }),
            credentials: 'same-origin',
        });
        const data = await res.json();
        sessionId.value = data.session ?? sessionId.value;
        messages.value.push({
            role: 'assistant',
            text: data.answer || 'Bu konuda henüz yazımız yok.',
            citations: data.citations || [],
        });
    } catch (e) {
        messages.value.push({
            role: 'assistant',
            text: 'Bir hata oluştu, biraz sonra tekrar dene.',
            citations: [],
        });
    } finally {
        loading.value = false;
        scrollToEnd();
    }
};

const reset = () => {
    messages.value = [];
    sessionId.value = null;
};
</script>

<template>
    <Head>
        <title>{{ title }}</title>
        <meta name="description" :content="description" />
    </Head>

    <AppLayout :title="title">
        <div class="min-h-screen bg-gray-50">
            <div class="max-w-3xl mx-auto px-4 py-10">
                <div class="mb-8 text-center">
                    <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Ben İzledim Asistanı
                    </h1>
                    <p class="text-gray-600">
                        Sitedeki yazılara dayanan film, dizi, belgesel önerileri ve sorular için.
                    </p>
                </div>

                <div
                    ref="transcriptEl"
                    class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4"
                    style="max-height: 60vh; min-height: 320px; overflow-y: auto;"
                >
                    <div v-if="messages.length === 0" class="p-8 text-center">
                        <p class="text-gray-500 mb-6">Bir örnekle başla:</p>
                        <div class="grid sm:grid-cols-2 gap-3">
                            <button
                                v-for="s in suggestions"
                                :key="s"
                                @click="ask(s)"
                                :disabled="loading || !enabled"
                                class="text-left text-sm px-4 py-3 rounded-xl border border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-700 transition disabled:opacity-50"
                            >
                                {{ s }}
                            </button>
                        </div>
                    </div>

                    <div v-else class="divide-y divide-gray-100">
                        <div v-for="(m, i) in messages" :key="i" class="px-5 py-4">
                            <div v-if="m.role === 'user'" class="flex justify-end">
                                <div class="bg-red-600 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%] whitespace-pre-wrap">
                                    {{ m.text }}
                                </div>
                            </div>
                            <div v-else class="flex justify-start">
                                <div class="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%]">
                                    <p class="whitespace-pre-wrap leading-relaxed">{{ m.text }}</p>
                                    <div v-if="m.citations && m.citations.length" class="mt-3 pt-3 border-t border-gray-200">
                                        <p class="text-xs uppercase tracking-wide text-gray-500 mb-2">Kaynaklar</p>
                                        <ul class="space-y-1">
                                            <li v-for="c in m.citations" :key="c.id" class="text-sm">
                                                <Link
                                                    v-if="c.slug"
                                                    :href="`/yazi/${c.slug}`"
                                                    class="text-red-600 hover:underline"
                                                >
                                                    {{ c.title }}
                                                </Link>
                                                <span v-else>{{ c.title }}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div v-if="loading" class="px-5 py-4">
                            <div class="flex justify-start">
                                <div class="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div class="flex gap-1">
                                        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
                                        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
                                        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <form @submit.prevent="ask()" class="flex gap-2">
                    <input
                        v-model="question"
                        type="text"
                        placeholder="Sorunu yaz…"
                        :disabled="loading || !enabled"
                        maxlength="500"
                        class="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        :disabled="loading || !enabled || question.trim().length < 3"
                        class="px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sor
                    </button>
                </form>

                <div class="mt-4 flex items-center justify-between text-sm">
                    <p class="text-gray-500">
                        Cevaplar yalnızca yayınladığımız yazılara dayanır.
                    </p>
                    <button
                        v-if="messages.length > 0"
                        @click="reset"
                        class="text-gray-600 hover:text-red-600"
                    >
                        Yeni sohbet
                    </button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
