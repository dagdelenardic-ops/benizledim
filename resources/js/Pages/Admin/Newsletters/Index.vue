<script setup>
import { ref, watch } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    subscribers: {
        type: Object,
        required: true,
    },
    filters: {
        type: Object,
        default: () => ({}),
    },
});

const { formatDate } = useDate();

const search = ref(props.filters.search || '');

// Debounced search
let searchTimeout;
watch(search, () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        router.get('/admin/newsletters', {
            search: search.value,
        }, {
            preserveState: true,
            replace: true,
        });
    }, 300);
});

const toggleSubscriber = (subscriber) => {
    const action = subscriber.unsubscribed_at ? 'aktif etmek' : 'pasif etmek';
    if (!confirm(`${subscriber.email} aboneliğini ${action} istiyor musunuz?`)) return;

    router.post(`/admin/newsletters/${subscriber.id}/toggle`);
};

const deleteSubscriber = (subscriber) => {
    if (!confirm(`${subscriber.email} aboneliğini kalıcı olarak silmek istediğinize emin misiniz?`)) return;

    router.delete(`/admin/newsletters/${subscriber.id}`);
};
</script>

<template>
    <AdminLayout title="Newsletter Yönetimi">
        <div class="space-y-6">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 class="text-2xl font-bold text-gray-900">Newsletter Yönetimi</h1>

                <input
                    v-model="search"
                    type="text"
                    placeholder="E-posta ara..."
                    class="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                />
            </div>

            <!-- Stats Summary -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-white rounded-lg shadow-sm p-4">
                    <div class="text-sm text-gray-500">Toplam Abone</div>
                    <div class="text-2xl font-bold text-gray-900">{{ subscribers.total || subscribers.data?.length || 0 }}</div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-4">
                    <div class="text-sm text-gray-500">Aktif Abone</div>
                    <div class="text-2xl font-bold text-green-600">
                        {{ subscribers.data?.filter(s => !s.unsubscribed_at).length || 0 }}
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-4">
                    <div class="text-sm text-gray-500">Pasif Abone</div>
                    <div class="text-2xl font-bold text-gray-600">
                        {{ subscribers.data?.filter(s => s.unsubscribed_at).length || 0 }}
                    </div>
                </div>
            </div>

            <!-- Subscribers List -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[600px]">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-posta</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Abonelik Tarihi</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="subscriber in subscribers.data" :key="subscriber.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4 text-gray-900">{{ subscriber.email }}</td>
                                <td class="px-6 py-4">
                                    <span
                                        :class="[
                                            'px-2 py-1 rounded-full text-xs font-medium',
                                            subscriber.unsubscribed_at ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-700'
                                        ]"
                                    >
                                        {{ subscriber.unsubscribed_at ? 'Pasif' : 'Aktif' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-gray-600 text-sm">{{ formatDate(subscriber.subscribed_at) }}</td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <button
                                            @click="toggleSubscriber(subscriber)"
                                            class="text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            {{ subscriber.unsubscribed_at ? 'Aktif Et' : 'Pasif Et' }}
                                        </button>
                                        <button
                                            @click="deleteSubscriber(subscriber)"
                                            class="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!subscribers.data || subscribers.data.length === 0">
                                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                                    {{ search ? 'Arama sonucuna uygun abone bulunamadı.' : 'Henüz abone bulunmuyor.' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="subscribers.links && subscribers.links.length > 3" class="px-6 py-4 border-t border-gray-200 flex justify-center">
                    <div class="flex items-center gap-2">
                        <Link
                            v-for="(link, index) in subscribers.links"
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
