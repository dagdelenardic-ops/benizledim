import { ref, mergeProps, withCtx, unref, createVNode, withModifiers, createTextVNode, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from "vue/server-renderer";
import { useForm, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-fOISzqII.js";
import { _ as _sfc_main$2 } from "./RichTextEditor-B1ICi6UT.js";
import "@tiptap/vue-3";
import "@tiptap/starter-kit";
import "@tiptap/extension-link";
import "@tiptap/extension-placeholder";
import "@tiptap/extension-underline";
import "@tiptap/extension-character-count";
import "@tiptap/extension-typography";
import "@tiptap/extension-text-align";
import "@tiptap/extension-highlight";
import "@tiptap/extension-code-block-lowlight";
import "lowlight";
import "@tiptap/extension-image";
import "@tiptap/pm/state";
import "axios";
import "@tiptap/core";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    pages: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const newForm = useForm({
      title: "",
      slug: "",
      content: ""
    });
    const submitNew = () => {
      newForm.post("/admin/pages", {
        onSuccess: () => newForm.reset()
      });
    };
    const editingId = ref(null);
    const editForm = useForm({
      title: "",
      slug: "",
      content: ""
    });
    const startEdit = (page) => {
      editingId.value = page.id;
      editForm.title = page.title || "";
      editForm.slug = page.slug || "";
      editForm.content = page.content || "";
    };
    const submitEdit = (page) => {
      editForm.put(`/admin/pages/${page.id}`, {
        onSuccess: () => {
          editingId.value = null;
        }
      });
    };
    const cancelEdit = () => {
      editingId.value = null;
      editForm.reset();
    };
    const deletePage = (page) => {
      if (!confirm(`"${page.title}" sayfasını silmek istediğinize emin misiniz?`)) return;
      newForm.delete(`/admin/pages/${page.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Sayfa Yönetimi" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><h1 class="text-2xl font-bold text-gray-900"${_scopeId}>Sayfa Yönetimi</h1><div class="bg-white rounded-lg shadow-sm p-6 space-y-4"${_scopeId}><h2 class="text-lg font-medium text-gray-900"${_scopeId}>Yeni Sayfa</h2><form class="space-y-4"${_scopeId}><div class="grid md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Başlık <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(newForm).title)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(newForm).errors.title }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>`);
            if (unref(newForm).errors.title) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(newForm).errors.title)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Slug (opsiyonel)</label><input${ssrRenderAttr("value", unref(newForm).slug)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(newForm).errors.slug }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>`);
            if (unref(newForm).errors.slug) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(newForm).errors.slug)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>İçerik <span class="text-red-500"${_scopeId}>*</span></label>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              modelValue: unref(newForm).content,
              "onUpdate:modelValue": ($event) => unref(newForm).content = $event
            }, null, _parent2, _scopeId));
            if (unref(newForm).errors.content) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(newForm).errors.content)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(newForm).processing) ? " disabled" : ""} class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"${_scopeId}>`);
            if (unref(newForm).processing) {
              _push2(`<span${_scopeId}>Kaydediliyor...</span>`);
            } else {
              _push2(`<span${_scopeId}>Kaydet</span>`);
            }
            _push2(`</button></div></form></div><div class="bg-white rounded-lg shadow-sm overflow-hidden"${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="w-full min-w-[600px]"${_scopeId}><thead class="bg-gray-50"${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Başlık</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Slug</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Güncelleme</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>İşlemler</th></tr></thead><tbody class="divide-y divide-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(__props.pages.data, (page) => {
              _push2(`<tr class="hover:bg-gray-50"${_scopeId}><td class="px-6 py-4 font-medium text-gray-900"${_scopeId}>${ssrInterpolate(page.title)}</td><td class="px-6 py-4 text-gray-600"${_scopeId}>${ssrInterpolate(page.slug)}</td><td class="px-6 py-4 text-gray-600 text-sm"${_scopeId}>${ssrInterpolate(page.updated_at?.slice(0, 10))}</td><td class="px-6 py-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><button class="text-blue-600 hover:text-blue-700 text-sm"${_scopeId}>Düzenle</button><a${ssrRenderAttr("href", `/sayfa/${page.slug}`)} target="_blank" class="text-gray-600 hover:text-gray-700 text-sm"${_scopeId}>Görüntüle</a><button class="text-red-600 hover:text-red-700 text-sm"${_scopeId}>Sil</button></div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (!__props.pages.data || __props.pages.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="4" class="px-6 py-8 text-center text-gray-500"${_scopeId}>Henüz sayfa bulunmuyor.</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
            if (__props.pages.links && __props.pages.links.length > 3) {
              _push2(`<div class="px-6 py-4 border-t border-gray-200 flex justify-center"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.pages.links, (link, index) => {
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
            _push2(`</div>`);
            if (editingId.value) {
              _push2(`<div class="bg-white rounded-lg shadow-sm p-6 space-y-4"${_scopeId}><h2 class="text-lg font-medium text-gray-900"${_scopeId}>Sayfa Düzenle</h2><form class="space-y-4"${_scopeId}><div class="grid md:grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Başlık <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(editForm).title)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(editForm).errors.title }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>`);
              if (unref(editForm).errors.title) {
                _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(editForm).errors.title)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Slug</label><input${ssrRenderAttr("value", unref(editForm).slug)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(editForm).errors.slug }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>`);
              if (unref(editForm).errors.slug) {
                _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(editForm).errors.slug)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>İçerik <span class="text-red-500"${_scopeId}>*</span></label>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                modelValue: unref(editForm).content,
                "onUpdate:modelValue": ($event) => unref(editForm).content = $event
              }, null, _parent2, _scopeId));
              if (unref(editForm).errors.content) {
                _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(editForm).errors.content)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex gap-2"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(editForm).processing) ? " disabled" : ""} class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"${_scopeId}>`);
              if (unref(editForm).processing) {
                _push2(`<span${_scopeId}>Güncelleniyor...</span>`);
              } else {
                _push2(`<span${_scopeId}>Güncelle</span>`);
              }
              _push2(`</button><button type="button" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"${_scopeId}> İptal </button></div></form></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("h1", { class: "text-2xl font-bold text-gray-900" }, "Sayfa Yönetimi"),
                createVNode("div", { class: "bg-white rounded-lg shadow-sm p-6 space-y-4" }, [
                  createVNode("h2", { class: "text-lg font-medium text-gray-900" }, "Yeni Sayfa"),
                  createVNode("form", {
                    onSubmit: withModifiers(submitNew, ["prevent"]),
                    class: "space-y-4"
                  }, [
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, [
                          createTextVNode("Başlık "),
                          createVNode("span", { class: "text-red-500" }, "*")
                        ]),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(newForm).title = $event,
                          type: "text",
                          class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(newForm).errors.title }]
                        }, null, 10, ["onUpdate:modelValue"]), [
                          [vModelText, unref(newForm).title]
                        ]),
                        unref(newForm).errors.title ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(newForm).errors.title), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, "Slug (opsiyonel)"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(newForm).slug = $event,
                          type: "text",
                          class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(newForm).errors.slug }]
                        }, null, 10, ["onUpdate:modelValue"]), [
                          [vModelText, unref(newForm).slug]
                        ]),
                        unref(newForm).errors.slug ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(newForm).errors.slug), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, [
                        createTextVNode("İçerik "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      createVNode(_sfc_main$2, {
                        modelValue: unref(newForm).content,
                        "onUpdate:modelValue": ($event) => unref(newForm).content = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      unref(newForm).errors.content ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-600"
                      }, toDisplayString(unref(newForm).errors.content), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(newForm).processing,
                        class: "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      }, [
                        unref(newForm).processing ? (openBlock(), createBlock("span", { key: 0 }, "Kaydediliyor...")) : (openBlock(), createBlock("span", { key: 1 }, "Kaydet"))
                      ], 8, ["disabled"])
                    ])
                  ], 32)
                ]),
                createVNode("div", { class: "bg-white rounded-lg shadow-sm overflow-hidden" }, [
                  createVNode("div", { class: "overflow-x-auto" }, [
                    createVNode("table", { class: "w-full min-w-[600px]" }, [
                      createVNode("thead", { class: "bg-gray-50" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Başlık"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Slug"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Güncelleme"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "İşlemler")
                        ])
                      ]),
                      createVNode("tbody", { class: "divide-y divide-gray-200" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.pages.data, (page) => {
                          return openBlock(), createBlock("tr", {
                            key: page.id,
                            class: "hover:bg-gray-50"
                          }, [
                            createVNode("td", { class: "px-6 py-4 font-medium text-gray-900" }, toDisplayString(page.title), 1),
                            createVNode("td", { class: "px-6 py-4 text-gray-600" }, toDisplayString(page.slug), 1),
                            createVNode("td", { class: "px-6 py-4 text-gray-600 text-sm" }, toDisplayString(page.updated_at?.slice(0, 10)), 1),
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("button", {
                                  onClick: ($event) => startEdit(page),
                                  class: "text-blue-600 hover:text-blue-700 text-sm"
                                }, "Düzenle", 8, ["onClick"]),
                                createVNode("a", {
                                  href: `/sayfa/${page.slug}`,
                                  target: "_blank",
                                  class: "text-gray-600 hover:text-gray-700 text-sm"
                                }, "Görüntüle", 8, ["href"]),
                                createVNode("button", {
                                  onClick: ($event) => deletePage(page),
                                  class: "text-red-600 hover:text-red-700 text-sm"
                                }, "Sil", 8, ["onClick"])
                              ])
                            ])
                          ]);
                        }), 128)),
                        !__props.pages.data || __props.pages.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                          createVNode("td", {
                            colspan: "4",
                            class: "px-6 py-8 text-center text-gray-500"
                          }, "Henüz sayfa bulunmuyor.")
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  __props.pages.links && __props.pages.links.length > 3 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "px-6 py-4 border-t border-gray-200 flex justify-center"
                  }, [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.pages.links, (link, index) => {
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
                ]),
                editingId.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-white rounded-lg shadow-sm p-6 space-y-4"
                }, [
                  createVNode("h2", { class: "text-lg font-medium text-gray-900" }, "Sayfa Düzenle"),
                  createVNode("form", {
                    onSubmit: withModifiers(($event) => submitEdit(__props.pages.data.find((item) => item.id === editingId.value)), ["prevent"]),
                    class: "space-y-4"
                  }, [
                    createVNode("div", { class: "grid md:grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, [
                          createTextVNode("Başlık "),
                          createVNode("span", { class: "text-red-500" }, "*")
                        ]),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(editForm).title = $event,
                          type: "text",
                          class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(editForm).errors.title }]
                        }, null, 10, ["onUpdate:modelValue"]), [
                          [vModelText, unref(editForm).title]
                        ]),
                        unref(editForm).errors.title ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(editForm).errors.title), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, "Slug"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(editForm).slug = $event,
                          type: "text",
                          class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(editForm).errors.slug }]
                        }, null, 10, ["onUpdate:modelValue"]), [
                          [vModelText, unref(editForm).slug]
                        ]),
                        unref(editForm).errors.slug ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(editForm).errors.slug), 1)) : createCommentVNode("", true)
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, [
                        createTextVNode("İçerik "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      createVNode(_sfc_main$2, {
                        modelValue: unref(editForm).content,
                        "onUpdate:modelValue": ($event) => unref(editForm).content = $event
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      unref(editForm).errors.content ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-600"
                      }, toDisplayString(unref(editForm).errors.content), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(editForm).processing,
                        class: "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      }, [
                        unref(editForm).processing ? (openBlock(), createBlock("span", { key: 0 }, "Güncelleniyor...")) : (openBlock(), createBlock("span", { key: 1 }, "Güncelle"))
                      ], 8, ["disabled"]),
                      createVNode("button", {
                        type: "button",
                        onClick: cancelEdit,
                        class: "px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      }, " İptal ")
                    ])
                  ], 40, ["onSubmit"])
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Pages/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
