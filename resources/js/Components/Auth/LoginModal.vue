<script setup>
import { reactive, ref, watch, computed } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue';

const props = defineProps({
    show: Boolean,
});

const emit = defineEmits(['close']);

const showEmailForm = ref(false);
const loading = ref(false);
const googleLoading = ref(false);
const facebookLoading = ref(false);
const errors = reactive({});
const page = usePage();

const form = reactive({
    email: '',
    password: '',
    remember: false,
});

const formError = computed(() => errors.email || errors.password || errors.failed || null);

const resetFormState = () => {
    showEmailForm.value = false;
    loading.value = false;
    googleLoading.value = false;
    facebookLoading.value = false;
    form.email = '';
    form.password = '';
    form.remember = false;
    Object.keys(errors).forEach((key) => delete errors[key]);
};

const close = () => {
    resetFormState();
    emit('close');
};

const loginWithGoogle = () => {
    googleLoading.value = true;
    window.location.href = '/auth/google';
};

const loginWithFacebook = () => {
    facebookLoading.value = true;
    window.location.href = '/auth/facebook';
};

const submitLogin = () => {
    loading.value = true;
    Object.keys(errors).forEach((k) => delete errors[k]);

    router.post('/login', form, {
        preserveScroll: true,
        onSuccess: () => {
            close();
            loading.value = false;
        },
        onError: (e) => {
            Object.assign(errors, e);
            loading.value = false;
        },
    });
};

watch(() => props.show, (isOpen) => {
    if (!isOpen) {
        resetFormState();
    }
});

watch(showEmailForm, () => {
    Object.keys(errors).forEach((key) => delete errors[key]);
});
</script>

<template>
    <TransitionRoot appear :show="show" as="template">
        <Dialog as="div" class="relative z-50" @close="close">
            <TransitionChild
                as="template"
                enter="duration-200 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-150 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <TransitionChild
                        as="template"
                        enter="duration-200 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-150 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                            <!-- Header -->
                            <div class="relative px-6 pt-6 pb-4 border-b border-gray-200">
                                <DialogTitle class="text-xl font-bold text-gray-900 text-center">
                                    Giriş Yapın
                                </DialogTitle>
                                <button
                                    type="button"
                                    @click="close"
                                    class="absolute right-4 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Kapat"
                                >
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <!-- Content -->
                            <div class="px-6 py-6">
                                <!-- Form-level error banner -->
                                <div
                                    v-if="formError && !showEmailForm"
                                    role="alert"
                                    class="mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
                                >
                                    {{ formError }}
                                </div>

                                <!-- Social Login Buttons -->
                                <div class="space-y-3">
                                    <button
                                        v-if="page.props.authProviders?.google"
                                        type="button"
                                        @click="loginWithGoogle"
                                        :disabled="googleLoading"
                                        class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <template v-if="googleLoading">
                                            <svg class="animate-spin h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Yönlendiriliyor...
                                        </template>
                                        <template v-else>
                                            <svg class="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Google ile giriş yapın
                                        </template>
                                    </button>

                                    <button
                                        v-if="page.props.authProviders?.facebook"
                                        type="button"
                                        @click="loginWithFacebook"
                                        :disabled="facebookLoading"
                                        class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <template v-if="facebookLoading">
                                            <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Yönlendiriliyor...
                                        </template>
                                        <template v-else>
                                            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.22.19 2.22.19v2.45h-1.25c-1.23 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
                                            </svg>
                                            Facebook ile giriş yapın
                                        </template>
                                    </button>
                                </div>

                                <!-- Divider -->
                                <div class="relative my-5">
                                    <div class="absolute inset-0 flex items-center">
                                        <div class="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div class="relative flex justify-center text-sm">
                                        <span class="px-2 bg-white text-gray-500">veya</span>
                                    </div>
                                </div>

                                <!-- Email Login -->
                                <div v-if="!showEmailForm">
                                    <button
                                        type="button"
                                        @click="showEmailForm = true"
                                        class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        E-Posta ile giriş yapın
                                    </button>
                                </div>

                                <!-- Email Form -->
                                <form v-else @submit.prevent="submitLogin" class="space-y-4" novalidate>
                                    <div
                                        v-if="formError"
                                        role="alert"
                                        class="px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
                                    >
                                        {{ formError }}
                                    </div>

                                    <div>
                                        <label for="login-email" class="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
                                        <input
                                            id="login-email"
                                            v-model="form.email"
                                            type="email"
                                            required
                                            autocomplete="email"
                                            placeholder="ornek@email.com"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            :class="{ 'border-red-500': errors.email }"
                                            :aria-invalid="!!errors.email"
                                            :aria-describedby="errors.email ? 'login-email-error' : undefined"
                                        />
                                        <p v-if="errors.email" id="login-email-error" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                                    </div>

                                    <div>
                                        <label for="login-password" class="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                                        <input
                                            id="login-password"
                                            v-model="form.password"
                                            type="password"
                                            required
                                            autocomplete="current-password"
                                            placeholder="••••••••"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            :class="{ 'border-red-500': errors.password }"
                                            :aria-invalid="!!errors.password"
                                            :aria-describedby="errors.password ? 'login-password-error' : undefined"
                                        />
                                        <p v-if="errors.password" id="login-password-error" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
                                    </div>

                                    <button
                                        type="submit"
                                        :disabled="loading"
                                        class="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
                                    </button>

                                    <button
                                        type="button"
                                        @click="showEmailForm = false"
                                        class="w-full text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        ← Geri dön
                                    </button>
                                </form>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>
