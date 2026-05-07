import { ref, watch, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { router, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-CgPpPth9.js";
import { u as useDate } from "./useDate-CbchC0lg.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    comments: {
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
    const { timeAgo } = useDate();
    const search = ref(props.filters.search || "");
    let searchTimeout;
    watch(search, () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        router.get("/admin/comments", {
          search: search.value
        }, {
          preserveState: true,
          replace: true
        });
      }, 300);
    });
    const deleteComment = (comment) => {
      if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
      router.delete(`/admin/comments/${comment.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Yorum Yönetimi" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"${_scopeId}><h1 class="text-2xl font-bold text-gray-900"${_scopeId}>Yorum Yönetimi</h1><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Yorum, yazar veya yazı ara..." class="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"${_scopeId}></div><div class="bg-white rounded-lg shadow-sm overflow-hidden"${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="w-full min-w-[700px]"${_scopeId}><thead class="bg-gray-50"${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Yorum</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Yazar</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Yazı</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Tarih</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>İşlemler</th></tr></thead><tbody class="divide-y divide-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(__props.comments.data, (comment) => {
              _push2(`<tr class="hover:bg-gray-50"${_scopeId}><td class="px-6 py-4 text-gray-700 text-sm max-w-md"${_scopeId}>${ssrInterpolate(comment.content)}</td><td class="px-6 py-4 text-gray-700"${_scopeId}>${ssrInterpolate(comment.user?.name || "-")}</td><td class="px-6 py-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: comment.post?.slug ? `/yazi/${comment.post.slug}` : "#",
                class: "text-blue-600 hover:text-blue-700 text-sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(comment.post?.title || "-")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(comment.post?.title || "-"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</td><td class="px-6 py-4 text-gray-600 text-sm"${_scopeId}>${ssrInterpolate(unref(timeAgo)(comment.created_at))}</td><td class="px-6 py-4"${_scopeId}><button class="text-red-600 hover:text-red-700 text-sm"${_scopeId}> Sil </button></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (!__props.comments.data || __props.comments.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="5" class="px-6 py-8 text-center text-gray-500"${_scopeId}>${ssrInterpolate(search.value ? "Arama sonucuna uygun yorum bulunamadı." : "Henüz yorum bulunmuyor.")}</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
            if (__props.comments.links && __props.comments.links.length > 3) {
              _push2(`<div class="px-6 py-4 border-t border-gray-200 flex justify-center"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.comments.links, (link, index) => {
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
                  createVNode("h1", { class: "text-2xl font-bold text-gray-900" }, "Yorum Yönetimi"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => search.value = $event,
                    type: "text",
                    placeholder: "Yorum, yazar veya yazı ara...",
                    class: "w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, search.value]
                  ])
                ]),
                createVNode("div", { class: "bg-white rounded-lg shadow-sm overflow-hidden" }, [
                  createVNode("div", { class: "overflow-x-auto" }, [
                    createVNode("table", { class: "w-full min-w-[700px]" }, [
                      createVNode("thead", { class: "bg-gray-50" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Yorum"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Yazar"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Yazı"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Tarih"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "İşlemler")
                        ])
                      ]),
                      createVNode("tbody", { class: "divide-y divide-gray-200" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.comments.data, (comment) => {
                          return openBlock(), createBlock("tr", {
                            key: comment.id,
                            class: "hover:bg-gray-50"
                          }, [
                            createVNode("td", { class: "px-6 py-4 text-gray-700 text-sm max-w-md" }, toDisplayString(comment.content), 1),
                            createVNode("td", { class: "px-6 py-4 text-gray-700" }, toDisplayString(comment.user?.name || "-"), 1),
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode(unref(Link), {
                                href: comment.post?.slug ? `/yazi/${comment.post.slug}` : "#",
                                class: "text-blue-600 hover:text-blue-700 text-sm"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(comment.post?.title || "-"), 1)
                                ]),
                                _: 2
                              }, 1032, ["href"])
                            ]),
                            createVNode("td", { class: "px-6 py-4 text-gray-600 text-sm" }, toDisplayString(unref(timeAgo)(comment.created_at)), 1),
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode("button", {
                                onClick: ($event) => deleteComment(comment),
                                class: "text-red-600 hover:text-red-700 text-sm"
                              }, " Sil ", 8, ["onClick"])
                            ])
                          ]);
                        }), 128)),
                        !__props.comments.data || __props.comments.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                          createVNode("td", {
                            colspan: "5",
                            class: "px-6 py-8 text-center text-gray-500"
                          }, toDisplayString(search.value ? "Arama sonucuna uygun yorum bulunamadı." : "Henüz yorum bulunmuyor."), 1)
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  __props.comments.links && __props.comments.links.length > 3 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "px-6 py-4 border-t border-gray-200 flex justify-center"
                  }, [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.comments.links, (link, index) => {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Comments/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
