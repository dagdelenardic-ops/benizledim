import { ref, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, Teleport, withModifiers, withDirectives, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderTeleport } from "vue/server-renderer";
import { useForm, Link, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AdminLayout-CgPpPth9.js";
import { u as useDate } from "./useDate-CbchC0lg.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    users: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const { formatDate } = useDate();
    const updateRole = (user, newRole) => {
      router.put(`/admin/users/${user.id}/role`, { role: newRole }, {
        preserveScroll: true
      });
    };
    const setPassword = (user) => {
      passwordUser.value = user;
      passwordForm.reset();
      passwordForm.clearErrors();
      passwordForm.email = user.email;
      showPasswordModal.value = true;
    };
    const showPasswordModal = ref(false);
    const passwordUser = ref(null);
    const passwordForm = useForm({
      email: "",
      password: "",
      password_confirmation: ""
    });
    const submitPassword = () => {
      if (!passwordUser.value) return;
      passwordForm.put(`/admin/users/${passwordUser.value.id}/password`, {
        preserveScroll: true,
        onSuccess: () => {
          showPasswordModal.value = false;
          passwordUser.value = null;
          passwordForm.reset();
          passwordForm.clearErrors();
        }
      });
    };
    const closePasswordModal = () => {
      showPasswordModal.value = false;
      passwordUser.value = null;
      passwordForm.reset();
      passwordForm.clearErrors();
    };
    const getRoleBadge = (role) => {
      const colors = {
        admin: "bg-red-100 text-red-700",
        editor: "bg-purple-100 text-purple-700",
        author: "bg-blue-100 text-blue-700",
        reader: "bg-gray-100 text-gray-700"
      };
      return colors[role] || "bg-gray-100 text-gray-700";
    };
    const getProviderLabel = (user) => {
      if (user.has_google_connection) {
        return "Google bağlı";
      }
      if (user.is_wix_placeholder) {
        return "Wix placeholder";
      }
      return user.provider || "E-posta";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Kullanıcılar" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><h1 class="text-2xl font-bold text-gray-900"${_scopeId}>Kullanıcılar</h1><div class="bg-white rounded-lg shadow-sm overflow-hidden"${_scopeId}><div class="overflow-x-auto"${_scopeId}><table class="w-full"${_scopeId}><thead class="bg-gray-50"${_scopeId}><tr${_scopeId}><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Kullanıcı</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>E-posta</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Rol</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Bağlantı</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Yazılar</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Yorumlar</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>Kayıt Tarihi</th><th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"${_scopeId}>İşlemler</th></tr></thead><tbody class="divide-y divide-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(__props.users.data, (user) => {
              _push2(`<tr class="hover:bg-gray-50"${_scopeId}><td class="px-6 py-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
              if (user.avatar) {
                _push2(`<img${ssrRenderAttr("src", user.avatar)}${ssrRenderAttr("alt", user.name)} class="w-10 h-10 rounded-full object-cover"${_scopeId}>`);
              } else {
                _push2(`<div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold"${_scopeId}>${ssrInterpolate(user.name?.charAt(0)?.toUpperCase() || "?")}</div>`);
              }
              _push2(ssrRenderComponent(unref(Link), {
                href: `/profile/${user.id}`,
                class: "font-medium text-gray-900 hover:text-red-600"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(user.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(user.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></td><td class="px-6 py-4 text-gray-600 text-sm"${_scopeId}>${ssrInterpolate(user.email)}</td><td class="px-6 py-4"${_scopeId}><select${ssrRenderAttr("value", user.role)} class="${ssrRenderClass([getRoleBadge(user.role), "px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"])}"${ssrIncludeBooleanAttr(user.id === _ctx.$page.props.auth.user?.id) ? " disabled" : ""}${_scopeId}><option value="admin"${_scopeId}>Admin</option><option value="editor"${_scopeId}>Editör</option><option value="author"${_scopeId}>Yazar</option><option value="reader"${_scopeId}>Okuyucu</option></select></td><td class="px-6 py-4 text-sm text-gray-600"${_scopeId}>${ssrInterpolate(getProviderLabel(user))}</td><td class="px-6 py-4 text-gray-600"${_scopeId}>${ssrInterpolate(user.posts_count)}</td><td class="px-6 py-4 text-gray-600"${_scopeId}>${ssrInterpolate(user.comments_count)}</td><td class="px-6 py-4 text-gray-600 text-sm"${_scopeId}>${ssrInterpolate(unref(formatDate)(user.created_at))}</td><td class="px-6 py-4"${_scopeId}><div class="flex items-center gap-3 text-sm"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/posts?owner=${user.id}`,
                class: "text-gray-700 hover:text-red-600"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Yazıları Gör `);
                  } else {
                    return [
                      createTextVNode(" Yazıları Gör ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<button class="text-blue-600 hover:text-blue-700"${_scopeId}> Şifre Ata </button></div></td></tr>`);
            });
            _push2(`<!--]-->`);
            if (__props.users.data.length === 0) {
              _push2(`<tr${_scopeId}><td colspan="8" class="px-6 py-8 text-center text-gray-500"${_scopeId}> Kullanıcı bulunamadı. </td></tr>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</tbody></table></div>`);
            if (__props.users.links) {
              _push2(`<div class="px-6 py-4 border-t border-gray-200 flex justify-center"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.users.links, (link, index) => {
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
            ssrRenderTeleport(_push2, (_push3) => {
              if (showPasswordModal.value) {
                _push3(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"${_scopeId}><div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"${_scopeId}><h3 class="text-lg font-bold text-gray-900 mb-4"${_scopeId}>Şifre Ata: ${ssrInterpolate(unref(passwordForm).email)}</h3><form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Yeni Şifre</label><input${ssrRenderAttr("value", unref(passwordForm).password)} type="password" required minlength="10" placeholder="En az 10 karakter" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"${_scopeId}><p class="mt-1 text-xs text-gray-500"${_scopeId}>En az 10 karakter; küçük harf, büyük harf, rakam ve sembol içermeli.</p>`);
                if (unref(passwordForm).errors.password) {
                  _push3(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(passwordForm).errors.password)}</p>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div><div${_scopeId}><label class="block text-sm font-medium text-gray-700 mb-1"${_scopeId}>Şifre Tekrarı</label><input${ssrRenderAttr("value", unref(passwordForm).password_confirmation)} type="password" required minlength="10" placeholder="Şifreyi tekrar girin" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"${_scopeId}>`);
                if (unref(passwordForm).errors.password_confirmation) {
                  _push3(`<p class="mt-1 text-sm text-red-600"${_scopeId}>${ssrInterpolate(unref(passwordForm).errors.password_confirmation)}</p>`);
                } else {
                  _push3(`<!---->`);
                }
                _push3(`</div><div class="flex gap-2 justify-end"${_scopeId}><button type="button" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"${_scopeId}> İptal </button><button type="submit"${ssrIncludeBooleanAttr(unref(passwordForm).processing) ? " disabled" : ""} class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"${_scopeId}>${ssrInterpolate(unref(passwordForm).processing ? "Kaydediliyor..." : "Kaydet")}</button></div></form></div></div>`);
              } else {
                _push3(`<!---->`);
              }
            }, "body", false, _parent2);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("h1", { class: "text-2xl font-bold text-gray-900" }, "Kullanıcılar"),
                createVNode("div", { class: "bg-white rounded-lg shadow-sm overflow-hidden" }, [
                  createVNode("div", { class: "overflow-x-auto" }, [
                    createVNode("table", { class: "w-full" }, [
                      createVNode("thead", { class: "bg-gray-50" }, [
                        createVNode("tr", null, [
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Kullanıcı"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "E-posta"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Rol"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Bağlantı"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Yazılar"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Yorumlar"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "Kayıt Tarihi"),
                          createVNode("th", { class: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase" }, "İşlemler")
                        ])
                      ]),
                      createVNode("tbody", { class: "divide-y divide-gray-200" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.users.data, (user) => {
                          return openBlock(), createBlock("tr", {
                            key: user.id,
                            class: "hover:bg-gray-50"
                          }, [
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode("div", { class: "flex items-center gap-3" }, [
                                user.avatar ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: user.avatar,
                                  alt: user.name,
                                  class: "w-10 h-10 rounded-full object-cover"
                                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold"
                                }, toDisplayString(user.name?.charAt(0)?.toUpperCase() || "?"), 1)),
                                createVNode(unref(Link), {
                                  href: `/profile/${user.id}`,
                                  class: "font-medium text-gray-900 hover:text-red-600"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(user.name), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["href"])
                              ])
                            ]),
                            createVNode("td", { class: "px-6 py-4 text-gray-600 text-sm" }, toDisplayString(user.email), 1),
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode("select", {
                                value: user.role,
                                onChange: ($event) => updateRole(user, $event.target.value),
                                class: ["px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500", getRoleBadge(user.role)],
                                disabled: user.id === _ctx.$page.props.auth.user?.id
                              }, [
                                createVNode("option", { value: "admin" }, "Admin"),
                                createVNode("option", { value: "editor" }, "Editör"),
                                createVNode("option", { value: "author" }, "Yazar"),
                                createVNode("option", { value: "reader" }, "Okuyucu")
                              ], 42, ["value", "onChange", "disabled"])
                            ]),
                            createVNode("td", { class: "px-6 py-4 text-sm text-gray-600" }, toDisplayString(getProviderLabel(user)), 1),
                            createVNode("td", { class: "px-6 py-4 text-gray-600" }, toDisplayString(user.posts_count), 1),
                            createVNode("td", { class: "px-6 py-4 text-gray-600" }, toDisplayString(user.comments_count), 1),
                            createVNode("td", { class: "px-6 py-4 text-gray-600 text-sm" }, toDisplayString(unref(formatDate)(user.created_at)), 1),
                            createVNode("td", { class: "px-6 py-4" }, [
                              createVNode("div", { class: "flex items-center gap-3 text-sm" }, [
                                createVNode(unref(Link), {
                                  href: `/admin/posts?owner=${user.id}`,
                                  class: "text-gray-700 hover:text-red-600"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(" Yazıları Gör ")
                                  ]),
                                  _: 1
                                }, 8, ["href"]),
                                createVNode("button", {
                                  onClick: ($event) => setPassword(user),
                                  class: "text-blue-600 hover:text-blue-700"
                                }, " Şifre Ata ", 8, ["onClick"])
                              ])
                            ])
                          ]);
                        }), 128)),
                        __props.users.data.length === 0 ? (openBlock(), createBlock("tr", { key: 0 }, [
                          createVNode("td", {
                            colspan: "8",
                            class: "px-6 py-8 text-center text-gray-500"
                          }, " Kullanıcı bulunamadı. ")
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ]),
                  __props.users.links ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "px-6 py-4 border-t border-gray-200 flex justify-center"
                  }, [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.users.links, (link, index) => {
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
              ]),
              (openBlock(), createBlock(Teleport, { to: "body" }, [
                showPasswordModal.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
                  onClick: withModifiers(closePasswordModal, ["self"])
                }, [
                  createVNode("div", { class: "bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6" }, [
                    createVNode("h3", { class: "text-lg font-bold text-gray-900 mb-4" }, "Şifre Ata: " + toDisplayString(unref(passwordForm).email), 1),
                    createVNode("form", {
                      onSubmit: withModifiers(submitPassword, ["prevent"]),
                      class: "space-y-4"
                    }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Yeni Şifre"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(passwordForm).password = $event,
                          type: "password",
                          required: "",
                          minlength: "10",
                          placeholder: "En az 10 karakter",
                          class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(passwordForm).password]
                        ]),
                        createVNode("p", { class: "mt-1 text-xs text-gray-500" }, "En az 10 karakter; küçük harf, büyük harf, rakam ve sembol içermeli."),
                        unref(passwordForm).errors.password ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(passwordForm).errors.password), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-sm font-medium text-gray-700 mb-1" }, "Şifre Tekrarı"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(passwordForm).password_confirmation = $event,
                          type: "password",
                          required: "",
                          minlength: "10",
                          placeholder: "Şifreyi tekrar girin",
                          class: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(passwordForm).password_confirmation]
                        ]),
                        unref(passwordForm).errors.password_confirmation ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-sm text-red-600"
                        }, toDisplayString(unref(passwordForm).errors.password_confirmation), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "flex gap-2 justify-end" }, [
                        createVNode("button", {
                          type: "button",
                          onClick: closePasswordModal,
                          class: "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        }, " İptal "),
                        createVNode("button", {
                          type: "submit",
                          disabled: unref(passwordForm).processing,
                          class: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        }, toDisplayString(unref(passwordForm).processing ? "Kaydediliyor..." : "Kaydet"), 9, ["disabled"])
                      ])
                    ], 32)
                  ])
                ])) : createCommentVNode("", true)
              ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Users/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
