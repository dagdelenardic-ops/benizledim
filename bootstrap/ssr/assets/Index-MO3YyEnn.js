import { mergeProps, withCtx, unref, createVNode, withModifiers, toDisplayString, withDirectives, vModelText, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-CgPpPth9.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    settings: {
      type: Object,
      required: true
    },
    status: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({
      gemini_api_key: "",
      gemini_text_model: props.settings.gemini_text_model || "gemini-2.5-flash",
      google_client_id: "",
      google_client_secret: "",
      google_redirect_uri: props.settings.google_redirect_uri || "",
      facebook_client_id: "",
      facebook_client_secret: "",
      facebook_redirect_uri: props.settings.facebook_redirect_uri || "",
      _method: "PUT"
    });
    const submit = () => {
      form.post("/admin/settings");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Ayarlar" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5"${_scopeId}><span class="bi-kicker"${_scopeId}>Sistem</span><h1 class="mt-3 text-3xl font-black text-[var(--bi-ink)]"${_scopeId}>API ve OAuth Ayarları</h1><p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--bi-muted)]"${_scopeId}> Secret alanları güvenlik için boş gösterilir. Yeni değer girerseniz güncellenir, boş bırakırsanız mevcut değer korunur. </p></section><form class="space-y-6 border-2 border-[var(--bi-ink)] bg-white p-5"${_scopeId}><section class="space-y-4"${_scopeId}><h2 class="text-xl font-black text-[var(--bi-ink)]"${_scopeId}>Gemini</h2><div class="rounded border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3 text-sm font-bold text-[var(--bi-ink)]"${_scopeId}> API Key Durumu: ${ssrInterpolate(__props.status.gemini_api_key ? "Configured" : "Missing")}</div><div${_scopeId}><label class="mb-2 block text-sm font-bold text-[var(--bi-ink)]"${_scopeId}>GEMINI_API_KEY</label><input${ssrRenderAttr("value", unref(form).gemini_api_key)} type="password" autocomplete="off" placeholder="Yeni key gir (opsiyonel)" class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}></div><div${_scopeId}><label class="mb-2 block text-sm font-bold text-[var(--bi-ink)]"${_scopeId}>GEMINI_TEXT_MODEL</label><input${ssrRenderAttr("value", unref(form).gemini_text_model)} type="text" class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}>`);
            if (unref(form).errors.gemini_text_model) {
              _push2(`<p class="mt-1 text-sm text-red-700"${_scopeId}>${ssrInterpolate(unref(form).errors.gemini_text_model)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></section><section class="space-y-4 border-t-2 border-[var(--bi-ink)] pt-5"${_scopeId}><h2 class="text-xl font-black text-[var(--bi-ink)]"${_scopeId}>Google OAuth</h2><div class="rounded border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3 text-sm font-bold text-[var(--bi-ink)]"${_scopeId}> Client ID: ${ssrInterpolate(__props.status.google_client_id ? "Configured" : "Missing")} | Secret: ${ssrInterpolate(__props.status.google_client_secret ? "Configured" : "Missing")}</div><input${ssrRenderAttr("value", unref(form).google_client_id)} type="text" placeholder="GOOGLE_CLIENT_ID (opsiyonel güncelle)" class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}><input${ssrRenderAttr("value", unref(form).google_client_secret)} type="password" autocomplete="off" placeholder="GOOGLE_CLIENT_SECRET (opsiyonel güncelle)" class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}><input${ssrRenderAttr("value", unref(form).google_redirect_uri)} type="url" placeholder="https://benizledim.com/auth/google/callback" class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}>`);
            if (unref(form).errors.google_redirect_uri) {
              _push2(`<p class="text-sm text-red-700"${_scopeId}>${ssrInterpolate(unref(form).errors.google_redirect_uri)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section><section class="space-y-4 border-t-2 border-[var(--bi-ink)] pt-5"${_scopeId}><h2 class="text-xl font-black text-[var(--bi-ink)]"${_scopeId}>Facebook OAuth</h2><div class="rounded border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3 text-sm font-bold text-[var(--bi-ink)]"${_scopeId}> Client ID: ${ssrInterpolate(__props.status.facebook_client_id ? "Configured" : "Missing")} | Secret: ${ssrInterpolate(__props.status.facebook_client_secret ? "Configured" : "Missing")}</div><input${ssrRenderAttr("value", unref(form).facebook_client_id)} type="text" placeholder="FACEBOOK_CLIENT_ID (opsiyonel güncelle)" class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}><input${ssrRenderAttr("value", unref(form).facebook_client_secret)} type="password" autocomplete="off" placeholder="FACEBOOK_CLIENT_SECRET (opsiyonel güncelle)" class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}><input${ssrRenderAttr("value", unref(form).facebook_redirect_uri)} type="url" placeholder="https://benizledim.com/auth/facebook/callback" class="w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}>`);
            if (unref(form).errors.facebook_redirect_uri) {
              _push2(`<p class="text-sm text-red-700"${_scopeId}>${ssrInterpolate(unref(form).errors.facebook_redirect_uri)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section><div class="border-t-2 border-[var(--bi-ink)] pt-5"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="inline-flex items-center justify-center bg-red-700 px-5 py-3 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50"${_scopeId}>${ssrInterpolate(unref(form).processing ? "Kaydediliyor..." : "Ayarları Kaydet")}</button></div></form></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("section", { class: "border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5" }, [
                  createVNode("span", { class: "bi-kicker" }, "Sistem"),
                  createVNode("h1", { class: "mt-3 text-3xl font-black text-[var(--bi-ink)]" }, "API ve OAuth Ayarları"),
                  createVNode("p", { class: "mt-2 max-w-2xl text-sm leading-6 text-[var(--bi-muted)]" }, " Secret alanları güvenlik için boş gösterilir. Yeni değer girerseniz güncellenir, boş bırakırsanız mevcut değer korunur. ")
                ]),
                createVNode("form", {
                  onSubmit: withModifiers(submit, ["prevent"]),
                  class: "space-y-6 border-2 border-[var(--bi-ink)] bg-white p-5"
                }, [
                  createVNode("section", { class: "space-y-4" }, [
                    createVNode("h2", { class: "text-xl font-black text-[var(--bi-ink)]" }, "Gemini"),
                    createVNode("div", { class: "rounded border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3 text-sm font-bold text-[var(--bi-ink)]" }, " API Key Durumu: " + toDisplayString(__props.status.gemini_api_key ? "Configured" : "Missing"), 1),
                    createVNode("div", null, [
                      createVNode("label", { class: "mb-2 block text-sm font-bold text-[var(--bi-ink)]" }, "GEMINI_API_KEY"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).gemini_api_key = $event,
                        type: "password",
                        autocomplete: "off",
                        placeholder: "Yeni key gir (opsiyonel)",
                        class: "w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).gemini_api_key]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "mb-2 block text-sm font-bold text-[var(--bi-ink)]" }, "GEMINI_TEXT_MODEL"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).gemini_text_model = $event,
                        type: "text",
                        class: "w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).gemini_text_model]
                      ]),
                      unref(form).errors.gemini_text_model ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-700"
                      }, toDisplayString(unref(form).errors.gemini_text_model), 1)) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("section", { class: "space-y-4 border-t-2 border-[var(--bi-ink)] pt-5" }, [
                    createVNode("h2", { class: "text-xl font-black text-[var(--bi-ink)]" }, "Google OAuth"),
                    createVNode("div", { class: "rounded border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3 text-sm font-bold text-[var(--bi-ink)]" }, " Client ID: " + toDisplayString(__props.status.google_client_id ? "Configured" : "Missing") + " | Secret: " + toDisplayString(__props.status.google_client_secret ? "Configured" : "Missing"), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).google_client_id = $event,
                      type: "text",
                      placeholder: "GOOGLE_CLIENT_ID (opsiyonel güncelle)",
                      class: "w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).google_client_id]
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).google_client_secret = $event,
                      type: "password",
                      autocomplete: "off",
                      placeholder: "GOOGLE_CLIENT_SECRET (opsiyonel güncelle)",
                      class: "w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).google_client_secret]
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).google_redirect_uri = $event,
                      type: "url",
                      placeholder: "https://benizledim.com/auth/google/callback",
                      class: "w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).google_redirect_uri]
                    ]),
                    unref(form).errors.google_redirect_uri ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-red-700"
                    }, toDisplayString(unref(form).errors.google_redirect_uri), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("section", { class: "space-y-4 border-t-2 border-[var(--bi-ink)] pt-5" }, [
                    createVNode("h2", { class: "text-xl font-black text-[var(--bi-ink)]" }, "Facebook OAuth"),
                    createVNode("div", { class: "rounded border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3 text-sm font-bold text-[var(--bi-ink)]" }, " Client ID: " + toDisplayString(__props.status.facebook_client_id ? "Configured" : "Missing") + " | Secret: " + toDisplayString(__props.status.facebook_client_secret ? "Configured" : "Missing"), 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).facebook_client_id = $event,
                      type: "text",
                      placeholder: "FACEBOOK_CLIENT_ID (opsiyonel güncelle)",
                      class: "w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).facebook_client_id]
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).facebook_client_secret = $event,
                      type: "password",
                      autocomplete: "off",
                      placeholder: "FACEBOOK_CLIENT_SECRET (opsiyonel güncelle)",
                      class: "w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).facebook_client_secret]
                    ]),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).facebook_redirect_uri = $event,
                      type: "url",
                      placeholder: "https://benizledim.com/auth/facebook/callback",
                      class: "w-full border border-[var(--bi-ink)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).facebook_redirect_uri]
                    ]),
                    unref(form).errors.facebook_redirect_uri ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-red-700"
                    }, toDisplayString(unref(form).errors.facebook_redirect_uri), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", { class: "border-t-2 border-[var(--bi-ink)] pt-5" }, [
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "inline-flex items-center justify-center bg-red-700 px-5 py-3 text-sm font-bold text-white hover:bg-red-800 disabled:opacity-50"
                    }, toDisplayString(unref(form).processing ? "Kaydediliyor..." : "Ayarları Kaydet"), 9, ["disabled"])
                  ])
                ], 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Settings/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
