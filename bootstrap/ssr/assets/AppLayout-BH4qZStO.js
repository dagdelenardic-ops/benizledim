import { ref, reactive, computed, watch, unref, mergeProps, withCtx, createVNode, createTextVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, withModifiers, withDirectives, vModelText, useSSRContext, onMounted, onUnmounted, onBeforeUnmount, resolveDirective, renderList, resolveDynamicComponent } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderClass, ssrRenderAttrs, ssrRenderList, ssrRenderTeleport, ssrRenderVNode, ssrGetDirectiveProps, ssrRenderSlot } from "vue/server-renderer";
import { usePage, router, Link, useForm, Head } from "@inertiajs/vue3";
import { TransitionRoot, Dialog, TransitionChild, DialogPanel, DialogTitle } from "@headlessui/vue";
import axios from "axios";
const _sfc_main$6 = {
  __name: "LoginModal",
  __ssrInlineRender: true,
  props: {
    show: Boolean
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const showEmailForm = ref(false);
    const loading = ref(false);
    const googleLoading = ref(false);
    const facebookLoading = ref(false);
    const errors = reactive({});
    const page = usePage();
    const form = reactive({
      email: "",
      password: "",
      remember: false
    });
    const formError = computed(() => errors.email || errors.password || errors.failed || null);
    const resetFormState = () => {
      showEmailForm.value = false;
      loading.value = false;
      googleLoading.value = false;
      facebookLoading.value = false;
      form.email = "";
      form.password = "";
      form.remember = false;
      Object.keys(errors).forEach((key) => delete errors[key]);
    };
    const close = () => {
      resetFormState();
      emit("close");
    };
    const loginWithGoogle = () => {
      googleLoading.value = true;
      window.location.href = "/auth/google";
    };
    const loginWithFacebook = () => {
      facebookLoading.value = true;
      window.location.href = "/auth/facebook";
    };
    const submitLogin = () => {
      loading.value = true;
      Object.keys(errors).forEach((k) => delete errors[k]);
      router.post("/login", form, {
        preserveScroll: true,
        onSuccess: () => {
          close();
          loading.value = false;
        },
        onError: (e) => {
          Object.assign(errors, e);
          loading.value = false;
        }
      });
    };
    watch(() => props.show, (isOpen) => {
      if (!isOpen) {
        resetFormState();
      }
    });
    watch(showEmailForm, () => {
      Object.keys(errors).forEach((key) => delete errors[key]);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TransitionRoot), mergeProps({
        appear: "",
        show: __props.show,
        as: "template"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Dialog), {
              as: "div",
              class: "relative z-50",
              onClose: close
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(TransitionChild), {
                    as: "template",
                    enter: "duration-200 ease-out",
                    "enter-from": "opacity-0",
                    "enter-to": "opacity-100",
                    leave: "duration-150 ease-in",
                    "leave-from": "opacity-100",
                    "leave-to": "opacity-0"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true"${_scopeId3}></div>`);
                      } else {
                        return [
                          createVNode("div", {
                            class: "fixed inset-0 bg-black/50 backdrop-blur-sm",
                            "aria-hidden": "true"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="fixed inset-0 overflow-y-auto"${_scopeId2}><div class="flex min-h-full items-center justify-center p-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(TransitionChild), {
                    as: "template",
                    enter: "duration-200 ease-out",
                    "enter-from": "opacity-0 scale-95",
                    "enter-to": "opacity-100 scale-100",
                    leave: "duration-150 ease-in",
                    "leave-from": "opacity-100 scale-100",
                    "leave-to": "opacity-0 scale-95"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(DialogPanel), { class: "w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<div class="relative px-6 pt-6 pb-4 border-b border-gray-200"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(DialogTitle), { class: "text-xl font-bold text-gray-900 text-center" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(` Giriş Yapın `);
                                  } else {
                                    return [
                                      createTextVNode(" Giriş Yapın ")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<button type="button" class="absolute right-4 top-6 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Kapat"${_scopeId4}><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId4}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"${_scopeId4}></path></svg></button></div><div class="px-6 py-6"${_scopeId4}>`);
                              if (formError.value && !showEmailForm.value) {
                                _push5(`<div role="alert" class="mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"${_scopeId4}>${ssrInterpolate(formError.value)}</div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(`<div class="space-y-3"${_scopeId4}>`);
                              if (unref(page).props.authProviders?.google) {
                                _push5(`<button type="button"${ssrIncludeBooleanAttr(googleLoading.value) ? " disabled" : ""} class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId4}>`);
                                if (googleLoading.value) {
                                  _push5(`<!--[--><svg class="animate-spin h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24"${_scopeId4}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId4}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"${_scopeId4}></path></svg> Yönlendiriliyor... <!--]-->`);
                                } else {
                                  _push5(`<!--[--><svg class="w-5 h-5" viewBox="0 0 24 24"${_scopeId4}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"${_scopeId4}></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"${_scopeId4}></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"${_scopeId4}></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"${_scopeId4}></path></svg> Google ile giriş yapın <!--]-->`);
                                }
                                _push5(`</button>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              if (unref(page).props.authProviders?.facebook) {
                                _push5(`<button type="button"${ssrIncludeBooleanAttr(facebookLoading.value) ? " disabled" : ""} class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId4}>`);
                                if (facebookLoading.value) {
                                  _push5(`<!--[--><svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24"${_scopeId4}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId4}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"${_scopeId4}></path></svg> Yönlendiriliyor... <!--]-->`);
                                } else {
                                  _push5(`<!--[--><svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"${_scopeId4}><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.22.19 2.22.19v2.45h-1.25c-1.23 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z"${_scopeId4}></path></svg> Facebook ile giriş yapın <!--]-->`);
                                }
                                _push5(`</button>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(`</div><div class="relative my-5"${_scopeId4}><div class="absolute inset-0 flex items-center"${_scopeId4}><div class="w-full border-t border-gray-300"${_scopeId4}></div></div><div class="relative flex justify-center text-sm"${_scopeId4}><span class="px-2 bg-white text-gray-500"${_scopeId4}>veya</span></div></div>`);
                              if (!showEmailForm.value) {
                                _push5(`<div${_scopeId4}><button type="button" class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"${_scopeId4}><svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId4}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"${_scopeId4}></path></svg> E-Posta ile giriş yapın </button></div>`);
                              } else {
                                _push5(`<form class="space-y-4" novalidate${_scopeId4}>`);
                                if (formError.value) {
                                  _push5(`<div role="alert" class="px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"${_scopeId4}>${ssrInterpolate(formError.value)}</div>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`<div${_scopeId4}><label for="login-email" class="block text-sm font-medium text-gray-700 mb-1"${_scopeId4}>E-Posta</label><input id="login-email"${ssrRenderAttr("value", form.email)} type="email" required autocomplete="email" placeholder="ornek@email.com" class="${ssrRenderClass([{ "border-red-500": errors.email }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"])}"${ssrRenderAttr("aria-invalid", !!errors.email)}${ssrRenderAttr("aria-describedby", errors.email ? "login-email-error" : void 0)}${_scopeId4}>`);
                                if (errors.email) {
                                  _push5(`<p id="login-email-error" class="mt-1 text-sm text-red-600"${_scopeId4}>${ssrInterpolate(errors.email)}</p>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div><div${_scopeId4}><label for="login-password" class="block text-sm font-medium text-gray-700 mb-1"${_scopeId4}>Şifre</label><input id="login-password"${ssrRenderAttr("value", form.password)} type="password" required autocomplete="current-password" placeholder="••••••••" class="${ssrRenderClass([{ "border-red-500": errors.password }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"])}"${ssrRenderAttr("aria-invalid", !!errors.password)}${ssrRenderAttr("aria-describedby", errors.password ? "login-password-error" : void 0)}${_scopeId4}>`);
                                if (errors.password) {
                                  _push5(`<p id="login-password-error" class="mt-1 text-sm text-red-600"${_scopeId4}>${ssrInterpolate(errors.password)}</p>`);
                                } else {
                                  _push5(`<!---->`);
                                }
                                _push5(`</div><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId4}>${ssrInterpolate(loading.value ? "Giriş yapılıyor..." : "Giriş Yap")}</button><button type="button" class="w-full text-sm text-gray-500 hover:text-gray-700"${_scopeId4}> ← Geri dön </button></form>`);
                              }
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode("div", { class: "relative px-6 pt-6 pb-4 border-b border-gray-200" }, [
                                  createVNode(unref(DialogTitle), { class: "text-xl font-bold text-gray-900 text-center" }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Giriş Yapın ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("button", {
                                    type: "button",
                                    onClick: close,
                                    class: "absolute right-4 top-6 text-gray-400 hover:text-gray-600 transition-colors",
                                    "aria-label": "Kapat"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      class: "w-6 h-6",
                                      fill: "none",
                                      stroke: "currentColor",
                                      viewBox: "0 0 24 24"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        "stroke-width": "2",
                                        d: "M6 18L18 6M6 6l12 12"
                                      })
                                    ]))
                                  ])
                                ]),
                                createVNode("div", { class: "px-6 py-6" }, [
                                  formError.value && !showEmailForm.value ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    role: "alert",
                                    class: "mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
                                  }, toDisplayString(formError.value), 1)) : createCommentVNode("", true),
                                  createVNode("div", { class: "space-y-3" }, [
                                    unref(page).props.authProviders?.google ? (openBlock(), createBlock("button", {
                                      key: 0,
                                      type: "button",
                                      onClick: loginWithGoogle,
                                      disabled: googleLoading.value,
                                      class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    }, [
                                      googleLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "animate-spin h-5 w-5 text-red-600",
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
                                        ])),
                                        createTextVNode(" Yönlendiriliyor... ")
                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "w-5 h-5",
                                          viewBox: "0 0 24 24"
                                        }, [
                                          createVNode("path", {
                                            fill: "#4285F4",
                                            d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                          }),
                                          createVNode("path", {
                                            fill: "#34A853",
                                            d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                          }),
                                          createVNode("path", {
                                            fill: "#FBBC05",
                                            d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                          }),
                                          createVNode("path", {
                                            fill: "#EA4335",
                                            d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                          })
                                        ])),
                                        createTextVNode(" Google ile giriş yapın ")
                                      ], 64))
                                    ], 8, ["disabled"])) : createCommentVNode("", true),
                                    unref(page).props.authProviders?.facebook ? (openBlock(), createBlock("button", {
                                      key: 1,
                                      type: "button",
                                      onClick: loginWithFacebook,
                                      disabled: facebookLoading.value,
                                      class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    }, [
                                      facebookLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "animate-spin h-5 w-5 text-blue-600",
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
                                        ])),
                                        createTextVNode(" Yönlendiriliyor... ")
                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "w-5 h-5",
                                          viewBox: "0 0 24 24",
                                          fill: "currentColor"
                                        }, [
                                          createVNode("path", { d: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.22.19 2.22.19v2.45h-1.25c-1.23 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" })
                                        ])),
                                        createTextVNode(" Facebook ile giriş yapın ")
                                      ], 64))
                                    ], 8, ["disabled"])) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", { class: "relative my-5" }, [
                                    createVNode("div", { class: "absolute inset-0 flex items-center" }, [
                                      createVNode("div", { class: "w-full border-t border-gray-300" })
                                    ]),
                                    createVNode("div", { class: "relative flex justify-center text-sm" }, [
                                      createVNode("span", { class: "px-2 bg-white text-gray-500" }, "veya")
                                    ])
                                  ]),
                                  !showEmailForm.value ? (openBlock(), createBlock("div", { key: 1 }, [
                                    createVNode("button", {
                                      type: "button",
                                      onClick: ($event) => showEmailForm.value = true,
                                      class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "w-5 h-5 text-gray-500",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24"
                                      }, [
                                        createVNode("path", {
                                          "stroke-linecap": "round",
                                          "stroke-linejoin": "round",
                                          "stroke-width": "2",
                                          d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        })
                                      ])),
                                      createTextVNode(" E-Posta ile giriş yapın ")
                                    ], 8, ["onClick"])
                                  ])) : (openBlock(), createBlock("form", {
                                    key: 2,
                                    onSubmit: withModifiers(submitLogin, ["prevent"]),
                                    class: "space-y-4",
                                    novalidate: ""
                                  }, [
                                    formError.value ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      role: "alert",
                                      class: "px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
                                    }, toDisplayString(formError.value), 1)) : createCommentVNode("", true),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "login-email",
                                        class: "block text-sm font-medium text-gray-700 mb-1"
                                      }, "E-Posta"),
                                      withDirectives(createVNode("input", {
                                        id: "login-email",
                                        "onUpdate:modelValue": ($event) => form.email = $event,
                                        type: "email",
                                        required: "",
                                        autocomplete: "email",
                                        placeholder: "ornek@email.com",
                                        class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent", { "border-red-500": errors.email }],
                                        "aria-invalid": !!errors.email,
                                        "aria-describedby": errors.email ? "login-email-error" : void 0
                                      }, null, 10, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                                        [vModelText, form.email]
                                      ]),
                                      errors.email ? (openBlock(), createBlock("p", {
                                        key: 0,
                                        id: "login-email-error",
                                        class: "mt-1 text-sm text-red-600"
                                      }, toDisplayString(errors.email), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "login-password",
                                        class: "block text-sm font-medium text-gray-700 mb-1"
                                      }, "Şifre"),
                                      withDirectives(createVNode("input", {
                                        id: "login-password",
                                        "onUpdate:modelValue": ($event) => form.password = $event,
                                        type: "password",
                                        required: "",
                                        autocomplete: "current-password",
                                        placeholder: "••••••••",
                                        class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent", { "border-red-500": errors.password }],
                                        "aria-invalid": !!errors.password,
                                        "aria-describedby": errors.password ? "login-password-error" : void 0
                                      }, null, 10, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                                        [vModelText, form.password]
                                      ]),
                                      errors.password ? (openBlock(), createBlock("p", {
                                        key: 0,
                                        id: "login-password-error",
                                        class: "mt-1 text-sm text-red-600"
                                      }, toDisplayString(errors.password), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("button", {
                                      type: "submit",
                                      disabled: loading.value,
                                      class: "w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    }, toDisplayString(loading.value ? "Giriş yapılıyor..." : "Giriş Yap"), 9, ["disabled"]),
                                    createVNode("button", {
                                      type: "button",
                                      onClick: ($event) => showEmailForm.value = false,
                                      class: "w-full text-sm text-gray-500 hover:text-gray-700"
                                    }, " ← Geri dön ", 8, ["onClick"])
                                  ], 32))
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(DialogPanel), { class: "w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "relative px-6 pt-6 pb-4 border-b border-gray-200" }, [
                                createVNode(unref(DialogTitle), { class: "text-xl font-bold text-gray-900 text-center" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Giriş Yapın ")
                                  ]),
                                  _: 1
                                }),
                                createVNode("button", {
                                  type: "button",
                                  onClick: close,
                                  class: "absolute right-4 top-6 text-gray-400 hover:text-gray-600 transition-colors",
                                  "aria-label": "Kapat"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-6 h-6",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M6 18L18 6M6 6l12 12"
                                    })
                                  ]))
                                ])
                              ]),
                              createVNode("div", { class: "px-6 py-6" }, [
                                formError.value && !showEmailForm.value ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  role: "alert",
                                  class: "mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
                                }, toDisplayString(formError.value), 1)) : createCommentVNode("", true),
                                createVNode("div", { class: "space-y-3" }, [
                                  unref(page).props.authProviders?.google ? (openBlock(), createBlock("button", {
                                    key: 0,
                                    type: "button",
                                    onClick: loginWithGoogle,
                                    disabled: googleLoading.value,
                                    class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  }, [
                                    googleLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "animate-spin h-5 w-5 text-red-600",
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
                                      ])),
                                      createTextVNode(" Yönlendiriliyor... ")
                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "w-5 h-5",
                                        viewBox: "0 0 24 24"
                                      }, [
                                        createVNode("path", {
                                          fill: "#4285F4",
                                          d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        }),
                                        createVNode("path", {
                                          fill: "#34A853",
                                          d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        }),
                                        createVNode("path", {
                                          fill: "#FBBC05",
                                          d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        }),
                                        createVNode("path", {
                                          fill: "#EA4335",
                                          d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        })
                                      ])),
                                      createTextVNode(" Google ile giriş yapın ")
                                    ], 64))
                                  ], 8, ["disabled"])) : createCommentVNode("", true),
                                  unref(page).props.authProviders?.facebook ? (openBlock(), createBlock("button", {
                                    key: 1,
                                    type: "button",
                                    onClick: loginWithFacebook,
                                    disabled: facebookLoading.value,
                                    class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  }, [
                                    facebookLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "animate-spin h-5 w-5 text-blue-600",
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
                                      ])),
                                      createTextVNode(" Yönlendiriliyor... ")
                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "w-5 h-5",
                                        viewBox: "0 0 24 24",
                                        fill: "currentColor"
                                      }, [
                                        createVNode("path", { d: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.22.19 2.22.19v2.45h-1.25c-1.23 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" })
                                      ])),
                                      createTextVNode(" Facebook ile giriş yapın ")
                                    ], 64))
                                  ], 8, ["disabled"])) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "relative my-5" }, [
                                  createVNode("div", { class: "absolute inset-0 flex items-center" }, [
                                    createVNode("div", { class: "w-full border-t border-gray-300" })
                                  ]),
                                  createVNode("div", { class: "relative flex justify-center text-sm" }, [
                                    createVNode("span", { class: "px-2 bg-white text-gray-500" }, "veya")
                                  ])
                                ]),
                                !showEmailForm.value ? (openBlock(), createBlock("div", { key: 1 }, [
                                  createVNode("button", {
                                    type: "button",
                                    onClick: ($event) => showEmailForm.value = true,
                                    class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      class: "w-5 h-5 text-gray-500",
                                      fill: "none",
                                      stroke: "currentColor",
                                      viewBox: "0 0 24 24"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        "stroke-width": "2",
                                        d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      })
                                    ])),
                                    createTextVNode(" E-Posta ile giriş yapın ")
                                  ], 8, ["onClick"])
                                ])) : (openBlock(), createBlock("form", {
                                  key: 2,
                                  onSubmit: withModifiers(submitLogin, ["prevent"]),
                                  class: "space-y-4",
                                  novalidate: ""
                                }, [
                                  formError.value ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    role: "alert",
                                    class: "px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
                                  }, toDisplayString(formError.value), 1)) : createCommentVNode("", true),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "login-email",
                                      class: "block text-sm font-medium text-gray-700 mb-1"
                                    }, "E-Posta"),
                                    withDirectives(createVNode("input", {
                                      id: "login-email",
                                      "onUpdate:modelValue": ($event) => form.email = $event,
                                      type: "email",
                                      required: "",
                                      autocomplete: "email",
                                      placeholder: "ornek@email.com",
                                      class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent", { "border-red-500": errors.email }],
                                      "aria-invalid": !!errors.email,
                                      "aria-describedby": errors.email ? "login-email-error" : void 0
                                    }, null, 10, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                                      [vModelText, form.email]
                                    ]),
                                    errors.email ? (openBlock(), createBlock("p", {
                                      key: 0,
                                      id: "login-email-error",
                                      class: "mt-1 text-sm text-red-600"
                                    }, toDisplayString(errors.email), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "login-password",
                                      class: "block text-sm font-medium text-gray-700 mb-1"
                                    }, "Şifre"),
                                    withDirectives(createVNode("input", {
                                      id: "login-password",
                                      "onUpdate:modelValue": ($event) => form.password = $event,
                                      type: "password",
                                      required: "",
                                      autocomplete: "current-password",
                                      placeholder: "••••••••",
                                      class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent", { "border-red-500": errors.password }],
                                      "aria-invalid": !!errors.password,
                                      "aria-describedby": errors.password ? "login-password-error" : void 0
                                    }, null, 10, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                                      [vModelText, form.password]
                                    ]),
                                    errors.password ? (openBlock(), createBlock("p", {
                                      key: 0,
                                      id: "login-password-error",
                                      class: "mt-1 text-sm text-red-600"
                                    }, toDisplayString(errors.password), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("button", {
                                    type: "submit",
                                    disabled: loading.value,
                                    class: "w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  }, toDisplayString(loading.value ? "Giriş yapılıyor..." : "Giriş Yap"), 9, ["disabled"]),
                                  createVNode("button", {
                                    type: "button",
                                    onClick: ($event) => showEmailForm.value = false,
                                    class: "w-full text-sm text-gray-500 hover:text-gray-700"
                                  }, " ← Geri dön ", 8, ["onClick"])
                                ], 32))
                              ])
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode(unref(TransitionChild), {
                      as: "template",
                      enter: "duration-200 ease-out",
                      "enter-from": "opacity-0",
                      "enter-to": "opacity-100",
                      leave: "duration-150 ease-in",
                      "leave-from": "opacity-100",
                      "leave-to": "opacity-0"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          class: "fixed inset-0 bg-black/50 backdrop-blur-sm",
                          "aria-hidden": "true"
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "fixed inset-0 overflow-y-auto" }, [
                      createVNode("div", { class: "flex min-h-full items-center justify-center p-4" }, [
                        createVNode(unref(TransitionChild), {
                          as: "template",
                          enter: "duration-200 ease-out",
                          "enter-from": "opacity-0 scale-95",
                          "enter-to": "opacity-100 scale-100",
                          leave: "duration-150 ease-in",
                          "leave-from": "opacity-100 scale-100",
                          "leave-to": "opacity-0 scale-95"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(DialogPanel), { class: "w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all" }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "relative px-6 pt-6 pb-4 border-b border-gray-200" }, [
                                  createVNode(unref(DialogTitle), { class: "text-xl font-bold text-gray-900 text-center" }, {
                                    default: withCtx(() => [
                                      createTextVNode(" Giriş Yapın ")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("button", {
                                    type: "button",
                                    onClick: close,
                                    class: "absolute right-4 top-6 text-gray-400 hover:text-gray-600 transition-colors",
                                    "aria-label": "Kapat"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      class: "w-6 h-6",
                                      fill: "none",
                                      stroke: "currentColor",
                                      viewBox: "0 0 24 24"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        "stroke-width": "2",
                                        d: "M6 18L18 6M6 6l12 12"
                                      })
                                    ]))
                                  ])
                                ]),
                                createVNode("div", { class: "px-6 py-6" }, [
                                  formError.value && !showEmailForm.value ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    role: "alert",
                                    class: "mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
                                  }, toDisplayString(formError.value), 1)) : createCommentVNode("", true),
                                  createVNode("div", { class: "space-y-3" }, [
                                    unref(page).props.authProviders?.google ? (openBlock(), createBlock("button", {
                                      key: 0,
                                      type: "button",
                                      onClick: loginWithGoogle,
                                      disabled: googleLoading.value,
                                      class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    }, [
                                      googleLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "animate-spin h-5 w-5 text-red-600",
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
                                        ])),
                                        createTextVNode(" Yönlendiriliyor... ")
                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "w-5 h-5",
                                          viewBox: "0 0 24 24"
                                        }, [
                                          createVNode("path", {
                                            fill: "#4285F4",
                                            d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                          }),
                                          createVNode("path", {
                                            fill: "#34A853",
                                            d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                          }),
                                          createVNode("path", {
                                            fill: "#FBBC05",
                                            d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                          }),
                                          createVNode("path", {
                                            fill: "#EA4335",
                                            d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                          })
                                        ])),
                                        createTextVNode(" Google ile giriş yapın ")
                                      ], 64))
                                    ], 8, ["disabled"])) : createCommentVNode("", true),
                                    unref(page).props.authProviders?.facebook ? (openBlock(), createBlock("button", {
                                      key: 1,
                                      type: "button",
                                      onClick: loginWithFacebook,
                                      disabled: facebookLoading.value,
                                      class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    }, [
                                      facebookLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "animate-spin h-5 w-5 text-blue-600",
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
                                        ])),
                                        createTextVNode(" Yönlendiriliyor... ")
                                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "w-5 h-5",
                                          viewBox: "0 0 24 24",
                                          fill: "currentColor"
                                        }, [
                                          createVNode("path", { d: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.22.19 2.22.19v2.45h-1.25c-1.23 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" })
                                        ])),
                                        createTextVNode(" Facebook ile giriş yapın ")
                                      ], 64))
                                    ], 8, ["disabled"])) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", { class: "relative my-5" }, [
                                    createVNode("div", { class: "absolute inset-0 flex items-center" }, [
                                      createVNode("div", { class: "w-full border-t border-gray-300" })
                                    ]),
                                    createVNode("div", { class: "relative flex justify-center text-sm" }, [
                                      createVNode("span", { class: "px-2 bg-white text-gray-500" }, "veya")
                                    ])
                                  ]),
                                  !showEmailForm.value ? (openBlock(), createBlock("div", { key: 1 }, [
                                    createVNode("button", {
                                      type: "button",
                                      onClick: ($event) => showEmailForm.value = true,
                                      class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "w-5 h-5 text-gray-500",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24"
                                      }, [
                                        createVNode("path", {
                                          "stroke-linecap": "round",
                                          "stroke-linejoin": "round",
                                          "stroke-width": "2",
                                          d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        })
                                      ])),
                                      createTextVNode(" E-Posta ile giriş yapın ")
                                    ], 8, ["onClick"])
                                  ])) : (openBlock(), createBlock("form", {
                                    key: 2,
                                    onSubmit: withModifiers(submitLogin, ["prevent"]),
                                    class: "space-y-4",
                                    novalidate: ""
                                  }, [
                                    formError.value ? (openBlock(), createBlock("div", {
                                      key: 0,
                                      role: "alert",
                                      class: "px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
                                    }, toDisplayString(formError.value), 1)) : createCommentVNode("", true),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "login-email",
                                        class: "block text-sm font-medium text-gray-700 mb-1"
                                      }, "E-Posta"),
                                      withDirectives(createVNode("input", {
                                        id: "login-email",
                                        "onUpdate:modelValue": ($event) => form.email = $event,
                                        type: "email",
                                        required: "",
                                        autocomplete: "email",
                                        placeholder: "ornek@email.com",
                                        class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent", { "border-red-500": errors.email }],
                                        "aria-invalid": !!errors.email,
                                        "aria-describedby": errors.email ? "login-email-error" : void 0
                                      }, null, 10, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                                        [vModelText, form.email]
                                      ]),
                                      errors.email ? (openBlock(), createBlock("p", {
                                        key: 0,
                                        id: "login-email-error",
                                        class: "mt-1 text-sm text-red-600"
                                      }, toDisplayString(errors.email), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("label", {
                                        for: "login-password",
                                        class: "block text-sm font-medium text-gray-700 mb-1"
                                      }, "Şifre"),
                                      withDirectives(createVNode("input", {
                                        id: "login-password",
                                        "onUpdate:modelValue": ($event) => form.password = $event,
                                        type: "password",
                                        required: "",
                                        autocomplete: "current-password",
                                        placeholder: "••••••••",
                                        class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent", { "border-red-500": errors.password }],
                                        "aria-invalid": !!errors.password,
                                        "aria-describedby": errors.password ? "login-password-error" : void 0
                                      }, null, 10, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                                        [vModelText, form.password]
                                      ]),
                                      errors.password ? (openBlock(), createBlock("p", {
                                        key: 0,
                                        id: "login-password-error",
                                        class: "mt-1 text-sm text-red-600"
                                      }, toDisplayString(errors.password), 1)) : createCommentVNode("", true)
                                    ]),
                                    createVNode("button", {
                                      type: "submit",
                                      disabled: loading.value,
                                      class: "w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    }, toDisplayString(loading.value ? "Giriş yapılıyor..." : "Giriş Yap"), 9, ["disabled"]),
                                    createVNode("button", {
                                      type: "button",
                                      onClick: ($event) => showEmailForm.value = false,
                                      class: "w-full text-sm text-gray-500 hover:text-gray-700"
                                    }, " ← Geri dön ", 8, ["onClick"])
                                  ], 32))
                                ])
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Dialog), {
                as: "div",
                class: "relative z-50",
                onClose: close
              }, {
                default: withCtx(() => [
                  createVNode(unref(TransitionChild), {
                    as: "template",
                    enter: "duration-200 ease-out",
                    "enter-from": "opacity-0",
                    "enter-to": "opacity-100",
                    leave: "duration-150 ease-in",
                    "leave-from": "opacity-100",
                    "leave-to": "opacity-0"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", {
                        class: "fixed inset-0 bg-black/50 backdrop-blur-sm",
                        "aria-hidden": "true"
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "fixed inset-0 overflow-y-auto" }, [
                    createVNode("div", { class: "flex min-h-full items-center justify-center p-4" }, [
                      createVNode(unref(TransitionChild), {
                        as: "template",
                        enter: "duration-200 ease-out",
                        "enter-from": "opacity-0 scale-95",
                        "enter-to": "opacity-100 scale-100",
                        leave: "duration-150 ease-in",
                        "leave-from": "opacity-100 scale-100",
                        "leave-to": "opacity-0 scale-95"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(DialogPanel), { class: "w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all" }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "relative px-6 pt-6 pb-4 border-b border-gray-200" }, [
                                createVNode(unref(DialogTitle), { class: "text-xl font-bold text-gray-900 text-center" }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Giriş Yapın ")
                                  ]),
                                  _: 1
                                }),
                                createVNode("button", {
                                  type: "button",
                                  onClick: close,
                                  class: "absolute right-4 top-6 text-gray-400 hover:text-gray-600 transition-colors",
                                  "aria-label": "Kapat"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-6 h-6",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M6 18L18 6M6 6l12 12"
                                    })
                                  ]))
                                ])
                              ]),
                              createVNode("div", { class: "px-6 py-6" }, [
                                formError.value && !showEmailForm.value ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  role: "alert",
                                  class: "mb-4 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
                                }, toDisplayString(formError.value), 1)) : createCommentVNode("", true),
                                createVNode("div", { class: "space-y-3" }, [
                                  unref(page).props.authProviders?.google ? (openBlock(), createBlock("button", {
                                    key: 0,
                                    type: "button",
                                    onClick: loginWithGoogle,
                                    disabled: googleLoading.value,
                                    class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  }, [
                                    googleLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "animate-spin h-5 w-5 text-red-600",
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
                                      ])),
                                      createTextVNode(" Yönlendiriliyor... ")
                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "w-5 h-5",
                                        viewBox: "0 0 24 24"
                                      }, [
                                        createVNode("path", {
                                          fill: "#4285F4",
                                          d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        }),
                                        createVNode("path", {
                                          fill: "#34A853",
                                          d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        }),
                                        createVNode("path", {
                                          fill: "#FBBC05",
                                          d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        }),
                                        createVNode("path", {
                                          fill: "#EA4335",
                                          d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        })
                                      ])),
                                      createTextVNode(" Google ile giriş yapın ")
                                    ], 64))
                                  ], 8, ["disabled"])) : createCommentVNode("", true),
                                  unref(page).props.authProviders?.facebook ? (openBlock(), createBlock("button", {
                                    key: 1,
                                    type: "button",
                                    onClick: loginWithFacebook,
                                    disabled: facebookLoading.value,
                                    class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  }, [
                                    facebookLoading.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "animate-spin h-5 w-5 text-blue-600",
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
                                      ])),
                                      createTextVNode(" Yönlendiriliyor... ")
                                    ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "w-5 h-5",
                                        viewBox: "0 0 24 24",
                                        fill: "currentColor"
                                      }, [
                                        createVNode("path", { d: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.22.19 2.22.19v2.45h-1.25c-1.23 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" })
                                      ])),
                                      createTextVNode(" Facebook ile giriş yapın ")
                                    ], 64))
                                  ], 8, ["disabled"])) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "relative my-5" }, [
                                  createVNode("div", { class: "absolute inset-0 flex items-center" }, [
                                    createVNode("div", { class: "w-full border-t border-gray-300" })
                                  ]),
                                  createVNode("div", { class: "relative flex justify-center text-sm" }, [
                                    createVNode("span", { class: "px-2 bg-white text-gray-500" }, "veya")
                                  ])
                                ]),
                                !showEmailForm.value ? (openBlock(), createBlock("div", { key: 1 }, [
                                  createVNode("button", {
                                    type: "button",
                                    onClick: ($event) => showEmailForm.value = true,
                                    class: "w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      class: "w-5 h-5 text-gray-500",
                                      fill: "none",
                                      stroke: "currentColor",
                                      viewBox: "0 0 24 24"
                                    }, [
                                      createVNode("path", {
                                        "stroke-linecap": "round",
                                        "stroke-linejoin": "round",
                                        "stroke-width": "2",
                                        d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                      })
                                    ])),
                                    createTextVNode(" E-Posta ile giriş yapın ")
                                  ], 8, ["onClick"])
                                ])) : (openBlock(), createBlock("form", {
                                  key: 2,
                                  onSubmit: withModifiers(submitLogin, ["prevent"]),
                                  class: "space-y-4",
                                  novalidate: ""
                                }, [
                                  formError.value ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    role: "alert",
                                    class: "px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
                                  }, toDisplayString(formError.value), 1)) : createCommentVNode("", true),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "login-email",
                                      class: "block text-sm font-medium text-gray-700 mb-1"
                                    }, "E-Posta"),
                                    withDirectives(createVNode("input", {
                                      id: "login-email",
                                      "onUpdate:modelValue": ($event) => form.email = $event,
                                      type: "email",
                                      required: "",
                                      autocomplete: "email",
                                      placeholder: "ornek@email.com",
                                      class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent", { "border-red-500": errors.email }],
                                      "aria-invalid": !!errors.email,
                                      "aria-describedby": errors.email ? "login-email-error" : void 0
                                    }, null, 10, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                                      [vModelText, form.email]
                                    ]),
                                    errors.email ? (openBlock(), createBlock("p", {
                                      key: 0,
                                      id: "login-email-error",
                                      class: "mt-1 text-sm text-red-600"
                                    }, toDisplayString(errors.email), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("label", {
                                      for: "login-password",
                                      class: "block text-sm font-medium text-gray-700 mb-1"
                                    }, "Şifre"),
                                    withDirectives(createVNode("input", {
                                      id: "login-password",
                                      "onUpdate:modelValue": ($event) => form.password = $event,
                                      type: "password",
                                      required: "",
                                      autocomplete: "current-password",
                                      placeholder: "••••••••",
                                      class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent", { "border-red-500": errors.password }],
                                      "aria-invalid": !!errors.password,
                                      "aria-describedby": errors.password ? "login-password-error" : void 0
                                    }, null, 10, ["onUpdate:modelValue", "aria-invalid", "aria-describedby"]), [
                                      [vModelText, form.password]
                                    ]),
                                    errors.password ? (openBlock(), createBlock("p", {
                                      key: 0,
                                      id: "login-password-error",
                                      class: "mt-1 text-sm text-red-600"
                                    }, toDisplayString(errors.password), 1)) : createCommentVNode("", true)
                                  ]),
                                  createVNode("button", {
                                    type: "submit",
                                    disabled: loading.value,
                                    class: "w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  }, toDisplayString(loading.value ? "Giriş yapılıyor..." : "Giriş Yap"), 9, ["disabled"]),
                                  createVNode("button", {
                                    type: "button",
                                    onClick: ($event) => showEmailForm.value = false,
                                    class: "w-full text-sm text-gray-500 hover:text-gray-700"
                                  }, " ← Geri dön ", 8, ["onClick"])
                                ], 32))
                              ])
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Auth/LoginModal.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "SearchBar",
  __ssrInlineRender: true,
  props: {
    placeholder: {
      type: String,
      default: "Ara..."
    }
  },
  setup(__props) {
    const searchQuery = ref("");
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><form class="relative hidden md:block"><input${ssrRenderAttr("value", searchQuery.value)} type="text"${ssrRenderAttr("placeholder", __props.placeholder)} class="min-h-11 w-72 border border-[var(--bi-ink)] bg-transparent py-2.5 pl-10 pr-4 text-sm text-[var(--bi-ink)] placeholder-[var(--bi-muted)] transition-all focus:border-red-700 focus:outline-none"><svg class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></form><div class="md:hidden"><button class="inline-flex h-11 w-11 items-center justify-center border border-[var(--bi-ink)] text-[var(--bi-ink)] transition-colors hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]" aria-label="Aramayı aç"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>`);
      if (isOpen.value) {
        _push(`<div class="fixed inset-0 z-50 bg-black/50"><div class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-4"><form class="relative"><input id="mobile-search-input"${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Yazı ara..." class="min-h-12 w-full border border-[var(--bi-ink)] bg-white py-3 pl-10 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg><button type="button" class="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-gray-400 hover:text-gray-600" aria-label="Aramayı kapat"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/UI/SearchBar.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "AuthorBottomNav",
  __ssrInlineRender: true,
  emits: ["quick-log"],
  setup(__props, { emit: __emit }) {
    const page = usePage();
    const authUser = computed(() => page.props.auth?.user);
    const tabs = [
      { name: "Anasayfa", href: "/yazar", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { name: "Akış", href: "/akis", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" }
    ];
    if (authUser.value) {
      tabs.push({ name: "Profil", href: `/profile/${authUser.value.id}`, icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "fixed inset-x-0 bottom-0 z-40 border-t-2 border-[var(--bi-ink)] bg-white lg:hidden",
        style: { "padding-bottom": "env(safe-area-inset-bottom, 0)" }
      }, _attrs))}><div class="flex items-center justify-around h-16 px-2"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<!--[-->`);
        if (!tab.disabled) {
          _push(ssrRenderComponent(unref(Link), {
            href: tab.href,
            class: [
              "relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full transition-colors",
              unref(page).url === tab.href || tab.href.startsWith("/profile") && unref(page).url.startsWith("/profile") ? "text-red-700" : "text-gray-500 hover:text-gray-800"
            ]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", tab.icon)}${_scopeId}></path></svg><span class="text-[10px] font-medium"${_scopeId}>${ssrInterpolate(tab.name)}</span>`);
                if (tab.badge > 0) {
                  _push2(`<span class="absolute -top-0.5 right-1/4 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[8px] font-bold text-white"${_scopeId}>${ssrInterpolate(tab.badge > 9 ? "9+" : tab.badge)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-5 h-5",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: tab.icon
                    }, null, 8, ["d"])
                  ])),
                  createVNode("span", { class: "text-[10px] font-medium" }, toDisplayString(tab.name), 1),
                  tab.badge > 0 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "absolute -top-0.5 right-1/4 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[8px] font-bold text-white"
                  }, toDisplayString(tab.badge > 9 ? "9+" : tab.badge), 1)) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<button disabled class="relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full text-gray-300 cursor-not-allowed"${ssrRenderAttr("title", "Yakında")}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", tab.icon)}></path></svg><span class="text-[10px] font-medium">${ssrInterpolate(tab.name)}</span></button>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--><button type="button" class="relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 h-full -mt-5"><div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></div><span class="text-[10px] font-medium text-red-700">Not</span></button></div></nav>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Layout/AuthorBottomNav.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "QuickLogModal",
  __ssrInlineRender: true,
  emits: ["close", "submitted"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const open = ref(false);
    const step = ref(1);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const searchLoading = ref(false);
    const searchMessage = ref("");
    const searchMessageTone = ref("muted");
    const selectedTmdb = ref(null);
    const moodOptions = ["romantik", "gerilim", "melankolik", "vintage", "suç", "zihin-bükücü", "retro", "cesur", "duygusal", "sessiz"];
    const todayString = () => {
      const today = /* @__PURE__ */ new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const defaultForm = () => ({
      tmdb_id: null,
      tmdb_type: "movie",
      external_title: "",
      external_year: "",
      cover_image: "",
      rating: null,
      mood_tags: [],
      note: "",
      watched_on: todayString(),
      status: "published",
      errors: {},
      processing: false
    });
    const form = reactive(defaultForm());
    const isMobile = ref(typeof window !== "undefined" ? window.innerWidth < 768 : false);
    const onResize = () => {
      isMobile.value = window.innerWidth < 768;
    };
    onMounted(() => window.addEventListener("resize", onResize));
    onUnmounted(() => window.removeEventListener("resize", onResize));
    const show = () => {
      open.value = true;
    };
    const titleOf = (item) => item.title || item.name || "";
    const typeOf = (item) => item.type || item.media_type || (item.name ? "tv" : "movie");
    const yearOf = (item) => item.year || (item.release_date || item.first_air_date || "").slice(0, 4);
    const posterPathOf = (item) => item.poster_path || "";
    const starLabels = ["Berbat", "Çok Kötü", "Kötü", "İdare Eder", "Orta", "Ortanın Üstü", "İyi", "Çok İyi", "Harika", "Başyapıt"];
    const ratingLabel = computed(() => form.rating ? starLabels[form.rating - 1] : "");
    const firstError = computed(() => Object.values(form.errors || {})?.flat?.()?.[0] || "");
    __expose({ show });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (open.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50"><div class="${ssrRenderClass(["bg-white overflow-y-auto max-h-[90vh] w-full md:max-w-lg md:rounded-lg md:shadow-xl border-t-2 md:border-2 border-[var(--bi-ink)]", isMobile.value ? "rounded-t-xl" : ""])}"><div class="sticky top-0 z-10 flex items-center justify-between border-b-2 border-[var(--bi-ink)] bg-white px-4 py-3"><h2 class="text-lg font-bold">Hızlı Not</h2><button class="text-gray-500 hover:text-gray-700"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="p-4 space-y-4">`);
          if (firstError.value) {
            _push2(`<div class="bg-red-50 border border-red-200 text-red-700 text-sm p-3">${ssrInterpolate(firstError.value)}</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (step.value === 1) {
            _push2(`<!--[--><div class="relative"><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Film veya dizi ara..." class="w-full border-2 border-[var(--bi-ink)] px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-700/20">`);
            if (searchLoading.value) {
              _push2(`<div class="absolute right-3 top-3"><svg class="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (searchResults.value.length) {
              _push2(`<div class="border-2 border-[var(--bi-ink)] divide-y divide-[var(--bi-rule-soft)] max-h-80 overflow-y-auto"><!--[-->`);
              ssrRenderList(searchResults.value, (item) => {
                _push2(`<button class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bi-paper)] transition-colors">`);
                if (posterPathOf(item)) {
                  _push2(`<img${ssrRenderAttr("src", `https://image.tmdb.org/t/p/w92${posterPathOf(item)}`)} class="w-10 h-14 object-cover border border-gray-200">`);
                } else {
                  _push2(`<div class="w-10 h-14 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">N/A</div>`);
                }
                _push2(`<div class="flex-1 min-w-0"><div class="font-medium text-sm truncate">${ssrInterpolate(titleOf(item))}</div><div class="text-xs text-gray-500">${ssrInterpolate(yearOf(item))} · ${ssrInterpolate(typeOf(item) === "tv" ? "Dizi" : "Film")}</div></div></button>`);
              });
              _push2(`<!--]--></div>`);
            } else if (searchMessage.value) {
              _push2(`<div class="${ssrRenderClass([
                "border px-3 py-2 text-sm",
                searchMessageTone.value === "warning" ? "border-amber-200 bg-amber-50 text-amber-900" : "",
                searchMessageTone.value === "error" ? "border-red-200 bg-red-50 text-red-700" : "",
                searchMessageTone.value === "muted" ? "border-gray-200 bg-gray-50 text-gray-500" : ""
              ])}">${ssrInterpolate(searchMessage.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-3 space-y-3"><p class="text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]">Manuel giriş</p><input${ssrRenderAttr("value", form.external_title)} type="text" placeholder="TMDB&#39;de bulamadıysan adını yaz..." class="w-full border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"><div class="grid grid-cols-[1fr_auto] gap-2"><input${ssrRenderAttr("value", form.external_year)} type="number" min="1880" max="2100" placeholder="Yıl" class="min-w-0 border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"><div class="flex border border-[var(--bi-ink)] bg-white"><button type="button" class="${ssrRenderClass(["px-3 py-2 text-xs font-bold", form.tmdb_type === "movie" ? "bg-[var(--bi-ink)] text-white" : "text-[var(--bi-ink)]"])}">Film</button><button type="button" class="${ssrRenderClass(["px-3 py-2 text-xs font-bold border-l border-[var(--bi-ink)]", form.tmdb_type === "tv" ? "bg-[var(--bi-ink)] text-white" : "text-[var(--bi-ink)]"])}">Dizi</button></div></div><button type="button" class="w-full border-2 border-[var(--bi-ink)] bg-white py-2 text-sm font-bold text-[var(--bi-ink)] transition-colors hover:bg-[var(--bi-ink)] hover:text-white"> Manuel Devam Et </button></div><!--]-->`);
          } else {
            _push2(`<!---->`);
          }
          if (step.value === 2) {
            _push2(`<!--[--><div class="flex items-center gap-3 bg-[var(--bi-paper)] border-2 border-[var(--bi-ink)] p-3">`);
            if (selectedTmdb.value && posterPathOf(selectedTmdb.value)) {
              _push2(`<img${ssrRenderAttr("src", `https://image.tmdb.org/t/p/w185${posterPathOf(selectedTmdb.value)}`)} class="w-12 h-16 object-cover border border-gray-200">`);
            } else {
              _push2(`<div class="flex h-16 w-12 items-center justify-center border border-gray-200 bg-white text-xs text-gray-400">Bİ</div>`);
            }
            _push2(`<div class="flex-1 min-w-0"><div class="font-bold truncate">${ssrInterpolate(form.external_title)}</div><div class="text-xs text-gray-500">${ssrInterpolate(form.external_year || "Yıl yok")} · ${ssrInterpolate(form.tmdb_type === "tv" ? "Dizi" : "Film")}</div></div><button class="text-gray-400 hover:text-red-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div><label class="block text-sm font-bold mb-2">Puanın (1-10)</label><div class="flex items-center gap-1"><!--[-->`);
            ssrRenderList(10, (i) => {
              _push2(`<button class="${ssrRenderClass([form.rating && i <= form.rating ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400", "text-2xl transition-colors"])}">★</button>`);
            });
            _push2(`<!--]--></div>`);
            if (ratingLabel.value) {
              _push2(`<p class="mt-1 text-xs font-medium text-yellow-700">${ssrInterpolate(ratingLabel.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div><label class="block text-sm font-bold mb-2">Mod (en fazla 3)</label><div class="flex flex-wrap gap-2"><!--[-->`);
            ssrRenderList(moodOptions, (mood) => {
              _push2(`<button class="${ssrRenderClass(["px-3 py-1 rounded-full text-xs font-medium border transition-colors", form.mood_tags.includes(mood) ? "border-red-600 bg-red-100 text-red-700" : "border-gray-300 text-gray-600 hover:border-gray-400"])}">${ssrInterpolate(mood)}</button>`);
            });
            _push2(`<!--]--></div></div><div><label class="block text-sm font-bold mb-2">Notun</label><textarea maxlength="280" rows="3" class="w-full border-2 border-[var(--bi-ink)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-700/20" placeholder="Ne düşündün?">${ssrInterpolate(form.note)}</textarea><div class="${ssrRenderClass([form.note.length > 240 ? "text-red-600 font-bold" : "text-gray-400", "text-right text-xs"])}">${ssrInterpolate(form.note.length)}/280</div></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-bold mb-1">Tarih</label><input${ssrRenderAttr("value", form.watched_on)} type="date" class="w-full border-2 border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"></div><div class="flex items-end gap-2"><button type="button" class="${ssrRenderClass(["flex-1 border-2 px-3 py-2 text-xs font-bold transition-colors", form.status === "published" ? "border-red-700 bg-red-700 text-white" : "border-[var(--bi-ink)] bg-white text-[var(--bi-ink)]"])}">${ssrInterpolate(form.status === "published" ? "Yayınla" : "Taslak")}</button></div></div><button${ssrIncludeBooleanAttr(form.processing || !form.rating) ? " disabled" : ""} class="w-full bg-red-700 text-white py-3 font-bold hover:bg-red-800 disabled:opacity-50 transition-colors">${ssrInterpolate(form.processing ? "Kaydediliyor..." : form.status === "published" ? "Yayınla" : "Taslak Olarak Kaydet")}</button><!--]-->`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Author/QuickLogModal.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
function usePWAInstall() {
  const deferredPrompt = ref(null);
  const canInstall = ref(false);
  const isIOS = ref(false);
  const isMobile = ref(false);
  const isStandalone = ref(false);
  const installed = ref(false);
  const detectStandalone = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;
  };
  const detectMobile = () => {
    if (typeof window === "undefined") return false;
    const ua = window.navigator.userAgent || "";
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) return true;
    return window.matchMedia?.("(max-width: 768px)").matches ?? false;
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
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
  });
  onUnmounted(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.removeEventListener("appinstalled", handleInstalled);
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
    install
  };
}
const storageKey$1 = "pwa_install_prompt_dismissed_at";
const dismissWindowMs = 2 * 24 * 60 * 60 * 1e3;
const visibilityDelayMs$1 = 3e3;
const _sfc_main$2 = {
  __name: "InstallAppPrompt",
  __ssrInlineRender: true,
  setup(__props) {
    const { canInstall, installed, isIOS, isMobile } = usePWAInstall();
    const dismissed = ref(true);
    const ready = ref(false);
    const busy = ref(false);
    let revealTimer = null;
    onMounted(() => {
      const dismissedAt = Number(localStorage.getItem(storageKey$1) || 0);
      dismissed.value = dismissedAt > 0 && Date.now() - dismissedAt < dismissWindowMs;
      revealTimer = setTimeout(() => {
        ready.value = true;
      }, visibilityDelayMs$1);
    });
    onBeforeUnmount(() => {
      if (revealTimer) clearTimeout(revealTimer);
    });
    const shouldShow = computed(() => {
      return ready.value && isMobile.value && !installed.value && !dismissed.value;
    });
    computed(() => !isIOS.value && !canInstall.value);
    return (_ctx, _push, _parent, _attrs) => {
      if (shouldShow.value) {
        _push(`<aside${ssrRenderAttrs(mergeProps({
          class: "fixed inset-x-3 bottom-20 z-50 border-2 border-[var(--bi-ink)] bg-white p-4 shadow-[6px_6px_0_var(--bi-ink)] md:left-auto md:right-5 md:bottom-5 md:w-96",
          role: "dialog",
          "aria-labelledby": "pwa-install-title"
        }, _attrs))}><div class="flex items-start justify-between gap-4"><div class="flex-1"><h2 id="pwa-install-title" class="text-sm font-black text-[var(--bi-ink)]"> 📲 Telefonuna uygulama olarak ekle </h2><p class="mt-1 text-xs leading-5 text-[var(--bi-muted)]">`);
        if (unref(isIOS)) {
          _push(`<!--[--> Ben/İzledim&#39;i ana ekranına ekle; tarayıcısız tek dokunuşla aç, yeni yazılarda bildirim al. <!--]-->`);
        } else {
          _push(`<!--[--> Ben/İzledim&#39;i ana ekranına ekle; tarayıcısız tek dokunuşla aç, bildirim al. <!--]-->`);
        }
        _push(`</p></div><button type="button" class="text-gray-400 hover:text-[var(--bi-ink)]" aria-label="Kapat"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
        if (unref(isIOS)) {
          _push(`<div class="mt-4 space-y-2 border-t border-[var(--bi-ink)]/10 pt-3"><div class="flex items-center gap-2 text-xs text-[var(--bi-ink)]"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-[10px] font-black text-white">1</span><span>Safari&#39;de alttaki paylaş ikonuna dokun</span><svg class="h-4 w-4 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v12"></path></svg></div><div class="flex items-center gap-2 text-xs text-[var(--bi-ink)]"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-red-700 text-[10px] font-black text-white">2</span><span class="font-semibold">&quot;Ana Ekrana Ekle&quot;</span><span>seçeneğini seç</span></div></div>`);
        } else if (unref(canInstall)) {
          _push(`<button type="button"${ssrIncludeBooleanAttr(busy.value) ? " disabled" : ""} class="mt-4 w-full bg-red-700 px-4 py-3 text-sm font-black text-white transition hover:bg-red-800 disabled:opacity-50">${ssrInterpolate(busy.value ? "Yükleniyor..." : "Uygulamayı Yükle")}</button>`);
        } else {
          _push(`<div class="mt-4 space-y-2 border-t border-[var(--bi-ink)]/10 pt-3"><div class="flex items-center gap-2 text-xs text-[var(--bi-ink)]"><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-700 text-[10px] font-black text-white">1</span><span>Tarayıcı menüsünü aç</span><svg class="h-4 w-4 text-red-700" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg><span>(sağ üst)</span></div><div class="flex items-center gap-2 text-xs text-[var(--bi-ink)]"><span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-700 text-[10px] font-black text-white">2</span><span><span class="font-semibold">&quot;Uygulamayı yükle&quot;</span> ya da <span class="font-semibold">&quot;Ana ekrana ekle&quot;</span>ye dokun</span></div></div>`);
        }
        _push(`</aside>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/PWA/InstallAppPrompt.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
function usePushSubscription() {
  const isSubscribed = ref(false);
  const supported = typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
  const urlBase64ToUint8Array = (b64) => {
    const padding = "=".repeat((4 - b64.length % 4) % 4);
    const base64 = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
  };
  const fetchVapidKey = async () => {
    const { data } = await axios.get("/api/push/vapid");
    if (!data?.publicKey) {
      throw new Error("VAPID anahtarı alınamadı");
    }
    return data.publicKey;
  };
  const waitForReady = (timeoutMs = 8e3) => Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error("Service worker hazır değil — sayfayı yenileyip tekrar dene")),
      timeoutMs
    ))
  ]);
  const subscribe = async (vapidPublicKey = null) => {
    if (!supported) throw new Error("Push desteklenmiyor");
    const perm = await Notification.requestPermission();
    if (perm !== "granted") throw new Error("İzin verilmedi");
    const key = vapidPublicKey || await fetchVapidKey();
    const reg = await waitForReady();
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key)
    });
    await axios.post("/api/push/subscribe", sub.toJSON());
    isSubscribed.value = true;
    try {
      await axios.post("/api/push/test");
    } catch {
    }
  };
  const unsubscribe = async () => {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      try {
        await axios.delete("/api/push/subscribe", { data: { endpoint: sub.endpoint } });
      } catch {
      }
      await sub.unsubscribe();
    }
    isSubscribed.value = false;
  };
  const checkSubscription = async () => {
    if (!supported) return false;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      isSubscribed.value = !!sub;
      return isSubscribed.value;
    } catch {
      return false;
    }
  };
  return { supported, isSubscribed, subscribe, unsubscribe, checkSubscription };
}
const storageKey = "push_optin_dismissed_at";
const fourteenDays = 14 * 24 * 60 * 60 * 1e3;
const visibilityDelayMs = 14e3;
const _sfc_main$1 = {
  __name: "PushOptInPrompt",
  __ssrInlineRender: true,
  setup(__props) {
    const { supported, isSubscribed, subscribe, checkSubscription } = usePushSubscription();
    const { isIOS, isStandalone } = usePWAInstall();
    const dismissed = ref(true);
    const ready = ref(false);
    const busy = ref(false);
    const error = ref("");
    let revealTimer = null;
    onMounted(async () => {
      const dismissedAt = Number(localStorage.getItem(storageKey) || 0);
      dismissed.value = dismissedAt > 0 && Date.now() - dismissedAt < fourteenDays;
      if (supported) {
        await checkSubscription().catch(() => {
        });
        if (!isSubscribed.value && typeof Notification !== "undefined" && Notification.permission === "granted") {
          subscribe().catch(() => {
          });
        }
      }
      revealTimer = setTimeout(() => {
        ready.value = true;
      }, visibilityDelayMs);
    });
    onBeforeUnmount(() => {
      if (revealTimer) clearTimeout(revealTimer);
    });
    const permission = computed(() => {
      if (typeof Notification === "undefined") return "unsupported";
      return Notification.permission;
    });
    const iOSNeedsInstall = computed(() => isIOS.value && !isStandalone.value);
    const shouldShow = computed(() => {
      if (!ready.value || dismissed.value) return false;
      if (!supported) return false;
      if (isSubscribed.value) return false;
      if (permission.value === "denied") return false;
      if (permission.value === "granted") return false;
      if (iOSNeedsInstall.value) return false;
      return true;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (shouldShow.value) {
        _push(`<aside${ssrRenderAttrs(mergeProps({
          class: "fixed inset-x-3 bottom-36 z-40 border-2 border-[var(--bi-ink)] bg-white p-4 shadow-[6px_6px_0_var(--bi-ink)] md:left-auto md:right-5 md:bottom-24 md:w-96",
          role: "dialog",
          "aria-labelledby": "push-optin-title"
        }, _attrs))}><div class="flex items-start justify-between gap-4"><div class="flex-1"><h2 id="push-optin-title" class="text-sm font-black text-[var(--bi-ink)]"> Yeni yazılardan haberdar ol </h2><p class="mt-1 text-xs leading-5 text-[var(--bi-muted)]"> Her akşam o gün yayınlanan yazıların özetini tek bir bildirimle al. İstediğinde kapatabilirsin. </p></div><button type="button" class="text-gray-400 hover:text-[var(--bi-ink)]" aria-label="Kapat"><svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
        if (error.value) {
          _push(`<p class="mt-3 text-xs text-red-700">${ssrInterpolate(error.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="button"${ssrIncludeBooleanAttr(busy.value) ? " disabled" : ""} class="mt-4 w-full bg-red-700 px-4 py-3 text-sm font-black text-white transition hover:bg-red-800 disabled:opacity-50">${ssrInterpolate(busy.value ? "Açılıyor..." : "Bildirimleri aç")}</button></aside>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/PWA/PushOptInPrompt.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const __default__ = {
  directives: {
    "click-outside": {
      mounted(el, binding) {
        el._clickOutside = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener("click", el._clickOutside, true);
      },
      unmounted(el) {
        document.removeEventListener("click", el._clickOutside, true);
      }
    }
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "AppLayout",
  __ssrInlineRender: true,
  props: {
    title: String,
    description: {
      type: String,
      default: "Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazıları - Ben İzledim"
    },
    ogImage: {
      type: String,
      default: "/images/og-default.png"
    },
    canonicalUrl: {
      type: String,
      default: ""
    },
    ogType: {
      type: String,
      default: "website"
    },
    schemaNodes: {
      type: Array,
      default: () => []
    },
    extraMeta: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const baseUrl = "https://benizledim.com";
    const currentCanonical = computed(() => {
      if (props.canonicalUrl) return props.canonicalUrl;
      const path = usePage().url?.split("?")[0] || "/";
      return `${baseUrl}${path}`;
    });
    const fullOgImage = computed(() => {
      if (props.ogImage.startsWith("http")) return props.ogImage;
      return `${baseUrl}${props.ogImage}`;
    });
    const fullTitle = computed(() => props.title ? `${props.title} - Ben İzledim` : "Ben İzledim - Film, Dizi ve Belgesel Eleştiri Platformu");
    const websiteSchema = computed(() => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Ben İzledim",
      "url": baseUrl,
      "description": "Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazıları",
      "inLanguage": "tr-TR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://benizledim.com/ara?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }));
    const webPageSchema = computed(() => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": props.title || "Ben İzledim",
      "headline": props.title || "Ben İzledim",
      "description": props.description,
      "url": currentCanonical.value,
      "image": fullOgImage.value,
      "inLanguage": "tr-TR",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Ben İzledim",
        "url": baseUrl
      }
    }));
    const resolvedSchemaNodes = computed(() => [
      websiteSchema.value,
      webPageSchema.value,
      ...props.schemaNodes.filter(Boolean)
    ]);
    const page = usePage();
    const authUser = computed(() => page.props.auth?.user);
    const newsletterMessage = computed(() => page.props.flash?.newsletter_message);
    const canAccessCms = computed(() => {
      return ["admin", "editor", "author"].includes(authUser.value?.role || "");
    });
    const showLoginModal = ref(false);
    const showUserMenu = ref(false);
    const showMobileMenu = ref(false);
    const quickLogModal = ref(null);
    const openLoginModal = () => {
      showLoginModal.value = true;
    };
    const closeLoginModal = () => {
      showLoginModal.value = false;
    };
    const openQuickLog = () => {
      showMobileMenu.value = false;
      showUserMenu.value = false;
      if (!authUser.value) {
        openLoginModal();
        return;
      }
      quickLogModal.value?.show();
    };
    const refreshAfterQuickLog = () => {
      router.reload({
        only: ["stats", "recentLogs", "recentPosts", "pendingDrafts", "posts", "items"],
        preserveScroll: true
      });
    };
    const shouldOpenQuickLog = (url) => {
      return new URLSearchParams(url.split("?")[1] || "").get("action") === "log";
    };
    const handleQuickLogEvent = () => openQuickLog();
    const categoryLinks = [
      { name: "Sinema", slug: "sinema" },
      { name: "Dizi", slug: "dizi" },
      { name: "Belgesel", slug: "belgesel" },
      { name: "Film", slug: "film" }
    ];
    const form = useForm({ email: "" });
    const todayLabel = computed(() => {
      return new Intl.DateTimeFormat("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(/* @__PURE__ */ new Date());
    });
    onMounted(() => {
      window.addEventListener("quick-log:open", handleQuickLogEvent);
      if (shouldOpenQuickLog(page.url || "")) {
        openQuickLog();
      }
    });
    onUnmounted(() => {
      window.removeEventListener("quick-log:open", handleQuickLogEvent);
    });
    watch(
      () => page.url,
      (url) => {
        if (shouldOpenQuickLog(url || "")) {
          openQuickLog();
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_click_outside = resolveDirective("click-outside");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-f8c01841${_scopeId}>${ssrInterpolate(fullTitle.value)}</title><link rel="canonical"${ssrRenderAttr("href", currentCanonical.value)} data-v-f8c01841${_scopeId}><link rel="alternate" type="application/rss+xml" title="Ben İzledim RSS" href="https://benizledim.com/feed" data-v-f8c01841${_scopeId}><meta name="description"${ssrRenderAttr("content", __props.description)} data-v-f8c01841${_scopeId}><meta property="og:title"${ssrRenderAttr("content", __props.title || "Ben İzledim")} data-v-f8c01841${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.description)} data-v-f8c01841${_scopeId}><meta property="og:image"${ssrRenderAttr("content", fullOgImage.value)} data-v-f8c01841${_scopeId}><meta property="og:url"${ssrRenderAttr("content", currentCanonical.value)} data-v-f8c01841${_scopeId}><meta property="og:type"${ssrRenderAttr("content", __props.ogType)} data-v-f8c01841${_scopeId}><meta property="og:site_name" content="Ben İzledim" data-v-f8c01841${_scopeId}><meta property="og:locale" content="tr_TR" data-v-f8c01841${_scopeId}><!--[-->`);
            ssrRenderList(__props.extraMeta, (meta, index) => {
              _push2(`<meta${ssrRenderAttrs(mergeProps({
                key: `meta-${index}`
              }, { ref_for: true }, meta.property ? { property: meta.property } : { name: meta.name }, {
                content: meta.content
              }))} data-v-f8c01841${_scopeId}>`);
            });
            _push2(`<!--]--><meta name="twitter:card" content="summary_large_image" data-v-f8c01841${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", __props.title || "Ben İzledim")} data-v-f8c01841${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", __props.description)} data-v-f8c01841${_scopeId}><meta name="twitter:image"${ssrRenderAttr("content", fullOgImage.value)} data-v-f8c01841${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(fullTitle.value), 1),
              createVNode("link", {
                rel: "canonical",
                href: currentCanonical.value
              }, null, 8, ["href"]),
              createVNode("link", {
                rel: "alternate",
                type: "application/rss+xml",
                title: "Ben İzledim RSS",
                href: "https://benizledim.com/feed"
              }),
              createVNode("meta", {
                name: "description",
                content: __props.description
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:title",
                content: __props.title || "Ben İzledim"
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.description
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:image",
                content: fullOgImage.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:url",
                content: currentCanonical.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:type",
                content: __props.ogType
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:site_name",
                content: "Ben İzledim"
              }),
              createVNode("meta", {
                property: "og:locale",
                content: "tr_TR"
              }),
              (openBlock(true), createBlock(Fragment, null, renderList(__props.extraMeta, (meta, index) => {
                return openBlock(), createBlock("meta", mergeProps({
                  key: `meta-${index}`
                }, { ref_for: true }, meta.property ? { property: meta.property } : { name: meta.name }, {
                  content: meta.content
                }), null, 16, ["content"]);
              }), 128)),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: __props.title || "Ben İzledim"
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: __props.description
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:image",
                content: fullOgImage.value
              }, null, 8, ["content"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(resolvedSchemaNodes.value, (schema, index) => {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent("script"), {
          key: `schema-${index}`,
          type: "application/ld+json"
        }, null), _parent);
      });
      _push(`<!--]--><a href="#ana-icerik" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:bg-red-700 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg" data-v-f8c01841> İçeriğe atla </a><header class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)]" data-v-f8c01841><div class="bg-[var(--bi-ink)] text-[var(--bi-paper)]" data-v-f8c01841><div class="bi-wrap flex h-8 items-center justify-between gap-4 text-[0.68rem] font-bold uppercase tracking-[0.08em] bi-mono" data-v-f8c01841><span data-v-f8c01841>${ssrInterpolate(todayLabel.value)} · İstanbul</span><div class="hidden items-center gap-4 sm:flex" data-v-f8c01841>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/#bulten",
        class: "inline-flex items-center py-2 hover:text-red-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Bülten`);
          } else {
            return [
              createTextVNode("Bülten")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/quiz",
        class: "inline-flex items-center py-2 hover:text-red-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Quiz`);
          } else {
            return [
              createTextVNode("Quiz")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (!authUser.value) {
        _push(`<button class="inline-flex items-center py-2 hover:text-red-300" data-v-f8c01841>Giriş</button>`);
      } else if (canAccessCms.value) {
        _push(ssrRenderComponent(unref(Link), {
          href: "/admin",
          class: "inline-flex items-center py-2 hover:text-red-300"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Admin`);
            } else {
              return [
                createTextVNode("Admin")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="bi-wrap grid gap-5 border-b border-[var(--bi-ink)] py-5 lg:grid-cols-[auto_1fr_auto] lg:items-end" data-v-f8c01841><button class="inline-flex h-11 w-11 items-center justify-center border border-[var(--bi-ink)] lg:hidden" aria-label="Menüyü aç" data-v-f8c01841>`);
      if (!showMobileMenu.value) {
        _push(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f8c01841><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 17h16" data-v-f8c01841></path></svg>`);
      } else {
        _push(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f8c01841><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-f8c01841></path></svg>`);
      }
      _push(`</button>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "bi-serif text-[clamp(2.7rem,8vw,5.8rem)] font-bold leading-none text-[var(--bi-ink)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ben<span class="px-1 text-red-700" data-v-f8c01841${_scopeId}>/</span>İzledim `);
          } else {
            return [
              createTextVNode(" Ben"),
              createVNode("span", { class: "px-1 text-red-700" }, "/"),
              createTextVNode("İzledim ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="hidden max-w-[24ch] border-l border-[var(--bi-ink)] pl-4 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-[var(--bi-muted)] bi-mono lg:block" data-v-f8c01841> Film, dizi ve belgesel üzerine bağımsız eleştiri </p><div class="flex flex-wrap items-center gap-3 lg:justify-end" data-v-f8c01841>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/quiz",
        class: "quiz-cta-button inline-flex min-h-11 items-center justify-center gap-1.5 px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] bi-mono lg:hidden"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="quiz-cta-emoji" data-v-f8c01841${_scopeId}>🎭</span><span data-v-f8c01841${_scopeId}>Quiz</span>`);
          } else {
            return [
              createVNode("span", { class: "quiz-cta-emoji" }, "🎭"),
              createVNode("span", null, "Quiz")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/ne-izlesem",
        class: "ne-izlesem-nav-button inline-flex min-h-11 items-center justify-center px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white bi-mono lg:hidden"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ne İzlesem? `);
          } else {
            return [
              createTextVNode(" Ne İzlesem? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button type="button" class="hidden min-h-11 items-center border border-red-700 bg-red-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800 md:inline-flex" data-v-f8c01841> Hemen İncele </button>`);
      _push(ssrRenderComponent(_sfc_main$5, { placeholder: "Film, dizi, yazar ara..." }, null, _parent));
      if (!authUser.value) {
        _push(`<button class="hidden min-h-11 items-center border border-[var(--bi-ink)] bg-[var(--bi-ink)] px-4 py-2 text-sm font-bold text-[var(--bi-paper)] transition hover:bg-red-700 md:inline-flex" data-v-f8c01841> Giriş </button>`);
      } else {
        _push(`<div class="relative hidden md:block" data-v-f8c01841><button class="flex min-h-11 items-center gap-2 border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-3 py-2 text-sm font-bold" data-v-f8c01841>`);
        if (authUser.value.avatar) {
          _push(`<img${ssrRenderAttr("src", authUser.value.avatar)}${ssrRenderAttr("alt", authUser.value.name)} class="h-7 w-7 rounded-full object-cover" data-v-f8c01841>`);
        } else {
          _push(`<span class="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white" data-v-f8c01841>${ssrInterpolate(authUser.value?.name?.charAt(0)?.toUpperCase() || "?")}</span>`);
        }
        _push(`<span class="max-w-32 truncate" data-v-f8c01841>${ssrInterpolate(authUser.value.name)}</span></button>`);
        if (showUserMenu.value) {
          _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute right-0 z-50 mt-2 w-52 border border-[var(--bi-ink)] bg-[var(--bi-paper)] py-1 shadow-[6px_6px_0_var(--bi-ink)]" }, ssrGetDirectiveProps(_ctx, _directive_click_outside, () => showUserMenu.value = false)))} data-v-f8c01841><button class="flex min-h-11 w-full items-center gap-2 px-4 py-2 text-left text-sm font-bold text-red-700 hover:bg-[var(--bi-paper-deep)]" data-v-f8c01841><svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f8c01841><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-v-f8c01841></path></svg> Hızlı Not </button>`);
          if (canAccessCms.value) {
            _push(ssrRenderComponent(unref(Link), {
              href: "/admin/posts/create",
              class: "flex min-h-11 items-center gap-2 px-4 py-2 text-sm font-bold text-red-700 hover:bg-[var(--bi-paper-deep)]"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-f8c01841${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" data-v-f8c01841${_scopeId}></path></svg> Yeni Yazı `);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "h-4 w-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M12 4v16m8-8H4"
                      })
                    ])),
                    createTextVNode(" Yeni Yazı ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(unref(Link), {
            href: `/profile/${authUser.value.id}`,
            class: "flex min-h-11 items-center px-4 py-2 text-sm hover:bg-[var(--bi-paper-deep)]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Profilim`);
              } else {
                return [
                  createTextVNode("Profilim")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (canAccessCms.value) {
            _push(ssrRenderComponent(unref(Link), {
              href: "/admin",
              class: "flex min-h-11 items-center px-4 py-2 text-sm hover:bg-[var(--bi-paper-deep)]"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Admin Panel`);
                } else {
                  return [
                    createTextVNode("Admin Panel")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="flex min-h-11 w-full items-center px-4 py-2 text-left text-sm hover:bg-[var(--bi-paper-deep)]" data-v-f8c01841>Çıkış Yap</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div><nav class="bi-wrap hidden h-12 items-stretch justify-between border-b border-[var(--bi-ink)] lg:flex" data-v-f8c01841><div class="flex" data-v-f8c01841>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "inline-flex min-h-12 items-center border-x border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Ana Sayfa`);
          } else {
            return [
              createTextVNode("Ana Sayfa")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(categoryLinks, (cat) => {
        _push(ssrRenderComponent(unref(Link), {
          key: cat.slug,
          href: `/yazilar?category=${cat.slug}`,
          class: "inline-flex min-h-12 items-center border-r border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(cat.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(cat.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/haberler",
        class: "inline-flex min-h-12 items-center border-r border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Haberler`);
          } else {
            return [
              createTextVNode("Haberler")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/festival",
        class: "inline-flex min-h-12 items-center border-r border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Festival`);
          } else {
            return [
              createTextVNode("Festival")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex items-stretch" data-v-f8c01841>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/quiz",
        class: "quiz-cta-button inline-flex min-h-12 min-w-[132px] items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] bi-mono"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="quiz-cta-emoji" data-v-f8c01841${_scopeId}>🎭</span><span data-v-f8c01841${_scopeId}>Hangi Karaktersin?</span>`);
          } else {
            return [
              createVNode("span", { class: "quiz-cta-emoji" }, "🎭"),
              createVNode("span", null, "Hangi Karaktersin?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/ne-izlesem",
        class: "ne-izlesem-nav-button inline-flex min-h-12 min-w-[132px] items-center justify-center px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white bi-mono"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ne İzlesem? `);
          } else {
            return [
              createTextVNode(" Ne İzlesem? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></nav>`);
      if (showMobileMenu.value) {
        _push(`<div class="bi-wrap border-b border-[var(--bi-ink)] py-4 lg:hidden" data-v-f8c01841><div class="grid gap-2" data-v-f8c01841>`);
        _push(ssrRenderComponent(unref(Link), {
          href: "/",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Ana Sayfa`);
            } else {
              return [
                createTextVNode("Ana Sayfa")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--[-->`);
        ssrRenderList(categoryLinks, (cat) => {
          _push(ssrRenderComponent(unref(Link), {
            key: cat.slug,
            href: `/yazilar?category=${cat.slug}`,
            class: "bi-chip",
            onClick: ($event) => showMobileMenu.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(cat.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(cat.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]-->`);
        _push(ssrRenderComponent(unref(Link), {
          href: "/quiz",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Quiz`);
            } else {
              return [
                createTextVNode("Quiz")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Link), {
          href: "/haberler",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Haberler`);
            } else {
              return [
                createTextVNode("Haberler")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Link), {
          href: "/festival",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Festival`);
            } else {
              return [
                createTextVNode("Festival")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Link), {
          href: "/sinemalar",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Sinemalar`);
            } else {
              return [
                createTextVNode("Sinemalar")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Link), {
          href: "/ne-izlesem",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Ne İzlesem?`);
            } else {
              return [
                createTextVNode("Ne İzlesem?")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (!authUser.value) {
          _push(`<button class="bi-chip text-left" data-v-f8c01841>Giriş Yap</button>`);
        } else {
          _push(`<!--[--><button class="bi-chip bi-chip--accent text-left" data-v-f8c01841>Hemen İncele</button>`);
          _push(ssrRenderComponent(unref(Link), {
            href: "/yazar",
            class: "bi-chip",
            onClick: ($event) => showMobileMenu.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Panelim`);
              } else {
                return [
                  createTextVNode("Panelim")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (canAccessCms.value) {
            _push(ssrRenderComponent(unref(Link), {
              href: "/admin/posts/create",
              class: "bi-chip bi-chip--accent",
              onClick: ($event) => showMobileMenu.value = false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`✏️ Yeni Yazı`);
                } else {
                  return [
                    createTextVNode("✏️ Yeni Yazı")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          if (canAccessCms.value) {
            _push(ssrRenderComponent(unref(Link), {
              href: "/admin",
              class: "bi-chip",
              onClick: ($event) => showMobileMenu.value = false
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Admin Panel`);
                } else {
                  return [
                    createTextVNode("Admin Panel")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<!--]-->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><main id="ana-icerik" class="min-h-screen pb-20 lg:pb-0" data-v-f8c01841>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="border-t-2 border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]" data-v-f8c01841><div class="bi-wrap py-12" data-v-f8c01841><div class="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr_1fr]" data-v-f8c01841><div id="bulten" data-v-f8c01841><h3 class="bi-serif mb-4 text-4xl font-bold" data-v-f8c01841>Ben/İzledim</h3><p class="max-w-md text-sm leading-relaxed text-stone-300" data-v-f8c01841> Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazılarının yer aldığı bir medya ve eğlence platformudur. </p></div><div data-v-f8c01841><h4 class="bi-mono mb-4 text-xs font-bold uppercase tracking-[0.08em] text-red-300" data-v-f8c01841>Kategoriler</h4><ul class="space-y-2 text-sm" data-v-f8c01841><li data-v-f8c01841>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/yazilar?category=sinema",
        class: "text-stone-300 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sinema `);
          } else {
            return [
              createTextVNode(" Sinema ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-f8c01841>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/yazilar?category=dizi",
        class: "text-stone-300 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Dizi `);
          } else {
            return [
              createTextVNode(" Dizi ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-f8c01841>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/yazilar?category=belgesel",
        class: "text-stone-300 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Belgesel `);
          } else {
            return [
              createTextVNode(" Belgesel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-f8c01841>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/yazilar?category=film",
        class: "text-stone-300 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Film `);
          } else {
            return [
              createTextVNode(" Film ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div data-v-f8c01841><h4 class="bi-mono mb-4 text-xs font-bold uppercase tracking-[0.08em] text-red-300" data-v-f8c01841>Önce Siz Okuyun</h4><p class="mb-4 text-sm text-stone-300" data-v-f8c01841> Yeni blog yazılarımızdan ve haberlerden ilk siz haberdar olun! </p>`);
      if (newsletterMessage.value) {
        _push(`<div class="mb-3" data-v-f8c01841><div class="border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-700" data-v-f8c01841>${ssrInterpolate(newsletterMessage.value)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="flex gap-2" novalidate data-v-f8c01841><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="E-posta adresiniz" class="${ssrRenderClass([{ "border-red-500": unref(form).errors.email }, "min-w-0 flex-1 border border-stone-500 bg-transparent px-3 py-2 text-sm text-white placeholder-stone-400 focus:border-red-400 focus:outline-none"])}" data-v-f8c01841><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="bg-red-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50" data-v-f8c01841> Abone </button></form>`);
      if (unref(form).errors.email) {
        _push(`<p class="mt-2 text-red-400 text-xs" data-v-f8c01841>${ssrInterpolate(unref(form).errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="bi-mono mt-8 border-t border-stone-700 pt-8 text-center text-xs uppercase tracking-[0.08em] text-stone-500" data-v-f8c01841> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Ben İzledim. Tüm hakları saklıdır. </div></div></footer>`);
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      if (authUser.value) {
        _push(ssrRenderComponent(_sfc_main$4, { onQuickLog: openQuickLog }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (authUser.value) {
        _push(ssrRenderComponent(_sfc_main$3, {
          ref_key: "quickLogModal",
          ref: quickLogModal,
          onSubmitted: refreshAfterQuickLog
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$6, {
        show: showLoginModal.value,
        onClose: closeLoginModal
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Layout/AppLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AppLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f8c01841"]]);
export {
  AppLayout as A,
  _sfc_main$6 as _,
  _export_sfc as a,
  usePushSubscription as u
};
