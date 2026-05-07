import { ref, watch, mergeProps, withCtx, unref, createVNode, withDirectives, vModelText, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { router, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-CgPpPth9.js";
import { u as useDate } from "./useDate-CbchC0lg.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    subscribers: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    const props = __props;
    const { formatDate } = useDate();
    const search = ref(props.filters.search || "");
    let searchTimeout;
    watch(search, () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        router.get("/admin/newsletters", {
          search: search.value
        }, {
          preserveState: true,
          replace: true
        });
      }, 300);
    });
    const toggleSubscriber = (subscriber) => {
      const action = subscriber.unsubscribed_at ? "aktif etmek" : "pasif etmek";
      if (!confirm(`${subscriber.email} aboneliğini ${action} istiyor musunuz?`)) return;
      router.post(`/admin/newsletters/${subscriber.id}/toggle`);
    };
    const deleteSubscriber = (subscriber) => {
      if (!confirm(`${subscriber.email} aboneliğini kalıcı olarak silmek istediğinize emin misiniz?`)) return;
      router.delete(`/admin/newsletters/${subscriber.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Newsletter Yönetimi" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"${_scopeId}><h1 class="text-2xl font-bold text-gray-900"${_scopeId}>Newsletter Yönetimi</h1><input${ssrRenderAttr("value", search.value)} type="text" placeholder="E-posta ara..." class="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"${_scopeId}></div><div class="grid grid-cols-1 sm:grid-cols-3 gap-4"${_scopeId}><div class="bg-white rounded-lg shadow-sm p-4"${_scopeId}><div class="text-sm text-gray-500"${_scopeId}>Toplam Abone</div><div class="text-2xl font-bold text-gray-900"${_scopeId}>${ssrInterpolate(__props.subscribers.total || __props.subscribers.data?.length || 0)}</div></div><div class="bg-white rounded-lg shadow-sm p-4"${_scopeId}><div class="text-sm text-gray-500"${_scopeId}>Aktif Abone</div><div class="text-2xl font-bold text-green-600"${_scopeId}>${ssrInterpolate(__props.subscribers.data?.filter((s) => !s.unsubscribed_at).length || 0)}</div></div><div class="bg-white rounded-lg shadow-sm p-4"${_scopeId}><div class="text-sm text-gray-500"${_scopeId}>Pasif Abone</div><div class="text-2xl font-bold text-gray-600"${_scopeId}>${ssrInterpolate(__props.subscribers.data?.filter((s) => s.unsubscribed_at).length || 0)}</div></div></div><div class="bg-white rounded-lg shadow-sm overflow-hidden"${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="w-full min-w-[600px]"${_scopeId}><thead class="bg-gray-50"${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>E-posta</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Durum</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Abonelik Tarihi</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>İşlemler</th></tr></thead><tbody class="divide-y divide-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(__props.subscribers.data, (subscriber) => {
              _push2(`<tr class="hover:bg-gray-50"${_scopeId}><td class="px-6 py-4 text-gray-900"${_scopeId}>${ssrInterpolate(subscriber.email)}</td><td class="px-6 py-4"${_scopeId}><span class="${ssrRenderClass([
                "px-2 py-1 rounded-full text-xs font-medium",
                subscriber.unsubscribed_at ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700"
              ])}"${_scopeId}>${ssrInterpolate(subscriber.unsubscribed_at ? "Pasif" : "Aktif")}</span></td><td class="px-6 py-4 text-gray-600 text-sm"${_scopeId}>${ssrInterpolate(unref(formatDate)(subscriber.subscribed_at))}</td><td class="px-6 py-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><button class="text-blue-600 hover:text-blue-700 text-sm"${_scopeId}>${ssrInterpolate(subscriber.unsubscribed_at ? "Aktif Et" : "Pasif Et")}</button><button class="text-red-600 hover:text-red-700 text-sm"${_scopeId}> Sil </button></div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (!__props.subscribers.data || __props.subscribers.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="4" class="px-6 py-8 text-center text-gray-500"${_scopeId}>${ssrInterpolate(search.value ? "Arama sonucuna uygun abone bulunamadı." : "Henüz abone bulunmuyor.")}</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
            if (__props.subscribers.links && __props.subscribers.links.length > 3) {
              _push2(`<div class="px-6 py-4 border-t border-gray-200 flex justify-center"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.subscribers.links, (link, index) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: index,
                  href: link.url || "#",
                  class: [
                    "px-3 py-1 rounded text-sm",
                    link.active ? "bg-red-600 text-white" : link.url ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed"
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
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center justify-between gap-4" }, [
                  createVNode("h1", { class: "text-2xl font-bold text-gray-900" }, "Newsletter Yönetimi"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => search.value = $event,
                    type: "text",
                    placeholder: "E-posta ara...",
                    class: "w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, search.value]
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-1 sm:grid-cols-3 gap-4" }, [
                  createVNode("div", { class: "bg-white rounded-lg shadow-sm p-4" }, [
                    createVNode("div", { class: "text-sm text-gray-500" }, "Toplam Abone"),
                    createVNode("div", { class: "text-2xl font-bold text-gray-900" }, toDisplayString(__props.subscribers.total || __props.subscribers.data?.length || 0), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-lg shadow-sm p-4" }, [
                    createVNode("div", { class: "text-sm text-gray-500" }, "Aktif Abone"),
                    createVNode("div", { class: "text-2xl font-bold text-green-600" }, toDisplayString(__props.subscribers.data?.filter((s) => !s.unsubscribed_at).length || 0), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-lg shadow-sm p-4" }, [
                    createVNode("div", { class: "text-sm text-gray-500" }, "Pasif Abone"),
                    createVNode("div", { class: "text-2xl font-bold text-gray-600" }, toDisplayString(__props.subscribers.data?.filter((s) => s.unsubscribed_at).length || 0), 1)
                  ])
                ]),
                createVNode("div", { class: "bg-white rounded-lg shadow-sm overflow-hidden" }, [
                  createVNode("div", { class: "overflow-x-auto" }, [
                    createVNode("table", { class: "w-full min-w-[600px]" }, [
                      createVNode("thead", { class: "bg-gray-50" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "E-posta"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Durum"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Abonelik Tarihi"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "İşlemler")
                        ])
                      ]),
                      createVNode("tbody", { class: "divide-y divide-gray-200" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.subscribers.data, (subscriber) => {
                          return openBlock(), createBlock("tr", {
                            key: subscriber.id,
                            class: "hover:bg-gray-50"
                          }, [
                            createVNode("td", { class: "px-6 py-4 text-gray-900" }, toDisplayString(subscriber.email), 1),
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode("span", {
                                class: [
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  subscriber.unsubscribed_at ? "bg-gray-100 text-gray-700" : "bg-green-100 text-green-700"
                                ]
                              }, toDisplayString(subscriber.unsubscribed_at ? "Pasif" : "Aktif"), 3)
                            ]),
                            createVNode("td", { class: "px-6 py-4 text-gray-600 text-sm" }, toDisplayString(unref(formatDate)(subscriber.subscribed_at)), 1),
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("button", {
                                  onClick: ($event) => toggleSubscriber(subscriber),
                                  class: "text-blue-600 hover:text-blue-700 text-sm"
                                }, toDisplayString(subscriber.unsubscribed_at ? "Aktif Et" : "Pasif Et"), 9, ["onClick"]),
                                createVNode("button", {
                                  onClick: ($event) => deleteSubscriber(subscriber),
                                  class: "text-red-600 hover:text-red-700 text-sm"
                                }, " Sil ", 8, ["onClick"])
                              ])
                            ])
                          ]);
                        }), 128)),
                        !__props.subscribers.data || __props.subscribers.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                          createVNode("td", {
                            colspan: "4",
                            class: "px-6 py-8 text-center text-gray-500"
                          }, toDisplayString(search.value ? "Arama sonucuna uygun abone bulunamadı." : "Henüz abone bulunmuyor."), 1)
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  __props.subscribers.links && __props.subscribers.links.length > 3 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "px-6 py-4 border-t border-gray-200 flex justify-center"
                  }, [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.subscribers.links, (link, index) => {
                        return openBlock(), createBlock(unref(Link), {
                          key: index,
                          href: link.url || "#",
                          class: [
                            "px-3 py-1 rounded text-sm",
                            link.active ? "bg-red-600 text-white" : link.url ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 cursor-not-allowed"
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Newsletters/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
