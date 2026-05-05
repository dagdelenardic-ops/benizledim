<script setup>
import { ref, onMounted } from 'vue';

const deferredPrompt = ref(null);
const canInstall = ref(false);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

onMounted(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt.value = e;
        canInstall.value = true;
    });
});

const install = async () => {
    if (!deferredPrompt.value) return;
    deferredPrompt.value.prompt();
    await deferredPrompt.value.userChoice;
    deferredPrompt.value = null;
    canInstall.value = false;
};
</script>
