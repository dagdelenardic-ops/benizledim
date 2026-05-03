import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

const cloneDraftData = (value) => JSON.parse(JSON.stringify(value));

export function useLocalFormDraft(payload, { storageKey, debounceMs = 500, isMeaningful } = {}) {
    const draftRestoreAvailable = ref(false);
    const draftSavedAt = ref('');

    let saveTimer = null;

    const getPayload = () => cloneDraftData(payload.value);

    const defaultIsMeaningful = (data) => Object.values(data).some((value) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined && value !== '';
    });

    const hasMeaningfulData = (data) => (isMeaningful ?? defaultIsMeaningful)(data);

    const readDraft = () => {
        if (!storageKey) return null;

        try {
            const raw = localStorage.getItem(storageKey);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    const clearDraft = () => {
        if (!storageKey) return;

        localStorage.removeItem(storageKey);
        draftRestoreAvailable.value = false;
        draftSavedAt.value = '';
    };

    const saveDraftNow = () => {
        if (!storageKey) return;

        const data = getPayload();

        if (!hasMeaningfulData(data)) {
            clearDraft();
            return;
        }

        localStorage.setItem(storageKey, JSON.stringify({
            savedAt: Date.now(),
            data,
        }));
    };

    const restoreDraft = (applyDraft) => {
        const draft = readDraft();

        if (!draft?.data) return;

        applyDraft(cloneDraftData(draft.data));
        draftRestoreAvailable.value = false;
    };

    const currentPayload = computed(() => JSON.stringify(getPayload()));

    watch(payload, () => {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(saveDraftNow, debounceMs);
    }, { deep: true });

    const flushDraft = () => {
        clearTimeout(saveTimer);
        saveDraftNow();
    };

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
            flushDraft();
        }
    };

    onMounted(() => {
        const draft = readDraft();

        if (draft?.data && hasMeaningfulData(draft.data) && JSON.stringify(draft.data) !== currentPayload.value) {
            draftRestoreAvailable.value = true;
            draftSavedAt.value = new Date(draft.savedAt).toLocaleString('tr-TR');
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', flushDraft);
    });

    onUnmounted(() => {
        clearTimeout(saveTimer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', flushDraft);
    });

    return {
        clearDraft,
        draftRestoreAvailable,
        draftSavedAt,
        restoreDraft,
        saveDraftNow: flushDraft,
    };
}