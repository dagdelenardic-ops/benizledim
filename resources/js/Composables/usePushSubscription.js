import { ref } from 'vue';
import axios from 'axios';

export function usePushSubscription() {
    const isSubscribed = ref(false);
    const supported = typeof window !== 'undefined'
        && 'serviceWorker' in navigator
        && 'PushManager' in window;

    const urlBase64ToUint8Array = (b64) => {
        const padding = '='.repeat((4 - b64.length % 4) % 4);
        const base64 = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/');
        const raw = atob(base64);
        return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
    };

    const fetchVapidKey = async () => {
        const { data } = await axios.get('/api/push/vapid');
        if (!data?.publicKey) {
            throw new Error('VAPID anahtarı alınamadı');
        }
        return data.publicKey;
    };

    const waitForReady = (timeoutMs = 8000) => Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) => setTimeout(
            () => reject(new Error('Service worker hazır değil — sayfayı yenileyip tekrar dene')),
            timeoutMs,
        )),
    ]);

    const subscribe = async (vapidPublicKey = null) => {
        if (!supported) throw new Error('Push desteklenmiyor');

        const perm = await Notification.requestPermission();
        if (perm !== 'granted') throw new Error('İzin verilmedi');

        const key = vapidPublicKey || await fetchVapidKey();
        const reg = await waitForReady();
        const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(key),
        });

        await axios.post('/api/push/subscribe', sub.toJSON());
        isSubscribed.value = true;
        try { await axios.post('/api/push/test'); } catch {}
    };

    const unsubscribe = async () => {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
            try { await axios.delete('/api/push/subscribe', { data: { endpoint: sub.endpoint } }); } catch {}
            await sub.unsubscribe();
        }
        isSubscribed.value = false;
    };

    const checkSubscription = async () => {
        if (!supported) return false;
        try {
            const reg = await navigator.serviceWorker.ready;
            const sub = await reg.pushManager.getSubscription();
            isSubscribed.value = !!sub;
            return isSubscribed.value;
        } catch {
            return false;
        }
    };

    return { supported, isSubscribed, subscribe, unsubscribe, checkSubscription };
}
