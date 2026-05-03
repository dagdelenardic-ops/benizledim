<script setup>
import { ref } from 'vue';
import { Link, useForm, usePage } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import RichTextEditor from '../../../Components/Admin/RichTextEditor.vue';
import Icon from '../../../Components/Admin/AdminIcon.vue';

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
    publishMode: {
        type: Object,
        default: () => ({ requiresReview: false }),
    },
    owners: {
        type: Array,
        default: () => [],
    },
});

const page = usePage();
const userRole = page.props.auth?.user?.role;
const isAdmin = userRole === 'admin';

const form = useForm({
    title: props.post.title,
    excerpt: props.post.excerpt || '',
    content: props.post.content,
    cover_image: null,
    status: props.post.status,
    user_id: props.post.user_id,
    categories: props.post.categories?.map(c => c.id) || [],
    tags: props.post.tags?.map(t => t.id) || [],
    _method: 'PUT',
});

const coverPreview = ref(props.post.cover_image);
const action = ref('draft');

const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.cover_image = file;
        coverPreview.value = URL.createObjectURL(file);
    }
};

const submit = (publish = false) => {
    action.value = publish ? 'publish' : 'draft';
    if (publish) {
        form.status = 'published';
    }
    
    form.post(`/admin/posts/${props.post.id}`, {
        onError: () => {
            if (publish) form.status = props.post.status;
        },
    });
};

const requestDelete = () => {
    const confirmText = isAdmin
        ? `"${props.post.title}" yazısını kalıcı olarak silmek istediğinize emin misiniz?`
        : `"${props.post.title}" yazısını silmek için admin onayına göndermek istiyor musunuz?`;
    
    if (!confirm(confirmText)) return;
    
    form.delete(`/admin/posts/${props.post.id}`);
};
</script>

