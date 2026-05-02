<script setup>
import { ref, computed, watch } from 'vue';
import { Head, usePage, router } from '@inertiajs/vue3';
import Icon from './AdminIcon.vue';

const props = defineProps({
    title: String,
});

const page = usePage();
const authUser = computed(() => page.props.auth?.user || {});
const flashSuccess = computed(() => page.props.flash?.success);
const flashError = computed(() => page.props.flash?.error);
const isAdmin = computed(() => authUser.value?.role === 'admin');
const isManager = computed(() => ['admin', 'editor'].includes(authUser.value?.role || ''));
const panelName = computed(() => (authUser.value?.role === 'author' ? 'Yazar Paneli' : 'Yönetim Paneli'));
const roleLabel = computed(() => {
    if (isAdmin.value) return 'Admin';
    if (authUser.value?.role === 'editor') return 'Editör';
    return 'Yazar';
});

const showMobileSidebar = ref(false);
const showUserMenu = ref(false);

const logout = () => {
    router.post('/logout');
};

const isMenuActive = (href) => {
    const currentUrl = page.url;

    if (href === '/admin') {
        return currentUrl === '/admin' || currentUrl === '/admin/';
    }

    return currentUrl.startsWith(href);
};

const menuItems = computed(() => {
    const items = [
        { name: 'Genel Bakış', href: '/admin', icon: 'dashboard', roles: ['admin', 'editor', 'author'] },
        { name: 'Yazılar', href: '/admin/posts', icon: 'posts', roles: ['admin', 'editor', 'author'] },
        { name: 'Kategoriler', href: '/admin/categories', icon: 'folder', roles: ['admin', 'editor'] },
        { name: 'Etiketler', href: '/admin/tags', icon: 'tag', roles: ['admin', 'editor'] },
        { name: 'Podcast', href: '/admin/podcasts', icon: 'audio', roles: ['admin', 'editor'] },
        { name: 'Festival', href: '/admin/festival-events', icon: 'film', roles: ['admin', 'editor'] },
        { name: 'Sayfalar', href: '/admin/pages', icon: 'page', roles: ['admin', 'editor'] },
        { name: 'Yorumlar', href: '/admin/comments', icon: 'comments', roles: ['admin', 'editor'] },
    ];

    if (isManager.value) {
        items.push({ name: 'Bülten', href: '/admin/newsletters', icon: 'mail', roles: ['admin', 'editor'] });
    }

    if (isAdmin.value) {
        items.push({ name: 'Kullanıcılar', href: '/admin/users', icon: 'users', roles: ['admin'] });
    }

    return items.filter((item) => item.roles.includes(authUser.value?.role || ''));
});

const toasts = ref([]);
let toastId = 0;

const addToast = (message, type = 'success') => {
    const id = ++toastId;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
        toasts.value = toasts.value.filter((toast) => toast.id !== id);
    }, 3200);
};

watch(flashSuccess, (message) => {
    if (message) addToast(message, 'success');
});

watch(flashError, (message) => {
    if (message) addToast(message, 'error');
});
</script>

