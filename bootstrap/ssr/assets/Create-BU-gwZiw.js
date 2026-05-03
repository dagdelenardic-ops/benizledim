import { ref, computed, watch, mergeProps, withCtx, unref, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, withModifiers, createCommentVNode, withDirectives, vModelText, Fragment, renderList, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { useForm, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1, a as _sfc_main$4 } from "./AdminLayout-fOISzqII.js";
import { _ as _sfc_main$3 } from "./RichTextEditor-B1ICi6UT.js";
import { u as useLocalFormDraft, _ as _sfc_main$2 } from "./useLocalFormDraft-CADHagWC.js";
import "@tiptap/vue-3";
import "@tiptap/starter-kit";
import "@tiptap/extension-link";
import "@tiptap/extension-placeholder";
import "@tiptap/extension-underline";
import "@tiptap/extension-character-count";
import "@tiptap/extension-typography";
import "@tiptap/extension-text-align";
import "@tiptap/extension-highlight";
import "@tiptap/extension-code-block-lowlight";
import "lowlight";
import "@tiptap/extension-image";
import "@tiptap/pm/state";
import "axios";
import "@tiptap/core";
const draftKey = "benizledim_draft_new_post_content";
const formDraftKey = "benizledim_draft_new_post_form";
const _sfc_main = {
  __name: "Create",
  __ssrInlineRender: true,
  props: {
    categories: {
      type: Array,
      required: true
    },
    tags: {
      type: Array,
      required: true
    },
    publishMode: {
      type: Object,
      default: () => ({ requiresReview: false })
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      title: "",
      excerpt: "",
      content: "",
      cover_image: null,
      cover_image_focus_x: 50,
      cover_image_focus_y: 50,
      cover_image_mobile_focus_x: 50,
      cover_image_mobile_focus_y: 50,
      status: "draft",
      scheduled_at: "",
      reading_time_minutes: 1,
      categories: props.categories[0]?.id ? [props.categories[0].id] : [],
      tags: []
    });
    const coverPreview = ref(null);
    const action = ref("draft");
    const formMessage = ref("");
    const hasCategories = computed(() => props.categories.length > 0);
    const slugPreviewRef = ref(null);
    const createDraftPayload = computed(() => ({
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      status: form.status,
      cover_image_focus_x: form.cover_image_focus_x,
      cover_image_focus_y: form.cover_image_focus_y,
      cover_image_mobile_focus_x: form.cover_image_mobile_focus_x,
      cover_image_mobile_focus_y: form.cover_image_mobile_focus_y,
      scheduled_at: form.scheduled_at,
      reading_time_minutes: form.reading_time_minutes,
      categories: [...form.categories],
      tags: [...form.tags]
    }));
    const {
      clearDraft: clearFormDraft,
      draftRestoreAvailable,
      draftSavedAt,
      restoreDraft
    } = useLocalFormDraft(createDraftPayload, {
      storageKey: formDraftKey,
      isMeaningful: (data) => Boolean(
        data.title || data.excerpt || data.content || data.scheduled_at || data.tags.length
      )
    });
    watch(() => props.categories, (categories) => {
      if (form.categories.length === 0 && categories[0]?.id) {
        form.categories = [categories[0].id];
      }
    });
    watch(() => form.title, (title) => {
      slugPreviewRef.value?.updateFromTitle(title);
    });
    const handleCoverChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        form.cover_image = file;
        coverPreview.value = URL.createObjectURL(file);
      }
    };
    const onReadingTimeUpdate = (mins) => {
      form.reading_time_minutes = mins;
    };
    const applyDraft = (draft) => {
      form.title = draft.title ?? "";
      form.excerpt = draft.excerpt ?? "";
      form.content = draft.content ?? "";
      form.status = draft.status ?? "draft";
      form.cover_image_focus_x = draft.cover_image_focus_x ?? 50;
      form.cover_image_focus_y = draft.cover_image_focus_y ?? 50;
      form.cover_image_mobile_focus_x = draft.cover_image_mobile_focus_x ?? 50;
      form.cover_image_mobile_focus_y = draft.cover_image_mobile_focus_y ?? 50;
      form.scheduled_at = draft.scheduled_at ?? "";
      form.reading_time_minutes = draft.reading_time_minutes ?? 1;
      form.categories = Array.isArray(draft.categories) && draft.categories.length > 0 ? draft.categories : props.categories[0]?.id ? [props.categories[0].id] : [];
      form.tags = Array.isArray(draft.tags) ? draft.tags : [];
    };
    const restoreFormDraft = () => restoreDraft(applyDraft);
    const discardFormDraft = () => {
      clearFormDraft();
      localStorage.removeItem(draftKey);
    };
    const coverPositionStyle = (mode = "desktop") => ({
      objectPosition: mode === "mobile" ? `${form.cover_image_mobile_focus_x}% ${form.cover_image_mobile_focus_y}%` : `${form.cover_image_focus_x}% ${form.cover_image_focus_y}%`
    });
    const submit = (publish = false) => {
      formMessage.value = "";
      if (!hasCategories.value) {
        formMessage.value = "Yazı kaydetmek için önce en az bir kategori oluşturulmalı.";
        return;
      }
      action.value = form.scheduled_at ? "schedule" : publish ? "publish" : "draft";
      if (publish) {
        form.status = "published";
        form.scheduled_at = "";
      } else if (!form.scheduled_at) {
        form.status = "draft";
      } else {
        form.status = "published";
      }
      form.post("/admin/posts", {
        onSuccess: () => {
          clearFormDraft();
          localStorage.removeItem(draftKey);
        },
        onError: () => {
          formMessage.value = "Yazı kaydedilemedi. Lütfen işaretli alanları kontrol edin.";
          if (publish) form.status = "draft";
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Yeni Yazı" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-5xl space-y-6"${_scopeId}><section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5"${_scopeId}><div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><span class="bi-kicker"${_scopeId}>Üretim</span><h1 class="mt-3 text-3xl font-black text-[var(--bi-ink)]"${_scopeId}>Yeni Yazı</h1><p class="mt-2 text-sm text-[var(--bi-muted)]"${_scopeId}> Yazını taslak olarak sakla veya hazır olduğunda ${ssrInterpolate(__props.publishMode.requiresReview ? "incelemeye gönder" : "yayınla")}. </p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/posts",
              class: "flex items-center gap-1 border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm font-bold text-[var(--bi-ink)] hover:bg-[var(--bi-paper)]"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"${_scopeId2}></path></svg> Geri `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M15 19l-7-7 7-7"
                      })
                    ])),
                    createTextVNode(" Geri ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></section><form class="space-y-6 border-2 border-[var(--bi-ink)] bg-white p-5 md:p-6"${_scopeId}>`);
            if (unref(draftRestoreAvailable)) {
              _push2(`<div class="flex items-center justify-between border-2 border-amber-500 bg-amber-50 px-4 py-3"${_scopeId}><span class="text-sm font-bold text-amber-900"${_scopeId}>Kaydedilmemiş taslak bulundu (${ssrInterpolate(unref(draftSavedAt))})</span><div class="flex gap-2"${_scopeId}><button type="button" class="border border-amber-500 bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:bg-amber-600"${_scopeId}> Devam Et </button><button type="button" class="border border-gray-400 bg-white px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-50"${_scopeId}> Yoksay </button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (formMessage.value) {
              _push2(`<div class="border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold text-red-800"${_scopeId}>${ssrInterpolate(formMessage.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> Başlık <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(form).title)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(form).errors.title }, "w-full border border-[var(--bi-ink)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700/20"])}" placeholder="Yazı başlığı..."${_scopeId}>`);
            if (unref(form).errors.title) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.title)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              ref_key: "slugPreviewRef",
              ref: slugPreviewRef
            }, null, _parent2, _scopeId));
            _push2(`<div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> Özet <span class="text-gray-400 text-xs ml-1"${_scopeId}>(opsiyonel)</span></label><textarea rows="3" maxlength="500" class="${ssrRenderClass([{ "border-red-500": unref(form).errors.excerpt }, "w-full resize-none border border-[var(--bi-ink)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700/20"])}" placeholder="Yazının kısa özeti..."${_scopeId}>${ssrInterpolate(unref(form).excerpt)}</textarea><div class="flex justify-between mt-1"${_scopeId}>`);
            if (unref(form).errors.excerpt) {
              _push2(`<p class="text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.excerpt)}</p>`);
            } else {
              _push2(`<p class="text-xs text-gray-400"${_scopeId}>${ssrInterpolate(unref(form).excerpt?.length || 0)}/500 karakter</p>`);
            }
            _push2(`</div></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> İçerik <span class="text-red-500"${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              modelValue: unref(form).content,
              "onUpdate:modelValue": ($event) => unref(form).content = $event,
              "autosave-key": draftKey,
              "show-restore-banner": false,
              "onUpdate:readingTime": onReadingTimeUpdate
            }, null, _parent2, _scopeId));
            if (unref(form).errors.content) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.content)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> Kapak Görseli <span class="text-gray-400 text-xs ml-1"${_scopeId}>(opsiyonel)</span></label><input type="file" accept="image/*" class="${ssrRenderClass([{ "border-red-500": unref(form).errors.cover_image }, "block w-full text-sm text-gray-600 file:mr-4 file:border file:border-red-700 file:bg-red-50 file:px-4 file:py-2 file:font-bold file:text-red-700 hover:file:bg-red-100"])}"${_scopeId}>`);
            if (unref(form).errors.cover_image) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.cover_image)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-4 space-y-4 border border-[var(--bi-ink)] bg-[var(--bi-paper)] p-4"${_scopeId}><div${_scopeId}><div class="text-sm font-bold text-[var(--bi-ink)]"${_scopeId}>Anasayfa Kırpma ve Odak</div><p class="mt-1 text-xs text-[var(--bi-muted)]"${_scopeId}> Hero görseli artık daha basık kırpılıyor. Web ve mobil için ayrı odak noktası belirleyebilirsin. </p></div><div class="grid gap-4 lg:grid-cols-2"${_scopeId}><div class="space-y-3"${_scopeId}><div class="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId}>Web</div><div class="overflow-hidden border border-[var(--bi-ink)] bg-black"${_scopeId}>`);
            if (coverPreview.value) {
              _push2(`<img${ssrRenderAttr("src", coverPreview.value)} class="h-[112px] w-full object-cover opacity-95" style="${ssrRenderStyle(coverPositionStyle("desktop"))}"${_scopeId}>`);
            } else {
              _push2(`<div class="grid h-[112px] place-items-center text-xs font-bold uppercase tracking-[0.08em] text-white/60 bi-mono"${_scopeId}>Önizleme</div>`);
            }
            _push2(`</div><label class="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId}> Yatay: ${ssrInterpolate(unref(form).cover_image_focus_x)}% <input${ssrRenderAttr("value", unref(form).cover_image_focus_x)} type="range" min="0" max="100" class="mt-2 w-full"${_scopeId}></label><label class="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId}> Dikey: ${ssrInterpolate(unref(form).cover_image_focus_y)}% <input${ssrRenderAttr("value", unref(form).cover_image_focus_y)} type="range" min="0" max="100" class="mt-2 w-full"${_scopeId}></label></div><div class="space-y-3"${_scopeId}><div class="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId}>Mobil</div><div class="mx-auto w-[180px] overflow-hidden border border-[var(--bi-ink)] bg-black"${_scopeId}>`);
            if (coverPreview.value) {
              _push2(`<img${ssrRenderAttr("src", coverPreview.value)} class="h-[112px] w-full object-cover opacity-95" style="${ssrRenderStyle(coverPositionStyle("mobile"))}"${_scopeId}>`);
            } else {
              _push2(`<div class="grid h-[112px] place-items-center text-xs font-bold uppercase tracking-[0.08em] text-white/60 bi-mono"${_scopeId}>Önizleme</div>`);
            }
            _push2(`</div><label class="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId}> Yatay: ${ssrInterpolate(unref(form).cover_image_mobile_focus_x)}% <input${ssrRenderAttr("value", unref(form).cover_image_mobile_focus_x)} type="range" min="0" max="100" class="mt-2 w-full"${_scopeId}></label><label class="block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId}> Dikey: ${ssrInterpolate(unref(form).cover_image_mobile_focus_y)}% <input${ssrRenderAttr("value", unref(form).cover_image_mobile_focus_y)} type="range" min="0" max="100" class="mt-2 w-full"${_scopeId}></label></div></div></div></div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> Kategoriler <span class="text-red-500"${_scopeId}>*</span></label><div class="flex flex-wrap gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.categories, (category) => {
              _push2(`<label class="${ssrRenderClass([{
                "border-red-700 bg-red-50": unref(form).categories.includes(category.id),
                "border-[var(--bi-ink)]": !unref(form).categories.includes(category.id),
                "border-red-500 ring-1 ring-red-500": unref(form).errors.categories
              }, "flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"])}"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).categories) ? ssrLooseContain(unref(form).categories, category.id) : unref(form).categories) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", category.id)} class="rounded border-gray-300 text-red-600 focus:ring-red-500"${_scopeId}><span class="text-sm"${_scopeId}>${ssrInterpolate(category.name)}</span></label>`);
            });
            _push2(`<!--]--></div>`);
            if (unref(form).errors.categories) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.categories)}</p>`);
            } else if (hasCategories.value) {
              _push2(`<p class="mt-1 text-xs text-gray-400"${_scopeId}>İlk kategori otomatik seçildi; gerekirse değiştirebilirsiniz.</p>`);
            } else {
              _push2(`<p class="mt-1 text-sm font-bold text-red-700"${_scopeId}>Kategori bulunamadı. Önce Kategoriler sayfasından kategori ekleyin.</p>`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}> Etiketler <span class="text-gray-400 text-xs ml-1"${_scopeId}>(opsiyonel)</span></label><div class="flex flex-wrap gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.tags, (tag) => {
              _push2(`<label class="${ssrRenderClass([{
                "border-red-700 bg-red-50": unref(form).tags.includes(tag.id),
                "border-[var(--bi-ink)]": !unref(form).tags.includes(tag.id)
              }, "flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"])}"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).tags) ? ssrLooseContain(unref(form).tags, tag.id) : unref(form).tags) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", tag.id)} class="rounded border-gray-300 text-red-600 focus:ring-red-500"${_scopeId}><span class="text-sm"${_scopeId}>${ssrInterpolate(tag.name)}</span></label>`);
            });
            _push2(`<!--]--></div>`);
            if (unref(form).errors.tags) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(form).errors.tags)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col gap-4 border-t-2 border-[var(--bi-ink)] pt-5"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}> Zamanlı Yayın <span class="text-gray-400 text-xs ml-1"${_scopeId}>(opsiyonel)</span></label><input${ssrRenderAttr("value", unref(form).scheduled_at)} type="datetime-local" class="w-full max-w-xs border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}>`);
            if (unref(form).scheduled_at) {
              _push2(`<p class="mt-1 text-xs text-amber-600"${_scopeId}> Yazı belirtilen tarihte otomatik yayınlanacak. Şimdi taslak olarak kaydedilir. </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="flex items-center justify-center gap-2 border border-[var(--bi-ink)] bg-white px-6 py-3 font-bold text-[var(--bi-ink)] transition-colors hover:bg-[var(--bi-paper)] disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing && action.value === "draft") {
              _push2(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span${_scopeId}>${ssrInterpolate(unref(form).scheduled_at ? "Zamanla" : "Taslak Kaydet")}</span></button><button type="button"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="flex items-center justify-center gap-2 bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing && action.value === "publish") {
              _push2(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"${_scopeId}></path></svg>`);
            } else {
              _push2(ssrRenderComponent(_sfc_main$4, { name: "check" }, null, _parent2, _scopeId));
            }
            _push2(`<span${_scopeId}>${ssrInterpolate(__props.publishMode.requiresReview ? "İncelemeye Gönder" : "Yayınla")}</span></button></div></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-5xl space-y-6" }, [
                createVNode("section", { class: "border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5" }, [
                  createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                    createVNode("div", null, [
                      createVNode("span", { class: "bi-kicker" }, "Üretim"),
                      createVNode("h1", { class: "mt-3 text-3xl font-black text-[var(--bi-ink)]" }, "Yeni Yazı"),
                      createVNode("p", { class: "mt-2 text-sm text-[var(--bi-muted)]" }, " Yazını taslak olarak sakla veya hazır olduğunda " + toDisplayString(__props.publishMode.requiresReview ? "incelemeye gönder" : "yayınla") + ". ", 1)
                    ]),
                    createVNode(unref(Link), {
                      href: "/admin/posts",
                      class: "flex items-center gap-1 border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm font-bold text-[var(--bi-ink)] hover:bg-[var(--bi-paper)]"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M15 19l-7-7 7-7"
                          })
                        ])),
                        createTextVNode(" Geri ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(($event) => submit(false), ["prevent"]),
                  class: "space-y-6 border-2 border-[var(--bi-ink)] bg-white p-5 md:p-6"
                }, [
                  unref(draftRestoreAvailable) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex items-center justify-between border-2 border-amber-500 bg-amber-50 px-4 py-3"
                  }, [
                    createVNode("span", { class: "text-sm font-bold text-amber-900" }, "Kaydedilmemiş taslak bulundu (" + toDisplayString(unref(draftSavedAt)) + ")", 1),
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode("button", {
                        type: "button",
                        onClick: restoreFormDraft,
                        class: "border border-amber-500 bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:bg-amber-600"
                      }, " Devam Et "),
                      createVNode("button", {
                        type: "button",
                        onClick: discardFormDraft,
                        class: "border border-gray-400 bg-white px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-50"
                      }, " Yoksay ")
                    ])
                  ])) : createCommentVNode("", true),
                  formMessage.value ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "border-2 border-red-700 bg-red-50 px-4 py-3 text-sm font-bold text-red-800"
                  }, toDisplayString(formMessage.value), 1)) : createCommentVNode("", true),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, [
                      createTextVNode(" Başlık "),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).title = $event,
                      type: "text",
                      class: ["w-full border border-[var(--bi-ink)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700/20", { "border-red-500": unref(form).errors.title }],
                      placeholder: "Yazı başlığı..."
                    }, null, 10, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).title]
                    ]),
                    unref(form).errors.title ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-sm text-red-600"
                    }, toDisplayString(unref(form).errors.title), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode(_sfc_main$2, {
                    ref_key: "slugPreviewRef",
                    ref: slugPreviewRef
                  }, null, 512),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, [
                      createTextVNode(" Özet "),
                      createVNode("span", { class: "text-gray-400 text-xs ml-1" }, "(opsiyonel)")
                    ]),
                    withDirectives(createVNode("textarea", {
                      "onUpdate:modelValue": ($event) => unref(form).excerpt = $event,
                      rows: "3",
                      maxlength: "500",
                      class: ["w-full resize-none border border-[var(--bi-ink)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-700/20", { "border-red-500": unref(form).errors.excerpt }],
                      placeholder: "Yazının kısa özeti..."
                    }, null, 10, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).excerpt]
                    ]),
                    createVNode("div", { class: "flex justify-between mt-1" }, [
                      unref(form).errors.excerpt ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-sm text-red-600"
                      }, toDisplayString(unref(form).errors.excerpt), 1)) : (openBlock(), createBlock("p", {
                        key: 1,
                        class: "text-xs text-gray-400"
                      }, toDisplayString(unref(form).excerpt?.length || 0) + "/500 karakter", 1))
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, [
                      createTextVNode(" İçerik "),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    createVNode(_sfc_main$3, {
                      modelValue: unref(form).content,
                      "onUpdate:modelValue": ($event) => unref(form).content = $event,
                      "autosave-key": draftKey,
                      "show-restore-banner": false,
                      "onUpdate:readingTime": onReadingTimeUpdate
                    }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                    unref(form).errors.content ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-sm text-red-600"
                    }, toDisplayString(unref(form).errors.content), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, [
                      createTextVNode(" Kapak Görseli "),
                      createVNode("span", { class: "text-gray-400 text-xs ml-1" }, "(opsiyonel)")
                    ]),
                    createVNode("input", {
                      type: "file",
                      accept: "image/*",
                      onChange: handleCoverChange,
                      class: ["block w-full text-sm text-gray-600 file:mr-4 file:border file:border-red-700 file:bg-red-50 file:px-4 file:py-2 file:font-bold file:text-red-700 hover:file:bg-red-100", { "border-red-500": unref(form).errors.cover_image }]
                    }, null, 34),
                    unref(form).errors.cover_image ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-sm text-red-600"
                    }, toDisplayString(unref(form).errors.cover_image), 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "mt-4 space-y-4 border border-[var(--bi-ink)] bg-[var(--bi-paper)] p-4" }, [
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm font-bold text-[var(--bi-ink)]" }, "Anasayfa Kırpma ve Odak"),
                        createVNode("p", { class: "mt-1 text-xs text-[var(--bi-muted)]" }, " Hero görseli artık daha basık kırpılıyor. Web ve mobil için ayrı odak noktası belirleyebilirsin. ")
                      ]),
                      createVNode("div", { class: "grid gap-4 lg:grid-cols-2" }, [
                        createVNode("div", { class: "space-y-3" }, [
                          createVNode("div", { class: "text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, "Web"),
                          createVNode("div", { class: "overflow-hidden border border-[var(--bi-ink)] bg-black" }, [
                            coverPreview.value ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: coverPreview.value,
                              class: "h-[112px] w-full object-cover opacity-95",
                              style: coverPositionStyle("desktop")
                            }, null, 12, ["src"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "grid h-[112px] place-items-center text-xs font-bold uppercase tracking-[0.08em] text-white/60 bi-mono"
                            }, "Önizleme"))
                          ]),
                          createVNode("label", { class: "block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, [
                            createTextVNode(" Yatay: " + toDisplayString(unref(form).cover_image_focus_x) + "% ", 1),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).cover_image_focus_x = $event,
                              type: "range",
                              min: "0",
                              max: "100",
                              class: "mt-2 w-full"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).cover_image_focus_x]
                            ])
                          ]),
                          createVNode("label", { class: "block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, [
                            createTextVNode(" Dikey: " + toDisplayString(unref(form).cover_image_focus_y) + "% ", 1),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).cover_image_focus_y = $event,
                              type: "range",
                              min: "0",
                              max: "100",
                              class: "mt-2 w-full"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).cover_image_focus_y]
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "space-y-3" }, [
                          createVNode("div", { class: "text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, "Mobil"),
                          createVNode("div", { class: "mx-auto w-[180px] overflow-hidden border border-[var(--bi-ink)] bg-black" }, [
                            coverPreview.value ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: coverPreview.value,
                              class: "h-[112px] w-full object-cover opacity-95",
                              style: coverPositionStyle("mobile")
                            }, null, 12, ["src"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "grid h-[112px] place-items-center text-xs font-bold uppercase tracking-[0.08em] text-white/60 bi-mono"
                            }, "Önizleme"))
                          ]),
                          createVNode("label", { class: "block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, [
                            createTextVNode(" Yatay: " + toDisplayString(unref(form).cover_image_mobile_focus_x) + "% ", 1),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).cover_image_mobile_focus_x = $event,
                              type: "range",
                              min: "0",
                              max: "100",
                              class: "mt-2 w-full"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).cover_image_mobile_focus_x]
                            ])
                          ]),
                          createVNode("label", { class: "block text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, [
                            createTextVNode(" Dikey: " + toDisplayString(unref(form).cover_image_mobile_focus_y) + "% ", 1),
                            withDirectives(createVNode("input", {
                              "onUpdate:modelValue": ($event) => unref(form).cover_image_mobile_focus_y = $event,
                              type: "range",
                              min: "0",
                              max: "100",
                              class: "mt-2 w-full"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, unref(form).cover_image_mobile_focus_y]
                            ])
                          ])
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, [
                      createTextVNode(" Kategoriler "),
                      createVNode("span", { class: "text-red-500" }, "*")
                    ]),
                    createVNode("div", { class: "flex flex-wrap gap-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (category) => {
                        return openBlock(), createBlock("label", {
                          key: category.id,
                          class: ["flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors", {
                            "border-red-700 bg-red-50": unref(form).categories.includes(category.id),
                            "border-[var(--bi-ink)]": !unref(form).categories.includes(category.id),
                            "border-red-500 ring-1 ring-red-500": unref(form).errors.categories
                          }]
                        }, [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).categories = $event,
                            type: "checkbox",
                            value: category.id,
                            class: "rounded border-gray-300 text-red-600 focus:ring-red-500"
                          }, null, 8, ["onUpdate:modelValue", "value"]), [
                            [vModelCheckbox, unref(form).categories]
                          ]),
                          createVNode("span", { class: "text-sm" }, toDisplayString(category.name), 1)
                        ], 2);
                      }), 128))
                    ]),
                    unref(form).errors.categories ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-sm text-red-600"
                    }, toDisplayString(unref(form).errors.categories), 1)) : hasCategories.value ? (openBlock(), createBlock("p", {
                      key: 1,
                      class: "mt-1 text-xs text-gray-400"
                    }, "İlk kategori otomatik seçildi; gerekirse değiştirebilirsiniz.")) : (openBlock(), createBlock("p", {
                      key: 2,
                      class: "mt-1 text-sm font-bold text-red-700"
                    }, "Kategori bulunamadı. Önce Kategoriler sayfasından kategori ekleyin."))
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, [
                      createTextVNode(" Etiketler "),
                      createVNode("span", { class: "text-gray-400 text-xs ml-1" }, "(opsiyonel)")
                    ]),
                    createVNode("div", { class: "flex flex-wrap gap-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.tags, (tag) => {
                        return openBlock(), createBlock("label", {
                          key: tag.id,
                          class: ["flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors", {
                            "border-red-700 bg-red-50": unref(form).tags.includes(tag.id),
                            "border-[var(--bi-ink)]": !unref(form).tags.includes(tag.id)
                          }]
                        }, [
                          withDirectives(createVNode("input", {
                            "onUpdate:modelValue": ($event) => unref(form).tags = $event,
                            type: "checkbox",
                            value: tag.id,
                            class: "rounded border-gray-300 text-red-600 focus:ring-red-500"
                          }, null, 8, ["onUpdate:modelValue", "value"]), [
                            [vModelCheckbox, unref(form).tags]
                          ]),
                          createVNode("span", { class: "text-sm" }, toDisplayString(tag.name), 1)
                        ], 2);
                      }), 128))
                    ]),
                    unref(form).errors.tags ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "mt-1 text-sm text-red-600"
                    }, toDisplayString(unref(form).errors.tags), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "flex flex-col gap-4 border-t-2 border-[var(--bi-ink)] pt-5" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, [
                        createTextVNode(" Zamanlı Yayın "),
                        createVNode("span", { class: "text-gray-400 text-xs ml-1" }, "(opsiyonel)")
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).scheduled_at = $event,
                        type: "datetime-local",
                        class: "w-full max-w-xs border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).scheduled_at]
                      ]),
                      unref(form).scheduled_at ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-xs text-amber-600"
                      }, " Yazı belirtilen tarihte otomatik yayınlanacak. Şimdi taslak olarak kaydedilir. ")) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col items-stretch gap-4 sm:flex-row sm:items-center" }, [
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing,
                        class: "flex items-center justify-center gap-2 border border-[var(--bi-ink)] bg-white px-6 py-3 font-bold text-[var(--bi-ink)] transition-colors hover:bg-[var(--bi-paper)] disabled:opacity-50"
                      }, [
                        unref(form).processing && action.value === "draft" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "animate-spin h-4 w-4",
                          fill: "none",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("circle", {
                            class: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            "stroke-width": "4"
                          }),
                          createVNode("path", {
                            class: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          })
                        ])) : createCommentVNode("", true),
                        createVNode("span", null, toDisplayString(unref(form).scheduled_at ? "Zamanla" : "Taslak Kaydet"), 1)
                      ], 8, ["disabled"]),
                      createVNode("button", {
                        type: "button",
                        onClick: ($event) => submit(true),
                        disabled: unref(form).processing,
                        class: "flex items-center justify-center gap-2 bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
                      }, [
                        unref(form).processing && action.value === "publish" ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "animate-spin h-4 w-4",
                          fill: "none",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("circle", {
                            class: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            "stroke-width": "4"
                          }),
                          createVNode("path", {
                            class: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          })
                        ])) : (openBlock(), createBlock(_sfc_main$4, {
                          key: 1,
                          name: "check"
                        })),
                        createVNode("span", null, toDisplayString(__props.publishMode.requiresReview ? "İncelemeye Gönder" : "Yayınla"), 1)
                      ], 8, ["onClick", "disabled"])
                    ])
                  ])
                ], 40, ["onSubmit"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Posts/Create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
