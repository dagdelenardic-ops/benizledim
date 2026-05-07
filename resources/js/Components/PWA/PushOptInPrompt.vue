<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { usePushSubscription } from '@/Composables/usePushSubscription';
import { usePWAInstall } from '@/Composables/usePWAInstall';

const { supported, isSubscribed, subscribe, checkSubscription } = usePushSubscription();
const { isIOS, isStandalone } = usePWAInstall();

const dismissed = ref(true);
const ready = ref(false);
const busy = ref(false);
const error = ref('');

const storageKey = 'push_optin_dismissed_at';
const fourteenDays = 14 * 24 * 60 * 60 * 1000;
const visibilityDelayMs = 14000;

let revealTimer = null;

onMounted(async () => {
    const dismissedAt = Number(localStorage.getItem(storageKey) || 0);
    dismissed.value = dismissedAt > 0 && Date.now() - dismissedAt < fourteenDays;

    if (supported) {
        await checkSubscription().catch(() => {});

        // Silent recovery: permission was granted previously but the worker
        // never registered the subscription server-side (old /build/ scope
        // bug). Try once now without nagging the user again.
        if (
            !isSubscribed.value
            && typeof Notification !== 'undefined'
            && Notification.permission === 'granted'
        ) {
            subscribe().catch(() => { /* swallow — best effort */ });
        }
    }

    revealTimer = setTimeout(() => {
        ready.value = true;
    }, visibilityDelayMs);
});

onBeforeUnmount(() => {
    if (revealTimer) clearTimeout(revealTimer);
});

const permission = computed(() => {
    if (typeof Notification === 'undefined') return 'unsupported';
    return Notification.permission;
});

const iOSNeedsInstall = computed(() => isIOS.value && !isStandalone.value);

const shouldShow = computed(() => {
    if (!ready.value || dismissed.value) return false;
    if (!supported) return false;
    if (isSubscribed.value) return false;
    if (permission.value === 'denied') return false;
    // Permission already granted but no subscription yet: a previous attempt
    // failed (e.g. SW not ready). Don't keep nagging — silent retry happens
    // on the next page that has the prompt mounted.
    if (permission.value === 'granted') return false;
    if (iOSNeedsInstall.value) return false;

    return true;
});

const dismiss = () => {
    localStorage.setItem(storageKey, String(Date.now()));
    dismissed.value = true;
};

const handleSubscribe = async () => {
    busy.value = true;
    error.value = '';

    try {
        await subscribe();
        dismiss();
    } catch (e) {
        error.value = e?.message || 'Bildirim açılamadı';
    } finally {
        busy.value = false;
    }
};
</script>

<template>
    <aside
            v-if="shouldShow"
            class="fixed inset-x-3 bottom-36 z-40 border-2 border-[var(--bi-ink)] bg-white p-4 shadow-[6px_6px_0_var(--bi-ink)] md:left-auto md:right-5 md:bottom-24 md:w-96"
            role="dialog"
            aria-labelledby="push-optin-title"
        >
            <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                    <h2 id="push-optin-title" class="text-sm font-black text-[var(--bi-ink)]">
                        Yeni yazılardan haberdar ol
                    </h2>
                    <p class="mt-1 text-xs leading-5 text-[var(--bi-muted)]">
                        Her akşam o gün yayınlanan yazıların özetini tek bir bildirimle al. İstediğinde kapatabilirsin.
                    </p>
                </div>
                <button type="button" @click="dismiss" class="text-gray-400 hover:text-[var(--bi-ink)]" aria-label="Kapat">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <p v-if="error" class="mt-3 text-xs text-red-700">{{ error }}</p>

            <button
                type="button"
                :disabled="busy"
                @click="handleSubscribe"
                class="mt-4 w-full bg-red-700 px-4 py-3 text-sm font-black text-white transition hover:bg-red-800 disabled:opacity-50"
            >
                {{ busy ? 'Açılıyor...' : 'Bildirimleri aç' }}
            </button>
        </aside>
</template>
