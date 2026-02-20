<script setup>
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';

const props = defineProps({
    categories: {
        type: Array,
        required: true,
    },
});

// New category form
const newForm = useForm({
    name: '',
});

const submitNew = () => {
    newForm.post('/admin/categories', {
        onSuccess: () => newForm.reset(),
    });
};

// Edit mode
const editingId = ref(null);
const editForm = useForm({
    name: '',
});

const startEdit = (category) => {
    editingId.value = category.id;
    editForm.name = category.name;
};

const cancelEdit = () => {
    editingId.value = null;
    editForm.reset();
};

const submitEdit = (category) => {
    editForm.put(`/admin/categories/${category.id}`, {
        onSuccess: () => {
            editingId.value = null;
        },
    });
};

const deleteCategory = (category) => {
    if (!confirm(`"${category.name}" kategorisini silmek istediğinize emin misiniz?`)) return;
    
    if (category.posts_count > 0) {
        alert('Bu kategoride yazılar var, önce yazıları başka kategoriye taşıyın.');
        return;
    }
    
    newForm.delete(`/admin/categories/${category.id}`);
};
</script>

<template>
    <AdminLayout title="Kategoriler">
        <div class="space-y-6">
            <!-- Header -->
            <h1 class="text-2xl font-bold text-gray-900">Kategoriler</h1>

            <!-- New Category Form -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Yeni Kategori</h2>
                <form @submit.prevent="submitNew" class="flex gap-4">
                    <input
                        v-model="newForm.name"
                        type="text"
                        placeholder="Kategori adı..."
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                        :class="{ 'border-red-500': newForm.errors.name }"
                    />
                    <button
                        type="submit"
                        :disabled="newForm.processing"
                        class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        Ekle
                    </button>
                </form>
                <p v-if="newForm.errors.name" class="mt-2 text-sm text-red-600">{{ newForm.errors.name }}</p>
            </div>

            <!-- Categories List -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yazı Sayısı</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4">
                                <div v-if="editingId === category.id" class="flex gap-2">
                                    <input
                                        v-model="editForm.name"
                                        type="text"
                                        class="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                                        :class="{ 'border-red-500': editForm.errors.name }"
                                    />
                                </div>
                                <span v-else class="font-medium text-gray-900">{{ category.name }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    {{ category.posts_count }} yazı
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div v-if="editingId === category.id" class="flex items-center gap-2">
                                    <button
                                        @click="submitEdit(category)"
                                        :disabled="editForm.processing"
                                        class="text-green-600 hover:text-green-700 text-sm"
                                    >
                                        Kaydet
                                    </button>
                                    <button
                                        @click="cancelEdit"
                                        class="text-gray-600 hover:text-gray-700 text-sm"
                                    >
                                        İptal
                                    </button>
                                </div>
                                <div v-else class="flex items-center gap-2">
                                    <button
                                        @click="startEdit(category)"
                                        class="text-blue-600 hover:text-blue-700 text-sm"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        v-if="category.posts_count === 0"
                                        @click="deleteCategory(category)"
                                        class="text-red-600 hover:text-red-700 text-sm"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="categories.length === 0">
                            <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                                Henüz kategori yok.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AdminLayout>
</template>
