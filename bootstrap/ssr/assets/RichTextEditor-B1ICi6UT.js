import { ref, watch, onMounted, onUnmounted, mergeProps, useSSRContext, computed, unref } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent, ssrRenderTeleport, ssrRenderAttr } from "vue/server-renderer";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, common } from "lowlight";
import Image from "@tiptap/extension-image";
import { Plugin } from "@tiptap/pm/state";
import axios from "axios";
import { Node } from "@tiptap/core";
function useAutosave(content, { localKey, endpoint, debounceMs = 500, intervalMs = 3e4 }) {
  const lastSavedAt = ref(null);
  const isDirty = ref(false);
  const saveStatus = ref("idle");
  let debounceTimer = null;
  let serverTimer = null;
  const formatTime = (date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);
  };
  const saveToLocal = (val) => {
    if (localKey) {
      try {
        localStorage.setItem(localKey, JSON.stringify({ content: val, savedAt: Date.now() }));
      } catch {
      }
    }
  };
  watch(content, (val) => {
    if (val === "" || val === void 0 || val === null) return;
    isDirty.value = true;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => saveToLocal(val), debounceMs);
  });
  const saveToServer = async () => {
    if (!endpoint || !isDirty.value) return;
    saveStatus.value = "saving";
    try {
      await window.axios.put(endpoint, { content: content.value });
      lastSavedAt.value = /* @__PURE__ */ new Date();
      isDirty.value = false;
      saveStatus.value = "saved";
      setTimeout(() => {
        if (saveStatus.value === "saved") saveStatus.value = "idle";
      }, 3e3);
    } catch {
      saveStatus.value = "error";
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
    formatTime
  };
}
const UPLOAD_URL = "/admin/posts/images";
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axios.post(UPLOAD_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  if (data.error) throw new Error(data.error);
  return data.url;
}
async function uploadRemoteUrl(url) {
  const { data } = await axios.post(UPLOAD_URL, { url });
  if (data.error) throw new Error(data.error);
  return data.url;
}
const UploadImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      alt: {
        default: null,
        parseHTML: (element) => element.getAttribute("alt"),
        renderHTML: (attributes) => {
          if (!attributes.alt) return {};
          return { alt: attributes.alt };
        }
      },
      caption: {
        default: null,
        parseHTML: (element) => element.getAttribute("title"),
        renderHTML: (attributes) => {
          if (!attributes.caption) return {};
          return { title: attributes.caption };
        }
      }
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        view() {
          return {
            update(view) {
            }
          };
        },
        props: {
          handleDrop(view, event, slice, moved) {
            if (moved) return false;
            const files = [...event.dataTransfer?.files ?? []].filter(
              (f) => f.type.startsWith("image/")
            );
            if (!files.length) return false;
            event.preventDefault();
            const coordinates = view.posAtCoords({
              left: event.clientX,
              top: event.clientY
            });
            const pos = coordinates?.pos ?? view.state.selection.anchor;
            files.forEach(async (file) => {
              try {
                const url = await uploadFile(file);
                const alt = window.prompt("Alt metin (isteğe bağlı):", "")?.trim() || null;
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: url, alt });
                const transaction = view.state.tr.insert(pos, node);
                view.dispatch(transaction);
              } catch (err) {
                alert("Görsel yüklenemedi: " + (err?.message || "Bilinmeyen hata"));
              }
            });
            return true;
          },
          handlePaste(view, event) {
            const items = [...event.clipboardData?.items ?? []];
            const imageItem = items.find((i) => i.type.startsWith("image/"));
            if (imageItem) {
              event.preventDefault();
              const file = imageItem.getAsFile();
              uploadFile(file).then((url) => {
                const alt = window.prompt("Alt metin (isteğe bağlı):", "")?.trim() || null;
                const { schema } = view.state;
                const node = schema.nodes.image.create({ src: url, alt });
                view.dispatch(view.state.tr.replaceSelectionWith(node));
              }).catch((err) => {
                alert("Görsel yüklenemedi: " + (err?.message || "Bilinmeyen hata"));
              });
              return true;
            }
            const textItem = items.find((i) => i.type === "text/plain");
            if (textItem) {
              textItem.getAsString(async (text) => {
                const trimmed = text.trim();
                const isImageUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(trimmed);
                if (isImageUrl) {
                  event.preventDefault();
                  try {
                    const url = await uploadRemoteUrl(trimmed);
                    const { schema } = view.state;
                    const node = schema.nodes.image.create({ src: url });
                    view.dispatch(view.state.tr.replaceSelectionWith(node));
                  } catch (err) {
                    alert("Görsel yüklenemedi: " + (err?.message || "Bilinmeyen hata"));
                  }
                }
              });
            }
            return false;
          }
        }
      })
    ];
  }
});
const EmbedExtension = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      service: { default: "youtube" },
      embedUrl: { default: "" },
      originalUrl: { default: "" }
    };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-embed]",
        getAttrs: (element) => {
          const embedUrl = element.getAttribute("data-embed-url") || "";
          const service = element.getAttribute("data-embed-service") || "youtube";
          const originalUrl = element.getAttribute("data-embed-original-url") || "";
          return { service, embedUrl, originalUrl };
        }
      }
    ];
  },
  renderHTML({ node }) {
    const { service, embedUrl, originalUrl } = node.attrs;
    return [
      "div",
      {
        "data-embed": "",
        "data-embed-service": service,
        "data-embed-url": embedUrl,
        "data-embed-original-url": originalUrl,
        style: `position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;margin:1.5rem 0;`
      },
      [
        "iframe",
        {
          src: embedUrl,
          style: "position:absolute;top:0;left:0;width:100%;height:100%;",
          frameborder: "0",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "true"
        }
      ]
    ];
  },
  addCommands() {
    return {
      setEmbed: (attrs) => ({ commands }) => commands.insertContent({ type: this.name, attrs })
    };
  }
});
const _sfc_main$1 = {
  __name: "OutlineSidebar",
  __ssrInlineRender: true,
  props: {
    editor: { type: Object, default: null }
  },
  setup(__props) {
    const props = __props;
    const headings = ref([]);
    ref(null);
    const extractHeadings = () => {
      if (!props.editor) return;
      const doc = props.editor.state.doc;
      const items = [];
      doc.descendants((node, pos) => {
        if (node.type.name === "heading" && [1, 2, 3].includes(node.attrs.level)) {
          items.push({
            id: `h-${pos}`,
            level: node.attrs.level,
            text: node.textContent || "",
            pos
          });
        }
      });
      headings.value = items;
    };
    watch(() => props.editor, (ed) => {
      if (!ed) return;
      ed.on("update", extractHeadings);
      extractHeadings();
    });
    onMounted(() => {
      if (props.editor) {
        props.editor.on("update", extractHeadings);
        extractHeadings();
      }
    });
    onUnmounted(() => {
      if (props.editor) {
        props.editor.off("update", extractHeadings);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (headings.value.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-56 flex-shrink-0 border-l-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-3" }, _attrs))}><h4 class="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">İçerik Yapısı</h4><nav class="space-y-0.5"><!--[-->`);
        ssrRenderList(headings.value, (h) => {
          _push(`<button class="${ssrRenderClass([
            "block w-full text-left text-xs truncate py-0.5 hover:text-red-700 transition-colors",
            h.level === 1 ? "font-bold" : h.level === 2 ? "pl-2 font-medium" : "pl-4 text-[var(--bi-muted)]"
          ])}">${ssrInterpolate(h.text)}</button>`);
        });
        _push(`<!--]--></nav></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Admin/OutlineSidebar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "RichTextEditor",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: String, default: "" },
    autosaveKey: { type: String, default: null },
    autosaveEndpoint: { type: String, default: null },
    showRestoreBanner: { type: Boolean, default: true }
  },
  emits: ["update:modelValue", "update:readingTime"],
  setup(__props, { emit: __emit }) {
    const lowlight = createLowlight(common);
    const props = __props;
    const emit = __emit;
    const previewMode = ref(false);
    const uploadingImage = ref(false);
    ref(null);
    ref(null);
    const draftRestoreAvailable = ref(false);
    const draftSavedAt = ref("");
    const showLinkModal = ref(false);
    const linkUrl = ref("");
    const linkSearchQuery = ref("");
    const linkSearchResults = ref([]);
    const linkSearchLoading = ref(false);
    const editor = useEditor({
      content: props.modelValue,
      extensions: [
        StarterKit.configure({
          link: false,
          underline: false,
          codeBlock: false
        }),
        Link.configure({ openOnClick: false }),
        Placeholder.configure({ placeholder: "Yazınızı buraya yazın..." }),
        Underline,
        CharacterCount.configure({ limit: 5e4 }),
        Typography,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Highlight.configure({ multicolor: false }),
        CodeBlockLowlight.configure({ lowlight }),
        UploadImage,
        EmbedExtension
      ],
      onUpdate: ({ editor: editor2 }) => {
        emit("update:modelValue", editor2.getHTML());
        const words = editor2.storage.characterCount?.words() ?? 0;
        const rt = Math.max(1, Math.ceil(words / 200));
        emit("update:readingTime", rt);
      }
    });
    const getContent = () => {
      if (!editor.value) return "";
      try {
        return editor.value.getHTML();
      } catch {
        return props.modelValue;
      }
    };
    const {
      lastSavedAt,
      saveStatus,
      startInterval,
      stopInterval,
      restoreFromLocal,
      formatTime
    } = useAutosave(
      computed(() => getContent()),
      {
        localKey: props.autosaveKey,
        endpoint: props.autosaveEndpoint,
        debounceMs: 500,
        intervalMs: 3e4
      }
    );
    onMounted(() => {
      startInterval();
      if (props.autosaveKey) {
        const draft = restoreFromLocal();
        if (draft?.content && draft.content !== props.modelValue && draft.content.length > 0) {
          draftRestoreAvailable.value = true;
          draftSavedAt.value = new Date(draft.savedAt).toLocaleString("tr-TR");
        }
      }
    });
    onUnmounted(() => stopInterval());
    watch(() => props.modelValue, (value) => {
      if (editor.value && editor.value.getHTML() !== value) {
        editor.value.commands.setContent(value, false);
      }
    });
    const readingTime = computed(() => {
      const words = editor.value?.storage.characterCount?.words() ?? 0;
      return Math.max(1, Math.ceil(words / 200));
    });
    const isActive = (type, options = {}) => editor.value?.isActive(type, options) ?? false;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "overflow-hidden border-2 border-[var(--bi-ink)] bg-white" }, _attrs))}>`);
      if (props.showRestoreBanner && draftRestoreAvailable.value) {
        _push(`<div class="flex items-center justify-between border-b-2 border-amber-500 bg-amber-50 px-4 py-3"><span class="text-sm font-bold text-amber-900">Kaydedilmemiş taslak bulundu (${ssrInterpolate(draftSavedAt.value)})</span><div class="flex gap-2"><button class="border border-amber-500 bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:bg-amber-600"> Devam Et </button><button class="border border-gray-400 bg-white px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-50"> Yoksay </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-2 border-b border-[var(--bi-ink)] bg-[var(--bi-paper)] px-3 py-1 text-xs">`);
      if (unref(saveStatus) === "saving") {
        _push(`<span class="text-gray-500">⏳ Kaydediliyor...</span>`);
      } else if (unref(saveStatus) === "saved") {
        _push(`<span class="text-green-700">✓ ${ssrInterpolate(unref(formatTime)(unref(lastSavedAt)))} kaydedildi</span>`);
      } else if (unref(saveStatus) === "error") {
        _push(`<span class="text-red-600">⚠ Kayıt hatası — internet bağlantısını kontrol et</span>`);
      } else {
        _push(`<span class="text-gray-400">Otomatik kayıt aktif</span>`);
      }
      _push(`</div><div class="flex flex-wrap items-center gap-1 border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-2"><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("bold") }, "border border-transparent px-3 py-1.5 text-sm font-bold transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Kalın">B</button><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("italic") }, "border border-transparent px-3 py-1.5 text-sm font-bold italic transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="İtalik">I</button><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("underline") }, "border border-transparent px-3 py-1.5 text-sm font-bold underline transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Alt Çizgi">U</button><div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("heading", { level: 1 }) }, "border border-transparent px-3 py-1.5 text-sm font-bold transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Başlık 1">H1</button><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("heading", { level: 2 }) }, "border border-transparent px-3 py-1.5 text-sm font-bold transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Başlık 2">H2</button><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("heading", { level: 3 }) }, "border border-transparent px-3 py-1.5 text-sm font-bold transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Başlık 3">H3</button><div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive({ textAlign: "left" }) }, "border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Sola Hizala"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14"></path></svg></button><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive({ textAlign: "center" }) }, "border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Ortala"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M8 12h8M6 18h12"></path></svg></button><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive({ textAlign: "right" }) }, "border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Sağa Hizala"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M14 12h6M6 18h14"></path></svg></button><div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("bulletList") }, "border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Liste"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("orderedList") }, "border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Numaralı Liste"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h12M7 12h12M7 17h12M3 7h.01M3 12h.01M3 17h.01"></path></svg></button><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("blockquote") }, "border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Alıntı"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg></button><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("codeBlock") }, "border border-transparent px-3 py-1.5 text-sm font-mono transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Kod Bloğu">&lt;/&gt;</button><div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("link") }, "border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="Link"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg></button><button type="button"${ssrIncludeBooleanAttr(uploadingImage.value) ? " disabled" : ""} class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white disabled:opacity-50" title="Görsel">`);
      if (uploadingImage.value) {
        _push(`<span>⏳</span>`);
      } else {
        _push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`);
      }
      _push(`</button><button type="button" class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Embed (YouTube/Vimeo)"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button><div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div><button type="button" class="${ssrRenderClass([{ "bg-white border-[var(--bi-ink)]": isActive("highlight") }, "border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white"])}" title="İşaretle"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button><button type="button" class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Yatay Çizgi"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg></button><div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div><button type="button" class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="Geri Al"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg></button><button type="button" class="border border-transparent px-3 py-1.5 text-sm transition-colors hover:border-[var(--bi-ink)] hover:bg-white" title="İleri Al"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"></path></svg></button><div class="mx-1 h-6 w-px bg-[var(--bi-rule-soft)]"></div><button type="button" class="${ssrRenderClass([{ "bg-[var(--bi-ink)] text-white": previewMode.value }, "border border-[var(--bi-ink)] px-3 py-1.5 text-xs font-bold transition-colors hover:bg-[var(--bi-ink)] hover:text-white"])}" title="Önizleme">${ssrInterpolate(previewMode.value ? "Düzenle" : "Önizle")}</button></div><div class="flex"><div class="flex-1 min-w-0">`);
      if (!previewMode.value) {
        _push(ssrRenderComponent(unref(EditorContent), {
          editor: unref(editor),
          class: "prose prose-lg max-w-none p-4 min-h-[300px] focus:outline-none"
        }, null, _parent));
      } else {
        _push(`<div class="prose prose-lg max-w-none p-4 min-h-[300px]">${(unref(editor)?.getHTML() || "") ?? ""}</div>`);
      }
      _push(`<div class="flex justify-between gap-4 border-t border-[var(--bi-ink)] px-3 py-1 text-xs text-gray-500"><span>${ssrInterpolate(unref(editor)?.storage.characterCount?.words() ?? 0)} kelime · ${ssrInterpolate(unref(editor)?.storage.characterCount?.characters() ?? 0)} karakter</span><span>~${ssrInterpolate(readingTime.value)} dk okuma</span></div></div>`);
      if (!previewMode.value) {
        _push(ssrRenderComponent(_sfc_main$1, { editor: unref(editor) }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><input type="file" accept="image/jpeg,image/png,image/gif,image/webp" class="hidden">`);
      ssrRenderTeleport(_push, (_push2) => {
        if (showLinkModal.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"><div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 border-2 border-[var(--bi-ink)]"><h3 class="text-lg font-bold mb-4">Link Ekle</h3><div class="space-y-3"><div><label class="block text-sm font-medium text-gray-700 mb-1">URL</label><input${ssrRenderAttr("value", linkUrl.value)} type="text" placeholder="https://veya /yazi/slug" class="w-full border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"></div><div><label class="block text-sm font-medium text-gray-700 mb-1">Yazılarda Ara</label><input${ssrRenderAttr("value", linkSearchQuery.value)} type="text" placeholder="Yazı adı yazın..." class="w-full border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20">`);
          if (linkSearchLoading.value) {
            _push2(`<div class="text-xs text-gray-400 mt-1">Aranıyor...</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (linkSearchResults.value.length) {
            _push2(`<div class="mt-1 border border-[var(--bi-ink)] max-h-40 overflow-y-auto bg-white"><!--[-->`);
            ssrRenderList(linkSearchResults.value, (post) => {
              _push2(`<button class="block w-full text-left px-3 py-2 text-sm hover:bg-[var(--bi-paper)] border-b border-gray-100 last:border-0"><span class="font-medium">${ssrInterpolate(post.title)}</span><span class="text-gray-400 ml-2">/yazi/${ssrInterpolate(post.slug)}</span></button>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div><div class="flex justify-end gap-2 mt-4"><button class="border border-[var(--bi-ink)] px-4 py-2 text-sm font-bold hover:bg-[var(--bi-paper)]">İptal</button><button class="bg-red-700 text-white px-4 py-2 text-sm font-bold hover:bg-red-800">Ekle</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Admin/RichTextEditor.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
