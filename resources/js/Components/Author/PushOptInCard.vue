<script setup>
import { ref, onMounted } from 'vue';
import { usePushSubscription } from '../../Composables/usePushSubscription';

const { supported, isSubscribed, subscribe, unsubscribe } = usePushSubscription();
const show = ref(false);
const dismissed = ref(false);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

onMounted(() => {
    const count = parseInt(localStorage.getItem('visit_count') || '0', 10) + 1;
    localStorage.setItem('visit_count', String(count));
    const dismissedAt = localStorage.getItem('push_dismissed_at');
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const canShow = count >= 2 && Notification.permission === 'default' && (!dismissedAt || Date.now() - parseInt(dismissedAt, 10) > sevenDays);
    show.value = canShow;
});

const handleSubscribe = async () => {
    try { await subscribe('BENIZLEDIM_VAPID_PUBLIC_KEY_PLACEHOLDER'); show.value = false; } catch (e) { alert(e.message); }
};

const dismiss = () => { localStorage.setItem('push_dismissed_at', String(Date.now())); show.value = false; };
</script>

<template>
    <div v-if="show && supported" class="bg-white border-2 border-[var(--bi-ink)] p-4">
        <div class="flex items-start justify-between gap-4">
            <div>
                <h3 class="font-bold text-sm">{{ isIOS && !isStandalone ? 'Önce ana ekrana ekleyin' : 'Bildirimleri açın' }}</h3>
                <p class="text-xs text-gray-500 mt-1">
                    {{ isIOS && !isStandalone ? 'Paylaş ▸ Ana Ekrana Ekle yapıp sonra bildirimleri etkinleştirebilirsiniz.' : 'Yeni yazılar ve yorumlardan anında haberdar olun.' }}
                </p>
            </div>
            <div class="flex gap-2 flex-shrink-0">
                <button v-if="!isIOS || isStandalone" @click="handleSubscribe" class="bg-red-700 text-white px-3 py-1.5 text-xs font-bold hover:bg-red-800">Bildirim Al</button>
                <button @click="dismiss" class="border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Şimdi Değil</button>
            </div>
        </div>
    </div>
</template>
