<script setup>
import { ref } from 'vue';
import { Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import RichTextEditor from '../../../Components/Admin/RichTextEditor.vue';

const props = defineProps({
    pages: {
        type: Object,
        required: true,
    },
});

const newForm = useForm({
    title: '',
    slug: '',
    content: '',
});

const submitNew = () => {
    newForm.post('/admin/pages', {
        onSuccess: () => newForm.reset(),
    });
};

const editingId = ref(null);
const editForm = useForm({
    title: '',
    slug: '',
    content: '',
});

const startEdit = (page) => {
    editingId.value = page.id;
    editForm.title = page.title || '';
    editForm.slug = page.slug || '';
    editForm.content = page.content || '';
};

const submitEdit = (page) => {
    editForm.put(`/admin/pages/${page.id}`, {
        onSuccess: () => {
            editingId.value = null;
        },
    });
};

const cancelEdit = () => {
    editingId.value = null;
    editForm.reset();
};

const deletePage = (page) => {
    if (!confirm(`"${page.title}" sayfasını silmek istediğinize emin misiniz?`)) return;

    newForm.delete(`/admin/pages/${page.id}`);
};
</script>

<template>
    <AdminLayout title="Sayfa Yönetimi">
        <div class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900">Sayfa Yönetimi</h1>

            <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h2 class="text-lg font-medium text-gray-900">Yeni Sayfa</h2>
                <form @submit.prevent="submitNew" class="space-y-4">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-gray-700 mb-1">Başlık</label>
                            <input v-model="newForm.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            <p v-if="newForm.errors.title" class="mt-1 text-sm text-red-600">{{ newForm.errors.title }}</p>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-700 mb-1">Slug (opsiyonel)</label>
                            <input v-model="newForm.slug" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            <p v-if="newForm.errors.slug" class="mt-1 text-sm text-red-600">{{ newForm.errors.slug }}</p>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">İçerik</label>
                        <RichTextEditor v-model="newForm.content" />
                        <p v-if="newForm.errors.content" class="mt-1 text-sm text-red-600">{{ newForm.errors.content }}</p>
                    </div>

                    <div>
                        <button type="submit" :disabled="newForm.processing" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>

            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Güncelleme</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="page in pages.data" :key="page.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 font-medium text-gray-900">{{ page.title }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ page.slug }}</td>
                            <td class="px-6 py-4 text-gray-600 text-sm">{{ page.updated_at?.slice(0, 10) }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <button @click="startEdit(page)" class="text-blue-600 hover:text-blue-700 text-sm">Düzenle</button>
                                    <a :href="`/sayfa/${page.slug}`" target="_blank" class="text-gray-600 hover:text-gray-700 text-sm">Görüntüle</a>
                                    <button @click="deletePage(page)" class="text-red-600 hover:text-red-700 text-sm">Sil</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="pages.data.length === 0">
                            <td colspan="4" class="px-6 py-8 text-center text-gray-500">Sayfa bulunamadı.</td>
                        </tr>
                    </tbody>
                </table>

                <div v-if="pages.links" class="px-6 py-4 border-t border-gray-200 flex justify-center">
                    <div class="flex items-center gap-2">
                        <Link
                            v-for="(link, index) in pages.links"
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

            <div v-if="editingId" class="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h2 class="text-lg font-medium text-gray-900">Sayfa Düzenle</h2>

                <form @submit.prevent="submitEdit(pages.data.find((item) => item.id === editingId))" class="space-y-4">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm text-gray-700 mb-1">Başlık</label>
                            <input v-model="editForm.title" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label class="block text-sm text-gray-700 mb-1">Slug</label>
                            <input v-model="editForm.slug" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">İçerik</label>
                        <RichTextEditor v-model="editForm.content" />
                    </div>

                    <div class="flex gap-2">
                        <button type="submit" :disabled="editForm.processing" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                            Güncelle
                        </button>
                        <button type="button" @click="cancelEdit" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                            İptal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </AdminLayout>
</template>
