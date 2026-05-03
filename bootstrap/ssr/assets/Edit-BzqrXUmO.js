import { ref, computed, watch, mergeProps, withCtx, unref, openBlock, createBlock, createVNode, createTextVNode, createCommentVNode, toDisplayString, withDirectives, Fragment, renderList, vModelSelect, withModifiers, vModelText, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderStyle } from "vue/server-renderer";
import { usePage, useForm, Link } from "@inertiajs/vue3";
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
const _sfc_main = {
  __name: "Edit",
  __ssrInlineRender: true,
  props: {
    post: {
      type: Object,
      required: true
    },
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
    },
    owners: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const userRole = page.props.auth?.user?.role;
    const isAdmin = userRole === "admin";
    const form = useForm({
      title: props.post.title,
      excerpt: props.post.excerpt || "",
      content: props.post.content,
      cover_image: null,
      cover_image_focus_x: props.post.cover_image_focus_x ?? 50,
      cover_image_focus_y: props.post.cover_image_focus_y ?? 50,
      cover_image_mobile_focus_x: props.post.cover_image_mobile_focus_x ?? props.post.cover_image_focus_x ?? 50,
      cover_image_mobile_focus_y: props.post.cover_image_mobile_focus_y ?? props.post.cover_image_focus_y ?? 50,
      status: props.post.status,
      scheduled_at: props.post.scheduled_at || "",
      reading_time_minutes: props.post.reading_time_minutes || 1,
      user_id: props.post.user_id,
      categories: props.post.categories?.map((c) => c.id) || [],
      tags: props.post.tags?.map((t) => t.id) || [],
      _method: "PUT"
    });
    const coverPreview = ref(props.post.cover_image);
    const action = ref("draft");
    const slugPreviewRef = ref(null);
    const draftKey = computed(() => `benizledim_draft_post_${props.post.id}_content`);
    const formDraftKey = computed(() => `benizledim_draft_post_${props.post.id}_form`);
    const autosaveEndpoint = computed(() => `/admin/posts/${props.post.id}/autosave`);
    const editDraftPayload = computed(() => ({
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
      user_id: form.user_id,
      categories: [...form.categories],
      tags: [...form.tags]
    }));
    const {
      clearDraft: clearFormDraft,
      draftRestoreAvailable,
      draftSavedAt,
      restoreDraft
    } = useLocalFormDraft(editDraftPayload, {
      storageKey: formDraftKey.value,
      isMeaningful: (data) => JSON.stringify(data) !== JSON.stringify({
        title: props.post.title,
        excerpt: props.post.excerpt || "",
        content: props.post.content,
        status: props.post.status,
        cover_image_focus_x: props.post.cover_image_focus_x ?? 50,
        cover_image_focus_y: props.post.cover_image_focus_y ?? 50,
        cover_image_mobile_focus_x: props.post.cover_image_mobile_focus_x ?? props.post.cover_image_focus_x ?? 50,
        cover_image_mobile_focus_y: props.post.cover_image_mobile_focus_y ?? props.post.cover_image_focus_y ?? 50,
        scheduled_at: props.post.scheduled_at || "",
        reading_time_minutes: props.post.reading_time_minutes || 1,
        user_id: props.post.user_id,
        categories: props.post.categories?.map((category) => category.id) || [],
        tags: props.post.tags?.map((tag) => tag.id) || []
      })
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
      form.title = draft.title ?? props.post.title;
      form.excerpt = draft.excerpt ?? "";
      form.content = draft.content ?? props.post.content;
      form.status = draft.status ?? props.post.status;
      form.cover_image_focus_x = draft.cover_image_focus_x ?? props.post.cover_image_focus_x ?? 50;
      form.cover_image_focus_y = draft.cover_image_focus_y ?? props.post.cover_image_focus_y ?? 50;
      form.cover_image_mobile_focus_x = draft.cover_image_mobile_focus_x ?? props.post.cover_image_mobile_focus_x ?? props.post.cover_image_focus_x ?? 50;
      form.cover_image_mobile_focus_y = draft.cover_image_mobile_focus_y ?? props.post.cover_image_mobile_focus_y ?? props.post.cover_image_focus_y ?? 50;
      form.scheduled_at = draft.scheduled_at ?? "";
      form.reading_time_minutes = draft.reading_time_minutes ?? props.post.reading_time_minutes ?? 1;
      form.user_id = draft.user_id ?? props.post.user_id;
      form.categories = Array.isArray(draft.categories) ? draft.categories : [];
      form.tags = Array.isArray(draft.tags) ? draft.tags : [];
    };
    const restoreFormDraft = () => restoreDraft(applyDraft);
    const discardFormDraft = () => {
      clearFormDraft();
      localStorage.removeItem(draftKey.value);
    };
    const coverPositionStyle = (mode = "desktop") => ({
      objectPosition: mode === "mobile" ? `${form.cover_image_mobile_focus_x}% ${form.cover_image_mobile_focus_y}%` : `${form.cover_image_focus_x}% ${form.cover_image_focus_y}%`
    });
    const submit = (publish = false) => {
      action.value = form.scheduled_at ? "schedule" : publish ? "publish" : "draft";
      if (publish) {
        form.status = "published";
        form.scheduled_at = "";
      } else if (!form.scheduled_at) {
        form.status = props.post.status;
      } else {
        form.status = "published";
      }
      form.post(`/admin/posts/${props.post.id}`, {
        onSuccess: () => {
          clearFormDraft();
          localStorage.removeItem(draftKey.value);
        },
        onError: () => {
          if (publish) form.status = props.post.status;
        }
      });
    };
    const requestDelete = () => {
      const confirmText = isAdmin ? `"${props.post.title}" yazısını kalıcı olarak silmek istediğinize emin misiniz?` : `"${props.post.title}" yazısını silmek için admin onayına göndermek istiyor musunuz?`;
      if (!confirm(confirmText)) return;
      form.delete(`/admin/posts/${props.post.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: `Yazı Düzenle` }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mx-auto max-w-5xl space-y-6"${_scopeId}><section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5"${_scopeId}><div class="flex items-center justify-between gap-4"${_scopeId}><div${_scopeId}><span class="bi-kicker"${_scopeId}>Düzenleme</span><h1 class="mt-3 text-3xl font-black text-[var(--bi-ink)]"${_scopeId}>Yazı Düzenle</h1></div>`);
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
            _push2(`</div></section>`);
            if (__props.post.is_deletion_pending) {
              _push2(`<div class="border-2 border-red-700 bg-red-50 p-4"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"${_scopeId}></path></svg><div${_scopeId}><h3 class="text-sm font-medium text-red-800"${_scopeId}>Silme Onayı Bekleniyor</h3><p class="text-sm text-red-700 mt-1"${_scopeId}> Bu yazı silinmek üzere işaretlendi. `);
              if (isAdmin) {
                _push2(`<span${_scopeId}>Siz admin olduğunuz için bu yazıyı kalıcı olarak silebilir veya yayına alabilirsiniz.</span>`);
              } else {
                _push2(`<span${_scopeId}>Admin onayı bekleniyor. Onaylanana kadar yazı yayında görünmeyecek.</span>`);
              }
              _push2(`</p></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.post.status === "pending_review") {
              _push2(`<div class="border-2 border-amber-500 bg-amber-50 p-4"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><svg class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><div${_scopeId}><h3 class="text-sm font-medium text-amber-800"${_scopeId}>İnceleme Bekleniyor</h3><p class="text-sm text-amber-700 mt-1"${_scopeId}> Bu yazı editör onayında. `);
              if (__props.post.pending_review_by?.name) {
                _push2(`<span${_scopeId}>Gönderen: ${ssrInterpolate(__props.post.pending_review_by.name)}.</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</p></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center gap-3"${_scopeId}><span class="text-sm text-gray-500"${_scopeId}>Durum:</span><span class="${ssrRenderClass([
              "px-3 py-1 border-2 text-sm font-bold",
              __props.post.is_deletion_pending ? "border-red-700 bg-red-50 text-red-700" : __props.post.status === "pending_review" ? "border-amber-500 bg-amber-50 text-amber-700" : __props.post.status === "published" ? "border-green-700 bg-green-50 text-green-700" : "border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)]"
            ])}"${_scopeId}>${ssrInterpolate(__props.post.is_deletion_pending ? "Silme Onayı Bekliyor" : __props.post.status === "pending_review" ? "İncelemede" : __props.post.status === "published" ? "Yayında" : "Taslak")}</span>`);
            if (__props.post.scheduled_at) {
              _push2(`<span class="px-3 py-1 border-2 border-purple-500 bg-purple-50 text-purple-700 text-sm font-bold"${_scopeId}> Zamanlı: ${ssrInterpolate(new Date(__props.post.scheduled_at).toLocaleString("tr-TR"))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (isAdmin) {
              _push2(`<div class="border border-[var(--bi-ink)] bg-[var(--bi-paper)] p-3"${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-2"${_scopeId}>Yazı Sahibi</label><select class="w-full max-w-xs border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20" disabled${_scopeId}><!--[-->`);
              ssrRenderList(__props.owners, (owner) => {
                _push2(`<option${ssrRenderAttr("value", owner.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(form).user_id) ? ssrLooseContain(unref(form).user_id, owner.id) : ssrLooseEqual(unref(form).user_id, owner.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(owner.name)}</option>`);
              });
              _push2(`<!--]--></select><p class="mt-1 text-xs text-gray-500"${_scopeId}>Sahip değişikliği liste ekranından yapılır.</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="space-y-6 border-2 border-[var(--bi-ink)] bg-white p-5 md:p-6"${_scopeId}>`);
            if (unref(draftRestoreAvailable)) {
              _push2(`<div class="flex items-center justify-between border-2 border-amber-500 bg-amber-50 px-4 py-3"${_scopeId}><span class="text-sm font-bold text-amber-900"${_scopeId}>Kaydedilmemiş taslak bulundu (${ssrInterpolate(unref(draftSavedAt))})</span><div class="flex gap-2"${_scopeId}><button type="button" class="border border-amber-500 bg-amber-500 px-3 py-1 text-xs font-bold text-white hover:bg-amber-600"${_scopeId}> Devam Et </button><button type="button" class="border border-gray-400 bg-white px-3 py-1 text-xs font-bold text-gray-600 hover:bg-gray-50"${_scopeId}> Yoksay </button></div></div>`);
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
              ref: slugPreviewRef,
              "model-value": __props.post.slug,
              "post-id": __props.post.id
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
              "autosave-key": draftKey.value,
              "autosave-endpoint": autosaveEndpoint.value,
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
            _push2(`<div class="mt-4 space-y-4 border border-[var(--bi-ink)] bg-[var(--bi-paper)] p-4"${_scopeId}><div${_scopeId}><div class="text-sm font-bold text-[var(--bi-ink)]"${_scopeId}>Anasayfa Kırpma ve Odak</div><p class="mt-1 text-xs text-[var(--bi-muted)]"${_scopeId}> Web ve mobil manşet kırpması ayrı kaydedilir. Daha basık hero için odak noktasını buradan ayarla. </p></div><div class="grid gap-4 lg:grid-cols-2"${_scopeId}><div class="space-y-3"${_scopeId}><div class="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId}>Web</div><div class="overflow-hidden border border-[var(--bi-ink)] bg-black"${_scopeId}>`);
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
            } else {
              _push2(`<p class="mt-1 text-xs text-gray-400"${_scopeId}>En az bir kategori seçmelisiniz.</p>`);
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
              _push2(`<p class="mt-1 text-xs text-amber-600"${_scopeId}> Yazı belirtilen tarihte otomatik yayınlanacak. </p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"${_scopeId}><div class="flex flex-col sm:flex-row gap-4"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing || __props.post.is_deletion_pending) ? " disabled" : ""} class="flex items-center justify-center gap-2 border border-[var(--bi-ink)] bg-white px-6 py-3 font-bold text-[var(--bi-ink)] transition-colors hover:bg-[var(--bi-paper)] disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing && action.value === "draft") {
              _push2(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span${_scopeId}>Taslak Olarak Kaydet</span></button><button type="button"${ssrIncludeBooleanAttr(unref(form).processing || __props.post.is_deletion_pending) ? " disabled" : ""} class="flex items-center justify-center gap-2 bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50"${_scopeId}>`);
            if (unref(form).processing && action.value === "publish") {
              _push2(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"${_scopeId}></path></svg>`);
            } else {
              _push2(ssrRenderComponent(_sfc_main$4, { name: "check" }, null, _parent2, _scopeId));
            }
            _push2(`<span${_scopeId}>${ssrInterpolate(__props.publishMode.requiresReview ? "İncelemeye Gönder" : __props.post.status === "published" ? "Güncelle" : "Yayınla")}</span></button></div><button type="button"${ssrIncludeBooleanAttr(unref(form).processing || __props.post.is_deletion_pending) ? " disabled" : ""} class="flex items-center justify-center gap-2 border border-red-300 px-6 py-3 font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(isAdmin ? "Sil" : "Silme Talebi Gönder")}</span></button></div></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "mx-auto max-w-5xl space-y-6" }, [
                createVNode("section", { class: "border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5" }, [
                  createVNode("div", { class: "flex items-center justify-between gap-4" }, [
                    createVNode("div", null, [
                      createVNode("span", { class: "bi-kicker" }, "Düzenleme"),
                      createVNode("h1", { class: "mt-3 text-3xl font-black text-[var(--bi-ink)]" }, "Yazı Düzenle")
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
                __props.post.is_deletion_pending ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "border-2 border-red-700 bg-red-50 p-4"
                }, [
                  createVNode("div", { class: "flex items-start gap-3" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5 text-red-600 mt-0.5 flex-shrink-0",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      })
                    ])),
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-sm font-medium text-red-800" }, "Silme Onayı Bekleniyor"),
                      createVNode("p", { class: "text-sm text-red-700 mt-1" }, [
                        createTextVNode(" Bu yazı silinmek üzere işaretlendi. "),
                        isAdmin ? (openBlock(), createBlock("span", { key: 0 }, "Siz admin olduğunuz için bu yazıyı kalıcı olarak silebilir veya yayına alabilirsiniz.")) : (openBlock(), createBlock("span", { key: 1 }, "Admin onayı bekleniyor. Onaylanana kadar yazı yayında görünmeyecek."))
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true),
                __props.post.status === "pending_review" ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "border-2 border-amber-500 bg-amber-50 p-4"
                }, [
                  createVNode("div", { class: "flex items-start gap-3" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      })
                    ])),
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-sm font-medium text-amber-800" }, "İnceleme Bekleniyor"),
                      createVNode("p", { class: "text-sm text-amber-700 mt-1" }, [
                        createTextVNode(" Bu yazı editör onayında. "),
                        __props.post.pending_review_by?.name ? (openBlock(), createBlock("span", { key: 0 }, "Gönderen: " + toDisplayString(__props.post.pending_review_by.name) + ".", 1)) : createCommentVNode("", true)
                      ])
                    ])
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "flex items-center gap-3" }, [
                  createVNode("span", { class: "text-sm text-gray-500" }, "Durum:"),
                  createVNode("span", {
                    class: [
                      "px-3 py-1 border-2 text-sm font-bold",
                      __props.post.is_deletion_pending ? "border-red-700 bg-red-50 text-red-700" : __props.post.status === "pending_review" ? "border-amber-500 bg-amber-50 text-amber-700" : __props.post.status === "published" ? "border-green-700 bg-green-50 text-green-700" : "border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)]"
                    ]
                  }, toDisplayString(__props.post.is_deletion_pending ? "Silme Onayı Bekliyor" : __props.post.status === "pending_review" ? "İncelemede" : __props.post.status === "published" ? "Yayında" : "Taslak"), 3),
                  __props.post.scheduled_at ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "px-3 py-1 border-2 border-purple-500 bg-purple-50 text-purple-700 text-sm font-bold"
                  }, " Zamanlı: " + toDisplayString(new Date(__props.post.scheduled_at).toLocaleString("tr-TR")), 1)) : createCommentVNode("", true)
                ]),
                isAdmin ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "border border-[var(--bi-ink)] bg-[var(--bi-paper)] p-3"
                }, [
                  createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-2" }, "Yazı Sahibi"),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => unref(form).user_id = $event,
                    class: "w-full max-w-xs border border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20",
                    disabled: ""
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.owners, (owner) => {
                      return openBlock(), createBlock("option", {
                        key: owner.id,
                        value: owner.id
                      }, toDisplayString(owner.name), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, unref(form).user_id]
                  ]),
                  createVNode("p", { class: "mt-1 text-xs text-gray-500" }, "Sahip değişikliği liste ekranından yapılır.")
                ])) : createCommentVNode("", true),
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
                    ref: slugPreviewRef,
                    "model-value": __props.post.slug,
                    "post-id": __props.post.id
                  }, null, 8, ["model-value", "post-id"]),
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
                      "autosave-key": draftKey.value,
                      "autosave-endpoint": autosaveEndpoint.value,
                      "show-restore-banner": false,
                      "onUpdate:readingTime": onReadingTimeUpdate
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "autosave-key", "autosave-endpoint"]),
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
                        createVNode("p", { class: "mt-1 text-xs text-[var(--bi-muted)]" }, " Web ve mobil manşet kırpması ayrı kaydedilir. Daha basık hero için odak noktasını buradan ayarla. ")
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
                    }, toDisplayString(unref(form).errors.categories), 1)) : (openBlock(), createBlock("p", {
                      key: 1,
                      class: "mt-1 text-xs text-gray-400"
                    }, "En az bir kategori seçmelisiniz."))
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
                      }, " Yazı belirtilen tarihte otomatik yayınlanacak. ")) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4" }, [
                      createVNode("div", { class: "flex flex-col sm:flex-row gap-4" }, [
                        createVNode("button", {
                          type: "submit",
                          disabled: unref(form).processing || __props.post.is_deletion_pending,
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
                          createVNode("span", null, "Taslak Olarak Kaydet")
                        ], 8, ["disabled"]),
                        createVNode("button", {
                          type: "button",
                          onClick: ($event) => submit(true),
                          disabled: unref(form).processing || __props.post.is_deletion_pending,
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
                          createVNode("span", null, toDisplayString(__props.publishMode.requiresReview ? "İncelemeye Gönder" : __props.post.status === "published" ? "Güncelle" : "Yayınla"), 1)
                        ], 8, ["onClick", "disabled"])
                      ]),
                      createVNode("button", {
                        type: "button",
                        onClick: requestDelete,
                        disabled: unref(form).processing || __props.post.is_deletion_pending,
                        class: "flex items-center justify-center gap-2 border border-red-300 px-6 py-3 font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      }, [
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
                            d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          })
                        ])),
                        createVNode("span", null, toDisplayString(isAdmin ? "Sil" : "Silme Talebi Gönder"), 1)
                      ], 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Posts/Edit.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
