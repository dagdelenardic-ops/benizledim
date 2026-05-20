<script setup>
import { computed } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';

const emit = defineEmits(['quick-log', 'login']);
const page = usePage();
const authUser = computed(() => page.props.auth?.user);
const currentUrl = computed(() => page.url || '/');

const isActive = (href) => {
    if (href === '/') return currentUrl.value === '/';
    return currentUrl.value.startsWith(href);
};
</script>

<template>
    <nav class="fixed inset-x-0 bottom-0 z-40 border-t-2 border-[var(--bi-ink)] bg-white lg:hidden" style="padding-bottom: env(safe-area-inset-bottom, 0);">
        <div class="flex items-center justify-around h-16 px-1">
            <Link
                href="/"
                :class="['relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full transition-colors', isActive('/') ? 'text-red-700' : 'text-gray-500']"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span class="text-[10px] font-medium">Ana Sayfa</span>
            </Link>

            <Link
                href="/yazilar"
                :class="['relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full transition-colors', isActive('/yazilar') ? 'text-red-700' : 'text-gray-500']"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span class="text-[10px] font-medium">Keşfet</span>
            </Link>

            <button
                type="button"
                @click="authUser ? emit('quick-log') : emit('login')"
                class="relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full -mt-5"
            >
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg active:bg-red-700 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <span class="text-[10px] font-medium text-red-700">İncele</span>
            </button>

            <Link
                href="/haberler"
                :class="['relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full transition-colors', isActive('/haberler') || isActive('/haber') ? 'text-red-700' : 'text-gray-500']"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span class="text-[10px] font-medium">Haberler</span>
            </Link>

            <template v-if="authUser">
                <Link
                    :href="`/profile/${authUser.id}`"
                    :class="['relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full transition-colors', isActive('/profile') || isActive('/yazar') ? 'text-red-700' : 'text-gray-500']"
                >
                    <img v-if="authUser.avatar" :src="authUser.avatar" class="w-5 h-5 rounded-full object-cover" />
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-[10px] font-medium">Profil</span>
                </Link>
            </template>
            <template v-else>
                <button
                    type="button"
                    @click="emit('login')"
                    class="relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full text-gray-500"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-[10px] font-medium">Giriş</span>
                </button>
            </template>
        </div>
    </nav>
</template>
