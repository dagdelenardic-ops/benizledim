import { ref } from 'vue';
import axios from 'axios';

export function usePushSubscription() {
    const isSubscribed = ref(false);
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;

    const urlBase64ToUint8Array = (b64) => {
        const padding = '='.repeat((4 - b64.length % 4) % 4);
        const base64 = (b64 + padding).replace(/-/g, '+').replace(/_/g, '/');
        const raw = atob(base64);
        return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
    };

    const subscribe = async (vapidPublicKey) => {
        if (!supported) throw new Error('Push desteklenmiyor');
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') throw new Error('İzin verilmedi');
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) });
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

    return { supported, isSubscribed, subscribe, unsubscribe };
}
