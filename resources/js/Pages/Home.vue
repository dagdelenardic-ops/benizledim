<script setup>
import { computed } from 'vue';
import { Link, useForm, usePage } from '@inertiajs/vue3';
import AppLayout from '../Components/Layout/AppLayout.vue';
import PostGrid from '../Components/Post/PostGrid.vue';

const props = defineProps({
    posts: {
        type: Array,
        default: () => [],
    },
    categories: {
        type: Array,
        default: () => [],
    },
});

const form = useForm({ email: '' });
const page = usePage();
const newsletterMessage = computed(() => page.props.flash?.newsletter_message);

const subscribe = () => {
    form.post('/newsletter', {
        preserveScroll: true,
        onSuccess: () => form.reset(),
    });
};
</script>

<template>
    <AppLayout title="Ana Sayfa">
        <!-- Hero Section -->
        <section class="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-16 md:py-24">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                    BEN İZLEDİM
                </h1>
                <p class="text-xl md:text-2xl text-red-100 max-w-2xl mx-auto mb-8">
                    Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazılarının yer aldığı bir medya platformu
                </p>
                <Link
                    href="/yazilar"
                    class="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-red-50 transition-colors"
                >
                    Yazıları Keşfet
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>
        </section>

        <!-- Categories -->
        <section class="bg-gray-50 border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 py-6">
                <div class="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <span class="text-gray-500 text-sm font-medium whitespace-nowrap">Kategoriler:</span>
                    <Link
                        v-for="category in categories"
                        :key="category.id"
                        :href="`/yazilar?category=${category.slug}`"
                        class="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-red-500 hover:text-red-600 whitespace-nowrap transition-colors"
                    >
                        {{ category.name }}
                        <span class="text-gray-400 ml-1">({{ category.posts_count }})</span>
                    </Link>
                </div>
            </div>
        </section>

        <!-- Recent Posts -->
        <section class="max-w-7xl mx-auto px-4 py-12">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Son Yazılar</h2>
                <Link
                    href="/yazilar"
                    class="text-red-600 font-medium hover:text-red-700 flex items-center gap-1"
                >
                    Tümünü Gör
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
            <PostGrid :posts="posts" />
        </section>

        <!-- Newsletter CTA -->
        <section class="bg-gray-900 text-white py-16">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <h2 class="text-3xl font-bold mb-4">Önce Siz Okuyun</h2>
                <p class="text-gray-400 mb-8 max-w-xl mx-auto">
                    Yeni blog yazılarımızdan ve haberlerden ilk siz haberdar olun. Spam yok, sadece kaliteli içerik.
                </p>
                
                <!-- Success Message -->
                <div v-if="newsletterMessage" class="mb-6 max-w-md mx-auto">
                    <div class="px-4 py-3 bg-green-100 text-green-700 rounded-lg">
                        {{ newsletterMessage }}
                    </div>
                </div>
                
                <form @submit.prevent="subscribe" class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <input
                        v-model="form.email"
                        type="email"
                        placeholder="E-posta adresiniz"
                        class="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
                        :class="{ 'border-red-500': form.errors.email }"
                    />
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <span v-if="form.processing">Gönderiliyor...</span>
                        <span v-else>Abone Ol</span>
                    </button>
                </form>
                <p v-if="form.errors.email" class="mt-2 text-red-400 text-sm">{{ form.errors.email }}</p>
            </div>
        </section>
    </AppLayout>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
