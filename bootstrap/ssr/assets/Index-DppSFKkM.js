import { ref, mergeProps, withCtx, unref, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, createTextVNode, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { Link, router } from "@inertiajs/vue3";
import { A as AppLayout } from "./AppLayout-wsaIx5jc.js";
import { _ as _sfc_main$1 } from "./PostGrid-WzhBsF3W.js";
import "@headlessui/vue";
import "axios";
import "./PostCard-Cja5HPWV.js";
import "./useDate-CbchC0lg.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    posts: {
      type: Object,
      default: () => ({})
    },
    query: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const searchQuery = ref(props.query);
    const handleSearch = () => {
      if (searchQuery.value.trim().length >= 2) {
        router.get("/ara", { q: searchQuery.value.trim() }, {
          preserveState: true,
          replace: true
        });
      }
    };
    const hasResults = () => {
      return props.posts.data && props.posts.data.length > 0;
    };
    const resultCount = () => {
      return props.posts.total || 0;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({ title: "Arama" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-gray-50"${_scopeId}><div class="bg-white border-b border-gray-200"${_scopeId}><div class="max-w-4xl mx-auto px-4 py-12"${_scopeId}><h1 class="text-3xl font-bold text-gray-900 mb-6 text-center"${_scopeId}>Yazı Ara</h1><form class="relative max-w-2xl mx-auto"${_scopeId}><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Film, dizi veya belgesel ara..." class="w-full px-6 py-4 pr-14 text-lg rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"${_scopeId}><button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-600 transition-colors"${_scopeId}><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"${_scopeId}></path></svg></button></form><p class="text-center text-gray-500 mt-4 text-sm"${_scopeId}> En az 2 karakter girerek arama yapabilirsiniz </p></div></div><div class="max-w-7xl mx-auto px-4 py-8"${_scopeId}>`);
            if (__props.query && __props.query.length >= 2) {
              _push2(`<div class="mb-6"${_scopeId}><h2 class="text-xl font-semibold text-gray-900"${_scopeId}> &quot;${ssrInterpolate(__props.query)}&quot; için arama sonuçları `);
              if (resultCount() > 0) {
                _push2(`<span class="text-gray-500 font-normal"${_scopeId}> (${ssrInterpolate(resultCount())} sonuç) </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</h2></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (hasResults()) {
              _push2(ssrRenderComponent(_sfc_main$1, {
                posts: __props.posts.data
              }, null, _parent2, _scopeId));
            } else if (__props.query && __props.query.length >= 2) {
              _push2(`<div class="text-center py-16"${_scopeId}><svg class="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><h3 class="text-2xl font-semibold text-gray-900 mb-3"${_scopeId}> Sonuç bulunamadı </h3><p class="text-gray-500 max-w-md mx-auto mb-6"${_scopeId}> &quot;${ssrInterpolate(__props.query)}&quot; aramanızla eşleşen yazı bulunamadı. Farklı bir kelime deneyin veya yazımı kontrol edin. </p><a href="/yazilar" class="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700"${_scopeId}> Tüm yazıları gör <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"${_scopeId}></path></svg></a></div>`);
            } else if (__props.query && __props.query.length < 2) {
              _push2(`<div class="text-center py-16"${_scopeId}><svg class="w-20 h-20 mx-auto text-yellow-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"${_scopeId}></path></svg><p class="text-gray-500 text-lg"${_scopeId}> Arama yapmak için en az 2 karakter girmelisiniz </p></div>`);
            } else if (!__props.query) {
              _push2(`<div class="text-center py-16"${_scopeId}><svg class="w-20 h-20 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"${_scopeId}></path></svg><p class="text-gray-500 text-lg"${_scopeId}> Aramaya başlamak için yukarıya bir kelime yazın </p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (hasResults() && __props.posts.links && __props.posts.last_page > 1) {
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
                createVNode("div", { class: "bg-white border-b border-gray-200" }, [
                  createVNode("div", { class: "max-w-4xl mx-auto px-4 py-12" }, [
                    createVNode("h1", { class: "text-3xl font-bold text-gray-900 mb-6 text-center" }, "Yazı Ara"),
                    createVNode("form", {
                      onSubmit: withModifiers(handleSearch, ["prevent"]),
                      class: "relative max-w-2xl mx-auto"
                    }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
                        type: "text",
                        placeholder: "Film, dizi veya belgesel ara...",
                        class: "w-full px-6 py-4 pr-14 text-lg rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, searchQuery.value]
                      ]),
                      createVNode("button", {
                        type: "submit",
                        class: "absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-600 transition-colors"
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
                            d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          })
                        ]))
                      ])
                    ], 32),
                    createVNode("p", { class: "text-center text-gray-500 mt-4 text-sm" }, " En az 2 karakter girerek arama yapabilirsiniz ")
                  ])
                ]),
                createVNode("div", { class: "max-w-7xl mx-auto px-4 py-8" }, [
                  __props.query && __props.query.length >= 2 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "mb-6"
                  }, [
                    createVNode("h2", { class: "text-xl font-semibold text-gray-900" }, [
                      createTextVNode(' "' + toDisplayString(__props.query) + '" için arama sonuçları ', 1),
                      resultCount() > 0 ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-gray-500 font-normal"
                      }, " (" + toDisplayString(resultCount()) + " sonuç) ", 1)) : createCommentVNode("", true)
                    ])
                  ])) : createCommentVNode("", true),
                  hasResults() ? (openBlock(), createBlock(_sfc_main$1, {
                    key: 1,
                    posts: __props.posts.data
                  }, null, 8, ["posts"])) : __props.query && __props.query.length >= 2 ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "text-center py-16"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-20 h-20 mx-auto text-gray-300 mb-6",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      })
                    ])),
                    createVNode("h3", { class: "text-2xl font-semibold text-gray-900 mb-3" }, " Sonuç bulunamadı "),
                    createVNode("p", { class: "text-gray-500 max-w-md mx-auto mb-6" }, ' "' + toDisplayString(__props.query) + '" aramanızla eşleşen yazı bulunamadı. Farklı bir kelime deneyin veya yazımı kontrol edin. ', 1),
                    createVNode("a", {
                      href: "/yazilar",
                      class: "inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
                    }, [
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
                    ])
                  ])) : __props.query && __props.query.length < 2 ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "text-center py-16"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-20 h-20 mx-auto text-yellow-400 mb-6",
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
                    createVNode("p", { class: "text-gray-500 text-lg" }, " Arama yapmak için en az 2 karakter girmelisiniz ")
                  ])) : !__props.query ? (openBlock(), createBlock("div", {
                    key: 4,
                    class: "text-center py-16"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-20 h-20 mx-auto text-gray-300 mb-6",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      })
                    ])),
                    createVNode("p", { class: "text-gray-500 text-lg" }, " Aramaya başlamak için yukarıya bir kelime yazın ")
                  ])) : createCommentVNode("", true),
                  hasResults() && __props.posts.links && __props.posts.last_page > 1 ? (openBlock(), createBlock("div", {
                    key: 5,
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Search/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
