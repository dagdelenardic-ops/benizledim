import { ref, unref, withCtx, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, withModifiers, withDirectives, vModelText, nextTick, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { A as AppLayout } from "./AppLayout-DRxfLCYb.js";
import "@headlessui/vue";
import "axios";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    title: { type: String, default: "Asistan" },
    description: { type: String, default: "" },
    enabled: { type: Boolean, default: true }
  },
  setup(__props) {
    const question = ref("");
    const messages = ref([]);
    const loading = ref(false);
    const sessionId = ref(null);
    const transcriptEl = ref(null);
    const suggestions = [
      "Karanlık atmosferli, yavaş tempolu bir film öner",
      "Lynch izlemiş birine ne tavsiye edersin?",
      "Türk yapımı suç-gizem belgeseli var mı?",
      "Bu hafta hangi yazılar yayınlandı?"
    ];
    const scrollToEnd = () => {
      nextTick(() => {
        if (transcriptEl.value) {
          transcriptEl.value.scrollTop = transcriptEl.value.scrollHeight;
        }
      });
    };
    const ask = async (text) => {
      const q = (text ?? question.value).trim();
      if (q.length < 3 || loading.value) return;
      messages.value.push({ role: "user", text: q });
      question.value = "";
      loading.value = true;
      scrollToEnd();
      try {
        const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
        const res = await fetch("/asistan/sor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            ...csrf ? { "X-CSRF-TOKEN": csrf } : {}
          },
          body: JSON.stringify({ question: q, session: sessionId.value }),
          credentials: "same-origin"
        });
        const data = await res.json();
        sessionId.value = data.session ?? sessionId.value;
        messages.value.push({
          role: "assistant",
          text: data.answer || "Bu konuda henüz yazımız yok.",
          citations: data.citations || []
        });
      } catch (e) {
        messages.value.push({
          role: "assistant",
          text: "Bir hata oluştu, biraz sonra tekrar dene.",
          citations: []
        });
      } finally {
        loading.value = false;
        scrollToEnd();
      }
    };
    const reset = () => {
      messages.value = [];
      sessionId.value = null;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(__props.title)}</title><meta name="description"${ssrRenderAttr("content", __props.description)}${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(__props.title), 1),
              createVNode("meta", {
                name: "description",
                content: __props.description
              }, null, 8, ["content"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(AppLayout, { title: __props.title }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-gray-50"${_scopeId}><div class="max-w-3xl mx-auto px-4 py-10"${_scopeId}><div class="mb-8 text-center"${_scopeId}><h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3"${_scopeId}> Ben İzledim Asistanı </h1><p class="text-gray-600"${_scopeId}> Sitedeki yazılara dayanan film, dizi, belgesel önerileri ve sorular için. </p></div><div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4" style="${ssrRenderStyle({ "max-height": "60vh", "min-height": "320px", "overflow-y": "auto" })}"${_scopeId}>`);
            if (messages.value.length === 0) {
              _push2(`<div class="p-8 text-center"${_scopeId}><p class="text-gray-500 mb-6"${_scopeId}>Bir örnekle başla:</p><div class="grid sm:grid-cols-2 gap-3"${_scopeId}><!--[-->`);
              ssrRenderList(suggestions, (s) => {
                _push2(`<button${ssrIncludeBooleanAttr(loading.value || !__props.enabled) ? " disabled" : ""} class="text-left text-sm px-4 py-3 rounded-xl border border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-700 transition disabled:opacity-50"${_scopeId}>${ssrInterpolate(s)}</button>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<div class="divide-y divide-gray-100"${_scopeId}><!--[-->`);
              ssrRenderList(messages.value, (m, i) => {
                _push2(`<div class="px-5 py-4"${_scopeId}>`);
                if (m.role === "user") {
                  _push2(`<div class="flex justify-end"${_scopeId}><div class="bg-red-600 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%] whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(m.text)}</div></div>`);
                } else {
                  _push2(`<div class="flex justify-start"${_scopeId}><div class="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%]"${_scopeId}><p class="whitespace-pre-wrap leading-relaxed"${_scopeId}>${ssrInterpolate(m.text)}</p>`);
                  if (m.citations && m.citations.length) {
                    _push2(`<div class="mt-3 pt-3 border-t border-gray-200"${_scopeId}><p class="text-xs uppercase tracking-wide text-gray-500 mb-2"${_scopeId}>Kaynaklar</p><ul class="space-y-1"${_scopeId}><!--[-->`);
                    ssrRenderList(m.citations, (c) => {
                      _push2(`<li class="text-sm"${_scopeId}>`);
                      if (c.slug) {
                        _push2(ssrRenderComponent(unref(Link), {
                          href: `/yazi/${c.slug}`,
                          class: "text-red-600 hover:underline"
                        }, {
                          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                            if (_push3) {
                              _push3(`${ssrInterpolate(c.title)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(c.title), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent2, _scopeId));
                      } else {
                        _push2(`<span${_scopeId}>${ssrInterpolate(c.title)}</span>`);
                      }
                      _push2(`</li>`);
                    });
                    _push2(`<!--]--></ul></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div></div>`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]-->`);
              if (loading.value) {
                _push2(`<div class="px-5 py-4"${_scopeId}><div class="flex justify-start"${_scopeId}><div class="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3"${_scopeId}><div class="flex gap-1"${_scopeId}><span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="${ssrRenderStyle({ "animation-delay": "0ms" })}"${_scopeId}></span><span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="${ssrRenderStyle({ "animation-delay": "150ms" })}"${_scopeId}></span><span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="${ssrRenderStyle({ "animation-delay": "300ms" })}"${_scopeId}></span></div></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }
            _push2(`</div><form class="flex gap-2"${_scopeId}><input${ssrRenderAttr("value", question.value)} type="text" placeholder="Sorunu yaz…"${ssrIncludeBooleanAttr(loading.value || !__props.enabled) ? " disabled" : ""} maxlength="500" class="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none disabled:opacity-50"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(loading.value || !__props.enabled || question.value.trim().length < 3) ? " disabled" : ""} class="px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"${_scopeId}> Sor </button></form><div class="mt-4 flex items-center justify-between text-sm"${_scopeId}><p class="text-gray-500"${_scopeId}> Cevaplar yalnızca yayınladığımız yazılara dayanır. </p>`);
            if (messages.value.length > 0) {
              _push2(`<button class="text-gray-600 hover:text-red-600"${_scopeId}> Yeni sohbet </button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-gray-50" }, [
                createVNode("div", { class: "max-w-3xl mx-auto px-4 py-10" }, [
                  createVNode("div", { class: "mb-8 text-center" }, [
                    createVNode("h1", { class: "text-3xl md:text-4xl font-bold text-gray-900 mb-3" }, " Ben İzledim Asistanı "),
                    createVNode("p", { class: "text-gray-600" }, " Sitedeki yazılara dayanan film, dizi, belgesel önerileri ve sorular için. ")
                  ]),
                  createVNode("div", {
                    ref_key: "transcriptEl",
                    ref: transcriptEl,
                    class: "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4",
                    style: { "max-height": "60vh", "min-height": "320px", "overflow-y": "auto" }
                  }, [
                    messages.value.length === 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "p-8 text-center"
                    }, [
                      createVNode("p", { class: "text-gray-500 mb-6" }, "Bir örnekle başla:"),
                      createVNode("div", { class: "grid sm:grid-cols-2 gap-3" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(suggestions, (s) => {
                          return createVNode("button", {
                            key: s,
                            onClick: ($event) => ask(s),
                            disabled: loading.value || !__props.enabled,
                            class: "text-left text-sm px-4 py-3 rounded-xl border border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-700 transition disabled:opacity-50"
                          }, toDisplayString(s), 9, ["onClick", "disabled"]);
                        }), 64))
                      ])
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "divide-y divide-gray-100"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(messages.value, (m, i) => {
                        return openBlock(), createBlock("div", {
                          key: i,
                          class: "px-5 py-4"
                        }, [
                          m.role === "user" ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex justify-end"
                          }, [
                            createVNode("div", { class: "bg-red-600 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%] whitespace-pre-wrap" }, toDisplayString(m.text), 1)
                          ])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex justify-start"
                          }, [
                            createVNode("div", { class: "bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%]" }, [
                              createVNode("p", { class: "whitespace-pre-wrap leading-relaxed" }, toDisplayString(m.text), 1),
                              m.citations && m.citations.length ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "mt-3 pt-3 border-t border-gray-200"
                              }, [
                                createVNode("p", { class: "text-xs uppercase tracking-wide text-gray-500 mb-2" }, "Kaynaklar"),
                                createVNode("ul", { class: "space-y-1" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(m.citations, (c) => {
                                    return openBlock(), createBlock("li", {
                                      key: c.id,
                                      class: "text-sm"
                                    }, [
                                      c.slug ? (openBlock(), createBlock(unref(Link), {
                                        key: 0,
                                        href: `/yazi/${c.slug}`,
                                        class: "text-red-600 hover:underline"
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(c.title), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["href"])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(c.title), 1))
                                    ]);
                                  }), 128))
                                ])
                              ])) : createCommentVNode("", true)
                            ])
                          ]))
                        ]);
                      }), 128)),
                      loading.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "px-5 py-4"
                      }, [
                        createVNode("div", { class: "flex justify-start" }, [
                          createVNode("div", { class: "bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3" }, [
                            createVNode("div", { class: "flex gap-1" }, [
                              createVNode("span", {
                                class: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                                style: { "animation-delay": "0ms" }
                              }),
                              createVNode("span", {
                                class: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                                style: { "animation-delay": "150ms" }
                              }),
                              createVNode("span", {
                                class: "w-2 h-2 bg-gray-400 rounded-full animate-bounce",
                                style: { "animation-delay": "300ms" }
                              })
                            ])
                          ])
                        ])
                      ])) : createCommentVNode("", true)
                    ]))
                  ], 512),
                  createVNode("form", {
                    onSubmit: withModifiers(($event) => ask(), ["prevent"]),
                    class: "flex gap-2"
                  }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => question.value = $event,
                      type: "text",
                      placeholder: "Sorunu yaz…",
                      disabled: loading.value || !__props.enabled,
                      maxlength: "500",
                      class: "flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none disabled:opacity-50"
                    }, null, 8, ["onUpdate:modelValue", "disabled"]), [
                      [vModelText, question.value]
                    ]),
                    createVNode("button", {
                      type: "submit",
                      disabled: loading.value || !__props.enabled || question.value.trim().length < 3,
                      class: "px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    }, " Sor ", 8, ["disabled"])
                  ], 40, ["onSubmit"]),
                  createVNode("div", { class: "mt-4 flex items-center justify-between text-sm" }, [
                    createVNode("p", { class: "text-gray-500" }, " Cevaplar yalnızca yayınladığımız yazılara dayanır. "),
                    messages.value.length > 0 ? (openBlock(), createBlock("button", {
                      key: 0,
                      onClick: reset,
                      class: "text-gray-600 hover:text-red-600"
                    }, " Yeni sohbet ")) : createCommentVNode("", true)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Asistan/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
