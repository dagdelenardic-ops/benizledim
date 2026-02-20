<script setup>
import { router } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import { useDate } from '@/Composables/useDate';

const props = defineProps({
    users: {
        type: Object,
        required: true,
    },
});

const { formatDate } = useDate();

const updateRole = (user, newRole) => {
    router.put(`/admin/users/${user.id}/role`, { role: newRole }, {
        preserveScroll: true,
    });
};

const getRoleBadge = (role) => {
    const colors = {
        admin: 'bg-red-100 text-red-700',
        author: 'bg-blue-100 text-blue-700',
        reader: 'bg-gray-100 text-gray-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
};

const getRoleLabel = (role) => {
    const labels = {
        admin: 'Admin',
        author: 'Yazar',
        reader: 'Okuyucu',
    };
    return labels[role] || role;
};
</script>

<template>
    <AdminLayout title="Kullanıcılar">
        <div class="space-y-6">
            <!-- Header -->
            <h1 class="text-2xl font-bold text-gray-900">Kullanıcılar</h1>

            <!-- Table -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kullanıcı</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-posta</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yazılar</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yorumlar</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="user in users.data" :key="user.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <img
                                            v-if="user.avatar"
                                            :src="user.avatar"
                                            :alt="user.name"
                                            class="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div
                                            v-else
                                            class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold"
                                        >
                                            {{ user.name.charAt(0).toUpperCase() }}
                                        </div>
                                        <Link :href="`/profile/${user.id}`" class="font-medium text-gray-900 hover:text-red-600">
                                            {{ user.name }}
                                        </Link>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-gray-600 text-sm">{{ user.email }}</td>
                                <td class="px-6 py-4">
                                    <select
                                        :value="user.role"
                                        @change="updateRole(user, $event.target.value)"
                                        class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
                                        :class="getRoleBadge(user.role)"
                                        :disabled="user.id === $page.props.auth.user?.id"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="author">Yazar</option>
                                        <option value="reader">Okuyucu</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4 text-gray-600">{{ user.posts_count }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ user.comments_count }}</td>
                                <td class="px-6 py-4 text-gray-600 text-sm">{{ formatDate(user.created_at) }}</td>
                            </tr>
                            <tr v-if="users.data.length === 0">
                                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                                    Kullanıcı bulunamadı.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="users.links" class="px-6 py-4 border-t border-gray-200 flex justify-center">
                    <div class="flex items-center gap-2">
                        <Link
                            v-for="(link, index) in users.links"
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
