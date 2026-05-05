<script setup>
import { ref, computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import AuthorStatCard from '../../Components/Author/AuthorStatCard.vue';
import PushOptInCard from '../../Components/Author/PushOptInCard.vue';
import LetterboxdConnectCard from '../../Components/Author/LetterboxdConnectCard.vue';
import QuickLogModal from '../../Components/Author/QuickLogModal.vue';
import WatchLogCard from '../../Components/Post/WatchLogCard.vue';
import PostCard from '../../Components/Post/PostCard.vue';

const props = defineProps({
    stats: { type: Object, default: () => ({}) },
    recentLogs: { type: Array, default: () => [] },
    recentPosts: { type: Array, default: () => [] },
    pendingDrafts: { type: Number, default: 0 },
    letterboxd: { type: Object, default: () => ({}) },
});

const quickLogModal = ref(null);

const openLog = () => quickLogModal.value?.show();
</script>

<template>
    <AppLayout title="Yazar Paneli">
        <div class="max-w-5xl mx-auto px-4 py-8 space-y-8">
            <!-- Welcome -->
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-3xl font-black text-[var(--bi-ink)]">Hoş geldin, {{ $page.props.auth.user?.name }}</h1>
                    <p class="text-sm text-[var(--bi-muted)] mt-1">Film günlüğüne not ekle veya yazı yaz.</p>
                </div>
                <button @click="openLog" class="flex items-center gap-2 bg-red-700 text-white px-5 py-3 font-bold hover:bg-red-800 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    Hızlı Not
                </button>
            </div>

            <!-- Pending drafts banner -->
            <div v-if="pendingDrafts > 0" class="border-2 border-amber-500 bg-amber-50 p-4 text-sm font-bold text-amber-900">
                {{ pendingDrafts }} Letterboxd taslağın gözden geçirilmeyi bekliyor.
            </div>

            <!-- Stats -->
            <AuthorStatCard :stats="stats" />

            <!-- Push opt-in -->
            <PushOptInCard />

            <!-- Letterboxd connect -->
            <LetterboxdConnectCard :letterboxd="letterboxd" />

            <!-- Recent Logs -->
            <section v-if="recentLogs.length">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-[var(--bi-ink)]">Son Notların</h2>
                    <Link :href="`/profile/${$page.props.auth.user?.id}?format=watch_log`" class="text-sm text-red-700 hover:text-red-800 font-bold">Tümünü Gör →</Link>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <WatchLogCard v-for="log in recentLogs" :key="log.id" :post="log" />
                </div>
            </section>

            <!-- Recent Posts -->
            <section v-if="recentPosts.length">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-[var(--bi-ink)]">Son Yazıların</h2>
                    <Link :href="`/profile/${$page.props.auth.user?.id}`" class="text-sm text-red-700 hover:text-red-800 font-bold">Tümünü Gör →</Link>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <PostCard v-for="post in recentPosts" :key="post.id" :post="post" />
                </div>
            </section>

            <!-- Empty -->
            <div v-if="!recentLogs.length && !recentPosts.length" class="text-center py-12 border-2 border-dashed border-[var(--bi-ink)] bg-[var(--bi-paper)]">
                <p class="text-lg font-bold text-[var(--bi-muted)]">Henüz not veya yazı yok</p>
                <p class="text-sm text-gray-400 mt-1">+ butonuna tıklayarak ilk notunu ekle!</p>
            </div>
        </div>

        <QuickLogModal ref="quickLogModal" @close="() => {}" @submitted="() => window.location.reload()" />
    </AppLayout>
</template>
