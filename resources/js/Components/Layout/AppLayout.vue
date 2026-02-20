<script setup>
import { computed, ref } from 'vue';
import { Head, usePage, router, Link } from '@inertiajs/vue3';
import LoginModal from '@/Components/Auth/LoginModal.vue';
import SearchBar from '@/Components/UI/SearchBar.vue';

const props = defineProps({
    title: String,
    description: {
        type: String,
        default: 'Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazıları - Ben İzledim',
    },
    ogImage: {
        type: String,
        default: '/images/og-default.jpg',
    },
});

const page = usePage();
const authUser = page.props.auth?.user;
const newsletterMessage = computed(() => page.props.flash?.newsletter_message);

const showLoginModal = ref(false);
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

const openLoginModal = () => {
    showLoginModal.value = true;
};

const closeLoginModal = () => {
    showLoginModal.value = false;
};

const logout = () => {
    router.post('/logout');
};

const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value;
};

const categoryLinks = [
    { name: 'Sinema', slug: 'sinema' },
    { name: 'Dizi', slug: 'dizi' },
    { name: 'Belgesel', slug: 'belgesel' },
    { name: 'Film', slug: 'film' },
];

// Footer Newsletter Form
const form = useForm({ email: '' });

const subscribe = () => {
    form.post('/newsletter', {
        preserveScroll: true,
        onSuccess: () => form.reset(),
    });
};
</script>

<script>
import { useForm } from '@inertiajs/vue3';

export default {
    directives: {
        'click-outside': {
            mounted(el, binding) {
                el._clickOutside = (event) => {
                    if (!(el === event.target || el.contains(event.target))) {
                        binding.value();
                    }
                };
                document.addEventListener('click', el._clickOutside, true);
            },
            unmounted(el) {
                document.removeEventListener('click', el._clickOutside, true);
            },
        },
    },
};
</script>

