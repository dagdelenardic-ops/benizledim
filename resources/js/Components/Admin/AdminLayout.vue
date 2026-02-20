<script setup>
import { ref, computed, watch } from 'vue';
import { Head, Link, usePage, router } from '@inertiajs/vue3';

const props = defineProps({
    title: String,
});

const page = usePage();
const authUser = page.props.auth?.user;
const flashSuccess = computed(() => page.props.flash?.success);
const flashError = computed(() => page.props.flash?.error);

const showMobileSidebar = ref(false);
const showUserMenu = ref(false);

const logout = () => {
    router.post('/logout');
};

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Yazılar', href: '/admin/posts', icon: '📝' },
    { name: 'Kategoriler', href: '/admin/categories', icon: '📁' },
    { name: 'Kullanıcılar', href: '/admin/users', icon: '👥' },
];

// Toast notifications
const toasts = ref([]);
let toastId = 0;

const addToast = (message, type = 'success') => {
    const id = ++toastId;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id);
    }, 3000);
};

watch(flashSuccess, (message) => {
    if (message) addToast(message, 'success');
});

watch(flashError, (message) => {
    if (message) addToast(message, 'error');
});
</script>

<template>
    <Head :title="title ? `${title} - Admin Panel` : 'Admin Panel'" />

    <div class="min-h-screen bg-gray-100 flex">
        <!-- Mobile Sidebar Overlay -->
        <div
            v-if="showMobileSidebar"
            class="fixed inset-0 bg-black/50 z-40 lg:hidden"
            @click="showMobileSidebar = false"
        ></div>

        <!-- Sidebar -->
        <aside
            :class="[
                'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200',
                showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            ]"
        >
            <!-- Logo -->
            <div class="h-16 flex items-center px-6 border-b border-gray-800">
                <Link href="/admin" class="text-xl font-bold">
                    Admin Panel
                </Link>
            </div>

            <!-- Navigation -->
            <nav class="p-4 space-y-1">
                <Link
                    v-for="item in menuItems"
                    :key="item.name"
                    :href="item.href"
                    :class="[
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        $page.url.startsWith(item.href) && item.href !== '/admin'
                            ? 'bg-red-600/10 text-red-500 border-l-4 border-red-500'
                            : $page.url === '/admin' && item.href === '/admin'
                                ? 'bg-red-600/10 text-red-500 border-l-4 border-red-500'
                                : 'hover:bg-gray-800 text-gray-300'
                    ]"
                    @click="showMobileSidebar = false"
                >
                    <span>{{ item.icon }}</span>
                    <span>{{ item.name }}</span>
                </Link>
            </nav>

            <!-- Bottom Actions -->
            <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                <Link
                    href="/"
                    class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors mb-2"
                >
                    <span>🏠</span>
                    <span>Siteye Dön</span>
                </Link>
                <button
                    @click="logout"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors"
                >
                    <span>🚪</span>
                    <span>Çıkış Yap</span>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col min-w-0">
            <!-- Header -->
            <header class="h-16 bg-white shadow-sm flex items-center justify-between px-4 lg:px-8">
                <div class="flex items-center gap-4">
                    <button
                        @click="showMobileSidebar = true"
                        class="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 class="text-xl font-bold text-gray-900">{{ title }}</h1>
                </div>

                <!-- User Menu -->
                <div class="relative">
                    <button
                        @click="showUserMenu = !showUserMenu"
                        class="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
                    >
                        <img
                            v-if="authUser?.avatar"
                            :src="authUser.avatar"
                            :alt="authUser.name"
                            class="w-8 h-8 rounded-full object-cover"
                        />
                        <div
                            v-else
                            class="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm"
                        >
                            {{ authUser?.name?.charAt(0)?.toUpperCase() }}
                        </div>
                        <span class="hidden sm:block font-medium text-gray-700">{{ authUser?.name }}</span>
                    </button>

                    <!-- Dropdown -->
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
                            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200"
                            v-click-outside="() => showUserMenu = false"
                        >
                            <Link
                                :href="`/profile/${authUser?.id}`"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Profilim
                            </Link>
                            <Link
                                href="/"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Siteye Dön
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
            </header>

            <!-- Page Content -->
            <main class="flex-1 p-4 lg:p-8 overflow-auto">
                <slot />
            </main>
        </div>
    </div>

    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
        <TransitionGroup
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform translate-x-full opacity-0"
            enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform translate-x-full opacity-0"
        >
            <div
                v-for="toast in toasts"
                :key="toast.id"
                :class="[
                    'px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[300px]',
                    toast.type === 'success'
                        ? 'bg-green-50 border-green-500 text-green-800'
                        : 'bg-red-50 border-red-500 text-red-800'
                ]"
            >
                <div class="flex items-center gap-2">
                    <span v-if="toast.type === 'success'">✅</span>
                    <span v-else>❌</span>
                    <span>{{ toast.message }}</span>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

<script>
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