<template>
    <AdminLayout :title="`Yazı Düzenle`">
        <div class="mx-auto max-w-5xl space-y-6">
            <section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5">
                <div class="flex items-center justify-between gap-4">
                    <div class="min-w-0">
                        <span class="bi-kicker">Üretim</span>
                        <h1 class="mt-3 truncate text-3xl font-black text-[var(--bi-ink)]">Yazı Düzenle</h1>
                        <p class="mt-2 truncate text-sm text-[var(--bi-muted)]">{{ post.title }}</p>
                    </div>
                    <Link href="/admin/posts" class="flex items-center gap-1 border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm font-bold text-[var(--bi-ink)] hover:bg-[var(--bi-paper)]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Geri
                    </Link>
                </div>
            </section>

            <!-- Pending Deletion Warning -->
            <div v-if="post.is_deletion_pending" class="border-2 border-red-700 bg-red-50 p-4">
                <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h3 class="text-sm font-medium text-red-800">Silme Onayı Bekleniyor</h3>
                        <p class="text-sm text-red-700 mt-1">
                            Bu yazı silinmek üzere işaretlendi. 
                            <span v-if="isAdmin">Siz admin olduğunuz için bu yazıyı kalıcı olarak silebilir veya yayına alabilirsiniz.</span>
                            <span v-else>Admin onayı bekleniyor. Onaylanana kadar yazı yayında görünmeyecek.</span>
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="post.status === 'pending_review'" class="border-2 border-amber-700 bg-amber-50 p-4">
                <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h3 class="text-sm font-medium text-amber-800">İnceleme Bekleniyor</h3>
                        <p class="text-sm text-amber-700 mt-1">
                            Bu yazı editör onayında.
                            <span v-if="post.pending_review_by?.name">Gönderen: {{ post.pending_review_by.name }}.</span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Status Badge -->
            <div class="flex items-center gap-3 border-2 border-[var(--bi-ink)] bg-white p-4">
                <span class="text-sm text-gray-500">Durum:</span>
                <span 
                    :class="[
                        'border px-3 py-1 text-sm font-bold',
                        post.is_deletion_pending 
                            ? 'bg-red-100 text-red-700' 
                            : post.status === 'pending_review'
                                ? 'bg-amber-100 text-amber-700'
                            : post.status === 'published' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                    ]"
                >
                    {{ post.is_deletion_pending ? 'Silme Onayı Bekliyor' : post.status === 'pending_review' ? 'İncelemede' : post.status === 'published' ? 'Yayında' : 'Taslak' }}
                </span>
            </div>

            <div v-if="isAdmin" class="border-2 border-[var(--bi-ink)] bg-white p-5">
                <label class="block text-sm font-medium text-gray-700 mb-2">Yazı Sahibi</label>
                <select
                    v-model="form.user_id"
                    class="w-full border border-[var(--bi-ink)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    disabled
                >
                    <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                        {{ owner.name }}
                    </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">Sahip değişikliği liste ekranından yapılır.</p>
            </div>

            <form @submit.prevent="submit(false)" class="space-y-6 border-2 border-[var(--bi-ink)] bg-white p-5 md:p-6">
                <!-- Title -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Başlık
                        <span class="text-red-500">*</span>
                    </label>
                    <input
                        v-model="form.title"
                        type="text"
                        class="w-full border border-[var(--bi-ink)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700/20"
                        :class="{ 'border-red-500': form.errors.title }"
                        placeholder="Yazı başlığı..."
                    />
                    <p v-if="form.errors.title" class="mt-1 text-sm text-red-600">{{ form.errors.title }}</p>
                </div>

                <!-- Excerpt -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Özet
                        <span class="text-gray-400 text-xs ml-1">(opsiyonel)</span>
                    </label>
                    <textarea
                        v-model="form.excerpt"
                        rows="3"
                        maxlength="500"
                        class="w-full resize-none border border-[var(--bi-ink)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700/20"
                        :class="{ 'border-red-500': form.errors.excerpt }"
                        placeholder="Yazının kısa özeti..."
                    ></textarea>
                    <div class="flex justify-between mt-1">
                        <p v-if="form.errors.excerpt" class="text-sm text-red-600">{{ form.errors.excerpt }}</p>
                        <p v-else class="text-xs text-gray-400">{{ form.excerpt?.length || 0 }}/500 karakter</p>
                    </div>
                </div>

                <!-- Content -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        İçerik
                        <span class="text-red-500">*</span>
                    </label>
                    <RichTextEditor v-model="form.content" />
                    <p v-if="form.errors.content" class="mt-1 text-sm text-red-600">{{ form.errors.content }}</p>
                </div>

                <!-- Cover Image -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Kapak Görseli
                        <span class="text-gray-400 text-xs ml-1">(opsiyonel)</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        @change="handleCoverChange"
                        class="block w-full text-sm text-gray-600 file:mr-4 file:border file:border-red-700 file:bg-red-50 file:px-4 file:py-2 file:font-bold file:text-red-700 hover:file:bg-red-100"
                        :class="{ 'border-red-500': form.errors.cover_image }"
                    />
                    <p v-if="form.errors.cover_image" class="mt-1 text-sm text-red-600">{{ form.errors.cover_image }}</p>
                    <img v-if="coverPreview" :src="coverPreview" class="mt-4 max-h-48 border-2 border-[var(--bi-ink)]" />
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
                            class="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            :class="{ 
                                'border-red-700 bg-red-50': form.categories.includes(category.id),
                                'border-[var(--bi-ink)]': !form.categories.includes(category.id),
                                'border-red-500 ring-1 ring-red-500': form.errors.categories 
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
                    <p v-else class="mt-1 text-xs text-gray-400">En az bir kategori seçmelisiniz.</p>
                </div>

                <!-- Tags -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Etiketler
                        <span class="text-gray-400 text-xs ml-1">(opsiyonel)</span>
                    </label>
                    <div class="flex flex-wrap gap-3">
                        <label
                            v-for="tag in tags"
                            :key="tag.id"
                            class="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            :class="{ 
                                'border-red-700 bg-red-50': form.tags.includes(tag.id),
                                'border-[var(--bi-ink)]': !form.tags.includes(tag.id)
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
                    <p v-if="form.errors.tags" class="mt-1 text-sm text-red-600">{{ form.errors.tags }}</p>
                </div>

                <!-- Actions -->
                <div class="flex flex-col items-stretch justify-between gap-4 border-t-2 border-[var(--bi-ink)] pt-5 sm:flex-row sm:items-center">
                    <div class="flex flex-col sm:flex-row gap-4">
                        <button
                            type="submit"
                            :disabled="form.processing || post.is_deletion_pending"
                            class="flex items-center justify-center gap-2 border border-[var(--bi-ink)] bg-white px-6 py-3 font-bold text-[var(--bi-ink)] transition-colors hover:bg-[var(--bi-paper)] disabled:opacity-50"
                        >
                            <svg v-if="form.processing && action === 'draft'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Taslak Olarak Kaydet</span>
                        </button>
                        <button
                            type="button"
                            @click="submit(true)"
                            :disabled="form.processing || post.is_deletion_pending"
                            class="flex items-center justify-center gap-2 bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
                        >
                            <svg v-if="form.processing && action === 'publish'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <Icon v-else name="check" />
                            <span>{{ publishMode.requiresReview ? 'İncelemeye Gönder' : post.status === 'published' ? 'Güncelle' : 'Yayınla' }}</span>
                        </button>
                    </div>
                    
                    <!-- Delete Button -->
                    <button
                        type="button"
                        @click="requestDelete"
                        :disabled="form.processing || (!isAdmin && post.is_deletion_pending)"
                        class="flex items-center justify-center gap-2 border border-red-700 bg-red-50 px-6 py-3 font-bold text-red-800 transition-colors hover:bg-red-100 disabled:opacity-50"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>{{ isAdmin ? 'Sil' : 'Silme Talebi Gönder' }}</span>
                    </button>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>
