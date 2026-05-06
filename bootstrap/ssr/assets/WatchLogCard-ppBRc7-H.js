import { computed, mergeProps, useSSRContext, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { u as useDate } from "./useDate-CbchC0lg.js";
const _sfc_main$1 = {
  __name: "AuthorStatCard",
  __ssrInlineRender: true,
  props: {
    stats: { type: Object, default: () => ({}) },
    year: { type: Number, default: null }
  },
  setup(__props) {
    const props = __props;
    const totalLogs = computed(() => (props.stats.posts_count || 0) + (props.stats.watch_logs_count || 0));
    const avgRating = computed(() => props.stats.avg_rating ? Number(props.stats.avg_rating).toFixed(1) : null);
    const topMoods = computed(() => (props.stats.top_mood_tags || []).slice(0, 3).map((mood) => {
      if (typeof mood === "string") {
        return { tag: mood, count: null };
      }
      if (mood && typeof mood.tag === "string" && mood.tag !== "") {
        return mood;
      }
      return null;
    }).filter(Boolean));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-2 lg:grid-cols-4 gap-3" }, _attrs))}><div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"><div class="text-xs text-gray-500 mb-1">${ssrInterpolate(__props.year || "Bu Yıl")}</div><div class="text-3xl font-bold text-red-600">${ssrInterpolate(totalLogs.value)}</div><div class="text-xs text-gray-400 mt-1">${ssrInterpolate(__props.stats.posts_count || 0)} yazı, ${ssrInterpolate(__props.stats.watch_logs_count || 0)} not</div></div><div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"><div class="text-xs text-gray-500 mb-1">Beğeni</div><div class="text-3xl font-bold text-red-600">${ssrInterpolate(__props.stats.total_likes_received || 0)}</div><div class="text-xs text-gray-400 mt-1">${ssrInterpolate(avgRating.value ? `Ortalama ${avgRating.value} ★` : "")}</div></div><div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"><div class="text-xs text-gray-500 mb-1">En Çok Beğenilen</div>`);
      if (__props.stats.most_liked_post) {
        _push(`<div class="flex items-center gap-2">`);
        if (__props.stats.most_liked_post.cover_image) {
          _push(`<img${ssrRenderAttr("src", __props.stats.most_liked_post.cover_image)} class="w-10 h-14 object-cover rounded border">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="text-xs font-medium text-gray-800 line-clamp-2">${ssrInterpolate(__props.stats.most_liked_post.title)}</div></div>`);
      } else {
        _push(`<div class="text-xs text-gray-400">Henüz yok</div>`);
      }
      _push(`</div><div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm"><div class="text-xs text-gray-500 mb-1">Mood Paletin</div><div class="flex flex-wrap gap-1"><!--[-->`);
      ssrRenderList(topMoods.value, (mood) => {
        _push(`<span class="px-2 py-0.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-full">${ssrInterpolate(mood.tag)}</span>`);
      });
      _push(`<!--]-->`);
      if (!topMoods.value.length) {
        _push(`<span class="text-xs text-gray-400">Henüz yok</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Author/AuthorStatCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "WatchLogCard",
  __ssrInlineRender: true,
  props: {
    post: { type: Object, required: true }
  },
  setup(__props) {
    const props = __props;
    const { formatDate } = useDate();
    const formattedWatchedOn = computed(() => props.post?.watched_on ? formatDate(props.post.watched_on) : null);
    const visibleMoods = computed(() => Array.isArray(props.post?.mood_tags) ? props.post.mood_tags.slice(0, 3) : []);
    const fallbackMonogram = computed(() => props.post?.title?.charAt(0)?.toUpperCase() || "B");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: `/yazi/${__props.post.slug}`,
        class: "flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative aspect-[2/3] bg-gray-100"${_scopeId}>`);
            if (__props.post.cover_image) {
              _push2(`<img${ssrRenderAttr("src", __props.post.cover_image)}${ssrRenderAttr("alt", __props.post.title)} class="w-full h-full object-cover" loading="lazy"${_scopeId}>`);
            } else {
              _push2(`<div class="flex h-full w-full items-end bg-gradient-to-br from-stone-100 via-white to-stone-200 p-3"${_scopeId}><div${_scopeId}><p class="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500"${_scopeId}>Watch Log</p><p class="mt-2 text-4xl font-black text-gray-800"${_scopeId}>${ssrInterpolate(fallbackMonogram.value)}</p></div></div>`);
            }
            if (__props.post.rating) {
              _push2(`<div class="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-yellow-700 shadow-sm"${_scopeId}>${ssrInterpolate(__props.post.rating)}/10 </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex flex-1 flex-col p-3"${_scopeId}><h3 class="line-clamp-2 text-sm font-bold text-gray-900"${_scopeId}>${ssrInterpolate(__props.post.title)}</h3>`);
            if (formattedWatchedOn.value) {
              _push2(`<p class="mt-1 text-xs text-gray-400"${_scopeId}>${ssrInterpolate(formattedWatchedOn.value)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.post.excerpt) {
              _push2(`<p class="mt-2 line-clamp-3 text-xs leading-5 text-gray-600"${_scopeId}>${ssrInterpolate(__props.post.excerpt)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (visibleMoods.value.length) {
              _push2(`<div class="mt-3 flex flex-wrap gap-1"${_scopeId}><!--[-->`);
              ssrRenderList(visibleMoods.value, (mood) => {
                _push2(`<span class="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"${_scopeId}>${ssrInterpolate(mood)}</span>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "relative aspect-[2/3] bg-gray-100" }, [
                __props.post.cover_image ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: __props.post.cover_image,
                  alt: __props.post.title,
                  class: "w-full h-full object-cover",
                  loading: "lazy"
                }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "flex h-full w-full items-end bg-gradient-to-br from-stone-100 via-white to-stone-200 p-3"
                }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500" }, "Watch Log"),
                    createVNode("p", { class: "mt-2 text-4xl font-black text-gray-800" }, toDisplayString(fallbackMonogram.value), 1)
                  ])
                ])),
                __props.post.rating ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[11px] font-bold text-yellow-700 shadow-sm"
                }, toDisplayString(__props.post.rating) + "/10 ", 1)) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "flex flex-1 flex-col p-3" }, [
                createVNode("h3", { class: "line-clamp-2 text-sm font-bold text-gray-900" }, toDisplayString(__props.post.title), 1),
                formattedWatchedOn.value ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "mt-1 text-xs text-gray-400"
                }, toDisplayString(formattedWatchedOn.value), 1)) : createCommentVNode("", true),
                __props.post.excerpt ? (openBlock(), createBlock("p", {
                  key: 1,
                  class: "mt-2 line-clamp-3 text-xs leading-5 text-gray-600"
                }, toDisplayString(__props.post.excerpt), 1)) : createCommentVNode("", true),
                visibleMoods.value.length ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "mt-3 flex flex-wrap gap-1"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(visibleMoods.value, (mood) => {
                    return openBlock(), createBlock("span", {
                      key: mood,
                      class: "rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
                    }, toDisplayString(mood), 1);
                  }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Post/WatchLogCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main$1 as _,
  _sfc_main as a
};
