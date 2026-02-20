<script setup>
import { ref, watch } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    comments: {
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

let searchTimeout;
watch(search, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        router.get('/admin/comments', {
            search: search.value,
        }, {
            preserveState: true,
            replace: true,
        });
    }, 300);
});

const deleteComment = (comment) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;

    router.delete(`/admin/comments/${comment.id}`);
};
</script>

<template>
    <AdminLayout title="Yorum Yönetimi">
        <div class="space-y-6">
            <div class="flex items-center justify-between gap-4">
                <h1 class="text-2xl font-bold text-gray-900">Yorum Yönetimi</h1>

                <input
                    v-model="search"
                    type="text"
                    placeholder="Yorum/yazar/yazı ara..."
                    class="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yorum</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yazar</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yazı</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="comment in comments.data" :key="comment.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 text-gray-700 text-sm max-w-xl">{{ comment.content }}</td>
                            <td class="px-6 py-4 text-gray-700">{{ comment.user?.name || '-' }}</td>
                            <td class="px-6 py-4">
                                <Link
                                    :href="comment.post?.slug ? `/yazi/${comment.post.slug}` : '#'"
                                    class="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    {{ comment.post?.title || '-' }}
                                </Link>
                            </td>
                            <td class="px-6 py-4 text-gray-600 text-sm">{{ timeAgo(comment.created_at) }}</td>
                            <td class="px-6 py-4">
                                <button @click="deleteComment(comment)" class="text-red-600 hover:text-red-700 text-sm">Sil</button>
                            </td>
                        </tr>
                        <tr v-if="comments.data.length === 0">
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500">Yorum bulunamadı.</td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="comments.links" class="px-6 py-4 border-t border-gray-200 flex justify-center">
                    <div class="flex items-center gap-2">
                        <Link
                            v-for="(link, index) in comments.links"
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
