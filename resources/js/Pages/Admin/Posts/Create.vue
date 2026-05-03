<script setup>
import { computed, ref, watch } from 'vue';
import { Link, useForm } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';
import RichTextEditor from '../../../Components/Admin/RichTextEditor.vue';
import SlugPreview from '../../../Components/Admin/SlugPreview.vue';
import Icon from '../../../Components/Admin/AdminIcon.vue';
import { useLocalFormDraft } from '../../../Composables/useLocalFormDraft';

const props = defineProps({
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
});

const form = useForm({
    title: '',
    excerpt: '',
    content: '',
    cover_image: null,
    cover_image_focus_x: 50,
    cover_image_focus_y: 50,
    cover_image_mobile_focus_x: 50,
    cover_image_mobile_focus_y: 50,
    status: 'draft',
    scheduled_at: '',
    reading_time_minutes: 1,
    categories: props.categories[0]?.id ? [props.categories[0].id] : [],
    tags: [],
});

const coverPreview = ref(null);
const action = ref('draft');
const formMessage = ref('');
const hasCategories = computed(() => props.categories.length > 0);
const slugPreviewRef = ref(null);

const draftKey = 'benizledim_draft_new_post_content';
const formDraftKey = 'benizledim_draft_new_post_form';
const createDraftPayload = computed(() => ({
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
    categories: [...form.categories],
    tags: [...form.tags],
}));

const {
    clearDraft: clearFormDraft,
    draftRestoreAvailable,
    draftSavedAt,
    restoreDraft,
} = useLocalFormDraft(createDraftPayload, {
    storageKey: formDraftKey,
    isMeaningful: (data) => Boolean(
        data.title || data.excerpt || data.content || data.scheduled_at || data.tags.length,
    ),
});

watch(() => props.categories, (categories) => {
    if (form.categories.length === 0 && categories[0]?.id) {
        form.categories = [categories[0].id];
    }
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
    form.title = draft.title ?? '';
    form.excerpt = draft.excerpt ?? '';
    form.content = draft.content ?? '';
    form.status = draft.status ?? 'draft';
    form.cover_image_focus_x = draft.cover_image_focus_x ?? 50;
    form.cover_image_focus_y = draft.cover_image_focus_y ?? 50;
    form.cover_image_mobile_focus_x = draft.cover_image_mobile_focus_x ?? 50;
    form.cover_image_mobile_focus_y = draft.cover_image_mobile_focus_y ?? 50;
    form.scheduled_at = draft.scheduled_at ?? '';
    form.reading_time_minutes = draft.reading_time_minutes ?? 1;
    form.categories = Array.isArray(draft.categories) && draft.categories.length > 0
        ? draft.categories
        : (props.categories[0]?.id ? [props.categories[0].id] : []);
    form.tags = Array.isArray(draft.tags) ? draft.tags : [];
};

const restoreFormDraft = () => restoreDraft(applyDraft);

const discardFormDraft = () => {
    clearFormDraft();
    localStorage.removeItem(draftKey);
};

const coverPositionStyle = (mode = 'desktop') => ({
    objectPosition: mode === 'mobile'
        ? `${form.cover_image_mobile_focus_x}% ${form.cover_image_mobile_focus_y}%`
        : `${form.cover_image_focus_x}% ${form.cover_image_focus_y}%`,
});

const submit = (publish = false) => {
    formMessage.value = '';

    if (!hasCategories.value) {
        formMessage.value = 'Yazı kaydetmek için önce en az bir kategori oluşturulmalı.';
        return;
    }

    action.value = form.scheduled_at ? 'schedule' : publish ? 'publish' : 'draft';
    if (publish) {
        form.status = 'published';
        form.scheduled_at = '';
    } else if (!form.scheduled_at) {
        form.status = 'draft';
    } else {
        form.status = 'published';
    }
    
    form.post('/admin/posts', {
        onSuccess: () => {
            clearFormDraft();
            localStorage.removeItem(draftKey);
        },
        onError: () => {
            formMessage.value = 'Yazı kaydedilemedi. Lütfen işaretli alanları kontrol edin.';
            if (publish) form.status = 'draft';
        },
    });
};
</script>

<template>
    <AdminLayout title="Yeni Yazı">
        <div class="mx-auto max-w-5xl space-y-6">
            <section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <span class="bi-kicker">Üretim</span>
                        <h1 class="mt-3 text-3xl font-black text-[var(--bi-ink)]">Yeni Yazı</h1>
                        <p class="mt-2 text-sm text-[var(--bi-muted)]">
                            Yazını taslak olarak sakla veya hazır olduğunda {{ publishMode.requiresReview ? 'incelemeye gönder' : 'yayınla' }}.
                        </p>
                    </div>
                    <Link href="/admin/posts" class="flex items-center gap-1 border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm font-bold text-[var(--bi-ink)] hover:bg-[var(--bi-paper)]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Geri
                    </Link>
                </div>
            </section>

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

                <div v-if="formMessage" class="border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">
                    {{ formMessage }}
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
                <SlugPreview ref="slugPreviewRef" />

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
                                Hero görseli artık daha basık kırpılıyor. Web ve mobil için ayrı odak noktası belirleyebilirsin.
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
                    <p v-else-if="hasCategories" class="mt-1 text-xs text-gray-400">İlk kategori otomatik seçildi; gerekirse değiştirebilirsiniz.</p>
                    <p v-else class="mt-1 text-sm font-bold text-red-700">Kategori bulunamadı. Önce Kategoriler sayfasından kategori ekleyin.</p>
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
                            Yazı belirtilen tarihte otomatik yayınlanacak. Şimdi taslak olarak kaydedilir.
                        </p>
                    </div>

                    <div class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                        <button
                            type="submit"
                            :disabled="form.processing"
                            class="flex items-center justify-center gap-2 border border-[var(--bi-ink)] bg-white px-6 py-3 font-bold text-[var(--bi-ink)] transition-colors hover:bg-[var(--bi-paper)] disabled:opacity-50"
                        >
                            <svg v-if="form.processing && action === 'draft'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{{ form.scheduled_at ? 'Zamanla' : 'Taslak Kaydet' }}</span>
                        </button>
                        <button
                            type="button"
                            @click="submit(true)"
                            :disabled="form.processing"
                            class="flex items-center justify-center gap-2 bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
                        >
                            <svg v-if="form.processing && action === 'publish'" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <Icon v-else name="check" />
                            <span>{{ publishMode.requiresReview ? 'İncelemeye Gönder' : 'Yayınla' }}</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>
