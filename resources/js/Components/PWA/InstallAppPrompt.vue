<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { usePWAInstall } from '@/Composables/usePWAInstall';

const { canInstall, installed, isIOS, isMobile, install } = usePWAInstall();
const dismissed = ref(true);
const ready = ref(false);
const busy = ref(false);

const storageKey = 'pwa_install_prompt_dismissed_at';
const dismissWindowMs = 2 * 24 * 60 * 60 * 1000;
const visibilityDelayMs = 3000;

let revealTimer = null;

onMounted(() => {
    const dismissedAt = Number(localStorage.getItem(storageKey) || 0);
    dismissed.value = dismissedAt > 0 && Date.now() - dismissedAt < dismissWindowMs;

    revealTimer = setTimeout(() => {
        ready.value = true;
    }, visibilityDelayMs);
});

onBeforeUnmount(() => {
    if (revealTimer) clearTimeout(revealTimer);
});

// beforeinstallprompt çoğu Android tarayıcısında geç/hiç gelmez; o durumda
// manuel kurulum talimatı göstermek için canInstall şartını kaldırdık.
const shouldShow = computed(() => {
    return ready.value
        && isMobile.value
        && !installed.value
        && !dismissed.value;
});

// Native prompt yoksa (ve iOS değilse) elle kurulum talimatı göster.
const showManualAndroid = computed(() => !isIOS.value && !canInstall.value);

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
                        📲 Telefonuna uygulama olarak ekle
                    </h2>
                    <p class="mt-1 text-xs leading-5 text-[var(--bi-muted)]">
                        <template v-if="isIOS">
                            Ben/İzledim'i ana ekranına ekle; tarayıcısız tek dokunuşla aç, yeni yazılarda bildirim al.
                        </template>
                        <template v-else>
                            Ben/İzledim'i ana ekranına ekle; tarayıcısız tek dokunuşla aç, bildirim al.
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
                v-else-if="canInstall"
                type="button"
                :disabled="busy"
                @click="handleInstall"
                class="mt-4 w-full bg-red-700 px-4 py-3 text-sm font-black text-white transition hover:bg-red-800 disabled:opacity-50"
            >
                {{ busy ? 'Yükleniyor...' : 'Uygulamayı Yükle' }}
            </button>

            <div v-else class="mt-4 space-y-2 border-t border-[var(--bi-ink)]/10 pt-3">
                <div class="flex items-center gap-2 text-xs text-[var(--bi-ink)]">
                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-700 text-[10px] font-black text-white">1</span>
                    <span>Tarayıcı menüsünü aç</span>
                    <svg class="h-4 w-4 text-red-700" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
                    </svg>
                    <span>(sağ üst)</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-[var(--bi-ink)]">
                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-700 text-[10px] font-black text-white">2</span>
                    <span><span class="font-semibold">"Uygulamayı yükle"</span> ya da <span class="font-semibold">"Ana ekrana ekle"</span>ye dokun</span>
                </div>
            </div>
        </aside>
</template>
