<script setup>
import { ref } from 'vue';
import { Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';

const props = defineProps({
    podcasts: {
        type: Object,
        required: true,
    },
});

const newForm = useForm({
    title: '',
    description: '',
    spotify_embed_url: '',
    cover_image: null,
    duration: '',
    published_at: '',
});

const selectedCoverName = ref('');

const onNewCoverChange = (event) => {
    const file = event.target.files[0] || null;
    newForm.cover_image = file;
    selectedCoverName.value = file ? file.name : '';
};

const submitNew = () => {
    newForm.post('/admin/podcasts', {
        forceFormData: true,
        onSuccess: () => {
            newForm.reset();
            selectedCoverName.value = '';
        },
    });
};

const editingPodcastId = ref(null);
const editForm = useForm({
    title: '',
    description: '',
    spotify_embed_url: '',
    cover_image: null,
    duration: '',
    published_at: '',
});

const editCoverName = ref('');

const startEdit = (podcast) => {
    editingPodcastId.value = podcast.id;
    editForm.title = podcast.title || '';
    editForm.description = podcast.description || '';
    editForm.spotify_embed_url = podcast.spotify_embed_url || '';
    editForm.duration = podcast.duration || '';
    editForm.published_at = podcast.published_at ? podcast.published_at.slice(0, 16) : '';
    editForm.cover_image = null;
    editCoverName.value = '';
};

const onEditCoverChange = (event) => {
    const file = event.target.files[0] || null;
    editForm.cover_image = file;
    editCoverName.value = file ? file.name : '';
};

const submitEdit = (podcast) => {
    editForm.transform((data) => ({ ...data, _method: 'PUT' }));
    editForm.post(`/admin/podcasts/${podcast.id}`, {
        forceFormData: true,
        onSuccess: () => {
            editingPodcastId.value = null;
            editCoverName.value = '';
        },
    });
};

const cancelEdit = () => {
    editingPodcastId.value = null;
    editForm.reset();
    editCoverName.value = '';
};

const deletePodcast = (podcast) => {
    if (!confirm(`"${podcast.title}" podcast kaydını silmek istediğinize emin misiniz?`)) return;

    newForm.delete(`/admin/podcasts/${podcast.id}`);
};
</script>

<template>
    <AdminLayout title="Podcast Yönetimi">
        <div class="space-y-6">
            <h1 class="text-2xl font-bold text-gray-900">Podcast Yönetimi</h1>

            <!-- New Podcast Form -->
            <div class="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h2 class="text-lg font-medium text-gray-900">Yeni Podcast</h2>

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
                        <label class="block text-sm text-gray-700 mb-1">Spotify Embed URL</label>
                        <input
                            v-model="newForm.spotify_embed_url"
                            type="url"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': newForm.errors.spotify_embed_url }"
                        />
                        <p v-if="newForm.errors.spotify_embed_url" class="mt-1 text-sm text-red-600">{{ newForm.errors.spotify_embed_url }}</p>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Süre (dakika)</label>
                        <input
                            v-model="newForm.duration"
                            type="number"
                            min="1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': newForm.errors.duration }"
                        />
                        <p v-if="newForm.errors.duration" class="mt-1 text-sm text-red-600">{{ newForm.errors.duration }}</p>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Yayın Tarihi</label>
                        <input
                            v-model="newForm.published_at"
                            type="datetime-local"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': newForm.errors.published_at }"
                        />
                        <p v-if="newForm.errors.published_at" class="mt-1 text-sm text-red-600">{{ newForm.errors.published_at }}</p>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Kapak Görseli</label>
                        <input type="file" accept="image/*" @change="onNewCoverChange" class="w-full text-sm" />
                        <p v-if="selectedCoverName" class="mt-1 text-xs text-gray-500">{{ selectedCoverName }}</p>
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

            <!-- Podcasts List -->
            <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[600px]">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Süre</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yayın</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="podcast in podcasts.data" :key="podcast.id" class="hover:bg-gray-50 align-top">
                                <td class="px-6 py-4">
                                    <div class="font-medium text-gray-900">{{ podcast.title }}</div>
                                    <div class="text-xs text-gray-500 mt-1 line-clamp-2">{{ podcast.description }}</div>
                                </td>
                                <td class="px-6 py-4 text-gray-600">{{ podcast.duration || '-' }}</td>
                                <td class="px-6 py-4 text-gray-600 text-sm">{{ podcast.published_at ? podcast.published_at.slice(0, 10) : '-' }}</td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-2">
                                        <button @click="startEdit(podcast)" class="text-blue-600 hover:text-blue-700 text-sm">Düzenle</button>
                                        <button @click="deletePodcast(podcast)" class="text-red-600 hover:text-red-700 text-sm">Sil</button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="!podcasts.data || podcasts.data.length === 0">
                                <td colspan="4" class="px-6 py-8 text-center text-gray-500">Henüz podcast kaydı bulunmuyor.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="podcasts.links && podcasts.links.length > 3" class="px-6 py-4 border-t border-gray-200 flex justify-center">
                    <div class="flex items-center gap-2">
                        <Link
                            v-for="(link, index) in podcasts.links"
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
            <div v-if="editingPodcastId" class="bg-white rounded-lg shadow-sm p-6 space-y-4">
                <h2 class="text-lg font-medium text-gray-900">Podcast Düzenle</h2>

                <form @submit.prevent="submitEdit(podcasts.data.find((item) => item.id === editingPodcastId))" class="grid md:grid-cols-2 gap-4">
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
                        <label class="block text-sm text-gray-700 mb-1">Spotify Embed URL</label>
                        <input
                            v-model="editForm.spotify_embed_url"
                            type="url"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': editForm.errors.spotify_embed_url }"
                        />
                        <p v-if="editForm.errors.spotify_embed_url" class="mt-1 text-sm text-red-600">{{ editForm.errors.spotify_embed_url }}</p>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Süre</label>
                        <input
                            v-model="editForm.duration"
                            type="number"
                            min="1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': editForm.errors.duration }"
                        />
                        <p v-if="editForm.errors.duration" class="mt-1 text-sm text-red-600">{{ editForm.errors.duration }}</p>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Yayın Tarihi</label>
                        <input
                            v-model="editForm.published_at"
                            type="datetime-local"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': editForm.errors.published_at }"
                        />
                        <p v-if="editForm.errors.published_at" class="mt-1 text-sm text-red-600">{{ editForm.errors.published_at }}</p>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 mb-1">Yeni Kapak</label>
                        <input type="file" accept="image/*" @change="onEditCoverChange" class="w-full text-sm" />
                        <p v-if="editCoverName" class="mt-1 text-xs text-gray-500">{{ editCoverName }}</p>
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
