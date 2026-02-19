<script setup>
import { Head } from '@inertiajs/vue3';

defineProps({
    title: String,
});
</script>

<template>
    <Head :title="title" />

    <!-- Navbar -->
    <header>
        <nav class="bg-primary text-white">
            <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <a href="/" class="text-xl font-bold tracking-wide">BEN İZLEDİM</a>
                <div class="flex items-center gap-6">
                    <a href="/" class="hover:underline">Ana Sayfa</a>
                    <a href="/podcast" class="hover:underline">Podcast</a>
                    <button class="bg-white text-primary px-4 py-1.5 rounded font-medium text-sm hover:bg-gray-100">
                        Giriş
                    </button>
                </div>
            </div>
        </nav>
    </header>

    <!-- Content -->
    <main>
        <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-16">
        <div class="max-w-7xl mx-auto px-4 py-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-lg font-bold mb-2">BEN İZLEDİM</h3>
                    <p class="text-gray-400 text-sm">
                        Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazılarının yer aldığı
                        bir medya ve eğlence platformudur.
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-bold mb-2">ÖNCE SİZ OKUYUN</h3>
                    <p class="text-gray-400 text-sm mb-3">
                        Yeni blog yazılarımızdan ve haberlerden ilk siz haberdar olun!
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>
