import { computed, mergeProps, useSSRContext, unref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
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
    const topMoods = computed(() => (props.stats.top_mood_tags || []).slice(0, 3));
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
        _push(`<span class="px-2 py-0.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-full">${ssrInterpolate(mood)}</span>`);
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: `/yazi/${__props.post.slug}`,
        class: "block bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative aspect-[2/3] bg-gray-100"${_scopeId}>`);
            if (__props.post.cover_image) {
              _push2(`<img${ssrRenderAttr("src", __props.post.cover_image)}${ssrRenderAttr("alt", __props.post.title)} class="w-full h-full object-cover" loading="lazy"${_scopeId}>`);
            } else {
              _push2(`<div class="w-full h-full flex items-center justify-center text-gray-400"${_scopeId}><svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg></div>`);
            }
            _push2(`<div class="absolute top-2 left-2 flex items-center gap-1.5"${_scopeId}>`);
            if (__props.post.user?.avatar) {
              _push2(`<img${ssrRenderAttr("src", __props.post.user.avatar)} class="w-6 h-6 rounded-full border border-white"${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="text-[10px] font-medium text-white drop-shadow"${_scopeId}>${ssrInterpolate(__props.post.user?.name)}</span></div>`);
            if (__props.post.rating) {
              _push2(`<div class="absolute top-2 right-2 bg-white/90 rounded px-1.5 py-0.5 text-xs font-bold text-yellow-600"${_scopeId}>${ssrInterpolate("★".repeat(__props.post.rating))}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="p-3"${_scopeId}><h3 class="text-sm font-bold text-gray-900 truncate"${_scopeId}>${ssrInterpolate(__props.post.title)}</h3>`);
            if (__props.post.watched_at) {
              _push2(`<p class="text-xs text-gray-400 mt-0.5"${_scopeId}>${ssrInterpolate(__props.post.watched_at)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.post.mood_tags?.length) {
              _push2(`<div class="flex flex-wrap gap-1 mt-1.5"${_scopeId}><!--[-->`);
              ssrRenderList(__props.post.mood_tags.slice(0, 2), (mood) => {
                _push2(`<span class="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded"${_scopeId}>${ssrInterpolate(mood)}</span>`);
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
                  class: "w-full h-full flex items-center justify-center text-gray-400"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-10 h-10",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    })
                  ]))
                ])),
                createVNode("div", { class: "absolute top-2 left-2 flex items-center gap-1.5" }, [
                  __props.post.user?.avatar ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: __props.post.user.avatar,
                    class: "w-6 h-6 rounded-full border border-white"
                  }, null, 8, ["src"])) : createCommentVNode("", true),
                  createVNode("span", { class: "text-[10px] font-medium text-white drop-shadow" }, toDisplayString(__props.post.user?.name), 1)
                ]),
                __props.post.rating ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "absolute top-2 right-2 bg-white/90 rounded px-1.5 py-0.5 text-xs font-bold text-yellow-600"
                }, toDisplayString("★".repeat(__props.post.rating)), 1)) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "p-3" }, [
                createVNode("h3", { class: "text-sm font-bold text-gray-900 truncate" }, toDisplayString(__props.post.title), 1),
                __props.post.watched_at ? (openBlock(), createBlock("p", {
                  key: 0,
                  class: "text-xs text-gray-400 mt-0.5"
                }, toDisplayString(__props.post.watched_at), 1)) : createCommentVNode("", true),
                __props.post.mood_tags?.length ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "flex flex-wrap gap-1 mt-1.5"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.post.mood_tags.slice(0, 2), (mood) => {
                    return openBlock(), createBlock("span", {
                      key: mood,
                      class: "px-1.5 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded"
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
