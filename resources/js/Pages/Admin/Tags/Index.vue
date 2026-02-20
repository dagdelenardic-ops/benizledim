<script setup>
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';

const props = defineProps({
    tags: {
        type: Array,
        required: true,
    },
});

const newForm = useForm({
    name: '',
});

const submitNew = () => {
    newForm.post('/admin/tags', {
        onSuccess: () => newForm.reset(),
    });
};

const editingId = ref(null);
const editForm = useForm({
    name: '',
});

const startEdit = (tag) => {
    editingId.value = tag.id;
    editForm.name = tag.name;
};

const cancelEdit = () => {
    editingId.value = null;
    editForm.reset();
};

const submitEdit = (tag) => {
    editForm.put(`/admin/tags/${tag.id}`, {
        onSuccess: () => {
            editingId.value = null;
        },
    });
};

const deleteTag = (tag) => {
    if (!confirm(`"${tag.name}" etiketini silmek istediğinize emin misiniz?`)) return;

    newForm.delete(`/admin/tags/${tag.id}`);
};
</script>

<template>
    <AdminLayout title="Etiketler">
        <div class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900">Etiketler</h1>

            <!-- New Tag Form -->
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-lg font-medium text-gray-900 mb-4">Yeni Etiket</h2>
                <form @submit.prevent="submitNew" class="flex gap-4">
                    <input
                        v-model="newForm.name"
                        type="text"
                        placeholder="Etiket adı..."
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                        :class="{ 'border-red-500': newForm.errors.name }"
                    />
                    <button
                        type="submit"
                        :disabled="newForm.processing"
                        class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <span v-if="newForm.processing">Kaydediliyor...</span>
                        <span v-else>Kaydet</span>
                    </button>
                </form>
                <p v-if="newForm.errors.name" class="mt-2 text-sm text-red-600">{{ newForm.errors.name }}</p>
            </div>

            <!-- Tags List -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[500px]">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Etiket</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yazı Sayısı</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="tag in tags" :key="tag.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4">
                                    <div v-if="editingId === tag.id" class="flex gap-2">
                                        <input
                                            v-model="editForm.name"
                                            type="text"
                                            class="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                                            :class="{ 'border-red-500': editForm.errors.name }"
                                        />
                                    </div>
                                    <span v-else class="font-medium text-gray-900">{{ tag.name }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                        {{ tag.posts_count }} yazı
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div v-if="editingId === tag.id" class="flex items-center gap-2">
                                        <button
                                            @click="submitEdit(tag)"
                                            :disabled="editForm.processing"
                                            class="text-green-600 hover:text-green-700 text-sm"
                                        >
                                            <span v-if="editForm.processing">Kaydediliyor...</span>
                                            <span v-else>Kaydet</span>
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
                                            @click="startEdit(tag)"
                                            class="text-blue-600 hover:text-blue-700 text-sm"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            @click="deleteTag(tag)"
                                            class="text-red-600 hover:text-red-700 text-sm"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!tags || tags.length === 0">
                                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                                    Henüz etiket bulunmuyor.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>
