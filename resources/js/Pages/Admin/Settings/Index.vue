<script setup>
import { useForm } from '@inertiajs/vue3';
import AdminLayout from '../../../Components/Admin/AdminLayout.vue';

const props = defineProps({
    settings: {
        type: Object,
        required: true,
    },
    status: {
        type: Object,
        required: true,
    },
});

const form = useForm({
    gemini_api_key: '',
    gemini_text_model: props.settings.gemini_text_model || 'gemini-2.5-flash',
    google_client_id: '',
    google_client_secret: '',
    google_redirect_uri: props.settings.google_redirect_uri || '',
    facebook_client_id: '',
    facebook_client_secret: '',
    facebook_redirect_uri: props.settings.facebook_redirect_uri || '',
    _method: 'PUT',
});

const submit = () => {
    form.post('/admin/settings');
};
</script>

<template>
    <AdminLayout title="Ayarlar">
        <div class="space-y-6">
            <section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5">
                <span class="bi-kicker">Sistem</span>
                <h1 class="mt-3 text-3xl font-black text-[var(--bi-ink)]">API ve OAuth Ayarları</h1>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--bi-muted)]">
                    Secret alanları güvenlik için boş gösterilir. Yeni değer girerseniz güncellenir, boş bırakırsanız mevcut değer korunur.
                </p>
            </section>

            <form @submit.prevent="submit" class="space-y-6 border-2 border-[var(--bi-ink)] bg-white p-5">
                <section class="space-y-4">
                    <h2 class="text-xl font-black text-[var(--bi-ink)]">Gemini</h2>
                    <div class="rounded border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3 text-sm font-bold text-[var(--bi-ink)]">
                        API Key Durumu: {{ status.gemini_api_key ? 'Configured' : 'Missing' }}
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-bold text-[var(--bi-ink)]">GEMINI_API_KEY</label>
                        <input
                            v-model="form.gemini_api_key"
                            type="password"
                            autocomplete="off"
                            placeholder="Yeni key gir (opsiyonel)"
                            class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                        />
                    </div>
                    <div>
                        <label class="mb-2 block text-sm font-bold text-[var(--bi-ink)]">GEMINI_TEXT_MODEL</label>
                        <input
                            v-model="form.gemini_text_model"
                            type="text"
                            class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                        />
                        <p v-if="form.errors.gemini_text_model" class="mt-1 text-sm text-red-700">{{ form.errors.gemini_text_model }}</p>
                    </div>
                </section>

                <section class="space-y-4 border-t-2 border-[var(--bi-ink)] pt-5">
                    <h2 class="text-xl font-black text-[var(--bi-ink)]">Google OAuth</h2>
                    <div class="rounded border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3 text-sm font-bold text-[var(--bi-ink)]">
                        Client ID: {{ status.google_client_id ? 'Configured' : 'Missing' }} | Secret: {{ status.google_client_secret ? 'Configured' : 'Missing' }}
                    </div>
                    <input
                        v-model="form.google_client_id"
                        type="text"
                        placeholder="GOOGLE_CLIENT_ID (opsiyonel güncelle)"
                        class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    />
                    <input
                        v-model="form.google_client_secret"
                        type="password"
                        autocomplete="off"
                        placeholder="GOOGLE_CLIENT_SECRET (opsiyonel güncelle)"
                        class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    />
                    <input
                        v-model="form.google_redirect_uri"
                        type="url"
                        placeholder="https://benizledim.com/auth/google/callback"
                        class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    />
                    <p v-if="form.errors.google_redirect_uri" class="text-sm text-red-700">{{ form.errors.google_redirect_uri }}</p>
                </section>

                <section class="space-y-4 border-t-2 border-[var(--bi-ink)] pt-5">
                    <h2 class="text-xl font-black text-[var(--bi-ink)]">Facebook OAuth</h2>
                    <div class="rounded border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3 text-sm font-bold text-[var(--bi-ink)]">
                        Client ID: {{ status.facebook_client_id ? 'Configured' : 'Missing' }} | Secret: {{ status.facebook_client_secret ? 'Configured' : 'Missing' }}
                    </div>
                    <input
                        v-model="form.facebook_client_id"
                        type="text"
                        placeholder="FACEBOOK_CLIENT_ID (opsiyonel güncelle)"
                        class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    />
                    <input
                        v-model="form.facebook_client_secret"
                        type="password"
                        autocomplete="off"
                        placeholder="FACEBOOK_CLIENT_SECRET (opsiyonel güncelle)"
                        class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    />
                    <input
                        v-model="form.facebook_redirect_uri"
                        type="url"
                        placeholder="https://benizledim.com/auth/facebook/callback"
                        class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    />
                    <p v-if="form.errors.facebook_redirect_uri" class="text-sm text-red-700">{{ form.errors.facebook_redirect_uri }}</p>
                </section>

                <div class="border-t-2 border-[var(--bi-ink)] pt-5">
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="inline-flex items-center justify-center bg-red-700 px-5 py-3 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50"
                    >
                        {{ form.processing ? 'Kaydediliyor...' : 'Ayarları Kaydet' }}
                    </button>
                </div>
            </form>
        </div>
    </AdminLayout>
</template>
