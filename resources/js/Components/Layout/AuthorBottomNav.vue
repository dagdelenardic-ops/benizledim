<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import { useUnreadNotifications } from '../../Composables/useUnreadNotifications';

const page = usePage();
const authUser = computed(() => page.props.auth?.user);

const { unread } = useUnreadNotifications();

const tabs = [
    { name: 'Anasayfa', href: '/yazar', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Akış', href: '/akis', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
];

if (authUser.value) {
    tabs.push({ name: 'Bildirimler', href: '/bildirimler', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', badge: unread.value });
    tabs.push({ name: 'Profil', href: `/profile/${authUser.value.id}`, icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' });
}
</script>

<template>
    <nav class="fixed inset-x-0 bottom-0 z-40 border-t-2 border-[var(--bi-ink)] bg-white lg:hidden" style="padding-bottom: env(safe-area-inset-bottom, 0);">
        <div class="flex items-center justify-around h-16 px-2">
            <template v-for="tab in tabs" :key="tab.href">
                <Link
                    v-if="!tab.disabled"
                    :href="tab.href"
                    :class="[
                        'relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full transition-colors',
                        page.url === tab.href || (tab.href.startsWith('/profile') && page.url.startsWith('/profile'))
                            ? 'text-red-700'
                            : 'text-gray-500 hover:text-gray-800'
                    ]"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
                    </svg>
                    <span class="text-[10px] font-medium">{{ tab.name }}</span>
                    <span v-if="tab.badge > 0" class="absolute -top-0.5 right-1/4 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[8px] font-bold text-white">
                        {{ tab.badge > 9 ? '9+' : tab.badge }}
                    </span>
                </Link>
                <button
                    v-else
                    disabled
                    class="relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full text-gray-300 cursor-not-allowed"
                    :title="'Yakında'"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="tab.icon" />
                    </svg>
                    <span class="text-[10px] font-medium">{{ tab.name }}</span>
                </button>
            </template>

            <!-- FAB + button -->
            <Link
                href="/yazar?action=log"
                class="relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full -mt-5"
            >
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <span class="text-[10px] font-medium text-red-700">Not</span>
            </Link>
        </div>
    </nav>
</template>
