import { ref, watch, mergeProps, useSSRContext, computed, onMounted, onUnmounted } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import axios from "axios";
const _sfc_main = {
  __name: "SlugPreview",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: String, default: "" },
    postId: { type: Number, default: null }
  },
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const slug = ref(props.modelValue || "");
    const isLoading = ref(false);
    const isAvailable = ref(true);
    const errorMsg = ref("");
    const turkishToEnglish = (text) => {
      const map = {
        ç: "c",
        Ç: "c",
        ş: "s",
        Ş: "s",
        ğ: "g",
        Ğ: "g",
        ü: "u",
        Ü: "u",
        ö: "o",
        Ö: "o",
        ı: "i",
        İ: "i",
        I: "i"
      };
      return text.replace(/[çÇşŞğĞüÜöÖıİI]/g, (c) => map[c] || c).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    };
    const generateSlug = (title) => {
      if (!title) return "";
      return turkishToEnglish(title);
    };
    let checkTimer = null;
    const checkAvailability = async (value) => {
      clearTimeout(checkTimer);
      if (!value) {
        isAvailable.value = true;
        errorMsg.value = "";
        return;
      }
      checkTimer = setTimeout(async () => {
        isLoading.value = true;
        try {
          const params = { slug: value };
          if (props.postId) params.exclude = props.postId;
          const { data } = await axios.get("/admin/posts/check-slug", { params });
          isAvailable.value = data.available;
          errorMsg.value = isAvailable.value ? "" : "Bu slug kullanımda, farklı bir slug deneyin.";
        } catch {
          isAvailable.value = true;
        } finally {
          isLoading.value = false;
        }
      }, 500);
    };
    const updateFromTitle = (title) => {
      const generated = generateSlug(title);
      slug.value = generated;
      emit("update:modelValue", slug.value);
      checkAvailability(slug.value);
    };
    watch(() => props.modelValue, (val) => {
      if (val !== slug.value) {
        slug.value = val || "";
      }
    });
    __expose({ updateFromTitle });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-1" }, _attrs))}><label class="block text-sm font-medium text-gray-700"> Slug <span class="text-gray-400 text-xs ml-1">(opsiyonel)</span></label><div class="flex items-center gap-2"><span class="text-sm text-gray-400">/yazi/</span><input${ssrRenderAttr("value", slug.value)} type="text" class="flex-1 border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20" placeholder="yazi-slug-ornegi">`);
      if (isLoading.value) {
        _push(`<span class="text-gray-400 text-xs">⏳</span>`);
      } else if (slug.value && isAvailable.value) {
        _push(`<span class="text-green-600 text-xs">✓</span>`);
      } else if (slug.value && !isAvailable.value) {
        _push(`<span class="text-red-600 text-xs">✗</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (errorMsg.value) {
        _push(`<p class="text-xs text-red-600">${ssrInterpolate(errorMsg.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Admin/SlugPreview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cloneDraftData = (value) => JSON.parse(JSON.stringify(value));
function useLocalFormDraft(payload, { storageKey, debounceMs = 500, isMeaningful } = {}) {
  const draftRestoreAvailable = ref(false);
  const draftSavedAt = ref("");
  let saveTimer = null;
  const getPayload = () => cloneDraftData(payload.value);
  const defaultIsMeaningful = (data) => Object.values(data).some((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== void 0 && value !== "";
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
    draftSavedAt.value = "";
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
      data
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
    if (document.visibilityState === "hidden") {
      flushDraft();
    }
  };
  onMounted(() => {
    const draft = readDraft();
    if (draft?.data && hasMeaningfulData(draft.data) && JSON.stringify(draft.data) !== currentPayload.value) {
      draftRestoreAvailable.value = true;
      draftSavedAt.value = new Date(draft.savedAt).toLocaleString("tr-TR");
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", flushDraft);
  });
  onUnmounted(() => {
    clearTimeout(saveTimer);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("beforeunload", flushDraft);
  });
  return {
    clearDraft,
    draftRestoreAvailable,
    draftSavedAt,
    restoreDraft,
    saveDraftNow: flushDraft
  };
}
export {
  _sfc_main as _,
  useLocalFormDraft as u
};