<template>
    <Head :title="title ? `${title} - ${panelName}` : panelName" />

    <div class="min-h-screen bg-[var(--bi-paper)] text-[var(--bi-ink)]">
        <div
            v-if="showMobileSidebar"
            class="fixed inset-0 z-40 bg-black/45 lg:hidden"
            @click="showMobileSidebar = false"
        ></div>

        <aside
            :class="[
                'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] transition-transform duration-200 lg:translate-x-0',
                showMobileSidebar ? 'translate-x-0' : '-translate-x-full',
            ]"
        >
            <div class="border-b-2 border-[var(--bi-ink)] px-5 py-5">
                <a href="/admin" class="block">
                    <span class="bi-mono block text-[0.65rem] font-bold uppercase tracking-[0.1em] text-red-700">Ben İzledim</span>
                    <span class="mt-1 block text-2xl font-black leading-none">{{ panelName }}</span>
                </a>
            </div>

            <div class="border-b border-[var(--bi-rule-soft)] px-5 py-4">
                <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                        <p class="truncate text-sm font-bold">{{ authUser?.name }}</p>
                        <p class="truncate text-xs text-[var(--bi-muted)]">{{ authUser?.email }}</p>
                    </div>
                    <span class="border border-[var(--bi-ink)] bg-white px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-red-700 bi-mono">
                        {{ roleLabel }}
                    </span>
                </div>
            </div>

            <nav class="flex-1 space-y-1 overflow-y-auto p-4">
                <a
                    v-for="item in menuItems"
                    :key="item.name"
                    :href="item.href"
                    :class="[
                        'flex items-center gap-3 border px-4 py-3 text-sm font-bold transition',
                        isMenuActive(item.href)
                            ? 'border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]'
                            : 'border-transparent text-[var(--bi-ink)] hover:border-[var(--bi-ink)] hover:bg-white',
                    ]"
                    @click="showMobileSidebar = false"
                >
                    <Icon :name="item.icon" />
                    <span>{{ item.name }}</span>
                </a>
            </nav>

            <div class="border-t-2 border-[var(--bi-ink)] p-4">
                <a
                    href="/"
                    class="mb-2 flex items-center gap-3 border border-transparent px-4 py-3 text-sm font-bold text-[var(--bi-ink)] hover:border-[var(--bi-ink)] hover:bg-white"
                >
                    <Icon name="home" />
                    <span>Siteye Dön</span>
                </a>
                <button
                    @click="logout"
                    class="flex w-full items-center gap-3 border border-transparent px-4 py-3 text-sm font-bold text-[var(--bi-ink)] hover:border-[var(--bi-ink)] hover:bg-white"
                >
                    <Icon name="logout" />
                    <span>Çıkış Yap</span>
                </button>
            </div>
        </aside>

        <div class="min-h-screen lg:pl-72">
            <header class="sticky top-0 z-30 border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)]/95 backdrop-blur">
                <div class="flex h-16 items-center justify-between px-4 lg:px-8">
                    <div class="flex min-w-0 items-center gap-3">
                        <button
                            @click="showMobileSidebar = true"
                            class="border border-[var(--bi-ink)] p-2 lg:hidden"
                            aria-label="Menüyü aç"
                        >
                            <Icon name="menu" />
                        </button>
                        <div class="min-w-0">
                            <p class="bi-mono text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--bi-muted)]">{{ panelName }}</p>
                            <h1 class="truncate text-xl font-black leading-tight text-[var(--bi-ink)]">{{ title }}</h1>
                        </div>
                    </div>

                    <div class="relative">
                        <button
                            @click="showUserMenu = !showUserMenu"
                            class="flex items-center gap-2 border border-transparent px-2 py-2 transition hover:border-[var(--bi-ink)] hover:bg-white"
                        >
                            <img
                                v-if="authUser?.avatar"
                                :src="authUser.avatar"
                                :alt="authUser.name"
                                class="h-8 w-8 rounded-full object-cover"
                            />
                            <div
                                v-else
                                class="grid h-8 w-8 place-items-center rounded-full bg-red-700 text-sm font-black text-white"
                            >
                                {{ authUser?.name?.charAt(0)?.toUpperCase() || '?' }}
                            </div>
                            <span class="hidden max-w-40 truncate text-sm font-bold sm:block">{{ authUser?.name }}</span>
                        </button>

                        <Transition
                            enter-active-class="transition duration-100 ease-out"
                            enter-from-class="scale-95 opacity-0"
                            enter-to-class="scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="scale-100 opacity-100"
                            leave-to-class="scale-95 opacity-0"
                        >
                            <div
                                v-if="showUserMenu"
                                class="absolute right-0 z-50 mt-2 w-56 border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] shadow-[6px_6px_0_var(--bi-ink)]"
                            >
                                <div class="border-b border-[var(--bi-rule-soft)] px-4 py-3">
                                    <p class="truncate text-sm font-bold">{{ authUser?.name }}</p>
                                    <p class="truncate text-xs text-[var(--bi-muted)]">{{ authUser?.email }}</p>
                                </div>
                                <a :href="`/profile/${authUser?.id}`" class="block px-4 py-2 text-sm font-bold hover:bg-white">
                                    Profilim
                                </a>
                                <a href="/" class="block px-4 py-2 text-sm font-bold hover:bg-white">
                                    Siteye Dön
                                </a>
                                <button @click="logout" class="block w-full px-4 py-2 text-left text-sm font-bold hover:bg-white">
                                    Çıkış Yap
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>
            </header>

            <main class="px-4 py-6 lg:px-8 lg:py-8">
                <slot />
            </main>
        </div>
    </div>

    <div class="fixed right-4 top-4 z-50 space-y-2">
        <TransitionGroup
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="translate-x-full opacity-0"
            enter-to-class="translate-x-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-x-0 opacity-100"
            leave-to-class="translate-x-full opacity-0"
        >
            <div
                v-for="toast in toasts"
                :key="toast.id"
                :class="[
                    'min-w-[280px] border-2 bg-[var(--bi-paper)] px-4 py-3 shadow-[5px_5px_0_var(--bi-ink)]',
                    toast.type === 'success' ? 'border-emerald-700 text-emerald-900' : 'border-red-700 text-red-900',
                ]"
            >
                <div class="flex items-center gap-2 text-sm font-bold">
                    <Icon :name="toast.type === 'success' ? 'check' : 'plus'" />
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
