<script setup>
import { ref, watch, computed } from 'vue';
import { Link, useForm, usePage } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import RichTextEditor from '../../../Components/Admin/RichTextEditor.vue';
import SlugPreview from '../../../Components/Admin/SlugPreview.vue';
import Icon from '../../../Components/Admin/AdminIcon.vue';
import { useLocalFormDraft } from '../../../Composables/useLocalFormDraft';

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
    cover_image_focus_x: props.post.cover_image_focus_x ?? 50,
    cover_image_focus_y: props.post.cover_image_focus_y ?? 50,
    cover_image_mobile_focus_x: props.post.cover_image_mobile_focus_x ?? props.post.cover_image_focus_x ?? 50,
    cover_image_mobile_focus_y: props.post.cover_image_mobile_focus_y ?? props.post.cover_image_focus_y ?? 50,
    status: props.post.status,
    scheduled_at: props.post.scheduled_at || '',
    reading_time_minutes: props.post.reading_time_minutes || 1,
    user_id: props.post.user_id,
    categories: props.post.categories?.map(c => c.id) || [],
    tags: props.post.tags?.map(t => t.id) || [],
    _method: 'PUT',
});

const coverPreview = ref(props.post.cover_image);
const action = ref('draft');
const slugPreviewRef = ref(null);
const draftKey = computed(() => `benizledim_draft_post_${props.post.id}_content`);
const formDraftKey = computed(() => `benizledim_draft_post_${props.post.id}_form`);
const autosaveEndpoint = computed(() => `/admin/posts/${props.post.id}/autosave`);
const editDraftPayload = computed(() => ({
    title: form.title,
    excerpt: form.excerpt,
    content: form.content,
    status: form.status,
    cover_image_focus_x: form.cover_image_focus_x,
    cover_image_focus_y: form.cover_image_focus_y,
    cover_image_mobile_focus_x: form.cover_image_mobile_focus_x,
    cover_image_mobile_focus_y: form.cover_image_mobile_focus_y,
    scheduled_at: form.scheduled_at,
    reading_time_minutes: form.reading_time_minutes,
    user_id: form.user_id,
    categories: [...form.categories],
    tags: [...form.tags],
}));

const {
    clearDraft: clearFormDraft,
    draftRestoreAvailable,
    draftSavedAt,
    restoreDraft,
} = useLocalFormDraft(editDraftPayload, {
    storageKey: formDraftKey.value,
    isMeaningful: (data) => JSON.stringify(data) !== JSON.stringify({
        title: props.post.title,
        excerpt: props.post.excerpt || '',
        content: props.post.content,
        status: props.post.status,
        cover_image_focus_x: props.post.cover_image_focus_x ?? 50,
        cover_image_focus_y: props.post.cover_image_focus_y ?? 50,
        cover_image_mobile_focus_x: props.post.cover_image_mobile_focus_x ?? props.post.cover_image_focus_x ?? 50,
        cover_image_mobile_focus_y: props.post.cover_image_mobile_focus_y ?? props.post.cover_image_focus_y ?? 50,
        scheduled_at: props.post.scheduled_at || '',
        reading_time_minutes: props.post.reading_time_minutes || 1,
        user_id: props.post.user_id,
        categories: props.post.categories?.map((category) => category.id) || [],
        tags: props.post.tags?.map((tag) => tag.id) || [],
    }),
});

watch(() => form.title, (title) => {
    slugPreviewRef.value?.updateFromTitle(title);
});

const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        form.cover_image = file;
        coverPreview.value = URL.createObjectURL(file);
    }
};

const onReadingTimeUpdate = (mins) => {
    form.reading_time_minutes = mins;
};

