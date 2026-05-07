<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { usePWAInstall } from '@/Composables/usePWAInstall';

const { canInstall, installed, isIOS, isMobile, install } = usePWAInstall();
const dismissed = ref(true);
const ready = ref(false);
const busy = ref(false);

const storageKey = 'pwa_install_prompt_dismissed_at';
const sevenDays = 7 * 24 * 60 * 60 * 1000;
const visibilityDelayMs = 8000;

let revealTimer = null;

onMounted(() => {
    const dismissedAt = Number(localStorage.getItem(storageKey) || 0);
    dismissed.value = dismissedAt > 0 && Date.now() - dismissedAt < sevenDays;

    revealTimer = setTimeout(() => {
        ready.value = true;
    }, visibilityDelayMs);
});

onBeforeUnmount(() => {
    if (revealTimer) clearTimeout(revealTimer);
});

const shouldShow = computed(() => {
    return ready.value
        && isMobile.value
        && !installed.value
        && !dismissed.value
        && (canInstall.value || isIOS.value);
});

const dismiss = () => {
    localStorage.setItem(storageKey, String(Date.now()));
    dismissed.value = true;
};

const handleInstall = async () => {
    busy.value = true;

    try {
        await install();
        dismiss();
    } finally {
        busy.value = false;
    }
};
</script>

<template>
    <aside
            v-if="shouldShow"
            class="fixed inset-x-3 bottom-20 z-50 border-2 border-[var(--bi-ink)] bg-white p-4 shadow-[6px_6px_0_var(--bi-ink)] md:left-auto md:right-5 md:bottom-5 md:w-96"
            role="dialog"
            aria-labelledby="pwa-install-title"
        >
            <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                    <h2 id="pwa-install-title" class="text-sm font-black text-[var(--bi-ink)]">
                        Uygulama gibi kullan
                    </h2>
                    <p class="mt-1 text-xs leading-5 text-[var(--bi-muted)]">
                        <template v-if="isIOS">
                            Ben/İzledim'i ana ekranına ekle, tek dokunuşla aç ve yeni yazılarda bildirim al.
                        </template>
                        <template v-else>
                            Ben/İzledim'i ana ekranına ekle, tarayıcısız tek dokunuşla aç.
                        </template>
                    </p>
                </div>
                <button type="button" @click="dismiss" class="text-gray-400 hover:text-[var(--bi-ink)]" aria-label="Kapat">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div v-if="isIOS" class="mt-4 space-y-2 border-t border-[var(--bi-ink)]/10 pt-3">
                <div class="flex items-center gap-2 text-xs text-[var(--bi-ink)]">
                    <span class="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-[10px] font-black text-white">1</span>
                    <span>Safari'de alttaki paylaş ikonuna dokun</span>
                    <svg class="h-4 w-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                </div>
                <div class="flex items-center gap-2 text-xs text-[var(--bi-ink)]">
                    <span class="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-[10px] font-black text-white">2</span>
                    <span class="font-semibold">"Ana Ekrana Ekle"</span>
                    <span>seçeneğini seç</span>
                </div>
            </div>

            <button
                v-else
                type="button"
                :disabled="busy || !canInstall"
                @click="handleInstall"
                class="mt-4 w-full bg-red-700 px-4 py-3 text-sm font-black text-white transition hover:bg-red-800 disabled:opacity-50"
            >
                {{ busy ? 'Açılıyor...' : 'Ana Ekrana Ekle' }}
            </button>
        </aside>
</template>
