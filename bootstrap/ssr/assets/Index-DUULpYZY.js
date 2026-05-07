import { ref, mergeProps, withCtx, unref, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useForm } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-CgPpPth9.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const newForm = useForm({
      name: ""
    });
    const submitNew = () => {
      newForm.post("/admin/categories", {
        onSuccess: () => newForm.reset()
      });
    };
    const editingId = ref(null);
    const editForm = useForm({
      name: ""
    });
    const startEdit = (category) => {
      editingId.value = category.id;
      editForm.name = category.name;
    };
    const cancelEdit = () => {
      editingId.value = null;
      editForm.reset();
    };
    const submitEdit = (category) => {
      editForm.put(`/admin/categories/${category.id}`, {
        onSuccess: () => {
          editingId.value = null;
        }
      });
    };
    const deleteCategory = (category) => {
      if (!confirm(`"${category.name}" kategorisini silmek istediğinize emin misiniz?`)) return;
      if (category.posts_count > 0) {
        alert("Bu kategoride yazılar var, önce yazıları başka kategoriye taşıyın.");
        return;
      }
      newForm.delete(`/admin/categories/${category.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Kategoriler" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><h1 class="text-2xl font-bold text-gray-900"${_scopeId}>Kategoriler</h1><div class="bg-white rounded-lg shadow-sm p-6"${_scopeId}><h2 class="text-lg font-medium text-gray-900 mb-4"${_scopeId}>Yeni Kategori</h2><form class="flex gap-4"${_scopeId}><input${ssrRenderAttr("value", unref(newForm).name)} type="text" placeholder="Kategori adı..." class="${ssrRenderClass([{ "border-red-500": unref(newForm).errors.name }, "flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(newForm).processing) ? " disabled" : ""} class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"${_scopeId}> Ekle </button></form>`);
            if (unref(newForm).errors.name) {
              _push2(`<p class="mt-2 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(newForm).errors.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="bg-white rounded-lg shadow-sm overflow-hidden"${_scopeId}><table class="w-full"${_scopeId}><thead class="bg-gray-50"${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Kategori</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Yazı Sayısı</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>İşlemler</th></tr></thead><tbody class="divide-y divide-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(__props.categories, (category) => {
              _push2(`<tr class="hover:bg-gray-50"${_scopeId}><td class="px-6 py-4"${_scopeId}>`);
              if (editingId.value === category.id) {
                _push2(`<div class="flex gap-2"${_scopeId}><input${ssrRenderAttr("value", unref(editForm).name)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(editForm).errors.name }, "flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-red-500"])}"${_scopeId}></div>`);
              } else {
                _push2(`<span class="font-medium text-gray-900"${_scopeId}>${ssrInterpolate(category.name)}</span>`);
              }
              _push2(`</td><td class="px-6 py-4"${_scopeId}><span class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"${_scopeId}>${ssrInterpolate(category.posts_count)} yazı </span></td><td class="px-6 py-4"${_scopeId}>`);
              if (editingId.value === category.id) {
                _push2(`<div class="flex items-center gap-2"${_scopeId}><button${ssrIncludeBooleanAttr(unref(editForm).processing) ? " disabled" : ""} class="text-green-600 hover:text-green-700 text-sm"${_scopeId}> Kaydet </button><button class="text-gray-600 hover:text-gray-700 text-sm"${_scopeId}> İptal </button></div>`);
              } else {
                _push2(`<div class="flex items-center gap-2"${_scopeId}><button class="text-blue-600 hover:text-blue-700 text-sm"${_scopeId}> Düzenle </button>`);
                if (category.posts_count === 0) {
                  _push2(`<button class="text-red-600 hover:text-red-700 text-sm"${_scopeId}> Sil </button>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              }
              _push2(`</td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.categories.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="3" class="px-6 py-8 text-center text-gray-500"${_scopeId}> Henüz kategori yok. </td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("h1", { class: "text-2xl font-bold text-gray-900" }, "Kategoriler"),
                createVNode("div", { class: "bg-white rounded-lg shadow-sm p-6" }, [
                  createVNode("h2", { class: "text-lg font-medium text-gray-900 mb-4" }, "Yeni Kategori"),
                  createVNode("form", {
                    onSubmit: withModifiers(submitNew, ["prevent"]),
                    class: "flex gap-4"
                  }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(newForm).name = $event,
                      type: "text",
                      placeholder: "Kategori adı...",
                      class: ["flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(newForm).errors.name }]
                    }, null, 10, ["onUpdate:modelValue"]), [
                      [vModelText, unref(newForm).name]
                    ]),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(newForm).processing,
                      class: "px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    }, " Ekle ", 8, ["disabled"])
                  ], 32),
                  unref(newForm).errors.name ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "mt-2 text-sm text-red-600"
                  }, toDisplayString(unref(newForm).errors.name), 1)) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "bg-white rounded-lg shadow-sm overflow-hidden" }, [
                  createVNode("table", { class: "w-full" }, [
                    createVNode("thead", { class: "bg-gray-50" }, [
                      createVNode("tr", null, [
                        createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Kategori"),
                        createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Yazı Sayısı"),
                        createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "İşlemler")
                      ])
                    ]),
                    createVNode("tbody", { class: "divide-y divide-gray-200" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (category) => {
                        return openBlock(), createBlock("tr", {
                          key: category.id,
                          class: "hover:bg-gray-50"
                        }, [
                          createVNode("td", { class: "px-6 py-4" }, [
                            editingId.value === category.id ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "flex gap-2"
                            }, [
                              withDirectives(createVNode("input", {
                                "onUpdate:modelValue": ($event) => unref(editForm).name = $event,
                                type: "text",
                                class: ["flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-red-500", { "border-red-500": unref(editForm).errors.name }]
                              }, null, 10, ["onUpdate:modelValue"]), [
                                [vModelText, unref(editForm).name]
                              ])
                            ])) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "font-medium text-gray-900"
                            }, toDisplayString(category.name), 1))
                          ]),
                          createVNode("td", { class: "px-6 py-4" }, [
                            createVNode("span", { class: "px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm" }, toDisplayString(category.posts_count) + " yazı ", 1)
                          ]),
                          createVNode("td", { class: "px-6 py-4" }, [
                            editingId.value === category.id ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "flex items-center gap-2"
                            }, [
                              createVNode("button", {
                                onClick: ($event) => submitEdit(category),
                                disabled: unref(editForm).processing,
                                class: "text-green-600 hover:text-green-700 text-sm"
                              }, " Kaydet ", 8, ["onClick", "disabled"]),
                              createVNode("button", {
                                onClick: cancelEdit,
                                class: "text-gray-600 hover:text-gray-700 text-sm"
                              }, " İptal ")
                            ])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "flex items-center gap-2"
                            }, [
                              createVNode("button", {
                                onClick: ($event) => startEdit(category),
                                class: "text-blue-600 hover:text-blue-700 text-sm"
                              }, " Düzenle ", 8, ["onClick"]),
                              category.posts_count === 0 ? (openBlock(), createBlock("button", {
                                key: 0,
                                onClick: ($event) => deleteCategory(category),
                                class: "text-red-600 hover:text-red-700 text-sm"
                              }, " Sil ", 8, ["onClick"])) : createCommentVNode("", true)
                            ]))
                          ])
                        ]);
                      }), 128)),
                      __props.categories.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                        createVNode("td", {
                          colspan: "3",
                          class: "px-6 py-8 text-center text-gray-500"
                        }, " Henüz kategori yok. ")
                      ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Categories/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
