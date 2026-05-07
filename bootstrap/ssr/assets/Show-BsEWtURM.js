import { mergeProps, withCtx, unref, createTextVNode, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { A as AppLayout } from "./AppLayout-DuOg95yc.js";
import { _ as _sfc_main$1 } from "./PostGrid-WzhBsF3W.js";
import "@headlessui/vue";
import "axios";
import "./PostCard-Cja5HPWV.js";
import "./useDate-CbchC0lg.js";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    category: {
      type: Object,
      required: true
    },
    posts: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: __props.category.name
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-gray-50"${_scopeId}><div class="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-16"${_scopeId}><div class="max-w-7xl mx-auto px-4 text-center"${_scopeId}><div class="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center"${_scopeId}><svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"${_scopeId}></path></svg></div><h1 class="text-4xl md:text-5xl font-bold mb-4"${_scopeId}>${ssrInterpolate(__props.category.name)}</h1>`);
            if (__props.category.description) {
              _push2(`<p class="text-xl text-red-100 max-w-2xl mx-auto"${_scopeId}>${ssrInterpolate(__props.category.description)}</p>`);
            } else {
              _push2(`<p class="text-lg text-red-100 max-w-2xl mx-auto"${_scopeId}>${ssrInterpolate(__props.category.name)} kategorisindeki tüm yazılar </p>`);
            }
            _push2(`<div class="mt-6 flex items-center justify-center gap-4 text-red-200"${_scopeId}><span class="flex items-center gap-2"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg> ${ssrInterpolate(__props.posts.total || __props.posts.data.length)} yazı </span></div></div></div><div class="max-w-7xl mx-auto px-4 py-12"${_scopeId}><div class="mb-8"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "text-gray-500 hover:text-red-600"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Ana Sayfa`);
                } else {
                  return [
                    createTextVNode("Ana Sayfa")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span class="mx-2 text-gray-400"${_scopeId}>/</span>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/yazilar",
              class: "text-gray-500 hover:text-red-600"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Yazılar`);
                } else {
                  return [
                    createTextVNode("Yazılar")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span class="mx-2 text-gray-400"${_scopeId}>/</span><span class="text-gray-900 font-medium"${_scopeId}>${ssrInterpolate(__props.category.name)}</span></div>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              posts: __props.posts.data
            }, null, _parent2, _scopeId));
            if (__props.posts.data.length === 0) {
              _push2(`<div class="text-center py-16"${_scopeId}><svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"${_scopeId}></path></svg><h3 class="text-xl font-semibold text-gray-900 mb-2"${_scopeId}>Henüz yazı yok</h3><p class="text-gray-500 mb-4"${_scopeId}>Bu kategoride henüz yazı bulunmuyor.</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/yazilar",
                class: "inline-flex items-center gap-2 text-red-600 hover:text-red-700"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Tüm yazıları gör <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"${_scopeId2}></path></svg>`);
                  } else {
                    return [
                      createTextVNode(" Tüm yazıları gör "),
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
                          d: "M17 8l4 4m0 0l-4 4m4-4H3"
                        })
                      ]))
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.posts.links && __props.posts.data.length > 0) {
              _push2(`<div class="mt-12 flex justify-center"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.posts.links, (link, index) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: index,
                  href: link.url || "#",
                  class: [
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    link.active ? "bg-red-600 text-white" : link.url ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  ]
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-gray-50" }, [
                createVNode("div", { class: "bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-16" }, [
                  createVNode("div", { class: "max-w-7xl mx-auto px-4 text-center" }, [
                    createVNode("div", { class: "w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center" }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-10 h-10 text-white",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        })
                      ]))
                    ]),
                    createVNode("h1", { class: "text-4xl md:text-5xl font-bold mb-4" }, toDisplayString(__props.category.name), 1),
                    __props.category.description ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-xl text-red-100 max-w-2xl mx-auto"
                    }, toDisplayString(__props.category.description), 1)) : (openBlock(), createBlock("p", {
                      key: 1,
                      class: "text-lg text-red-100 max-w-2xl mx-auto"
                    }, toDisplayString(__props.category.name) + " kategorisindeki tüm yazılar ", 1)),
                    createVNode("div", { class: "mt-6 flex items-center justify-center gap-4 text-red-200" }, [
                      createVNode("span", { class: "flex items-center gap-2" }, [
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
                            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          })
                        ])),
                        createTextVNode(" " + toDisplayString(__props.posts.total || __props.posts.data.length) + " yazı ", 1)
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "max-w-7xl mx-auto px-4 py-12" }, [
                  createVNode("div", { class: "mb-8" }, [
                    createVNode(unref(Link), {
                      href: "/",
                      class: "text-gray-500 hover:text-red-600"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Ana Sayfa")
                      ]),
                      _: 1
                    }),
                    createVNode("span", { class: "mx-2 text-gray-400" }, "/"),
                    createVNode(unref(Link), {
                      href: "/yazilar",
                      class: "text-gray-500 hover:text-red-600"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Yazılar")
                      ]),
                      _: 1
                    }),
                    createVNode("span", { class: "mx-2 text-gray-400" }, "/"),
                    createVNode("span", { class: "text-gray-900 font-medium" }, toDisplayString(__props.category.name), 1)
                  ]),
                  createVNode(_sfc_main$1, {
                    posts: __props.posts.data
                  }, null, 8, ["posts"]),
                  __props.posts.data.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
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
                        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      })
                    ])),
                    createVNode("h3", { class: "text-xl font-semibold text-gray-900 mb-2" }, "Henüz yazı yok"),
                    createVNode("p", { class: "text-gray-500 mb-4" }, "Bu kategoride henüz yazı bulunmuyor."),
                    createVNode(unref(Link), {
                      href: "/yazilar",
                      class: "inline-flex items-center gap-2 text-red-600 hover:text-red-700"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Tüm yazıları gör "),
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
                            d: "M17 8l4 4m0 0l-4 4m4-4H3"
                          })
                        ]))
                      ]),
                      _: 1
                    })
                  ])) : createCommentVNode("", true),
                  __props.posts.links && __props.posts.data.length > 0 ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "mt-12 flex justify-center"
                  }, [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.posts.links, (link, index) => {
                        return openBlock(), createBlock(unref(Link), {
                          key: index,
                          href: link.url || "#",
                          class: [
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            link.active ? "bg-red-600 text-white" : link.url ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          ],
                          innerHTML: link.label
                        }, null, 8, ["href", "class", "innerHTML"]);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Category/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
