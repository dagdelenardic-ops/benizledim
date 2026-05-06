<script setup>
import { ref, computed } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import PostGrid from '../../Components/Post/PostGrid.vue';
import AuthorStatCard from '../../Components/Author/AuthorStatCard.vue';
import WatchLogCard from '../../Components/Post/WatchLogCard.vue';
import FollowButton from '../../Components/Social/FollowButton.vue';

const props = defineProps({
    author: { type: Object, required: true },
    posts: { type: Object, required: true },
    stats: { type: Object, default: () => ({}) },
    activeTab: { type: String, default: 'standard' },
});

const page = usePage();
const authUser = computed(() => page.props.auth?.user);

const tabs = [
    { key: 'standard', label: 'Yazılar' },
    { key: 'watch_log', label: 'Watch-Log' },
    { key: 'lists', label: 'Listeler', disabled: true },
];

const switchTab = (tab) => {
    if (tab.disabled) return;
    router.get(`/profile/${props.author.id}`, { format: tab.key }, { preserveState: true, preserveScroll: true, replace: true });
};

const getRoleLabel = (role) => {
    const labels = { admin: 'Admin', editor: 'Editör', author: 'Yazar', reader: 'Okuyucu' };
    return labels[role] || role;
};

const getRoleColor = (role) => {
    const colors = { admin: 'bg-red-100 text-red-700', editor: 'bg-purple-100 text-purple-700', author: 'bg-blue-100 text-blue-700', reader: 'bg-gray-100 text-gray-700' };
    return colors[role] || 'bg-gray-100 text-gray-700';
};
</script>

<template>
    <AppLayout :title="author.name">
        <div class="min-h-screen bg-gray-50">
            <!-- Hero -->
            <div class="bg-gradient-to-br from-gray-100 to-gray-200 border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 py-12 md:py-16">
                    <div class="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div class="flex-shrink-0">
                            <img v-if="author.avatar" :src="author.avatar" :alt="author.name" class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg" />
                            <div v-else class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                                {{ author.name?.charAt(0)?.toUpperCase() || '?' }}
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="flex flex-col md:flex-row items-center gap-3 mb-2">
                                <h1 class="text-3xl md:text-4xl font-bold text-gray-900">{{ author.name }}</h1>
                                <span :class="['px-3 py-1 rounded-full text-sm font-medium', getRoleColor(author.role)]">{{ getRoleLabel(author.role) }}</span>
                            </div>
                            <p v-if="author.bio" class="text-gray-600 max-w-2xl">{{ author.bio }}</p>
                            <p v-else class="text-gray-500 italic">Henüz biyografi eklenmemiş.</p>
                            <div class="mt-4">
                                <FollowButton
                                    v-if="authUser && authUser.id !== author.id"
                                    :user="author"
                                    :initial-following="author.is_following"
                                    :initial-followers-count="stats.followers_count || 0"
                                />
                                <p v-else class="text-sm font-semibold text-gray-500">{{ stats.followers_count || 0 }} takipçi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats -->
            <div class="max-w-7xl mx-auto px-4 -mt-6">
                <AuthorStatCard :stats="stats" />
            </div>

            <!-- Tabs -->
            <div class="max-w-7xl mx-auto px-4 mt-8">
                <div class="flex border-b border-gray-200">
                    <button v-for="tab in tabs" :key="tab.key" @click="switchTab(tab)"
                        :class="['px-6 py-3 text-sm font-bold border-b-2 transition-colors', activeTab === tab.key ? 'border-red-600 text-red-600' : tab.disabled ? 'border-transparent text-gray-300 cursor-not-allowed' : 'border-transparent text-gray-500 hover:text-gray-700']">
                        {{ tab.label }}
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="max-w-7xl mx-auto px-4 py-8">
                <template v-if="activeTab === 'standard'">
                    <PostGrid v-if="posts.data?.length" :posts="posts.data" />
                    <div v-else class="text-center py-16">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Henüz yazı yok</h3>
                        <p class="text-gray-500">Bu yazar henüz yazı paylaşmamış.</p>
                    </div>
                </template>

                <template v-if="activeTab === 'watch_log'">
                    <div v-if="posts.data?.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <WatchLogCard v-for="log in posts.data" :key="log.id" :post="log" />
                    </div>
                    <div v-else class="text-center py-16">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Henüz watch-log yok</h3>
                        <p class="text-gray-500">Bu yazar henüz izleme notu paylaşmamış.</p>
                    </div>
                </template>
            </div>

            <!-- Pagination -->
            <div v-if="posts.links && posts.data?.length > 0" class="max-w-7xl mx-auto px-4 pb-12 flex justify-center">
                <div class="flex items-center gap-2">
                    <Link v-for="(link, index) in posts.links" :key="index" :href="link.url || '#'"
                        :class="['px-4 py-2 text-sm font-medium transition-colors', link.active ? 'bg-red-600 text-white' : link.url ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed rounded-lg']"
                        v-html="link.label" />
                </div>
            </div>
        </div>
    </AppLayout>
</template>
