import { ref, onMounted, unref, mergeProps, useSSRContext, onUnmounted, computed, withCtx, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderTeleport, ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
import { useForm, Link } from "@inertiajs/vue3";
import { A as AppLayout } from "./AppLayout-Bunikqc4.js";
import { _ as _sfc_main$4, a as _sfc_main$5 } from "./WatchLogCard-CjKvGqAo.js";
import axios from "axios";
import { _ as _sfc_main$6 } from "./PostCard-BwkqJ6T-.js";
import "@headlessui/vue";
import "./useDate-Es1AW_qO.js";
function usePushSubscription() {
  const isSubscribed = ref(false);
  const supported = "serviceWorker" in navigator && "PushManager" in window;
  const urlBase64ToUint8Array = (b64) => {
    const padding = "=".repeat((4 - b64.length % 4) % 4);
    const base64 = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
  };
  const subscribe = async (vapidPublicKey) => {
    if (!supported) throw new Error("Push desteklenmiyor");
    const perm = await Notification.requestPermission();
    if (perm !== "granted") throw new Error("İzin verilmedi");
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) });
    await axios.post("/api/push/subscribe", sub.toJSON());
    isSubscribed.value = true;
    try {
      await axios.post("/api/push/test");
    } catch {
    }
  };
  const unsubscribe = async () => {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      try {
        await axios.delete("/api/push/subscribe", { data: { endpoint: sub.endpoint } });
      } catch {
      }
      await sub.unsubscribe();
    }
    isSubscribed.value = false;
  };
  return { supported, isSubscribed, subscribe, unsubscribe };
}
const _sfc_main$3 = {
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Author/PushOptInCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Author/LetterboxdConnectCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "QuickLogModal",
  __ssrInlineRender: true,
  emits: ["close", "submitted"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const open = ref(false);
    const step = ref(1);
    const searchQuery = ref("");
    const searchResults = ref([]);
    const searchLoading = ref(false);
    const selectedTmdb = ref(null);
    const moodOptions = ["romantik", "gerilim", "melankolik", "vintage", "suç", "zihin-bükücü", "retro", "cesur", "duygusal", "sessiz"];
    const form = useForm({
      tmdb_id: null,
      external_title: "",
      external_year: "",
      cover_image: "",
      rating: null,
      mood_tags: [],
      note: "",
      watched_at: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      status: "published"
    });
    const isMobile = ref(window.innerWidth < 768);
    const onResize = () => {
      isMobile.value = window.innerWidth < 768;
    };
    onMounted(() => window.addEventListener("resize", onResize));
    onUnmounted(() => window.removeEventListener("resize", onResize));
    const show = () => {
      open.value = true;
    };
    const starLabels = ["Berbat", "Çok Kötü", "Kötü", "İdare Eder", "Orta", "Ortanın Üstü", "İyi", "Çok İyi", "Harika", "Başyapıt"];
    const ratingLabel = computed(() => form.rating ? starLabels[form.rating - 1] : "");
    __expose({ show });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (open.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50"><div class="${ssrRenderClass(["bg-white overflow-y-auto max-h-[90vh] w-full md:max-w-lg md:rounded-lg md:shadow-xl border-t-2 md:border-2 border-[var(--bi-ink)]", isMobile.value ? "rounded-t-xl" : ""])}"><div class="sticky top-0 z-10 flex items-center justify-between border-b-2 border-[var(--bi-ink)] bg-white px-4 py-3"><h2 class="text-lg font-bold">Hızlı Not</h2><button class="text-gray-500 hover:text-gray-700"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="p-4 space-y-4">`);
          if (unref(form).errors && Object.keys(unref(form).errors).length) {
            _push2(`<div class="bg-red-50 border border-red-200 text-red-700 text-sm p-3">${ssrInterpolate(Object.values(unref(form).errors)[0])}</div>`);
          } else {
            _push2(`<!---->`);
          }
          if (step.value === 1) {
            _push2(`<!--[--><div class="relative"><input${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Film veya dizi ara..." class="w-full border-2 border-[var(--bi-ink)] px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-red-700/20">`);
            if (searchLoading.value) {
              _push2(`<div class="absolute right-3 top-3"><svg class="animate-spin w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (searchResults.value.length) {
              _push2(`<div class="border-2 border-[var(--bi-ink)] divide-y divide-[var(--bi-rule-soft)] max-h-80 overflow-y-auto"><!--[-->`);
              ssrRenderList(searchResults.value, (item) => {
                _push2(`<button class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--bi-paper)] transition-colors">`);
                if (item.poster_path) {
                  _push2(`<img${ssrRenderAttr("src", `https://image.tmdb.org/t/p/w92${item.poster_path}`)} class="w-10 h-14 object-cover border border-gray-200">`);
                } else {
                  _push2(`<div class="w-10 h-14 bg-gray-200 flex items-center justify-center text-gray-400 text-xs">N/A</div>`);
                }
                _push2(`<div class="flex-1 min-w-0"><div class="font-medium text-sm truncate">${ssrInterpolate(item.title || item.name)}</div><div class="text-xs text-gray-500">${ssrInterpolate((item.release_date || item.first_air_date || "").slice(0, 4))} · ${ssrInterpolate(item.media_type === "tv" ? "Dizi" : "Film")}</div></div></button>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-gray-400">TMDB&#39;de bulamadıysanız notu manuel girebilirsiniz.</p><!--]-->`);
          } else {
            _push2(`<!---->`);
          }
          if (step.value === 2) {
            _push2(`<!--[-->`);
            if (selectedTmdb.value) {
              _push2(`<div class="flex items-center gap-3 bg-[var(--bi-paper)] border-2 border-[var(--bi-ink)] p-3">`);
              if (selectedTmdb.value.poster_path) {
                _push2(`<img${ssrRenderAttr("src", `https://image.tmdb.org/t/p/w185${selectedTmdb.value.poster_path}`)} class="w-12 h-16 object-cover border border-gray-200">`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="flex-1 min-w-0"><div class="font-bold truncate">${ssrInterpolate(selectedTmdb.value.title || selectedTmdb.value.name)}</div><div class="text-xs text-gray-500">${ssrInterpolate((selectedTmdb.value.release_date || selectedTmdb.value.first_air_date || "").slice(0, 4))}</div></div><button class="text-gray-400 hover:text-red-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div><label class="block text-sm font-bold mb-2">Puanın (1-10)</label><div class="flex items-center gap-1"><!--[-->`);
            ssrRenderList(10, (i) => {
              _push2(`<button class="${ssrRenderClass([unref(form).rating && i <= unref(form).rating ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400", "text-2xl transition-colors"])}">★</button>`);
            });
            _push2(`<!--]--></div>`);
            if (ratingLabel.value) {
              _push2(`<p class="mt-1 text-xs font-medium text-yellow-700">${ssrInterpolate(ratingLabel.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div><label class="block text-sm font-bold mb-2">Mod (en fazla 3)</label><div class="flex flex-wrap gap-2"><!--[-->`);
            ssrRenderList(moodOptions, (mood) => {
              _push2(`<button class="${ssrRenderClass(["px-3 py-1 rounded-full text-xs font-medium border transition-colors", unref(form).mood_tags.includes(mood) ? "border-red-600 bg-red-100 text-red-700" : "border-gray-300 text-gray-600 hover:border-gray-400"])}">${ssrInterpolate(mood)}</button>`);
            });
            _push2(`<!--]--></div></div><div><label class="block text-sm font-bold mb-2">Notun</label><textarea maxlength="280" rows="3" class="w-full border-2 border-[var(--bi-ink)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-700/20" placeholder="Ne düşündün?">${ssrInterpolate(unref(form).note)}</textarea><div class="${ssrRenderClass([unref(form).note.length > 240 ? "text-red-600 font-bold" : "text-gray-400", "text-right text-xs"])}">${ssrInterpolate(unref(form).note.length)}/280</div></div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-bold mb-1">Tarih</label><input${ssrRenderAttr("value", unref(form).watched_at)} type="date" class="w-full border-2 border-[var(--bi-ink)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"></div><div class="flex items-end gap-2"><button type="button" class="${ssrRenderClass(["flex-1 border-2 px-3 py-2 text-xs font-bold transition-colors", unref(form).status === "published" ? "border-red-700 bg-red-700 text-white" : "border-[var(--bi-ink)] bg-white text-[var(--bi-ink)]"])}">${ssrInterpolate(unref(form).status === "published" ? "Yayınla" : "Taslak")}</button></div></div><button${ssrIncludeBooleanAttr(unref(form).processing || !unref(form).rating) ? " disabled" : ""} class="w-full bg-red-700 text-white py-3 font-bold hover:bg-red-800 disabled:opacity-50 transition-colors">${ssrInterpolate(unref(form).processing ? "Kaydediliyor..." : unref(form).status === "published" ? "Yayınla" : "Taslak Olarak Kaydet")}</button><!--]-->`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Author/QuickLogModal.vue");
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
    const quickLogModal = ref(null);
    const openLog = () => quickLogModal.value?.show();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({ title: "Yazar Paneli" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="max-w-5xl mx-auto px-4 py-8 space-y-8"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div${_scopeId}><h1 class="text-3xl font-black text-[var(--bi-ink)]"${_scopeId}>Hoş geldin, ${ssrInterpolate(_ctx.$page.props.auth.user?.name)}</h1><p class="text-sm text-[var(--bi-muted)] mt-1"${_scopeId}>Film günlüğüne not ekle veya yazı yaz.</p></div><button class="flex items-center gap-2 bg-red-700 text-white px-5 py-3 font-bold hover:bg-red-800 transition-colors"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId}></path></svg> Hızlı Not </button></div>`);
            if (__props.pendingDrafts > 0) {
              _push2(`<div class="border-2 border-amber-500 bg-amber-50 p-4 text-sm font-bold text-amber-900"${_scopeId}>${ssrInterpolate(__props.pendingDrafts)} Letterboxd taslağın gözden geçirilmeyi bekliyor. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_sfc_main$4, { stats: __props.stats }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$3, null, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, { letterboxd: __props.letterboxd }, null, _parent2, _scopeId));
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
                _push2(ssrRenderComponent(_sfc_main$5, {
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
                _push2(ssrRenderComponent(_sfc_main$6, {
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
            _push2(ssrRenderComponent(_sfc_main$1, {
              ref_key: "quickLogModal",
              ref: quickLogModal,
              onClose: () => {
              },
              onSubmitted: () => _ctx.window.location.reload()
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "max-w-5xl mx-auto px-4 py-8 space-y-8" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("div", null, [
                    createVNode("h1", { class: "text-3xl font-black text-[var(--bi-ink)]" }, "Hoş geldin, " + toDisplayString(_ctx.$page.props.auth.user?.name), 1),
                    createVNode("p", { class: "text-sm text-[var(--bi-muted)] mt-1" }, "Film günlüğüne not ekle veya yazı yaz.")
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
                createVNode(_sfc_main$4, { stats: __props.stats }, null, 8, ["stats"]),
                createVNode(_sfc_main$3),
                createVNode(_sfc_main$2, { letterboxd: __props.letterboxd }, null, 8, ["letterboxd"]),
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
                      return openBlock(), createBlock(_sfc_main$5, {
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
                      return openBlock(), createBlock(_sfc_main$6, {
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
              ]),
              createVNode(_sfc_main$1, {
                ref_key: "quickLogModal",
                ref: quickLogModal,
                onClose: () => {
                },
                onSubmitted: () => _ctx.window.location.reload()
              }, null, 8, ["onSubmitted"])
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
