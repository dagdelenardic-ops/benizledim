import { ref, mergeProps, withCtx, unref, createVNode, withModifiers, createTextVNode, withDirectives, vModelText, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from "vue/server-renderer";
import { useForm, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-fOISzqII.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    events: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const newForm = useForm({
      title: "",
      description: "",
      cover_image: null,
      event_date: "",
      slider_order: 0
    });
    const onNewCoverChange = (event) => {
      newForm.cover_image = event.target.files[0] || null;
    };
    const submitNew = () => {
      newForm.post("/admin/festival-events", {
        forceFormData: true,
        onSuccess: () => newForm.reset()
      });
    };
    const editingId = ref(null);
    const editForm = useForm({
      title: "",
      description: "",
      cover_image: null,
      event_date: "",
      slider_order: 0
    });
    const startEdit = (event) => {
      editingId.value = event.id;
      editForm.title = event.title || "";
      editForm.description = event.description || "";
      editForm.event_date = event.event_date || "";
      editForm.slider_order = event.slider_order || 0;
      editForm.cover_image = null;
    };
    const onEditCoverChange = (event) => {
      editForm.cover_image = event.target.files[0] || null;
    };
    const submitEdit = (event) => {
      editForm.transform((data) => ({ ...data, _method: "PUT" }));
      editForm.post(`/admin/festival-events/${event.id}`, {
        forceFormData: true,
        onSuccess: () => {
          editingId.value = null;
        }
      });
    };
    const cancelEdit = () => {
      editingId.value = null;
      editForm.reset();
    };
    const deleteEvent = (event) => {
      if (!confirm(`"${event.title}" etkinliğini silmek istediğinize emin misiniz?`)) return;
      newForm.delete(`/admin/festival-events/${event.id}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Festival Yönetimi" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><h1 class="text-2xl font-bold text-gray-900"${_scopeId}>Festival Yönetimi</h1><div class="bg-white rounded-lg shadow-sm p-6 space-y-4"${_scopeId}><h2 class="text-lg font-medium text-gray-900"${_scopeId}>Yeni Etkinlik</h2><form class="grid md:grid-cols-2 gap-4"${_scopeId}><div class="md:col-span-2"${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Başlık <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(newForm).title)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(newForm).errors.title }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>`);
            if (unref(newForm).errors.title) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(newForm).errors.title)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="md:col-span-2"${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Açıklama</label><textarea rows="3" class="${ssrRenderClass([{ "border-red-500": unref(newForm).errors.description }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>${ssrInterpolate(unref(newForm).description)}</textarea>`);
            if (unref(newForm).errors.description) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(newForm).errors.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Etkinlik Tarihi</label><input${ssrRenderAttr("value", unref(newForm).event_date)} type="date" class="${ssrRenderClass([{ "border-red-500": unref(newForm).errors.event_date }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>`);
            if (unref(newForm).errors.event_date) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(newForm).errors.event_date)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Slider Sırası</label><input${ssrRenderAttr("value", unref(newForm).slider_order)} type="number" min="0" class="${ssrRenderClass([{ "border-red-500": unref(newForm).errors.slider_order }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>`);
            if (unref(newForm).errors.slider_order) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(newForm).errors.slider_order)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="md:col-span-2"${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Kapak Görseli</label><input type="file" accept="image/*" class="w-full text-sm"${_scopeId}>`);
            if (unref(newForm).errors.cover_image) {
              _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(newForm).errors.cover_image)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="md:col-span-2"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(newForm).processing) ? " disabled" : ""} class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"${_scopeId}>`);
            if (unref(newForm).processing) {
              _push2(`<span${_scopeId}>Kaydediliyor...</span>`);
            } else {
              _push2(`<span${_scopeId}>Kaydet</span>`);
            }
            _push2(`</button></div></form></div><div class="bg-white rounded-lg shadow-sm overflow-hidden"${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="w-full min-w-[600px]"${_scopeId}><thead class="bg-gray-50"${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Başlık</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Tarih</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Sıra</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>İşlemler</th></tr></thead><tbody class="divide-y divide-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(__props.events.data, (event) => {
              _push2(`<tr class="hover:bg-gray-50"${_scopeId}><td class="px-6 py-4"${_scopeId}><div class="font-medium text-gray-900"${_scopeId}>${ssrInterpolate(event.title)}</div><div class="text-xs text-gray-500 mt-1 line-clamp-2"${_scopeId}>${ssrInterpolate(event.description)}</div></td><td class="px-6 py-4 text-gray-600"${_scopeId}>${ssrInterpolate(event.event_date || "-")}</td><td class="px-6 py-4 text-gray-600"${_scopeId}>${ssrInterpolate(event.slider_order)}</td><td class="px-6 py-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><button class="text-blue-600 hover:text-blue-700 text-sm"${_scopeId}>Düzenle</button><button class="text-red-600 hover:text-red-700 text-sm"${_scopeId}>Sil</button></div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (!__props.events.data || __props.events.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="4" class="px-6 py-8 text-center text-gray-500"${_scopeId}>Henüz etkinlik bulunmuyor.</td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
            if (__props.events.links && __props.events.links.length > 3) {
              _push2(`<div class="px-6 py-4 border-t border-gray-200 flex justify-center"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.events.links, (link, index) => {
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
              _push2(`<div class="bg-white rounded-lg shadow-sm p-6 space-y-4"${_scopeId}><h2 class="text-lg font-medium text-gray-900"${_scopeId}>Etkinlik Düzenle</h2><form class="grid md:grid-cols-2 gap-4"${_scopeId}><div class="md:col-span-2"${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Başlık <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", unref(editForm).title)} type="text" class="${ssrRenderClass([{ "border-red-500": unref(editForm).errors.title }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>`);
              if (unref(editForm).errors.title) {
                _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(editForm).errors.title)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="md:col-span-2"${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Açıklama</label><textarea rows="3" class="${ssrRenderClass([{ "border-red-500": unref(editForm).errors.description }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>${ssrInterpolate(unref(editForm).description)}</textarea>`);
              if (unref(editForm).errors.description) {
                _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(editForm).errors.description)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Etkinlik Tarihi</label><input${ssrRenderAttr("value", unref(editForm).event_date)} type="date" class="${ssrRenderClass([{ "border-red-500": unref(editForm).errors.event_date }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>`);
              if (unref(editForm).errors.event_date) {
                _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(editForm).errors.event_date)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Slider Sırası</label><input${ssrRenderAttr("value", unref(editForm).slider_order)} type="number" min="0" class="${ssrRenderClass([{ "border-red-500": unref(editForm).errors.slider_order }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"])}"${_scopeId}>`);
              if (unref(editForm).errors.slider_order) {
                _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(editForm).errors.slider_order)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="md:col-span-2"${_scopeId}><label class="block text-sm text-gray-700 mb-1"${_scopeId}>Yeni Kapak</label><input type="file" accept="image/*" class="w-full text-sm"${_scopeId}>`);
              if (unref(editForm).errors.cover_image) {
                _push2(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(editForm).errors.cover_image)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="md:col-span-2 flex gap-2"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(editForm).processing) ? " disabled" : ""} class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"${_scopeId}>`);
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
                createVNode("h1", { class: "text-2xl font-bold text-gray-900" }, "Festival Yönetimi"),
                createVNode("div", { class: "bg-white rounded-lg shadow-sm p-6 space-y-4" }, [
                  createVNode("h2", { class: "text-lg font-medium text-gray-900" }, "Yeni Etkinlik"),
                  createVNode("form", {
                    onSubmit: withModifiers(submitNew, ["prevent"]),
                    class: "grid md:grid-cols-2 gap-4"
                  }, [
                    createVNode("div", { class: "md:col-span-2" }, [
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
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, "Açıklama"),
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => unref(newForm).description = $event,
                        rows: "3",
                        class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(newForm).errors.description }]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(newForm).description]
                      ]),
                      unref(newForm).errors.description ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-600"
                      }, toDisplayString(unref(newForm).errors.description), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, "Etkinlik Tarihi"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(newForm).event_date = $event,
                        type: "date",
                        class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(newForm).errors.event_date }]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(newForm).event_date]
                      ]),
                      unref(newForm).errors.event_date ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-600"
                      }, toDisplayString(unref(newForm).errors.event_date), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, "Slider Sırası"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(newForm).slider_order = $event,
                        type: "number",
                        min: "0",
                        class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(newForm).errors.slider_order }]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(newForm).slider_order]
                      ]),
                      unref(newForm).errors.slider_order ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-600"
                      }, toDisplayString(unref(newForm).errors.slider_order), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, "Kapak Görseli"),
                      createVNode("input", {
                        type: "file",
                        accept: "image/*",
                        onChange: onNewCoverChange,
                        class: "w-full text-sm"
                      }, null, 32),
                      unref(newForm).errors.cover_image ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-600"
                      }, toDisplayString(unref(newForm).errors.cover_image), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "md:col-span-2" }, [
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
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Tarih"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Sıra"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "İşlemler")
                        ])
                      ]),
                      createVNode("tbody", { class: "divide-y divide-gray-200" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.events.data, (event) => {
                          return openBlock(), createBlock("tr", {
                            key: event.id,
                            class: "hover:bg-gray-50"
                          }, [
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode("div", { class: "font-medium text-gray-900" }, toDisplayString(event.title), 1),
                              createVNode("div", { class: "text-xs text-gray-500 mt-1 line-clamp-2" }, toDisplayString(event.description), 1)
                            ]),
                            createVNode("td", { class: "px-6 py-4 text-gray-600" }, toDisplayString(event.event_date || "-"), 1),
                            createVNode("td", { class: "px-6 py-4 text-gray-600" }, toDisplayString(event.slider_order), 1),
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                createVNode("button", {
                                  onClick: ($event) => startEdit(event),
                                  class: "text-blue-600 hover:text-blue-700 text-sm"
                                }, "Düzenle", 8, ["onClick"]),
                                createVNode("button", {
                                  onClick: ($event) => deleteEvent(event),
                                  class: "text-red-600 hover:text-red-700 text-sm"
                                }, "Sil", 8, ["onClick"])
                              ])
                            ])
                          ]);
                        }), 128)),
                        !__props.events.data || __props.events.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                          createVNode("td", {
                            colspan: "4",
                            class: "px-6 py-8 text-center text-gray-500"
                          }, "Henüz etkinlik bulunmuyor.")
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  __props.events.links && __props.events.links.length > 3 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "px-6 py-4 border-t border-gray-200 flex justify-center"
                  }, [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.events.links, (link, index) => {
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
                  createVNode("h2", { class: "text-lg font-medium text-gray-900" }, "Etkinlik Düzenle"),
                  createVNode("form", {
                    onSubmit: withModifiers(($event) => submitEdit(__props.events.data.find((item) => item.id === editingId.value)), ["prevent"]),
                    class: "grid md:grid-cols-2 gap-4"
                  }, [
                    createVNode("div", { class: "md:col-span-2" }, [
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
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, "Açıklama"),
                      withDirectives(createVNode("textarea", {
                        "onUpdate:modelValue": ($event) => unref(editForm).description = $event,
                        rows: "3",
                        class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(editForm).errors.description }]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(editForm).description]
                      ]),
                      unref(editForm).errors.description ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-600"
                      }, toDisplayString(unref(editForm).errors.description), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, "Etkinlik Tarihi"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(editForm).event_date = $event,
                        type: "date",
                        class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(editForm).errors.event_date }]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(editForm).event_date]
                      ]),
                      unref(editForm).errors.event_date ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-600"
                      }, toDisplayString(unref(editForm).errors.event_date), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, "Slider Sırası"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(editForm).slider_order = $event,
                        type: "number",
                        min: "0",
                        class: ["w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500", { "border-red-500": unref(editForm).errors.slider_order }]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(editForm).slider_order]
                      ]),
                      unref(editForm).errors.slider_order ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-600"
                      }, toDisplayString(unref(editForm).errors.slider_order), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "md:col-span-2" }, [
                      createVNode("label", { class: "block text-sm text-gray-700 mb-1" }, "Yeni Kapak"),
                      createVNode("input", {
                        type: "file",
                        accept: "image/*",
                        onChange: onEditCoverChange,
                        class: "w-full text-sm"
                      }, null, 32),
                      unref(editForm).errors.cover_image ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-sm text-red-600"
                      }, toDisplayString(unref(editForm).errors.cover_image), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "md:col-span-2 flex gap-2" }, [
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Festival/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