const applyDraft = (draft) => {
    form.title = draft.title ?? props.post.title;
    form.excerpt = draft.excerpt ?? '';
    form.content = draft.content ?? props.post.content;
    form.status = draft.status ?? props.post.status;
    form.cover_image_focus_x = draft.cover_image_focus_x ?? props.post.cover_image_focus_x ?? 50;
    form.cover_image_focus_y = draft.cover_image_focus_y ?? props.post.cover_image_focus_y ?? 50;
    form.cover_image_mobile_focus_x = draft.cover_image_mobile_focus_x ?? props.post.cover_image_mobile_focus_x ?? props.post.cover_image_focus_x ?? 50;
    form.cover_image_mobile_focus_y = draft.cover_image_mobile_focus_y ?? props.post.cover_image_mobile_focus_y ?? props.post.cover_image_focus_y ?? 50;
    form.scheduled_at = draft.scheduled_at ?? '';
    form.reading_time_minutes = draft.reading_time_minutes ?? props.post.reading_time_minutes ?? 1;
    form.user_id = draft.user_id ?? props.post.user_id;
    form.categories = Array.isArray(draft.categories) ? draft.categories : [];
    form.tags = Array.isArray(draft.tags) ? draft.tags : [];
};

const restoreFormDraft = () => restoreDraft(applyDraft);

const discardFormDraft = () => {
    clearFormDraft();
    localStorage.removeItem(draftKey.value);
};

const coverPositionStyle = (mode = 'desktop') => ({
    objectPosition: mode === 'mobile'
        ? `${form.cover_image_mobile_focus_x}% ${form.cover_image_mobile_focus_y}%`
        : `${form.cover_image_focus_x}% ${form.cover_image_focus_y}%`,
});

