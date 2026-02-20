<script setup>
import { reactive, ref, watch } from 'vue';
import { router } from '@inertiajs/vue3';

const props = defineProps({
    show: Boolean,
});

const emit = defineEmits(['close']);

const showEmailForm = ref(false);
const loading = ref(false);
const errors = reactive({});

const form = reactive({
    email: '',
    password: '',
    remember: false,
});

const resetFormState = () => {
    showEmailForm.value = false;
    loading.value = false;
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
    window.location.href = '/auth/google';
};

const submitLogin = () => {
    loading.value = true;
    Object.keys(errors).forEach(k => delete errors[k]);

    router.post('/login', form, {
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
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div
                v-if="show"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                @click.self="close"
            >
                <div class="w-full max-w-md bg-white rounded-lg shadow-xl mx-4">
                    <!-- Header -->
                    <div class="relative px-6 pt-6 pb-4 border-b border-gray-200">
                        <h2 class="text-xl font-bold text-gray-900 text-center">Giriş Yapın</h2>
                        <button @click="close" class="absolute right-4 top-6 text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="px-6 py-6">
                        <!-- Social Login Buttons -->
                        <div class="space-y-3">
                            <button
                                @click="loginWithGoogle"
                                class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                <svg class="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google ile giriş yapın
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
                        <form v-else @submit.prevent="submitLogin" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
                                <input
                                    v-model="form.email"
                                    type="email"
                                    required
                                    placeholder="ornek@email.com"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    :class="{ 'border-red-500': errors.email }"
                                />
                                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                                <input
                                    v-model="form.password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    :class="{ 'border-red-500': errors.password }"
                                />
                                <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
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
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
