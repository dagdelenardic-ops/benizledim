import { mergeProps, withCtx, unref, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { A as AppLayout } from "./AppLayout-Bunikqc4.js";
import { u as useDate } from "./useDate-Es1AW_qO.js";
import "@inertiajs/vue3";
import "@headlessui/vue";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    podcasts: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const { timeAgo } = useDate();
    const formatDuration = (minutes) => {
      if (!minutes) return "30 dk";
      return `${minutes} dk`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({ title: "Podcast" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-gray-50"${_scopeId}><div class="bg-white border-b border-gray-200"${_scopeId}><div class="max-w-7xl mx-auto px-4 py-12"${_scopeId}><h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4"${_scopeId}>Podcast</h1><p class="text-gray-600 text-lg max-w-2xl"${_scopeId}> Film, dizi ve belgesel dünyasından sohbetler, eleştiriler ve öneriler. Spotify üzerinden dinleyebilirsiniz. </p></div></div><div class="max-w-4xl mx-auto px-4 py-12"${_scopeId}>`);
            if (__props.podcasts.length > 0) {
              _push2(`<div class="space-y-8"${_scopeId}><!--[-->`);
              ssrRenderList(__props.podcasts, (podcast) => {
                _push2(`<div class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"${_scopeId}><div class="w-full bg-gray-100"${_scopeId}><iframe${ssrRenderAttr("src", podcast.spotify_embed_url)} width="100%" height="232" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" class="w-full"${_scopeId}></iframe></div><div class="p-6"${_scopeId}><h2 class="text-xl font-bold text-gray-900 mb-2"${_scopeId}>${ssrInterpolate(podcast.title)}</h2><p class="text-gray-600 mb-4"${_scopeId}>${ssrInterpolate(podcast.description)}</p><div class="flex items-center gap-4 text-sm text-gray-500"${_scopeId}><span class="flex items-center gap-1"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg> ${ssrInterpolate(formatDuration(podcast.duration))}</span><span class="flex items-center gap-1"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg> ${ssrInterpolate(unref(timeAgo)(podcast.published_at))}</span></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-16"${_scopeId}><svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"${_scopeId}></path></svg><h3 class="text-xl font-semibold text-gray-900 mb-2"${_scopeId}>Henüz podcast yok</h3><p class="text-gray-500"${_scopeId}>Yakında yeni bölümlerle karşınızda olacağız.</p></div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-gray-50" }, [
                createVNode("div", { class: "bg-white border-b border-gray-200" }, [
                  createVNode("div", { class: "max-w-7xl mx-auto px-4 py-12" }, [
                    createVNode("h1", { class: "text-3xl md:text-4xl font-bold text-gray-900 mb-4" }, "Podcast"),
                    createVNode("p", { class: "text-gray-600 text-lg max-w-2xl" }, " Film, dizi ve belgesel dünyasından sohbetler, eleştiriler ve öneriler. Spotify üzerinden dinleyebilirsiniz. ")
                  ])
                ]),
                createVNode("div", { class: "max-w-4xl mx-auto px-4 py-12" }, [
                  __props.podcasts.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "space-y-8"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.podcasts, (podcast) => {
                      return openBlock(), createBlock("div", {
                        key: podcast.id,
                        class: "bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                      }, [
                        createVNode("div", { class: "w-full bg-gray-100" }, [
                          createVNode("iframe", {
                            src: podcast.spotify_embed_url,
                            width: "100%",
                            height: "232",
                            frameBorder: "0",
                            allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
                            loading: "lazy",
                            class: "w-full"
                          }, null, 8, ["src"])
                        ]),
                        createVNode("div", { class: "p-6" }, [
                          createVNode("h2", { class: "text-xl font-bold text-gray-900 mb-2" }, toDisplayString(podcast.title), 1),
                          createVNode("p", { class: "text-gray-600 mb-4" }, toDisplayString(podcast.description), 1),
                          createVNode("div", { class: "flex items-center gap-4 text-sm text-gray-500" }, [
                            createVNode("span", { class: "flex items-center gap-1" }, [
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
                                  d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                })
                              ])),
                              createTextVNode(" " + toDisplayString(formatDuration(podcast.duration)), 1)
                            ]),
                            createVNode("span", { class: "flex items-center gap-1" }, [
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
                                  d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                })
                              ])),
                              createTextVNode(" " + toDisplayString(unref(timeAgo)(podcast.published_at)), 1)
                            ])
                          ])
                        ])
                      ]);
                    }), 128))
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-center py-16"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-16 h-16 mx-auto text-gray-300 mb-4",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      })
                    ])),
                    createVNode("h3", { class: "text-xl font-semibold text-gray-900 mb-2" }, "Henüz podcast yok"),
                    createVNode("p", { class: "text-gray-500" }, "Yakında yeni bölümlerle karşınızda olacağız.")
                  ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Podcast/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
