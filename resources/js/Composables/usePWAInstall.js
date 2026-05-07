import { computed, onMounted, onUnmounted, ref } from 'vue';

export function usePWAInstall() {
    const deferredPrompt = ref(null);
    const canInstall = ref(false);
    const isIOS = ref(false);
    const isMobile = ref(false);
    const isStandalone = ref(false);
    const installed = ref(false);

    const detectStandalone = () => {
        if (typeof window === 'undefined') return false;

        return window.matchMedia?.('(display-mode: standalone)').matches
            || window.navigator.standalone === true;
    };

    const detectMobile = () => {
        if (typeof window === 'undefined') return false;

        const ua = window.navigator.userAgent || '';
        if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return true;

        return window.matchMedia?.('(max-width: 768px)').matches ?? false;
    };

    const handleBeforeInstallPrompt = (event) => {
        event.preventDefault();
        deferredPrompt.value = event;
        canInstall.value = true;
    };

    const handleInstalled = () => {
        installed.value = true;
        canInstall.value = false;
        deferredPrompt.value = null;
    };

    onMounted(() => {
        isIOS.value = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
        isMobile.value = detectMobile();
        isStandalone.value = detectStandalone();
        installed.value = isStandalone.value;

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleInstalled);
    });

    onUnmounted(() => {
        if (typeof window === 'undefined') return;

        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleInstalled);
    });

    const install = async () => {
        if (!deferredPrompt.value) return null;

        deferredPrompt.value.prompt();
        const choice = await deferredPrompt.value.userChoice;
        deferredPrompt.value = null;
        canInstall.value = false;

        return choice;
    };

    return {
        canInstall,
        installed: computed(() => installed.value || isStandalone.value),
        isIOS,
        isMobile,
        isStandalone,
        install,
    };
}
