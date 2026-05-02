<script setup>
import { ref, reactive } from 'vue';
import { Link, router } from '@inertiajs/vue3';
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

const setPassword = (user) => {
    passwordUser.value = user;
    passwordForm.email = user.email;
    passwordForm.password = '';
    passwordForm.password_confirmation = '';
    showPasswordModal.value = true;
};

const showPasswordModal = ref(false);
const passwordUser = ref(null);
const passwordForm = reactive({
    email: '',
    password: '',
    password_confirmation: '',
});

const submitPassword = () => {
    if (!passwordUser.value) return;
    if (passwordForm.password !== passwordForm.password_confirmation) {
        alert('Şifre tekrarı eşleşmiyor.');
        return;
    }
    router.put(`/admin/users/${passwordUser.value.id}/password`, {
        password: passwordForm.password,
        password_confirmation: passwordForm.password_confirmation,
    }, {
        preserveScroll: true,
        onSuccess: () => {
            showPasswordModal.value = false;
            passwordUser.value = null;
            passwordForm.password = '';
            passwordForm.password_confirmation = '';
        },
    });
};

const getRoleBadge = (role) => {
    const colors = {
        admin: 'bg-red-100 text-red-700',
        editor: 'bg-purple-100 text-purple-700',
        author: 'bg-blue-100 text-blue-700',
        reader: 'bg-gray-100 text-gray-700',
    };
    return colors[role] || 'bg-gray-100 text-gray-700';
};

const getRoleLabel = (role) => {
    const labels = {
        admin: 'Admin',
        editor: 'Editör',
        author: 'Yazar',
        reader: 'Okuyucu',
    };
    return labels[role] || role;
};

const getProviderLabel = (user) => {
    if (user.has_google_connection) {
        return 'Google bağlı';
    }

    if (user.is_wix_placeholder) {
        return 'Wix placeholder';
    }

    return user.provider || 'E-posta';
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
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bağlantı</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yazılar</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yorumlar</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
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
                                            {{ user.name?.charAt(0)?.toUpperCase() || '?' }}
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
                                        <option value="editor">Editör</option>
                                        <option value="author">Yazar</option>
                                        <option value="reader">Okuyucu</option>
                                    </select>
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">{{ getProviderLabel(user) }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ user.posts_count }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ user.comments_count }}</td>
                                <td class="px-6 py-4 text-gray-600 text-sm">{{ formatDate(user.created_at) }}</td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3 text-sm">
                                        <Link
                                            :href="`/admin/posts?owner=${user.id}`"
                                            class="text-gray-700 hover:text-red-600"
                                        >
                                            Yazıları Gör
                                        </Link>
                                        <button
                                            @click="setPassword(user)"
                                            class="text-blue-600 hover:text-blue-700"
                                        >
                                            Şifre Ata
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="users.data.length === 0">
                                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
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

        <!-- Password Modal -->
        <Teleport to="body">
            <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showPasswordModal = false">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">Şifre Ata: {{ passwordForm.email }}</h3>
                    <form @submit.prevent="submitPassword" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Yeni Şifre</label>
                            <input
                                v-model="passwordForm.password"
                                type="password"
                                required
                                minlength="10"
                                placeholder="En az 10 karakter"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Şifre Tekrarı</label>
                            <input
                                v-model="passwordForm.password_confirmation"
                                type="password"
                                required
                                minlength="10"
                                placeholder="Şifreyi tekrar girin"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div class="flex gap-2 justify-end">
                            <button
                                type="button"
                                @click="showPasswordModal = false"
                                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Teleport>
    </AdminLayout>
</template>