<template>
    <Head>
        <title>{{ title ? `${title} - Ben İzledim` : 'Ben İzledim - Film, Dizi ve Belgesel Eleştiri Platformu' }}</title>
        <meta name="description" :content="description" />
        <meta property="og:title" :content="title || 'Ben İzledim'" />
        <meta property="og:description" :content="description" />
        <meta property="og:image" :content="ogImage" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
    </Head>

    <!-- Navbar -->
    <header>
        <nav class="bg-red-600 text-white">
            <div class="max-w-7xl mx-auto px-4">
                <!-- Main Nav -->
                <div class="flex items-center justify-between h-16">
                    <!-- Logo -->
                    <Link href="/" class="text-xl font-bold tracking-wide flex-shrink-0">
                        BEN İZLEDİM
                    </Link>

                    <!-- Desktop Navigation -->
                    <div class="hidden lg:flex items-center gap-6">
                        <Link href="/" class="hover:text-red-100 transition-colors font-medium">Ana Sayfa</Link>
                        <Link
                            v-for="cat in categoryLinks"
                            :key="cat.slug"
                            :href="`/yazilar?category=${cat.slug}`"
                            class="hover:text-red-100 transition-colors"
                        >
                            {{ cat.name }}
                        </Link>
                        <Link href="/podcast" class="hover:text-red-100 transition-colors">Podcast</Link>
                        <Link href="/festival" class="hover:text-red-100 transition-colors font-medium">Festival</Link>
                    </div>

                    <!-- Right Side -->
                    <div class="flex items-center gap-4">
                        <!-- Search Bar -->
                        <SearchBar />

                        <!-- Desktop Auth -->
                        <div class="hidden md:flex items-center gap-3">
                            <!-- Guest: Login Button -->
                            <button
                                v-if="!authUser"
                                @click="openLoginModal"
                                class="bg-white text-red-600 px-4 py-2 rounded-full font-medium text-sm hover:bg-red-50 transition-colors"
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
                                        v-click-outside="() => showUserMenu = false"
                                    >
                                                        <Link
                                                :href="`/profile/${authUser.id}`"
                                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profilim
                                            </Link>
                                            <Link
                                                v-if="authUser?.role === 'admin'"
                                                href="/admin"
                                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Admin Panel
                                            </Link>
                                            <div class="border-t border-gray-100 my-1"></div>
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

                        <!-- Mobile Menu Button -->
                        <button
                            @click="toggleMobileMenu"
                            class="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <svg
                                v-if="!showMobileMenu"
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg
                                v-else
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div
                        v-if="showMobileMenu"
                        class="lg:hidden border-t border-white/20 py-4"
                    >
                        <div class="flex flex-col gap-2">
                            <Link
                                href="/"
                                class="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                                @click="showMobileMenu = false"
                            >
                                Ana Sayfa
                            </Link>
                            <Link
                                v-for="cat in categoryLinks"
                                :key="cat.slug"
                                :href="`/yazilar?category=${cat.slug}`"
                                class="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                                @click="showMobileMenu = false"
                            >
                                {{ cat.name }}
                            </Link>
                            <Link
                                href="/podcast"
                                class="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                                @click="showMobileMenu = false"
                            >
                                Podcast
                            </Link>
                            <Link
                                href="/festival"
                                class="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors font-medium"
                                @click="showMobileMenu = false"
                            >
                                Festival
                            </Link>

                            <!-- Mobile Auth -->
                            <div class="border-t border-white/20 mt-2 pt-2 md:hidden">
                                <button
                                    v-if="!authUser"
                                    @click="openLoginModal; showMobileMenu = false"
                                    class="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Giriş Yap
                                </button>
                                <template v-else>
                                    <Link
                                        :href="`/profile/${authUser.id}`"
                                        class="block px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                                        @click="showMobileMenu = false"
                                    >
                                        Profilim
                                    </Link>
                                    <button
                                        @click="logout; showMobileMenu = false"
                                        class="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        Çıkış Yap
                                    </button>
                                </template>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </nav>
    </header>

    <!-- Content -->
    <main>
        <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Brand -->
                <div>
                    <h3 class="text-xl font-bold mb-4">BEN İZLEDİM</h3>
                    <p class="text-gray-400 text-sm leading-relaxed">
                        Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazılarının yer aldığı
                        bir medya ve eğlence platformudur.
                    </p>
                </div>

                <!-- Links -->
                <div>
                    <h4 class="font-semibold mb-4">Kategoriler</h4>
                    <ul class="space-y-2 text-sm">
                        <li>
                            <Link href="/yazilar?category=sinema" class="text-gray-400 hover:text-white transition-colors">
                                Sinema
                            </Link>
                        </li>
                        <li>
                            <Link href="/yazilar?category=dizi" class="text-gray-400 hover:text-white transition-colors">
                                Dizi
                            </Link>
                        </li>
                        <li>
                            <Link href="/yazilar?category=belgesel" class="text-gray-400 hover:text-white transition-colors">
                                Belgesel
                            </Link>
                        </li>
                        <li>
                            <Link href="/yazilar?category=film" class="text-gray-400 hover:text-white transition-colors">
                                Film
                            </Link>
                        </li>
                    </ul>
                </div>

                <!-- Newsletter -->
                <div>
                    <h4 class="font-semibold mb-4">Önce Siz Okuyun</h4>
                    <p class="text-gray-400 text-sm mb-4">
                        Yeni blog yazılarımızdan ve haberlerden ilk siz haberdar olun!
                    </p>
                    
                    <!-- Success Message -->
                    <div v-if="newsletterMessage" class="mb-3">
                        <div class="px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg">
                            {{ newsletterMessage }}
                        </div>
                    </div>
                    
                    <form @submit.prevent="subscribe" class="flex gap-2">
                        <input
                            v-model="form.email"
                            type="email"
                            placeholder="E-posta adresiniz"
                            class="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                            :class="{ 'border-red-500': form.errors.email }"
                        />
                        <button
                            type="submit"
                            :disabled="form.processing"
                            class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            Abone
                        </button>
                    </form>
                    <p v-if="form.errors.email" class="mt-2 text-red-400 text-xs">{{ form.errors.email }}</p>
                </div>
            </div>

            <!-- Copyright -->
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
                © {{ new Date().getFullYear() }} Ben İzledim. Tüm hakları saklıdır.
            </div>
        </div>
    </footer>

    <!-- Login Modal -->
    <LoginModal :show="showLoginModal" @close="closeLoginModal" />
</template>