const submit = (publish = false) => {
    action.value = form.scheduled_at ? 'schedule' : publish ? 'publish' : 'draft';
    if (publish) {
        form.status = 'published';
        form.scheduled_at = '';
    } else if (!form.scheduled_at) {
        form.status = props.post.status;
    } else {
        form.status = 'published';
    }
    
    form.post(`/admin/posts/${props.post.id}`, {
        onSuccess: () => {
            clearFormDraft();
            localStorage.removeItem(draftKey.value);
        },
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
            <!-- Header -->
            <section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <span class="bi-kicker">Düzenleme</span>
                        <h1 class="mt-3 text-3xl font-black text-[var(--bi-ink)]">Yazı Düzenle</h1>
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

            <div v-if="post.status === 'pending_review'" class="border-2 border-amber-500 bg-amber-50 p-4">
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
            <div class="flex items-center gap-3">
                <span class="text-sm text-gray-500">Durum:</span>
                <span 
                    :class="[
                        'px-3 py-1 border-2 text-sm font-bold',
                        post.is_deletion_pending 
                            ? 'border-red-700 bg-red-50 text-red-700' 
                            : post.status === 'pending_review'
                                ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : post.status === 'published' 
                                ? 'border-green-700 bg-green-50 text-green-700' 
                                : 'border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)]'
                    ]"
                >
                    {{ post.is_deletion_pending ? 'Silme Onayı Bekliyor' : post.status === 'pending_review' ? 'İncelemede' : post.status === 'published' ? 'Yayında' : 'Taslak' }}
                </span>
                <span v-if="post.scheduled_at" class="px-3 py-1 border-2 border-purple-500 bg-purple-50 text-purple-700 text-sm font-bold">
                    Zamanlı: {{ new Date(post.scheduled_at).toLocaleString('tr-TR') }}
                </span>
            </div>

            <div v-if="isAdmin" class="border border-[var(--bi-ink)] bg-[var(--bi-paper)] p-3">
                <label class="block text-sm font-medium text-gray-700 mb-2">Yazı Sahibi</label>
                <select
                    v-model="form.user_id"
                    class="w-full max-w-xs border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    disabled
                >
                    <option v-for="owner in owners" :key="owner.id" :value="owner.id">
                        {{ owner.name }}
                    </option>
                </select>
                <p class="mt-1 text-xs text-gray-500">Sahip değişikliği liste ekranından yapılır.</p>
            </div>

            <form @submit.prevent="submit(false)" class="space-y-6 border-2 border-[var(--bi-ink)] bg-white p-5 md:p-6">
                <div v-if="draftRestoreAvailable" class="flex items-center justify-between border-2 border-amber-500 bg-amber-50 px-4 py-3">
                    <span class="text-sm font-bold text-amber-900">Kaydedilmemiş taslak bulundu ({{ draftSavedAt }})</span>
                    <div class="flex gap-2">
                        <button type="button" @click="restoreFormDraft" class="border border-amber-500 bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:bg-amber-600">
                            Devam Et
                        </button>
                        <button type="button" @click="discardFormDraft" class="border border-gray-400 bg-white px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-50">
                            Yoksay
                        </button>
                    </div>
                </div>

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

                <!-- Slug Preview -->
                <SlugPreview ref="slugPreviewRef" :model-value="post.slug" :post-id="post.id" />

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
                    <RichTextEditor
                        v-model="form.content"
                        :autosave-key="draftKey"
                        :autosave-endpoint="autosaveEndpoint"
                        :show-restore-banner="false"
                        @update:reading-time="onReadingTimeUpdate"
                    />
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

                    <div class="mt-4 space-y-4 border border-[var(--bi-ink)] bg-[var(--bi-paper)] p-4">
                        <div>
                            <div class="text-sm font-bold text-[var(--bi-ink)]">Anasayfa Kırpma ve Odak</div>
                            <p class="mt-1 text-xs text-[var(--bi-muted)]">
                                Web ve mobil manşet kırpması ayrı kaydedilir. Daha basık hero için odak noktasını buradan ayarla.
                            </p>
                        </div>

                        <div class="grid gap-4 lg:grid-cols-2">
                            <div class="space-y-3">
                                <div class="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">Web</div>
                                <div class="overflow-hidden border border-[var(--bi-ink)] bg-black">
                                    <img v-if="coverPreview" :src="coverPreview" class="h-[112px] w-full object-cover opacity-95" :style="coverPositionStyle('desktop')" />
                                    <div v-else class="grid h-[112px] place-items-center text-xs font-bold uppercase tracking-[0.08em] text-white/60 bi-mono">Önizleme</div>
                                </div>
                                <label class="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">
                                    Yatay: {{ form.cover_image_focus_x }}%
                                    <input v-model="form.cover_image_focus_x" type="range" min="0" max="100" class="mt-2 w-full" />
                                </label>
                                <label class="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">
                                    Dikey: {{ form.cover_image_focus_y }}%
                                    <input v-model="form.cover_image_focus_y" type="range" min="0" max="100" class="mt-2 w-full" />
                                </label>
                            </div>

                            <div class="space-y-3">
                                <div class="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">Mobil</div>
                                <div class="mx-auto w-[180px] overflow-hidden border border-[var(--bi-ink)] bg-black">
                                    <img v-if="coverPreview" :src="coverPreview" class="h-[112px] w-full object-cover opacity-95" :style="coverPositionStyle('mobile')" />
                                    <div v-else class="grid h-[112px] place-items-center text-xs font-bold uppercase tracking-[0.08em] text-white/60 bi-mono">Önizleme</div>
                                </div>
                                <label class="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">
                                    Yatay: {{ form.cover_image_mobile_focus_x }}%
                                    <input v-model="form.cover_image_mobile_focus_x" type="range" min="0" max="100" class="mt-2 w-full" />
                                </label>
                                <label class="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono">
                                    Dikey: {{ form.cover_image_mobile_focus_y }}%
                                    <input v-model="form.cover_image_mobile_focus_y" type="range" min="0" max="100" class="mt-2 w-full" />
                                </label>
                            </div>
                        </div>
                    </div>
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

                <!-- Schedule & Actions -->
                <div class="flex flex-col gap-4 border-t-2 border-[var(--bi-ink)] pt-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Zamanlı Yayın
                            <span class="text-gray-400 text-xs ml-1">(opsiyonel)</span>
                        </label>
                        <input
                            v-model="form.scheduled_at"
                            type="datetime-local"
                            class="w-full max-w-xs border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                        />
                        <p v-if="form.scheduled_at" class="mt-1 text-xs text-amber-600">
                            Yazı belirtilen tarihte otomatik yayınlanacak.
                        </p>
                    </div>

                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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
                        
                        <button
                            type="button"
                            @click="requestDelete"
                            :disabled="form.processing || post.is_deletion_pending"
                            class="flex items-center justify-center gap-2 border border-red-300 px-6 py-3 font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>{{ isAdmin ? 'Sil' : 'Silme Talebi Gönder' }}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>
