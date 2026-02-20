<script setup>
import { ref } from 'vue';
import { Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';

const props = defineProps({
    events: {
        type: Object,
        required: true,
    },
});

const newForm = useForm({
    title: '',
    description: '',
    cover_image: null,
    event_date: '',
    slider_order: 0,
});

const onNewCoverChange = (event) => {
    newForm.cover_image = event.target.files[0] || null;
};

const submitNew = () => {
    newForm.post('/admin/festival-events', {
        forceFormData: true,
        onSuccess: () => newForm.reset(),
    });
};

const editingId = ref(null);
const editForm = useForm({
    title: '',
    description: '',
    cover_image: null,
    event_date: '',
    slider_order: 0,
});

const startEdit = (event) => {
    editingId.value = event.id;
    editForm.title = event.title || '';
    editForm.description = event.description || '';
    editForm.event_date = event.event_date || '';
    editForm.slider_order = event.slider_order || 0;
    editForm.cover_image = null;
};

const onEditCoverChange = (event) => {
    editForm.cover_image = event.target.files[0] || null;
};

const submitEdit = (event) => {
    editForm.transform((data) => ({ ...data, _method: 'PUT' }));
    editForm.post(`/admin/festival-events/${event.id}`, {
        forceFormData: true,
        onSuccess: () => {
            editingId.value = null;
        },
    });
};

const cancelEdit = () => {
    editingId.value = null;
    editForm.reset();
};

const deleteEvent = (event) => {
    if (!confirm(`"${event.title}" etkinliğini silmek istediğinize emin misiniz?`)) return;

    newForm.delete(`/admin/festival-events/${event.id}`);
};
</script>

<template>
    <AdminLayout title="Festival Yönetimi">
        <div class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900">Festival Yönetimi</h1>

            <!-- New Event Form -->
            <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h2 class="text-lg font-medium text-gray-900">Yeni Etkinlik</h2>
                <form @submit.prevent="submitNew" class="grid md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm text-gray-700 mb-1">Başlık <span class="text-red-500">*</span></label>
                        <input
                            v-model="newForm.title"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': newForm.errors.title }"
                        />
                        <p v-if="newForm.errors.title" class="mt-1 text-sm text-red-600">{{ newForm.errors.title }}</p>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm text-gray-700 mb-1">Açıklama</label>
                        <textarea
                            v-model="newForm.description"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': newForm.errors.description }"
                        ></textarea>
                        <p v-if="newForm.errors.description" class="mt-1 text-sm text-red-600">{{ newForm.errors.description }}</p>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Etkinlik Tarihi</label>
                        <input
                            v-model="newForm.event_date"
                            type="date"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': newForm.errors.event_date }"
                        />
                        <p v-if="newForm.errors.event_date" class="mt-1 text-sm text-red-600">{{ newForm.errors.event_date }}</p>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Slider Sırası</label>
                        <input
                            v-model="newForm.slider_order"
                            type="number"
                            min="0"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': newForm.errors.slider_order }"
                        />
                        <p v-if="newForm.errors.slider_order" class="mt-1 text-sm text-red-600">{{ newForm.errors.slider_order }}</p>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm text-gray-700 mb-1">Kapak Görseli</label>
                        <input type="file" accept="image/*" @change="onNewCoverChange" class="w-full text-sm" />
                        <p v-if="newForm.errors.cover_image" class="mt-1 text-sm text-red-600">{{ newForm.errors.cover_image }}</p>
                    </div>

                    <div class="md:col-span-2">
                        <button
                            type="submit"
                            :disabled="newForm.processing"
                            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                            <span v-if="newForm.processing">Kaydediliyor...</span>
                            <span v-else>Kaydet</span>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Events List -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[600px]">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="event in events.data" :key="event.id" class="hover:bg-gray-50">
                                <td class="px-6 py-4">
                                    <div class="font-medium text-gray-900">{{ event.title }}</div>
                                    <div class="text-xs text-gray-500 mt-1 line-clamp-2">{{ event.description }}</div>
                                </td>
                                <td class="px-6 py-4 text-gray-600">{{ event.event_date || '-' }}</td>
                                <td class="px-6 py-4 text-gray-600">{{ event.slider_order }}</td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <button @click="startEdit(event)" class="text-blue-600 hover:text-blue-700 text-sm">Düzenle</button>
                                        <button @click="deleteEvent(event)" class="text-red-600 hover:text-red-700 text-sm">Sil</button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!events.data || events.data.length === 0">
                                <td colspan="4" class="px-6 py-8 text-center text-gray-500">Henüz etkinlik bulunmuyor.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="events.links && events.links.length > 3" class="px-6 py-4 border-t border-gray-200 flex justify-center">
                    <div class="flex items-center gap-2">
                        <Link
                            v-for="(link, index) in events.links"
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

            <!-- Edit Form -->
            <div v-if="editingId" class="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h2 class="text-lg font-medium text-gray-900">Etkinlik Düzenle</h2>

                <form @submit.prevent="submitEdit(events.data.find((item) => item.id === editingId))" class="grid md:grid-cols-2 gap-4">
                    <div class="md:col-span-2">
                        <label class="block text-sm text-gray-700 mb-1">Başlık <span class="text-red-500">*</span></label>
                        <input
                            v-model="editForm.title"
                            type="text"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': editForm.errors.title }"
                        />
                        <p v-if="editForm.errors.title" class="mt-1 text-sm text-red-600">{{ editForm.errors.title }}</p>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm text-gray-700 mb-1">Açıklama</label>
                        <textarea
                            v-model="editForm.description"
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': editForm.errors.description }"
                        ></textarea>
                        <p v-if="editForm.errors.description" class="mt-1 text-sm text-red-600">{{ editForm.errors.description }}</p>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Etkinlik Tarihi</label>
                        <input
                            v-model="editForm.event_date"
                            type="date"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': editForm.errors.event_date }"
                        />
                        <p v-if="editForm.errors.event_date" class="mt-1 text-sm text-red-600">{{ editForm.errors.event_date }}</p>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Slider Sırası</label>
                        <input
                            v-model="editForm.slider_order"
                            type="number"
                            min="0"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': editForm.errors.slider_order }"
                        />
                        <p v-if="editForm.errors.slider_order" class="mt-1 text-sm text-red-600">{{ editForm.errors.slider_order }}</p>
                    </div>

                    <div class="md:col-span-2">
                        <label class="block text-sm text-gray-700 mb-1">Yeni Kapak</label>
                        <input type="file" accept="image/*" @change="onEditCoverChange" class="w-full text-sm" />
                        <p v-if="editForm.errors.cover_image" class="mt-1 text-sm text-red-600">{{ editForm.errors.cover_image }}</p>
                    </div>

                    <div class="md:col-span-2 flex gap-2">
                        <button
                            type="submit"
                            :disabled="editForm.processing"
                            class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                            <span v-if="editForm.processing">Güncelleniyor...</span>
                            <span v-else>Güncelle</span>
                        </button>
                        <button type="button" @click="cancelEdit" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            İptal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </AdminLayout>
</template>
