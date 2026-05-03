import { ref, watch, onMounted, onUnmounted } from 'vue';

export function useAutosave(content, { localKey, endpoint, debounceMs = 500, intervalMs = 30000 }) {
    const lastSavedAt = ref(null);
    const isDirty = ref(false);
    const saveStatus = ref('idle');

    let debounceTimer = null;
    let serverTimer = null;

    const formatTime = (date) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    };

    const saveToLocal = (val) => {
        if (localKey) {
            try {
                localStorage.setItem(localKey, JSON.stringify({ content: val, savedAt: Date.now() }));
            } catch {}
        }
    };

    watch(content, (val) => {
        if (val === '' || val === undefined || val === null) return;
        isDirty.value = true;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => saveToLocal(val), debounceMs);
    });

    const saveToServer = async () => {
        if (!endpoint || !isDirty.value) return;
        saveStatus.value = 'saving';
        try {
            await window.axios.put(endpoint, { content: content.value });
            lastSavedAt.value = new Date();
            isDirty.value = false;
            saveStatus.value = 'saved';
            setTimeout(() => {
                if (saveStatus.value === 'saved') saveStatus.value = 'idle';
            }, 3000);
        } catch {
            saveStatus.value = 'error';
        }
    };

    const startInterval = () => {
        serverTimer = setInterval(saveToServer, intervalMs);
    };

    const stopInterval = () => clearInterval(serverTimer);

    const restoreFromLocal = () => {
        if (!localKey) return null;
        try {
            const raw = localStorage.getItem(localKey);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch {
            return null;
        }
    };

    const clearLocal = () => {
        if (localKey) localStorage.removeItem(localKey);
    };

    return {
        lastSavedAt,
        saveStatus,
        isDirty,
        saveToServer,
        startInterval,
        stopInterval,
        restoreFromLocal,
        clearLocal,
        formatTime,
    };
}
