<script setup>
import { ref, watch } from 'vue';
import { Link, router, usePage } from '@inertiajs/vue3';
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
    permissions: {
        type: Object,
        default: () => ({
            canApproveDeletion: false,
            canManageAllPosts: false,
        }),
    },
    owners: {
        type: Array,
        default: () => [],
    },
});

const { timeAgo } = useDate();
const page = usePage();

const search = ref(props.filters.search || '');
const status = ref(props.filters.status || '');
const owner = ref(props.filters.owner || '');

// Debounced search
let searchTimeout;
watch([search, status, owner], () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        router.get('/admin/posts', {
            search: search.value,
            status: status.value,
            owner: owner.value,
        }, {
            preserveState: true,
            replace: true,
        });
    }, 300);
});

const getStatusLabel = (status) => {
    if (status === 'pending_deletion') {
        return 'Silme Onayı';
    }

    if (status === 'pending_review') {
        return 'İncelemede';
    }

    return status === 'published' ? 'Yayında' : 'Taslak';
};

const getStatusBadge = (status) => {
    if (status === 'pending_deletion') {
        return 'bg-red-100 text-red-700';
    }

    if (status === 'pending_review') {
        return 'bg-amber-100 text-amber-700';
    }

    return status === 'published'
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700';
};

const deletePost = (post) => {
    const role = page.props.auth?.user?.role;
    const isAdmin = role === 'admin';

    const confirmText = isAdmin
        ? `"${post.title}" yazısını kalıcı olarak silmek istediğinize emin misiniz?`
        : `"${post.title}" yazısını yayından kaldırıp admin onayına göndermek istiyor musunuz?`;

    if (!confirm(confirmText)) return;

    router.delete(`/admin/posts/${post.id}`);
};

const approveDeletion = (post) => {
    if (!confirm(`"${post.title}" için silme talebini onaylayıp kalıcı silmek istiyor musunuz?`)) return;

    router.post(`/admin/posts/${post.id}/approve-deletion`);
};

const rejectDeletion = (post) => {
    if (!confirm(`"${post.title}" için silme talebini reddedip tekrar yayına almak istiyor musunuz?`)) return;

    router.post(`/admin/posts/${post.id}/reject-deletion`);
};

const approveReview = (post) => {
    if (!confirm(`"${post.title}" yazısını yayına almak istiyor musunuz?`)) return;

    router.post(`/admin/posts/${post.id}/approve-review`);
};

const rejectReview = (post) => {
    if (!confirm(`"${post.title}" yazısını taslağa geri almak istiyor musunuz?`)) return;

    router.post(`/admin/posts/${post.id}/reject-review`);
};

const updateOwner = (post, userId) => {
    router.put(`/admin/posts/${post.id}/owner`, {
        user_id: Number(userId),
    }, {
        preserveScroll: true,
    });
};

const resolveStatus = (post) => post.resolved_status || (post.is_deletion_pending ? 'pending_deletion' : post.status);
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
                    <option value="pending_review">İncelemede</option>
                    <option value="draft">Taslak</option>
                    <option value="pending_deletion">Silme Onayı</option>
                </select>
                <select
                    v-if="permissions.canManageAllPosts"
                    v-model="owner"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                >
                    <option value="">Tüm Yazarlar</option>
                    <option v-for="item in owners" :key="item.id" :value="item.id">{{ item.name }}</option>
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
                                    <div class="space-y-1">
                                        <Link
                                            :href="`/admin/posts/${post.id}/edit`"
                                            class="font-medium text-gray-900 hover:text-red-600"
                                        >
                                            {{ post.title }}
                                        </Link>
                                        <p v-if="post.reviewed_by?.name" class="text-xs text-gray-500">
                                            Son inceleyen: {{ post.reviewed_by.name }}
                                        </p>
                                        <p v-if="resolveStatus(post) === 'pending_review' && post.pending_review_by?.name" class="text-xs text-gray-500">
                                            İncelemeye gönderen: {{ post.pending_review_by.name }}
                                        </p>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <template v-if="permissions.canReassignPosts">
                                        <select
                                            :value="post.user?.id"
                                            @change="updateOwner(post, $event.target.value)"
                                            class="min-w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                        >
                                            <option v-for="item in owners" :key="item.id" :value="item.id">
                                                {{ item.name }}
                                            </option>
                                        </select>
                                        <p class="text-xs text-gray-500 mt-1 truncate">{{ post.user?.email }}</p>
                                    </template>
                                    <template v-else>
                                        <p class="text-gray-700">{{ post.user?.name }}</p>
                                        <p class="text-xs text-gray-500 truncate">{{ post.user?.email }}</p>
                                    </template>
                                </td>
                                <td class="px-6 py-4">
                                    <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusBadge(resolveStatus(post))]">
                                        {{ getStatusLabel(resolveStatus(post)) }}
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
                                        <template v-if="resolveStatus(post) === 'pending_review' && permissions.canReviewPosts">
                                            <button
                                                @click="approveReview(post)"
                                                class="text-emerald-600 hover:text-emerald-700 text-sm"
                                            >
                                                Yayına Al
                                            </button>
                                            <button
                                                @click="rejectReview(post)"
                                                class="text-amber-600 hover:text-amber-700 text-sm"
                                            >
                                                Taslağa Al
                                            </button>
                                        </template>
                                        <template v-if="post.is_deletion_pending && permissions.canApproveDeletion">
                                            <button
                                                @click="approveDeletion(post)"
                                                class="text-red-700 hover:text-red-800 text-sm"
                                            >
                                                Kalıcı Sil
                                            </button>
                                            <button
                                                @click="rejectDeletion(post)"
                                                class="text-emerald-600 hover:text-emerald-700 text-sm"
                                            >
                                                Yayına Al
                                            </button>
                                        </template>
                                        <button
                                            v-else
                                            @click="deletePost(post)"
                                            class="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            {{ page.props.auth?.user?.role === 'admin' ? 'Sil' : 'Silme Talebi' }}
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
                            :href="link.url || '#'"
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
