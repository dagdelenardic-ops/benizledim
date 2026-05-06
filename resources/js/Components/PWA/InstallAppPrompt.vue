<script setup>
import { computed, onMounted, ref } from 'vue';
import { usePWAInstall } from '@/Composables/usePWAInstall';

const { canInstall, installed, isIOS, install } = usePWAInstall();
const dismissed = ref(true);
const busy = ref(false);

const storageKey = 'pwa_install_prompt_dismissed_at';
const sevenDays = 7 * 24 * 60 * 60 * 1000;

onMounted(() => {
    const dismissedAt = Number(localStorage.getItem(storageKey) || 0);
    dismissed.value = dismissedAt > 0 && Date.now() - dismissedAt < sevenDays;
});

const shouldShow = computed(() => {
    return !installed.value && !dismissed.value && (canInstall.value || isIOS.value);
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
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-3 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-3 opacity-0"
    >
        <aside
            v-if="shouldShow"
            class="fixed inset-x-3 bottom-20 z-50 border-2 border-[var(--bi-ink)] bg-white p-4 shadow-[6px_6px_0_var(--bi-ink)] md:left-auto md:right-5 md:bottom-5 md:w-96"
        >
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h2 class="text-sm font-black text-[var(--bi-ink)]">Telefona ekle</h2>
                    <p class="mt-1 text-xs leading-5 text-[var(--bi-muted)]">
                        <template v-if="isIOS">
                            Safari'de Paylaş > Ana Ekrana Ekle ile Ben/İzledim'i uygulama gibi aç.
                        </template>
                        <template v-else>
                            Ben/İzledim'i ana ekrana ekle, hızlı notu tek dokunuşla aç.
                        </template>
                    </p>
                </div>
                <button type="button" @click="dismiss" class="text-gray-400 hover:text-[var(--bi-ink)]" aria-label="Kapat">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <button
                v-if="!isIOS"
                type="button"
                :disabled="busy"
                @click="handleInstall"
                class="mt-4 w-full bg-red-700 px-4 py-3 text-sm font-black text-white transition hover:bg-red-800 disabled:opacity-50"
            >
                {{ busy ? 'Açılıyor...' : 'Ana Ekrana Ekle' }}
            </button>
        </aside>
    </Transition>
</template>
