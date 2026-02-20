<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import AdminLayout from '../../Components/Admin/AdminLayout.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    stats: {
        type: Object,
        required: true,
    },
    recentPosts: {
        type: Array,
        required: true,
    },
    recentComments: {
        type: Array,
        required: true,
    },
});

const { timeAgo } = useDate();

const statCards = computed(() => {
    const cards = [
        { key: 'total_posts', label: 'Toplam Yazı', icon: '📝', color: 'bg-blue-500' },
        { key: 'published_posts', label: 'Yayında', icon: '✅', color: 'bg-green-500' },
        { key: 'draft_posts', label: 'Taslak', icon: '📄', color: 'bg-yellow-500' },
        { key: 'pending_deletion_posts', label: 'Silme Onayı', icon: '🧹', color: 'bg-orange-500' },
        { key: 'total_views', label: 'Toplam Görüntülenme', icon: '👁️', color: 'bg-purple-500' },
        { key: 'total_users', label: 'Toplam Kullanıcı', icon: '👥', color: 'bg-indigo-500' },
        { key: 'total_comments', label: 'Toplam Yorum', icon: '💬', color: 'bg-pink-500' },
        { key: 'newsletter_subscribers', label: 'Newsletter Abonesi', icon: '📧', color: 'bg-red-500' },
    ];

    return cards.filter((card) => stats[card.key] !== null && stats[card.key] !== undefined);
});

const getStatusBadge = (status) => {
    if (status === 'pending_deletion') {
        return 'bg-red-100 text-red-700';
    }

    return status === 'published'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700';
};

const getStatusLabel = (status) => {
    if (status === 'pending_deletion') {
        return 'Silme Onayı';
    }

    return status === 'published' ? 'Yayında' : 'Taslak';
};

const resolveStatus = (post) => (post.deletion_requested_at ? 'pending_deletion' : post.status);
</script>

<template>
    <AdminLayout title="Dashboard">
        <div class="space-y-8">
            <!-- Stats Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                    v-for="card in statCards"
                    :key="card.key"
                    class="bg-white rounded-xl shadow-sm p-6"
                >
                    <div class="flex items-center gap-4">
                        <div :class="[card.color, 'w-12 h-12 rounded-lg flex items-center justify-center text-2xl']">
                            {{ card.icon }}
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">{{ card.label }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats[card.key]?.toLocaleString() }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Content -->
            <div class="grid lg:grid-cols-2 gap-8">
                <!-- Recent Posts -->
                <div class="bg-white rounded-xl shadow-sm">
                    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 class="text-lg font-bold text-gray-900">Son Yazılar</h2>
                        <Link href="/admin/posts" class="text-red-600 hover:text-red-700 text-sm">
                            Tümünü Gör →
                        </Link>
                    </div>
                    <div class="divide-y divide-gray-200">
                        <div
                            v-for="post in recentPosts"
                            :key="post.id"
                            class="px-6 py-4 hover:bg-gray-50"
                        >
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex-1 min-w-0">
                                    <Link
                                        :href="`/admin/posts/${post.id}/edit`"
                                        class="font-medium text-gray-900 hover:text-red-600 truncate block"
                                    >
                                        {{ post.title }}
                                    </Link>
                                    <p class="text-sm text-gray-500 mt-1">
                                        {{ post.user?.name }} • {{ timeAgo(post.created_at) }}
                                    </p>
                                </div>
                                <span
                                    :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusBadge(resolveStatus(post))]"
                                >
                                    {{ getStatusLabel(resolveStatus(post)) }}
                                </span>
                            </div>
                        </div>
                        <div v-if="recentPosts.length === 0" class="px-6 py-8 text-center text-gray-500">
                            Henüz yazı yok.
                        </div>
                    </div>
                </div>

                <!-- Recent Comments -->
                <div class="bg-white rounded-xl shadow-sm">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h2 class="text-lg font-bold text-gray-900">Son Yorumlar</h2>
                    </div>
                    <div class="divide-y divide-gray-200">
                        <div
                            v-for="comment in recentComments"
                            :key="comment.id"
                            class="px-6 py-4 hover:bg-gray-50"
                        >
                            <div class="flex items-start gap-3">
                                <img
                                    v-if="comment.user?.avatar"
                                    :src="comment.user.avatar"
                                    :alt="comment.user.name"
                                    class="w-8 h-8 rounded-full object-cover"
                                />
                                <div
                                    v-else
                                    class="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm"
                                >
                                    {{ comment.user?.name?.charAt(0)?.toUpperCase() }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900">{{ comment.user?.name }}</p>
                                    <p class="text-sm text-gray-600 line-clamp-2">{{ comment.content }}</p>
                                    <Link
                                        :href="`/yazi/${comment.post?.slug}`"
                                        class="text-xs text-red-600 hover:text-red-700 mt-1 block"
                                    >
                                        {{ comment.post?.title }}
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div v-if="recentComments.length === 0" class="px-6 py-8 text-center text-gray-500">
                            Henüz yorum yok.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>
