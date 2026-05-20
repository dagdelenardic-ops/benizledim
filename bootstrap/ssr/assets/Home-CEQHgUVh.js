import { ref, onMounted, unref, mergeProps, useSSRContext, computed, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { u as usePushSubscription, A as AppLayout } from "./AppLayout-DJaRjmfw.js";
import { _ as _sfc_main$3, a as _sfc_main$4 } from "./WatchLogCard-ppBRc7-H.js";
import { _ as _sfc_main$5 } from "./PostCard-CO9kh5rs.js";
import "@headlessui/vue";
import "axios";
import "./useDate-CbchC0lg.js";
const _sfc_main$2 = {
  __name: "PushOptInCard",
  __ssrInlineRender: true,
  setup(__props) {
    const { supported } = usePushSubscription();
    const show = ref(false);
    ref(false);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    onMounted(() => {
      const count = parseInt(localStorage.getItem("visit_count") || "0", 10) + 1;
      localStorage.setItem("visit_count", String(count));
      const dismissedAt = localStorage.getItem("push_dismissed_at");
      const sevenDays = 7 * 24 * 60 * 60 * 1e3;
      const canShow = count >= 2 && Notification.permission === "default" && (!dismissedAt || Date.now() - parseInt(dismissedAt, 10) > sevenDays);
      show.value = canShow;
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (show.value && unref(supported)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white border-2 border-[var(--bi-ink)] p-4" }, _attrs))}><div class="flex items-start justify-between gap-4"><div><h3 class="font-bold text-sm">${ssrInterpolate(unref(isIOS) && !unref(isStandalone) ? "Önce ana ekrana ekleyin" : "Bildirimleri açın")}</h3><p class="text-xs text-gray-500 mt-1">${ssrInterpolate(unref(isIOS) && !unref(isStandalone) ? "Paylaş ▸ Ana Ekrana Ekle yapıp sonra bildirimleri etkinleştirebilirsiniz." : "Yeni yazılar ve yorumlardan anında haberdar olun.")}</p></div><div class="flex gap-2 flex-shrink-0">`);
        if (!unref(isIOS) || unref(isStandalone)) {
          _push(`<button class="bg-red-700 text-white px-3 py-1.5 text-xs font-bold hover:bg-red-800">Bildirim Al</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">Şimdi Değil</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Author/PushOptInCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "LetterboxdConnectCard",
  __ssrInlineRender: true,
  props: {
    letterboxd: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const step = ref(props.letterboxd?.username ? "connected" : "input");
    const username = ref(props.letterboxd?.username || "");
    const previewEntries = ref([]);
    const lastSyncAt = ref(props.letterboxd?.lastSyncAt || null);
    const loading = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3" }, _attrs))}><h3 class="font-bold text-sm flex items-center gap-2"><svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 16.29L13.17 21.17C13.89 21.89 15 21.36 15 20.41V3.59C15 2.64 13.89 2.11 13.17 2.83L8.29 7.71C7.9 8.1 7.5 8.1 7.11 7.71L2.83 3.41C2.11 2.69 1 3.22 1 4.17V19.83C1 20.78 2.11 21.31 2.83 20.59L7.11 16.29C7.5 15.9 7.9 15.9 8.29 16.29Z"></path></svg> Letterboxd </h3>`);
      if (error.value) {
        _push(`<div class="text-xs text-red-600 bg-red-50 p-2">${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (step.value === "input") {
        _push(`<!--[--><p class="text-xs text-gray-500">Letterboxd hesabınızı bağlayın, izleme geçmişinizi senkronize edin.</p><div class="flex gap-2"><input${ssrRenderAttr("value", username.value)} type="text" placeholder="letterboxd.com/ kullanıcı adınız" class="flex-1 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 rounded-lg"><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="bg-orange-500 text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50">${ssrInterpolate(loading.value ? "..." : "Bağla")}</button></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (step.value === "preview") {
        _push(`<!--[--><p class="text-xs text-gray-500">Bu siz misiniz? Son 5 entry:</p><div class="divide-y border rounded-lg max-h-48 overflow-y-auto"><!--[-->`);
        ssrRenderList(previewEntries.value.slice(0, 5), (entry) => {
          _push(`<div class="px-3 py-2 text-xs flex justify-between"><span class="truncate">${ssrInterpolate(entry.title || entry.name)}</span><span class="text-gray-400 ml-2 flex-shrink-0">${ssrInterpolate(entry.rating ? "★".repeat(Math.round(entry.rating)) : "")}</span></div>`);
        });
        _push(`<!--]--></div><div class="flex gap-2"><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="bg-orange-500 text-white px-4 py-2 text-sm font-bold rounded-lg hover:bg-orange-600 disabled:opacity-50">Evet, Bu Benim</button><button class="border border-gray-300 px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50">Hayır</button></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (step.value === "connected") {
        _push(`<!--[--><div class="flex items-center gap-2 text-sm"><span class="w-2 h-2 rounded-full bg-green-500"></span><span class="font-medium">${ssrInterpolate(username.value || __props.letterboxd.username)} bağlı</span></div>`);
        if (lastSyncAt.value) {
          _push(`<p class="text-xs text-gray-400">Son sync: ${ssrInterpolate(new Date(lastSyncAt.value).toLocaleString("tr-TR"))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex gap-2"><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="border border-gray-300 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-gray-50">${ssrInterpolate(loading.value ? "..." : "Şimdi Sync Et")}</button><button class="text-xs text-red-500 hover:text-red-700">Bağlantıyı Kes</button></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Author/LetterboxdConnectCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Home",
  __ssrInlineRender: true,
  props: {
    stats: { type: Object, default: () => ({}) },
    recentLogs: { type: Array, default: () => [] },
    recentPosts: { type: Array, default: () => [] },
    pendingDrafts: { type: Number, default: 0 },
    letterboxd: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const page = usePage();
    const canAccessCms = computed(() => ["admin", "editor", "author"].includes(page.props.auth?.user?.role || ""));
    const openLog = () => window.dispatchEvent(new CustomEvent("quick-log:open"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({ title: "Panelim" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-5xl mx-auto px-4 py-8 space-y-8"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h1 class="text-3xl font-black text-[var(--bi-ink)]"${_scopeId}>Hoş geldin, ${ssrInterpolate(_ctx.$page.props.auth.user?.name)}</h1><p class="text-sm text-[var(--bi-muted)] mt-1"${_scopeId}>${ssrInterpolate(canAccessCms.value ? "Film günlüğüne not ekle veya yazı yaz." : "Film günlüğüne hızlıca not ekle.")}</p></div><button class="flex items-center gap-2 bg-red-700 text-white px-5 py-3 font-bold hover:bg-red-800 transition-colors"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId}></path></svg> Hızlı Not </button></div>`);
            if (__props.pendingDrafts > 0) {
              _push2(`<div class="border-2 border-amber-500 bg-amber-50 p-4 text-sm font-bold text-amber-900"${_scopeId}>${ssrInterpolate(__props.pendingDrafts)} Letterboxd taslağın gözden geçirilmeyi bekliyor. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$3, { stats: __props.stats }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, { letterboxd: __props.letterboxd }, null, _parent2, _scopeId));
            if (__props.recentLogs.length) {
              _push2(`<section${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><h2 class="text-xl font-bold text-[var(--bi-ink)]"${_scopeId}>Son Notların</h2>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/profile/${_ctx.$page.props.auth.user?.id}?format=watch_log`,
                class: "text-sm text-red-700 hover:text-red-800 font-bold"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Tümünü Gör →`);
                  } else {
                    return [
                      createTextVNode("Tümünü Gör →")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.recentLogs, (log) => {
                _push2(ssrRenderComponent(_sfc_main$4, {
                  key: log.id,
                  post: log
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.recentPosts.length) {
              _push2(`<section${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><h2 class="text-xl font-bold text-[var(--bi-ink)]"${_scopeId}>Son Yazıların</h2>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/profile/${_ctx.$page.props.auth.user?.id}`,
                class: "text-sm text-red-700 hover:text-red-800 font-bold"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Tümünü Gör →`);
                  } else {
                    return [
                      createTextVNode("Tümünü Gör →")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.recentPosts, (post) => {
                _push2(ssrRenderComponent(_sfc_main$5, {
                  key: post.id,
                  post
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            if (!__props.recentLogs.length && !__props.recentPosts.length) {
              _push2(`<div class="text-center py-12 border-2 border-dashed border-[var(--bi-ink)] bg-[var(--bi-paper)]"${_scopeId}><p class="text-lg font-bold text-[var(--bi-muted)]"${_scopeId}>Henüz not veya yazı yok</p><p class="text-sm text-gray-400 mt-1"${_scopeId}>+ butonuna tıklayarak ilk notunu ekle!</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "max-w-5xl mx-auto px-4 py-8 space-y-8" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-3xl font-black text-[var(--bi-ink)]" }, "Hoş geldin, " + toDisplayString(_ctx.$page.props.auth.user?.name), 1),
                    createVNode("p", { class: "text-sm text-[var(--bi-muted)] mt-1" }, toDisplayString(canAccessCms.value ? "Film günlüğüne not ekle veya yazı yaz." : "Film günlüğüne hızlıca not ekle."), 1)
                  ]),
                  createVNode("button", {
                    onClick: openLog,
                    class: "flex items-center gap-2 bg-red-700 text-white px-5 py-3 font-bold hover:bg-red-800 transition-colors"
                  }, [
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
                        d: "M12 4v16m8-8H4"
                      })
                    ])),
                    createTextVNode(" Hızlı Not ")
                  ])
                ]),
                __props.pendingDrafts > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "border-2 border-amber-500 bg-amber-50 p-4 text-sm font-bold text-amber-900"
                }, toDisplayString(__props.pendingDrafts) + " Letterboxd taslağın gözden geçirilmeyi bekliyor. ", 1)) : createCommentVNode("", true),
                createVNode(_sfc_main$3, { stats: __props.stats }, null, 8, ["stats"]),
                createVNode(_sfc_main$2),
                createVNode(_sfc_main$1, { letterboxd: __props.letterboxd }, null, 8, ["letterboxd"]),
                __props.recentLogs.length ? (openBlock(), createBlock("section", { key: 1 }, [
                  createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                    createVNode("h2", { class: "text-xl font-bold text-[var(--bi-ink)]" }, "Son Notların"),
                    createVNode(unref(Link), {
                      href: `/profile/${_ctx.$page.props.auth.user?.id}?format=watch_log`,
                      class: "text-sm text-red-700 hover:text-red-800 font-bold"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Tümünü Gör →")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ]),
                  createVNode("div", { class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.recentLogs, (log) => {
                      return openBlock(), createBlock(_sfc_main$4, {
                        key: log.id,
                        post: log
                      }, null, 8, ["post"]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                __props.recentPosts.length ? (openBlock(), createBlock("section", { key: 2 }, [
                  createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                    createVNode("h2", { class: "text-xl font-bold text-[var(--bi-ink)]" }, "Son Yazıların"),
                    createVNode(unref(Link), {
                      href: `/profile/${_ctx.$page.props.auth.user?.id}`,
                      class: "text-sm text-red-700 hover:text-red-800 font-bold"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Tümünü Gör →")
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ]),
                  createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.recentPosts, (post) => {
                      return openBlock(), createBlock(_sfc_main$5, {
                        key: post.id,
                        post
                      }, null, 8, ["post"]);
                    }), 128))
                  ])
                ])) : createCommentVNode("", true),
                !__props.recentLogs.length && !__props.recentPosts.length ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "text-center py-12 border-2 border-dashed border-[var(--bi-ink)] bg-[var(--bi-paper)]"
                }, [
                  createVNode("p", { class: "text-lg font-bold text-[var(--bi-muted)]" }, "Henüz not veya yazı yok"),
                  createVNode("p", { class: "text-sm text-gray-400 mt-1" }, "+ butonuna tıklayarak ilk notunu ekle!")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Author/Home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
