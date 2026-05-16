import { computed, unref, mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { u as useDate } from "./useDate-CbchC0lg.js";
const LOCAL_STORAGE_PREFIX = "/storage/";
const WIX_CDN_PREFIX = "https://static.wixstatic.com/";
const buildWixVariantUrl = (path, width) => {
  const match = path.match(/w_(\d+),h_(\d+)/);
  if (!match) {
    return path;
  }
  const sourceWidth = Number(match[1]);
  const sourceHeight = Number(match[2]);
  if (!sourceWidth || !sourceHeight) {
    return path;
  }
  const targetWidth = Math.min(width, sourceWidth);
  const targetHeight = Math.max(1, Math.round(sourceHeight / sourceWidth * targetWidth));
  return path.replace(/w_\d+/, `w_${targetWidth}`).replace(/h_\d+/, `h_${targetHeight}`);
};
const buildResponsiveImage = (path, options = {}) => {
  if (!path) {
    return {
      src: "",
      srcset: "",
      sizes: options.sizes || ""
    };
  }
  const ytMatch = String(path).match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/i
  );
  if (ytMatch) {
    const thumb = `https://i.ytimg.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
    return {
      src: thumb,
      srcset: "",
      sizes: options.sizes || ""
    };
  }
  if (!path.startsWith(LOCAL_STORAGE_PREFIX)) {
    if (path.startsWith(WIX_CDN_PREFIX)) {
      const widths2 = options.widths || [480, 768, 960, 1280];
      const fallbackWidth2 = options.fallbackWidth || widths2[widths2.length - 1];
      return {
        src: buildWixVariantUrl(path, fallbackWidth2),
        srcset: widths2.map((width) => `${buildWixVariantUrl(path, width)} ${width}w`).join(", "),
        sizes: options.sizes || ""
      };
    }
    return {
      src: path,
      srcset: "",
      sizes: options.sizes || ""
    };
  }
  const widths = options.widths || [480, 768, 960, 1280];
  const fallbackWidth = options.fallbackWidth || widths[widths.length - 1];
  const buildVariantUrl = (width) => `/img/variant?path=${encodeURIComponent(path)}&w=${width}`;
  return {
    src: buildVariantUrl(fallbackWidth),
    srcset: widths.map((width) => `${buildVariantUrl(width)} ${width}w`).join(", "),
    sizes: options.sizes || ""
  };
};
const _sfc_main = {
  __name: "PostCard",
  __ssrInlineRender: true,
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { timeAgo } = useDate();
    const coverImage = computed(() => buildResponsiveImage(props.post.cover_image, {
      widths: [480, 768, 960],
      sizes: "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
      fallbackWidth: 768
    }));
    const formatReadingTime = (minutes) => {
      if (!minutes) return "2 dk";
      return `${minutes} dk`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Link), mergeProps({
        href: `/yazi/${__props.post.slug}`,
        class: "bi-post-card group"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bi-post-card__image"${_scopeId}>`);
            if (__props.post.cover_image) {
              _push2(`<img${ssrRenderAttr("src", coverImage.value.src)}${ssrRenderAttr("srcset", coverImage.value.srcset || void 0)}${ssrRenderAttr("sizes", coverImage.value.sizes || void 0)}${ssrRenderAttr("alt", __props.post.title)} loading="lazy" decoding="async" width="800" height="500"${_scopeId}>`);
            } else {
              _push2(`<div class="bi-post-card__fallback"${_scopeId}> Bİ </div>`);
            }
            _push2(`<div class="absolute top-3 left-3 flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.post.categories?.slice(0, 1), (category) => {
              _push2(`<span class="bi-post-card__category"${_scopeId}>${ssrInterpolate(category.name)}</span>`);
            });
            _push2(`<!--]--></div></div><div class="bi-post-card__body"${_scopeId}><span class="bi-kicker"${_scopeId}>${ssrInterpolate(__props.post.categories?.[0]?.name || "Yazı")}</span><h3 class="bi-post-card__title line-clamp-2 group-hover:text-red-700 transition-colors"${_scopeId}>${ssrInterpolate(__props.post.title)}</h3><p class="text-sm leading-6 text-[var(--bi-muted)] line-clamp-3"${_scopeId}>${ssrInterpolate(__props.post.excerpt)}</p><div class="bi-post-card__meta flex flex-wrap items-center justify-between gap-3"${_scopeId}><div class="flex min-w-0 items-center gap-2"${_scopeId}>`);
            if (__props.post.user?.avatar) {
              _push2(`<img${ssrRenderAttr("src", __props.post.user.avatar)}${ssrRenderAttr("alt", __props.post.user.name)} class="h-7 w-7 rounded-full object-cover" loading="lazy" decoding="async"${_scopeId}>`);
            } else {
              _push2(`<div class="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white"${_scopeId}>${ssrInterpolate(__props.post.user?.name?.charAt(0)?.toUpperCase() || "U")}</div>`);
            }
            _push2(`<span class="truncate font-semibold text-[var(--bi-ink)]"${_scopeId}>${ssrInterpolate(__props.post.user?.name)}</span></div><span${_scopeId}>${ssrInterpolate(unref(timeAgo)(__props.post.published_at))} · ${ssrInterpolate(formatReadingTime(__props.post.reading_time_minutes))}</span></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bi-post-card__image" }, [
                __props.post.cover_image ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: coverImage.value.src,
                  srcset: coverImage.value.srcset || void 0,
                  sizes: coverImage.value.sizes || void 0,
                  alt: __props.post.title,
                  loading: "lazy",
                  decoding: "async",
                  width: "800",
                  height: "500"
                }, null, 8, ["src", "srcset", "sizes", "alt"])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "bi-post-card__fallback"
                }, " Bİ ")),
                createVNode("div", { class: "absolute top-3 left-3 flex flex-wrap gap-2" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.post.categories?.slice(0, 1), (category) => {
                    return openBlock(), createBlock("span", {
                      key: category.id,
                      class: "bi-post-card__category"
                    }, toDisplayString(category.name), 1);
                  }), 128))
                ])
              ]),
              createVNode("div", { class: "bi-post-card__body" }, [
                createVNode("span", { class: "bi-kicker" }, toDisplayString(__props.post.categories?.[0]?.name || "Yazı"), 1),
                createVNode("h3", { class: "bi-post-card__title line-clamp-2 group-hover:text-red-700 transition-colors" }, toDisplayString(__props.post.title), 1),
                createVNode("p", { class: "text-sm leading-6 text-[var(--bi-muted)] line-clamp-3" }, toDisplayString(__props.post.excerpt), 1),
                createVNode("div", { class: "bi-post-card__meta flex flex-wrap items-center justify-between gap-3" }, [
                  createVNode("div", { class: "flex min-w-0 items-center gap-2" }, [
                    __props.post.user?.avatar ? (openBlock(), createBlock("img", {
                      key: 0,
                      src: __props.post.user.avatar,
                      alt: __props.post.user.name,
                      class: "h-7 w-7 rounded-full object-cover",
                      loading: "lazy",
                      decoding: "async"
                    }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white"
                    }, toDisplayString(__props.post.user?.name?.charAt(0)?.toUpperCase() || "U"), 1)),
                    createVNode("span", { class: "truncate font-semibold text-[var(--bi-ink)]" }, toDisplayString(__props.post.user?.name), 1)
                  ]),
                  createVNode("span", null, toDisplayString(unref(timeAgo)(__props.post.published_at)) + " · " + toDisplayString(formatReadingTime(__props.post.reading_time_minutes)), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Post/PostCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _,
  buildResponsiveImage as b
};
