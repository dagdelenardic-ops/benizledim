import { ref, onMounted, onUnmounted, withCtx, unref, createVNode, openBlock, createBlock, TransitionGroup, Fragment, renderList, withDirectives, toDisplayString, vShow, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrRenderAttr } from "vue/server-renderer";
import { A as AppLayout } from "./AppLayout-DRxfLCYb.js";
import { u as useDate } from "./useDate-CbchC0lg.js";
import "@inertiajs/vue3";
import "@headlessui/vue";
import "axios";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    events: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { formatDate } = useDate();
    const currentSlide = ref(0);
    let intervalId = null;
    const nextSlide = () => {
      if (props.events.length === 0) return;
      currentSlide.value = (currentSlide.value + 1) % props.events.length;
    };
    const prevSlide = () => {
      if (props.events.length === 0) return;
      currentSlide.value = (currentSlide.value - 1 + props.events.length) % props.events.length;
    };
    const goToSlide = (index) => {
      currentSlide.value = index;
      resetInterval();
    };
    const resetInterval = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = setInterval(nextSlide, 5e3);
      }
    };
    onMounted(() => {
      if (props.events.length > 0) {
        intervalId = setInterval(nextSlide, 5e3);
      }
    });
    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-gray-900"${_scopeId}><div class="bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white py-16"${_scopeId}><div class="max-w-7xl mx-auto px-4 text-center"${_scopeId}><h1 class="text-4xl md:text-6xl font-bold mb-4"${_scopeId}>İstanbul Film Festivali</h1><p class="text-xl text-gray-300 max-w-2xl mx-auto"${_scopeId}> Dünya sinemasından seçme filmler, özel gösterimler ve söyleşiler İstanbul&#39;da sinemaseverlerle buluşuyor. </p></div></div><div class="max-w-6xl mx-auto px-4 py-12"${_scopeId}>`);
            if (__props.events.length > 0) {
              _push2(`<div class="relative"${_scopeId}><div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 aspect-[16/9] md:aspect-[21/9]"${_scopeId}><!--[-->`);
              ssrRenderList(__props.events, (event, index) => {
                _push2(`<div class="absolute inset-0 flex items-center justify-center p-8 md:p-16" style="${ssrRenderStyle(currentSlide.value === index ? null : { display: "none" })}"${_scopeId}><div class="text-center max-w-3xl"${_scopeId}><div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center"${_scopeId}><svg class="w-10 h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"${_scopeId}></path></svg></div><h2 class="text-2xl md:text-4xl font-bold text-white mb-4"${_scopeId}>${ssrInterpolate(event.title)}</h2><p class="text-gray-300 text-lg mb-6"${_scopeId}>${ssrInterpolate(event.description)}</p><div class="flex items-center justify-center gap-2 text-red-400 font-medium"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(unref(formatDate)(event.event_date))}</span></div></div></div>`);
              });
              _push2(`<!--]--><button class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" aria-label="Önceki slayt"${_scopeId}><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"${_scopeId}></path></svg></button><button class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors" aria-label="Sonraki slayt"${_scopeId}><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"${_scopeId}></path></svg></button><div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.events, (event, index) => {
                _push2(`<button class="${ssrRenderClass([currentSlide.value === index ? "bg-red-500 w-8" : "bg-white/30 hover:bg-white/50", "w-3 h-3 rounded-full transition-all"])}"${ssrRenderAttr("aria-label", `Slayt ${index + 1}`)}${_scopeId}></button>`);
              });
              _push2(`<!--]--></div></div></div>`);
            } else {
              _push2(`<div class="text-center py-16"${_scopeId}><svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"${_scopeId}></path></svg><h3 class="text-xl font-semibold text-white mb-2"${_scopeId}>Henüz etkinlik yok</h3><p class="text-gray-400"${_scopeId}>Yakında festival programı açıklanacak.</p></div>`);
            }
            _push2(`</div><div class="max-w-4xl mx-auto px-4 py-12 border-t border-gray-800"${_scopeId}><div class="grid md:grid-cols-2 gap-8"${_scopeId}><div${_scopeId}><h3 class="text-xl font-bold text-white mb-3"${_scopeId}>Festival Hakkında</h3><p class="text-gray-400"${_scopeId}> İstanbul Film Festivali, her yıl dünya sinemasından ödüllü filmleri, klasik başyapıtları ve özel gösterimleri sinemaseverlerle buluşturuyor. </p></div><div${_scopeId}><h3 class="text-xl font-bold text-white mb-3"${_scopeId}>İletişim</h3><p class="text-gray-400"${_scopeId}> Festival programı ve biletler hakkında bilgi almak için bizi sosyal medyadan takip edebilirsiniz. </p></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-gray-900" }, [
                createVNode("div", { class: "bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white py-16" }, [
                  createVNode("div", { class: "max-w-7xl mx-auto px-4 text-center" }, [
                    createVNode("h1", { class: "text-4xl md:text-6xl font-bold mb-4" }, "İstanbul Film Festivali"),
                    createVNode("p", { class: "text-xl text-gray-300 max-w-2xl mx-auto" }, " Dünya sinemasından seçme filmler, özel gösterimler ve söyleşiler İstanbul'da sinemaseverlerle buluşuyor. ")
                  ])
                ]),
                createVNode("div", { class: "max-w-6xl mx-auto px-4 py-12" }, [
                  __props.events.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "relative"
                  }, [
                    createVNode("div", { class: "relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 aspect-[16/9] md:aspect-[21/9]" }, [
                      createVNode(TransitionGroup, {
                        "enter-active-class": "transition duration-500 ease-out",
                        "enter-from-class": "opacity-0 translate-x-full",
                        "enter-to-class": "opacity-100 translate-x-0",
                        "leave-active-class": "transition duration-500 ease-in",
                        "leave-from-class": "opacity-100 translate-x-0",
                        "leave-to-class": "opacity-0 -translate-x-full"
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(__props.events, (event, index) => {
                            return withDirectives((openBlock(), createBlock("div", {
                              key: event.id,
                              class: "absolute inset-0 flex items-center justify-center p-8 md:p-16"
                            }, [
                              createVNode("div", { class: "text-center max-w-3xl" }, [
                                createVNode("div", { class: "w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center" }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-10 h-10 md:w-12 md:h-12 text-white",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                                    })
                                  ]))
                                ]),
                                createVNode("h2", { class: "text-2xl md:text-4xl font-bold text-white mb-4" }, toDisplayString(event.title), 1),
                                createVNode("p", { class: "text-gray-300 text-lg mb-6" }, toDisplayString(event.description), 1),
                                createVNode("div", { class: "flex items-center justify-center gap-2 text-red-400 font-medium" }, [
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
                                      d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    })
                                  ])),
                                  createVNode("span", null, toDisplayString(unref(formatDate)(event.event_date)), 1)
                                ])
                              ])
                            ])), [
                              [vShow, currentSlide.value === index]
                            ]);
                          }), 128))
                        ]),
                        _: 1
                      }),
                      createVNode("button", {
                        onClick: prevSlide,
                        class: "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors",
                        "aria-label": "Önceki slayt"
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
                            d: "M15 19l-7-7 7-7"
                          })
                        ]))
                      ]),
                      createVNode("button", {
                        onClick: nextSlide,
                        class: "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors",
                        "aria-label": "Sonraki slayt"
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
                            d: "M9 5l7 7-7 7"
                          })
                        ]))
                      ]),
                      createVNode("div", { class: "absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.events, (event, index) => {
                          return openBlock(), createBlock("button", {
                            key: event.id,
                            onClick: ($event) => goToSlide(index),
                            class: ["w-3 h-3 rounded-full transition-all", currentSlide.value === index ? "bg-red-500 w-8" : "bg-white/30 hover:bg-white/50"],
                            "aria-label": `Slayt ${index + 1}`
                          }, null, 10, ["onClick", "aria-label"]);
                        }), 128))
                      ])
                    ])
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-center py-16"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-16 h-16 mx-auto text-gray-600 mb-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                      })
                    ])),
                    createVNode("h3", { class: "text-xl font-semibold text-white mb-2" }, "Henüz etkinlik yok"),
                    createVNode("p", { class: "text-gray-400" }, "Yakında festival programı açıklanacak.")
                  ]))
                ]),
                createVNode("div", { class: "max-w-4xl mx-auto px-4 py-12 border-t border-gray-800" }, [
                  createVNode("div", { class: "grid md:grid-cols-2 gap-8" }, [
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-xl font-bold text-white mb-3" }, "Festival Hakkında"),
                      createVNode("p", { class: "text-gray-400" }, " İstanbul Film Festivali, her yıl dünya sinemasından ödüllü filmleri, klasik başyapıtları ve özel gösterimleri sinemaseverlerle buluşturuyor. ")
                    ]),
                    createVNode("div", null, [
                      createVNode("h3", { class: "text-xl font-bold text-white mb-3" }, "İletişim"),
                      createVNode("p", { class: "text-gray-400" }, " Festival programı ve biletler hakkında bilgi almak için bizi sosyal medyadan takip edebilirsiniz. ")
                    ])
                  ])
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Festival/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
