<script setup>
import { ref, watch } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    posts: {
        type: Object,
        required: true,
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
});

const { timeAgo } = useDate();

const search = ref(props.filters.search || '');
const status = ref(props.filters.status || '');

// Debounced search
let searchTimeout;
watch([search, status], () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        router.get('/admin/posts', {
            search: search.value,
            status: status.value,
        }, {
            preserveState: true,
            replace: true,
        });
    }, 300);
});

const getStatusBadge = (status) => {
    return status === 'published'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700';
};

const getStatusLabel = (status) => {
    return status === 'published' ? 'Yayında' : 'Taslak';
};

const deletePost = (post) => {
    if (!confirm(`"${post.title}" yazısını silmek istediğinize emin misiniz?`)) return;
    router.delete(`/admin/posts/${post.id}`);
};
</script>

<template>
    <AdminLayout title="Yazılar">
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 class="text-2xl font-bold text-gray-900">Yazılar</h1>
                <Link
                    href="/admin/posts/create"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Yazı
                </Link>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4">
                <input
                    v-model="search"
                    type="text"
                    placeholder="Yazı ara..."
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
                <select
                    v-model="status"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                >
                    <option value="">Tümü</option>
                    <option value="published">Yayında</option>
                    <option value="draft">Taslak</option>
                </select>
            </div>

            <!-- Table -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yazar</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görüntülenme</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="post in posts.data" :key="post.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4">
                                    <Link
                                        :href="`/admin/posts/${post.id}/edit`"
                                        class="font-medium text-gray-900 hover:text-red-600"
                                    >
                                        {{ post.title }}
                                    </Link>
                                </td>
                                <td class="px-6 py-4 text-gray-600">{{ post.user?.name }}</td>
                                <td class="px-6 py-4">
                                    <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusBadge(post.status)]">
                                        {{ getStatusLabel(post.status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-gray-600 text-sm">{{ timeAgo(post.created_at) }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ post.view_count?.toLocaleString() }}</td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <Link
                                            :href="`/admin/posts/${post.id}/edit`"
                                            class="text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            Düzenle
                                        </Link>
                                        <button
                                            @click="deletePost(post)"
                                            class="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="posts.data.length === 0">
                                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                    Yazı bulunamadı.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="posts.links" class="px-6 py-4 border-t border-gray-200 flex justify-center">
                    <div class="flex items-center gap-2">
                        <Link
                            v-for="(link, index) in posts.links"
                            :key="index"
                            :href="link.url || '#'
                            "
                            :class="[
                                'px-3 py-1 rounded text-sm',
                                link.active
                                    ? 'bg-red-600 text-white'
                                    : link.url
                                        ? 'text-gray-600 hover:bg-gray-100'
                                        : 'text-gray-400 cursor-not-allowed'
                            ]"
                            v-html="link.label"
                        />
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>
