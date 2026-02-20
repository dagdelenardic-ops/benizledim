<script setup>
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import RichTextEditor from '../../../Components/Admin/RichTextEditor.vue';

const props = defineProps({
    post: {
        type: Object,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    tags: {
        type: Array,
        required: true,
    },
});

const form = useForm({
    title: props.post.title,
    excerpt: props.post.excerpt || '',
    content: props.post.content,
    cover_image: null,
    status: props.post.status,
    categories: props.post.categories?.map(c => c.id) || [],
    tags: props.post.tags?.map(t => t.id) || [],
    _method: 'PUT',
});

const coverPreview = ref(props.post.cover_image);

const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.cover_image = file;
        coverPreview.value = URL.createObjectURL(file);
    }
};

const submit = (publish = false) => {
    if (publish) {
        form.status = 'published';
    }
    
    form.post(`/admin/posts/${props.post.id}`, {
        onError: () => {
            if (publish) form.status = props.post.status;
        },
    });
};
</script>

<template>
    <AdminLayout :title="`Düzenle: ${post.title}`">
        <div class="max-w-4xl mx-auto">
            <div class="flex items-center justify-between mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Yazı Düzenle</h1>
                <a href="/admin/posts" class="text-gray-600 hover:text-gray-900">
                    ← Geri
                </a>
            </div>

            <form @submit.prevent="submit(false)" class="space-y-6">
                <!-- Title -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                    <input
                        v-model="form.title"
                        type="text"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        :class="{ 'border-red-500': form.errors.title }"
                        placeholder="Yazı başlığı..."
                    />
                    <p v-if="form.errors.title" class="mt-1 text-sm text-red-600">{{ form.errors.title }}</p>
                </div>

                <!-- Excerpt -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Özet
                        <span class="text-gray-400 text-xs">(opsiyonel)</span>
                    </label>
                    <textarea
                        v-model="form.excerpt"
                        rows="3"
                        maxlength="500"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none"
                        :class="{ 'border-red-500': form.errors.excerpt }"
                        placeholder="Yazının kısa özeti..."
                    ></textarea>
                    <p v-if="form.errors.excerpt" class="mt-1 text-sm text-red-600">{{ form.errors.excerpt }}</p>
                </div>

                <!-- Content -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                    <RichTextEditor v-model="form.content" />
                    <p v-if="form.errors.content" class="mt-1 text-sm text-red-600">{{ form.errors.content }}</p>
                </div>

                <!-- Cover Image -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Kapak Görseli
                        <span class="text-gray-400 text-xs">(opsiyonel)</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        @change="handleCoverChange"
                        class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        :class="{ 'border-red-500': form.errors.cover_image }"
                    />
                    <p v-if="form.errors.cover_image" class="mt-1 text-sm text-red-600">{{ form.errors.cover_image }}</p>
                    <img v-if="coverPreview" :src="coverPreview" class="mt-4 max-h-48 rounded-lg" />
                </div>

                <!-- Categories -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Kategoriler
                        <span class="text-red-500">*</span>
                    </label>
                    <div class="flex flex-wrap gap-3">
                        <label
                            v-for="category in categories"
                            :key="category.id"
                            class="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                            :class="{ 
                                'border-red-500 bg-red-50': form.categories.includes(category.id),
                                'border-gray-300': !form.categories.includes(category.id),
                                'border-red-500': form.errors.categories 
                            }"
                        >
                            <input
                                v-model="form.categories"
                                type="checkbox"
                                :value="category.id"
                                class="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span class="text-sm">{{ category.name }}</span>
                        </label>
                    </div>
                    <p v-if="form.errors.categories" class="mt-1 text-sm text-red-600">{{ form.errors.categories }}</p>
                </div>

                <!-- Tags -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Etiketler
                        <span class="text-gray-400 text-xs">(opsiyonel)</span>
                    </label>
                    <div class="flex flex-wrap gap-3">
                        <label
                            v-for="tag in tags"
                            :key="tag.id"
                            class="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                            :class="{ 
                                'border-red-500 bg-red-50': form.tags.includes(tag.id),
                                'border-gray-300': !form.tags.includes(tag.id)
                            }"
                        >
                            <input
                                v-model="form.tags"
                                type="checkbox"
                                :value="tag.id"
                                class="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span class="text-sm">{{ tag.name }}</span>
                        </label>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-4 pt-4 border-t">
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        <span v-if="form.processing && form.status === 'draft'">Kaydediliyor...</span>
                        <span v-else>Taslak Olarak Kaydet</span>
                    </button>
                    <button
                        type="button"
                        @click="submit(true)"
                        :disabled="form.processing"
                        class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <span v-if="form.processing && form.status === 'published'">Yayınlanıyor...</span>
                        <span v-else>Yayınla</span>
                    </button>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>
