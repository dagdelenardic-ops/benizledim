import { computed, mergeProps, withCtx, unref, createTextVNode, toDisplayString, openBlock, createBlock, createVNode, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { a as _export_sfc, A as AppLayout } from "./AppLayout-DuOg95yc.js";
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
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    const props = __props;
    const getPageTitle = () => {
      if (props.filters.category) {
        const category = props.categories.find((c) => c.slug === props.filters.category);
        return category ? `${category.name} Yazıları` : "Yazılar";
      }
      if (props.filters.tag) {
        return `Etiket: ${props.filters.tag}`;
      }
      return "Tüm Yazılar";
    };
    const isActiveCategory = (slug) => {
      return props.filters.category === slug;
    };
    const pageDescription = computed(() => {
      if (props.filters.category) {
        const category = props.categories.find((item) => item.slug === props.filters.category);
        return category ? `${category.name} kategorisindeki film, dizi ve belgesel yazıları.` : "Ben İzledim arşivindeki tüm yazılar.";
      }
      if (props.filters.tag) {
        return `${props.filters.tag} etiketiyle işaretlenmiş Ben İzledim yazıları.`;
      }
      return "Ben İzledim arşivindeki tüm film, dizi ve belgesel yazıları.";
    });
    const currentCanonical = computed(() => {
      const params = new URLSearchParams();
      if (props.filters.category) params.set("category", props.filters.category);
      if (props.filters.tag) params.set("tag", props.filters.tag);
      const queryString = params.toString();
      return queryString ? `https://benizledim.com/yazilar?${queryString}` : "https://benizledim.com/yazilar";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: getPageTitle(),
        description: pageDescription.value,
        "canonical-url": currentCanonical.value
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-[var(--bi-paper)]" data-v-dff0dbf0${_scopeId}><div class="border-b-2 border-[var(--bi-ink)]" data-v-dff0dbf0${_scopeId}><div class="bi-wrap py-8" data-v-dff0dbf0${_scopeId}><span class="bi-kicker" data-v-dff0dbf0${_scopeId}>Arşiv</span><h1 class="bi-serif mt-3 text-5xl font-bold leading-none text-[var(--bi-ink)] md:text-7xl" data-v-dff0dbf0${_scopeId}>${ssrInterpolate(getPageTitle())}</h1><p class="mt-4 max-w-2xl text-[var(--bi-muted)]" data-v-dff0dbf0${_scopeId}> Film, dizi ve belgesel dünyasından eleştiri ve tavsiyeler </p></div></div><div class="sticky top-0 z-10 border-b border-[var(--bi-ink)] bg-[var(--bi-paper)]/95 backdrop-blur" data-v-dff0dbf0${_scopeId}><div class="bi-wrap py-4" data-v-dff0dbf0${_scopeId}><div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" data-v-dff0dbf0${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/yazilar",
              class: [
                "bi-chip whitespace-nowrap",
                !__props.filters.category && !__props.filters.tag ? "is-active" : ""
              ]
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Tümü `);
                } else {
                  return [
                    createTextVNode(" Tümü ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<!--[-->`);
            ssrRenderList(__props.categories, (category) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: category.id,
                href: `/yazilar?category=${category.slug}`,
                class: [
                  "bi-chip whitespace-nowrap",
                  isActiveCategory(category.slug) ? "is-active" : ""
                ]
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(category.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(category.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
            if (__props.filters.category || __props.filters.tag) {
              _push2(`<div class="mt-4" data-v-dff0dbf0${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/yazilar",
                class: "inline-flex items-center gap-2 border border-red-700 px-3 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-700 hover:text-white"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Filtreyi Temizle <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-dff0dbf0${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-dff0dbf0${_scopeId2}></path></svg>`);
                  } else {
                    return [
                      createTextVNode(" Filtreyi Temizle "),
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
                          d: "M6 18L18 6M6 6l12 12"
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
            _push2(`</div></div><div class="bi-wrap py-8" data-v-dff0dbf0${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              posts: __props.posts.data
            }, null, _parent2, _scopeId));
            if (__props.posts.data.length === 0) {
              _push2(`<div class="bi-rule-box mt-6 text-center py-16" data-v-dff0dbf0${_scopeId}><svg class="w-16 h-16 mx-auto text-[var(--bi-rule-soft)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-dff0dbf0${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-dff0dbf0${_scopeId}></path></svg><h3 class="bi-serif text-3xl font-bold text-[var(--bi-ink)] mb-2" data-v-dff0dbf0${_scopeId}>Sonuç bulunamadı</h3><p class="text-[var(--bi-muted)]" data-v-dff0dbf0${_scopeId}>Seçtiğiniz kriterlere uygun yazı bulunmuyor.</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/yazilar",
                class: "mt-4 inline-flex items-center gap-2 text-red-700 font-bold hover:text-red-900"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Tüm yazıları gör <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-dff0dbf0${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" data-v-dff0dbf0${_scopeId2}></path></svg>`);
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
              _push2(`<div class="mt-12 flex justify-center" data-v-dff0dbf0${_scopeId}><div class="flex items-center gap-2" data-v-dff0dbf0${_scopeId}><!--[-->`);
              ssrRenderList(__props.posts.links, (link, index) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: index,
                  href: link.url || "#",
                  class: [
                    "border px-4 py-2 text-sm font-bold transition-colors",
                    link.active ? "border-red-700 bg-red-700 text-white" : link.url ? "border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]" : "border-[var(--bi-rule-soft)] text-[var(--bi-muted)] cursor-not-allowed"
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
              createVNode("div", { class: "min-h-screen bg-[var(--bi-paper)]" }, [
                createVNode("div", { class: "border-b-2 border-[var(--bi-ink)]" }, [
                  createVNode("div", { class: "bi-wrap py-8" }, [
                    createVNode("span", { class: "bi-kicker" }, "Arşiv"),
                    createVNode("h1", { class: "bi-serif mt-3 text-5xl font-bold leading-none text-[var(--bi-ink)] md:text-7xl" }, toDisplayString(getPageTitle()), 1),
                    createVNode("p", { class: "mt-4 max-w-2xl text-[var(--bi-muted)]" }, " Film, dizi ve belgesel dünyasından eleştiri ve tavsiyeler ")
                  ])
                ]),
                createVNode("div", { class: "sticky top-0 z-10 border-b border-[var(--bi-ink)] bg-[var(--bi-paper)]/95 backdrop-blur" }, [
                  createVNode("div", { class: "bi-wrap py-4" }, [
                    createVNode("div", { class: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide" }, [
                      createVNode(unref(Link), {
                        href: "/yazilar",
                        class: [
                          "bi-chip whitespace-nowrap",
                          !__props.filters.category && !__props.filters.tag ? "is-active" : ""
                        ]
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Tümü ")
                        ]),
                        _: 1
                      }, 8, ["class"]),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (category) => {
                        return openBlock(), createBlock(unref(Link), {
                          key: category.id,
                          href: `/yazilar?category=${category.slug}`,
                          class: [
                            "bi-chip whitespace-nowrap",
                            isActiveCategory(category.slug) ? "is-active" : ""
                          ]
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(category.name), 1)
                          ]),
                          _: 2
                        }, 1032, ["href", "class"]);
                      }), 128))
                    ]),
                    __props.filters.category || __props.filters.tag ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mt-4"
                    }, [
                      createVNode(unref(Link), {
                        href: "/yazilar",
                        class: "inline-flex items-center gap-2 border border-red-700 px-3 py-2 text-sm font-bold text-red-700 transition-colors hover:bg-red-700 hover:text-white"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Filtreyi Temizle "),
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
                              d: "M6 18L18 6M6 6l12 12"
                            })
                          ]))
                        ]),
                        _: 1
                      })
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "bi-wrap py-8" }, [
                  createVNode(_sfc_main$1, {
                    posts: __props.posts.data
                  }, null, 8, ["posts"]),
                  __props.posts.data.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bi-rule-box mt-6 text-center py-16"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-16 h-16 mx-auto text-[var(--bi-rule-soft)] mb-4",
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
                    createVNode("h3", { class: "bi-serif text-3xl font-bold text-[var(--bi-ink)] mb-2" }, "Sonuç bulunamadı"),
                    createVNode("p", { class: "text-[var(--bi-muted)]" }, "Seçtiğiniz kriterlere uygun yazı bulunmuyor."),
                    createVNode(unref(Link), {
                      href: "/yazilar",
                      class: "mt-4 inline-flex items-center gap-2 text-red-700 font-bold hover:text-red-900"
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
                            "border px-4 py-2 text-sm font-bold transition-colors",
                            link.active ? "border-red-700 bg-red-700 text-white" : link.url ? "border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]" : "border-[var(--bi-rule-soft)] text-[var(--bi-muted)] cursor-not-allowed"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Post/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dff0dbf0"]]);
export {
  Index as default
};
