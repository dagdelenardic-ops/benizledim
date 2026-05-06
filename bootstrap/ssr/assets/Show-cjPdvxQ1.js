import { computed, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList } from "vue/server-renderer";
import { usePage, Link, router } from "@inertiajs/vue3";
import { A as AppLayout } from "./AppLayout-Bunikqc4.js";
import { _ as _sfc_main$3 } from "./PostGrid-XfxM0aNu.js";
import { _ as _sfc_main$2, a as _sfc_main$4 } from "./WatchLogCard-CjKvGqAo.js";
import { _ as _sfc_main$1 } from "./FollowButton-B1R8OU26.js";
import "@headlessui/vue";
import "./PostCard-BwkqJ6T-.js";
import "./useDate-Es1AW_qO.js";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    author: { type: Object, required: true },
    posts: { type: Object, required: true },
    stats: { type: Object, default: () => ({}) },
    activeTab: { type: String, default: "standard" }
  },
  setup(__props) {
    const page = usePage();
    const authUser = computed(() => page.props.auth?.user);
    const tabs = [
      { key: "standard", label: "Yazılar" },
      { key: "watch_log", label: "Watch-Log" },
      { key: "lists", label: "Listeler", disabled: true }
    ];
    const switchTab = (tab) => {
      if (tab.disabled) return;
      router.get(page.url, { format: tab.key }, { preserveState: true, preserveScroll: true, replace: true });
    };
    const getRoleLabel = (role) => {
      const labels = { admin: "Admin", editor: "Editör", author: "Yazar", reader: "Okuyucu" };
      return labels[role] || role;
    };
    const getRoleColor = (role) => {
      const colors = { admin: "bg-red-100 text-red-700", editor: "bg-purple-100 text-purple-700", author: "bg-blue-100 text-blue-700", reader: "bg-gray-100 text-gray-700" };
      return colors[role] || "bg-gray-100 text-gray-700";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: __props.author.name
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-gray-50"${_scopeId}><div class="bg-gradient-to-br from-gray-100 to-gray-200 border-b border-gray-200"${_scopeId}><div class="max-w-7xl mx-auto px-4 py-12 md:py-16"${_scopeId}><div class="flex flex-col md:flex-row items-center gap-6 text-center md:text-left"${_scopeId}><div class="flex-shrink-0"${_scopeId}>`);
            if (__props.author.avatar) {
              _push2(`<img${ssrRenderAttr("src", __props.author.avatar)}${ssrRenderAttr("alt", __props.author.name)} class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"${_scopeId}>`);
            } else {
              _push2(`<div class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg"${_scopeId}>${ssrInterpolate(__props.author.name?.charAt(0)?.toUpperCase() || "?")}</div>`);
            }
            _push2(`</div><div class="flex-1"${_scopeId}><div class="flex flex-col md:flex-row items-center gap-3 mb-2"${_scopeId}><h1 class="text-3xl md:text-4xl font-bold text-gray-900"${_scopeId}>${ssrInterpolate(__props.author.name)}</h1><span class="${ssrRenderClass(["px-3 py-1 rounded-full text-sm font-medium", getRoleColor(__props.author.role)])}"${_scopeId}>${ssrInterpolate(getRoleLabel(__props.author.role))}</span></div>`);
            if (__props.author.bio) {
              _push2(`<p class="text-gray-600 max-w-2xl"${_scopeId}>${ssrInterpolate(__props.author.bio)}</p>`);
            } else {
              _push2(`<p class="text-gray-500 italic"${_scopeId}>Henüz biyografi eklenmemiş.</p>`);
            }
            _push2(`<div class="mt-4"${_scopeId}>`);
            if (authUser.value && authUser.value.id !== __props.author.id) {
              _push2(ssrRenderComponent(_sfc_main$1, {
                user: __props.author,
                "initial-following": __props.author.is_following,
                "initial-followers-count": __props.stats.followers_count || 0
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<p class="text-sm font-semibold text-gray-500"${_scopeId}>${ssrInterpolate(__props.stats.followers_count || 0)} takipçi</p>`);
            }
            _push2(`</div></div></div></div></div><div class="max-w-7xl mx-auto px-4 -mt-6"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, { stats: __props.stats }, null, _parent2, _scopeId));
            _push2(`</div><div class="max-w-7xl mx-auto px-4 mt-8"${_scopeId}><div class="flex border-b border-gray-200"${_scopeId}><!--[-->`);
            ssrRenderList(tabs, (tab) => {
              _push2(`<button class="${ssrRenderClass(["px-6 py-3 text-sm font-bold border-b-2 transition-colors", __props.activeTab === tab.key ? "border-red-600 text-red-600" : tab.disabled ? "border-transparent text-gray-300 cursor-not-allowed" : "border-transparent text-gray-500 hover:text-gray-700"])}"${_scopeId}>${ssrInterpolate(tab.label)}</button>`);
            });
            _push2(`<!--]--></div></div><div class="max-w-7xl mx-auto px-4 py-8"${_scopeId}>`);
            if (__props.activeTab === "standard") {
              _push2(`<!--[-->`);
              if (__props.posts.data?.length) {
                _push2(ssrRenderComponent(_sfc_main$3, {
                  posts: __props.posts.data
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<div class="text-center py-16"${_scopeId}><h3 class="text-xl font-semibold text-gray-900 mb-2"${_scopeId}>Henüz yazı yok</h3><p class="text-gray-500"${_scopeId}>Bu yazar henüz yazı paylaşmamış.</p></div>`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.activeTab === "watch_log") {
              _push2(`<!--[-->`);
              if (__props.posts.data?.length) {
                _push2(`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
                ssrRenderList(__props.posts.data, (log) => {
                  _push2(ssrRenderComponent(_sfc_main$4, {
                    key: log.id,
                    post: log
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<div class="text-center py-16"${_scopeId}><h3 class="text-xl font-semibold text-gray-900 mb-2"${_scopeId}>Henüz watch-log yok</h3><p class="text-gray-500"${_scopeId}>Bu yazar henüz izleme notu paylaşmamış.</p></div>`);
              }
              _push2(`<!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.posts.links && __props.posts.data?.length > 0) {
              _push2(`<div class="max-w-7xl mx-auto px-4 pb-12 flex justify-center"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.posts.links, (link, index) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: index,
                  href: link.url || "#",
                  class: ["px-4 py-2 text-sm font-medium transition-colors", link.active ? "bg-red-600 text-white" : link.url ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg" : "bg-gray-100 text-gray-400 cursor-not-allowed rounded-lg"]
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-gray-50" }, [
                createVNode("div", { class: "bg-gradient-to-br from-gray-100 to-gray-200 border-b border-gray-200" }, [
                  createVNode("div", { class: "max-w-7xl mx-auto px-4 py-12 md:py-16" }, [
                    createVNode("div", { class: "flex flex-col md:flex-row items-center gap-6 text-center md:text-left" }, [
                      createVNode("div", { class: "flex-shrink-0" }, [
                        __props.author.avatar ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: __props.author.avatar,
                          alt: __props.author.name,
                          class: "w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg"
                        }, toDisplayString(__props.author.name?.charAt(0)?.toUpperCase() || "?"), 1))
                      ]),
                      createVNode("div", { class: "flex-1" }, [
                        createVNode("div", { class: "flex flex-col md:flex-row items-center gap-3 mb-2" }, [
                          createVNode("h1", { class: "text-3xl md:text-4xl font-bold text-gray-900" }, toDisplayString(__props.author.name), 1),
                          createVNode("span", {
                            class: ["px-3 py-1 rounded-full text-sm font-medium", getRoleColor(__props.author.role)]
                          }, toDisplayString(getRoleLabel(__props.author.role)), 3)
                        ]),
                        __props.author.bio ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-gray-600 max-w-2xl"
                        }, toDisplayString(__props.author.bio), 1)) : (openBlock(), createBlock("p", {
                          key: 1,
                          class: "text-gray-500 italic"
                        }, "Henüz biyografi eklenmemiş.")),
                        createVNode("div", { class: "mt-4" }, [
                          authUser.value && authUser.value.id !== __props.author.id ? (openBlock(), createBlock(_sfc_main$1, {
                            key: 0,
                            user: __props.author,
                            "initial-following": __props.author.is_following,
                            "initial-followers-count": __props.stats.followers_count || 0
                          }, null, 8, ["user", "initial-following", "initial-followers-count"])) : (openBlock(), createBlock("p", {
                            key: 1,
                            class: "text-sm font-semibold text-gray-500"
                          }, toDisplayString(__props.stats.followers_count || 0) + " takipçi", 1))
                        ])
                      ])
                    ])
                  ])
                ]),
                createVNode("div", { class: "max-w-7xl mx-auto px-4 -mt-6" }, [
                  createVNode(_sfc_main$2, { stats: __props.stats }, null, 8, ["stats"])
                ]),
                createVNode("div", { class: "max-w-7xl mx-auto px-4 mt-8" }, [
                  createVNode("div", { class: "flex border-b border-gray-200" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(tabs, (tab) => {
                      return createVNode("button", {
                        key: tab.key,
                        onClick: ($event) => switchTab(tab),
                        class: ["px-6 py-3 text-sm font-bold border-b-2 transition-colors", __props.activeTab === tab.key ? "border-red-600 text-red-600" : tab.disabled ? "border-transparent text-gray-300 cursor-not-allowed" : "border-transparent text-gray-500 hover:text-gray-700"]
                      }, toDisplayString(tab.label), 11, ["onClick"]);
                    }), 64))
                  ])
                ]),
                createVNode("div", { class: "max-w-7xl mx-auto px-4 py-8" }, [
                  __props.activeTab === "standard" ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                    __props.posts.data?.length ? (openBlock(), createBlock(_sfc_main$3, {
                      key: 0,
                      posts: __props.posts.data
                    }, null, 8, ["posts"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-center py-16"
                    }, [
                      createVNode("h3", { class: "text-xl font-semibold text-gray-900 mb-2" }, "Henüz yazı yok"),
                      createVNode("p", { class: "text-gray-500" }, "Bu yazar henüz yazı paylaşmamış.")
                    ]))
                  ], 64)) : createCommentVNode("", true),
                  __props.activeTab === "watch_log" ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                    __props.posts.data?.length ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.posts.data, (log) => {
                        return openBlock(), createBlock(_sfc_main$4, {
                          key: log.id,
                          post: log
                        }, null, 8, ["post"]);
                      }), 128))
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-center py-16"
                    }, [
                      createVNode("h3", { class: "text-xl font-semibold text-gray-900 mb-2" }, "Henüz watch-log yok"),
                      createVNode("p", { class: "text-gray-500" }, "Bu yazar henüz izleme notu paylaşmamış.")
                    ]))
                  ], 64)) : createCommentVNode("", true)
                ]),
                __props.posts.links && __props.posts.data?.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "max-w-7xl mx-auto px-4 pb-12 flex justify-center"
                }, [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.posts.links, (link, index) => {
                      return openBlock(), createBlock(unref(Link), {
                        key: index,
                        href: link.url || "#",
                        class: ["px-4 py-2 text-sm font-medium transition-colors", link.active ? "bg-red-600 text-white" : link.url ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg" : "bg-gray-100 text-gray-400 cursor-not-allowed rounded-lg"],
                        innerHTML: link.label
                      }, null, 8, ["href", "class", "innerHTML"]);
                    }), 128))
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
