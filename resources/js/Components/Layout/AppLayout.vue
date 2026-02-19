<script setup>
import { ref } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import LoginModal from '@/Components/Auth/LoginModal.vue';

const props = defineProps({
    title: String,
});

const page = usePage();
const authUser = page.props.auth?.user;

const showLoginModal = ref(false);
const showUserMenu = ref(false);

const openLoginModal = () => {
    showLoginModal.value = true;
};

const closeLoginModal = () => {
    showLoginModal.value = false;
};

const logout = () => {
    router.post('/logout');
};
</script>

<template>
    <Head :title="title" />

    <!-- Navbar -->
    <header>
        <nav class="bg-red-600 text-white">
            <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <a href="/" class="text-xl font-bold tracking-wide">BEN İZLEDİM</a>
                <div class="flex items-center gap-6">
                    <a href="/" class="hover:underline">Ana Sayfa</a>
                    <a href="/podcast" class="hover:underline">Podcast</a>

                    <!-- Guest: Login Button -->
                    <button
                        v-if="!authUser"
                        @click="openLoginModal"
                        class="bg-white text-red-600 px-4 py-1.5 rounded font-medium text-sm hover:bg-gray-100 transition-colors"
                    >
                        Giriş
                    </button>

                    <!-- Authenticated: User Menu -->
                    <div v-else class="relative">
                        <button
                            @click="showUserMenu = !showUserMenu"
                            class="flex items-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            <img
                                v-if="authUser.avatar"
                                :src="authUser.avatar"
                                :alt="authUser.name"
                                class="w-8 h-8 rounded-full object-cover border-2 border-white"
                            />
                            <div
                                v-else
                                class="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-bold text-sm border-2 border-white"
                            >
                                {{ authUser.name.charAt(0).toUpperCase() }}
                            </div>
                            <span class="hidden sm:block font-medium">{{ authUser.name }}</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <!-- Dropdown Menu -->
                        <Transition
                            enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0"
                        >
                            <div
                                v-if="showUserMenu"
                                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                @click.outside="showUserMenu = false"
                            >
                                <a
                                    :href="`/profile/${authUser.id}`"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profilim
                                </a>
                                <button
                                    @click="logout"
                                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Çıkış Yap
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <!-- Content -->
    <main>
        <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-16">
        <div class="max-w-7xl mx-auto px-4 py-10">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-lg font-bold mb-2">BEN İZLEDİM</h3>
                    <p class="text-gray-400 text-sm">
                        Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazılarının yer aldığı
                        bir medya ve eğlence platformudur.
                    </p>
                </div>
                <div>
                    <h3 class="text-lg font-bold mb-2">ÖNCE SİZ OKUYUN</h3>
                    <p class="text-gray-400 text-sm mb-3">
                        Yeni blog yazılarımızdan ve haberlerden ilk siz haberdar olun!
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Login Modal -->
    <LoginModal :show="showLoginModal" @close="closeLoginModal" />
</template>
