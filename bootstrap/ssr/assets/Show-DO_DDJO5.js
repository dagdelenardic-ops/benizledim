import { mergeProps, withCtx, unref, createTextVNode, openBlock, createBlock, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { a as _export_sfc, A as AppLayout } from "./AppLayout-BH4qZStO.js";
import "@headlessui/vue";
import "axios";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: __props.page.title
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-gray-50" data-v-e5c83ea9${_scopeId}><div class="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-16" data-v-e5c83ea9${_scopeId}><div class="max-w-7xl mx-auto px-4 text-center" data-v-e5c83ea9${_scopeId}><h1 class="text-4xl md:text-5xl font-bold" data-v-e5c83ea9${_scopeId}>${ssrInterpolate(__props.page.title)}</h1></div></div><div class="max-w-4xl mx-auto px-4 py-12" data-v-e5c83ea9${_scopeId}><div class="mb-8" data-v-e5c83ea9${_scopeId}>`);
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
            _push2(`<span class="mx-2 text-gray-400" data-v-e5c83ea9${_scopeId}>/</span><span class="text-gray-900 font-medium" data-v-e5c83ea9${_scopeId}>${ssrInterpolate(__props.page.title)}</span></div><div class="bg-white rounded-2xl shadow-sm p-8 md:p-12" data-v-e5c83ea9${_scopeId}><div class="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:hover:text-red-700 prose-strong:text-gray-900 prose-blockquote:border-l-red-500 prose-blockquote:bg-red-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg" data-v-e5c83ea9${_scopeId}>${__props.page.content ?? ""}</div></div><div class="mt-12 text-center" data-v-e5c83ea9${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-e5c83ea9${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" data-v-e5c83ea9${_scopeId2}></path></svg> Ana Sayfaya Dön `);
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
                        d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                      })
                    ])),
                    createTextVNode(" Ana Sayfaya Dön ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-gray-50" }, [
                createVNode("div", { class: "bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-16" }, [
                  createVNode("div", { class: "max-w-7xl mx-auto px-4 text-center" }, [
                    createVNode("h1", { class: "text-4xl md:text-5xl font-bold" }, toDisplayString(__props.page.title), 1)
                  ])
                ]),
                createVNode("div", { class: "max-w-4xl mx-auto px-4 py-12" }, [
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
                    createVNode("span", { class: "text-gray-900 font-medium" }, toDisplayString(__props.page.title), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-2xl shadow-sm p-8 md:p-12" }, [
                    createVNode("div", {
                      class: "prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:hover:text-red-700 prose-strong:text-gray-900 prose-blockquote:border-l-red-500 prose-blockquote:bg-red-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg",
                      innerHTML: __props.page.content
                    }, null, 8, ["innerHTML"])
                  ]),
                  createVNode("div", { class: "mt-12 text-center" }, [
                    createVNode(unref(Link), {
                      href: "/",
                      class: "inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                    }, {
                      default: withCtx(() => [
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
                            d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                          })
                        ])),
                        createTextVNode(" Ana Sayfaya Dön ")
                      ]),
                      _: 1
                    })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Page/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Show = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e5c83ea9"]]);
export {
  Show as default
};
