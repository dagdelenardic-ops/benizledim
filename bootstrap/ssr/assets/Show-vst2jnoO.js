import { computed, mergeProps, withCtx, unref, createTextVNode, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { A as AppLayout } from "./AppLayout-ogTCebx3.js";
import "@headlessui/vue";
import "axios";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    item: { type: Object, required: true },
    related: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const canonicalUrl = computed(() => `https://benizledim.com/haber/${props.item.slug}`);
    const paragraphs = computed(() => {
      const c = props.item.content_tr || "";
      return String(c).split(/\n{2,}|\r\n\r\n/).map((p) => p.trim()).filter(Boolean);
    });
    const formatDate = (date) => {
      if (!date) return "";
      try {
        return new Date(date).toLocaleString("tr-TR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch (e) {
        return "";
      }
    };
    const articleSchema = computed(() => ({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: props.item.title_tr,
      description: props.item.summary_tr,
      image: props.item.image_url ? [props.item.image_url] : void 0,
      datePublished: props.item.published_at,
      dateModified: props.item.updated_at || props.item.published_at,
      author: { "@type": "Organization", name: props.item.source_name },
      publisher: {
        "@type": "Organization",
        name: "Ben İzledim",
        logo: { "@type": "ImageObject", url: "https://benizledim.com/images/og-default.png" }
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl.value },
      isBasedOn: props.item.source_url,
      inLanguage: "tr-TR"
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: __props.item.title_tr,
        description: __props.item.summary_tr,
        "og-image": __props.item.image_url || "/images/og-default.png",
        "canonical-url": canonicalUrl.value,
        "og-type": "article",
        "schema-nodes": [articleSchema.value]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<article class="bg-[var(--bi-paper)]"${_scopeId}><header class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]"${_scopeId}><div class="bi-wrap py-6"${_scopeId}><div class="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/",
              class: "text-red-700 hover:text-red-900"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Anasayfa`);
                } else {
                  return [
                    createTextVNode("Anasayfa")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span${_scopeId}>/</span><span${_scopeId}>Flash Haberler</span><span${_scopeId}>/</span><span class="bg-red-600 px-2 py-0.5 text-white"${_scopeId}>${ssrInterpolate(__props.item.source_name)}</span></div><h1 class="bi-serif text-3xl font-bold leading-tight text-[var(--bi-ink)] md:text-5xl"${_scopeId}>${ssrInterpolate(__props.item.title_tr)}</h1><p class="mt-4 max-w-3xl text-base leading-7 text-[var(--bi-muted)] md:text-lg md:leading-8"${_scopeId}>${ssrInterpolate(__props.item.summary_tr)}</p><div class="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId}><time${ssrRenderAttr("datetime", __props.item.published_at)}${_scopeId}>${ssrInterpolate(formatDate(__props.item.published_at))}</time><span${_scopeId}>•</span><span${_scopeId}>Kaynak: ${ssrInterpolate(__props.item.source_name)}</span></div></div></header>`);
            if (__props.item.image_url) {
              _push2(`<div class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-ink)]"${_scopeId}><div class="bi-wrap py-0"${_scopeId}><div class="relative aspect-[16/9] w-full overflow-hidden"${_scopeId}><img${ssrRenderAttr("src", __props.item.image_url)}${ssrRenderAttr("alt", __props.item.title_tr)} class="h-full w-full object-cover" loading="eager" fetchpriority="high" decoding="async" referrerpolicy="no-referrer"${_scopeId}></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="bi-wrap grid gap-10 py-10 lg:grid-cols-[1fr_320px]"${_scopeId}><div class="prose-bi max-w-none space-y-5 text-base leading-8 text-[var(--bi-ink)] md:text-lg md:leading-9"${_scopeId}><!--[-->`);
            ssrRenderList(paragraphs.value, (p, idx) => {
              _push2(`<p${_scopeId}>${ssrInterpolate(p)}</p>`);
            });
            _push2(`<!--]--><div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t-2 border-[var(--bi-ink)] pt-6"${_scopeId}><div class="text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId}> Bu haber otomatik olarak ${ssrInterpolate(__props.item.source_name)} kaynağından çevrilmiştir. </div><a${ssrRenderAttr("href", __props.item.source_url)} target="_blank" rel="noopener noreferrer nofollow" class="inline-flex items-center gap-2 bg-[var(--bi-ink)] px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] transition hover:bg-red-700 bi-mono"${_scopeId}> Orijinal habere git <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3h7v7M10 14L21 3M21 14v7H3V3h7"${_scopeId}></path></svg></a></div></div>`);
            if (__props.related.length) {
              _push2(`<aside class="h-fit border border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]"${_scopeId}><div class="border-b border-[var(--bi-ink)] bg-[var(--bi-ink)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] bi-mono"${_scopeId}> Diğer Flash Haberler </div><!--[-->`);
              ssrRenderList(__props.related, (r) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: r.id,
                  href: `/haber/${r.slug}`,
                  class: "block border-b border-[var(--bi-ink)]/20 p-4 transition hover:bg-[var(--bi-paper)]"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-red-700 bi-mono"${_scopeId2}>${ssrInterpolate(r.source_name)}</div><div class="mt-1 bi-serif text-sm font-bold leading-snug text-[var(--bi-ink)] line-clamp-3"${_scopeId2}>${ssrInterpolate(r.title_tr)}</div><div class="mt-2 text-[0.6rem] uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId2}>${ssrInterpolate(formatDate(r.published_at))}</div>`);
                    } else {
                      return [
                        createVNode("div", { class: "text-[0.6rem] font-bold uppercase tracking-[0.1em] text-red-700 bi-mono" }, toDisplayString(r.source_name), 1),
                        createVNode("div", { class: "mt-1 bi-serif text-sm font-bold leading-snug text-[var(--bi-ink)] line-clamp-3" }, toDisplayString(r.title_tr), 1),
                        createVNode("div", { class: "mt-2 text-[0.6rem] uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, toDisplayString(formatDate(r.published_at)), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></aside>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></article>`);
          } else {
            return [
              createVNode("article", { class: "bg-[var(--bi-paper)]" }, [
                createVNode("header", { class: "border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]" }, [
                  createVNode("div", { class: "bi-wrap py-6" }, [
                    createVNode("div", { class: "mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, [
                      createVNode(unref(Link), {
                        href: "/",
                        class: "text-red-700 hover:text-red-900"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Anasayfa")
                        ]),
                        _: 1
                      }),
                      createVNode("span", null, "/"),
                      createVNode("span", null, "Flash Haberler"),
                      createVNode("span", null, "/"),
                      createVNode("span", { class: "bg-red-600 px-2 py-0.5 text-white" }, toDisplayString(__props.item.source_name), 1)
                    ]),
                    createVNode("h1", { class: "bi-serif text-3xl font-bold leading-tight text-[var(--bi-ink)] md:text-5xl" }, toDisplayString(__props.item.title_tr), 1),
                    createVNode("p", { class: "mt-4 max-w-3xl text-base leading-7 text-[var(--bi-muted)] md:text-lg md:leading-8" }, toDisplayString(__props.item.summary_tr), 1),
                    createVNode("div", { class: "mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, [
                      createVNode("time", {
                        datetime: __props.item.published_at
                      }, toDisplayString(formatDate(__props.item.published_at)), 9, ["datetime"]),
                      createVNode("span", null, "•"),
                      createVNode("span", null, "Kaynak: " + toDisplayString(__props.item.source_name), 1)
                    ])
                  ])
                ]),
                __props.item.image_url ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "border-b-2 border-[var(--bi-ink)] bg-[var(--bi-ink)]"
                }, [
                  createVNode("div", { class: "bi-wrap py-0" }, [
                    createVNode("div", { class: "relative aspect-[16/9] w-full overflow-hidden" }, [
                      createVNode("img", {
                        src: __props.item.image_url,
                        alt: __props.item.title_tr,
                        class: "h-full w-full object-cover",
                        loading: "eager",
                        fetchpriority: "high",
                        decoding: "async",
                        referrerpolicy: "no-referrer"
                      }, null, 8, ["src", "alt"])
                    ])
                  ])
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "bi-wrap grid gap-10 py-10 lg:grid-cols-[1fr_320px]" }, [
                  createVNode("div", { class: "prose-bi max-w-none space-y-5 text-base leading-8 text-[var(--bi-ink)] md:text-lg md:leading-9" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(paragraphs.value, (p, idx) => {
                      return openBlock(), createBlock("p", { key: idx }, toDisplayString(p), 1);
                    }), 128)),
                    createVNode("div", { class: "mt-10 flex flex-wrap items-center justify-between gap-4 border-t-2 border-[var(--bi-ink)] pt-6" }, [
                      createVNode("div", { class: "text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, " Bu haber otomatik olarak " + toDisplayString(__props.item.source_name) + " kaynağından çevrilmiştir. ", 1),
                      createVNode("a", {
                        href: __props.item.source_url,
                        target: "_blank",
                        rel: "noopener noreferrer nofollow",
                        class: "inline-flex items-center gap-2 bg-[var(--bi-ink)] px-5 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] transition hover:bg-red-700 bi-mono"
                      }, [
                        createTextVNode(" Orijinal habere git "),
                        (openBlock(), createBlock("svg", {
                          class: "h-3 w-3",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M14 3h7v7M10 14L21 3M21 14v7H3V3h7"
                          })
                        ]))
                      ], 8, ["href"])
                    ])
                  ]),
                  __props.related.length ? (openBlock(), createBlock("aside", {
                    key: 0,
                    class: "h-fit border border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]"
                  }, [
                    createVNode("div", { class: "border-b border-[var(--bi-ink)] bg-[var(--bi-ink)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] bi-mono" }, " Diğer Flash Haberler "),
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.related, (r) => {
                      return openBlock(), createBlock(unref(Link), {
                        key: r.id,
                        href: `/haber/${r.slug}`,
                        class: "block border-b border-[var(--bi-ink)]/20 p-4 transition hover:bg-[var(--bi-paper)]"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "text-[0.6rem] font-bold uppercase tracking-[0.1em] text-red-700 bi-mono" }, toDisplayString(r.source_name), 1),
                          createVNode("div", { class: "mt-1 bi-serif text-sm font-bold leading-snug text-[var(--bi-ink)] line-clamp-3" }, toDisplayString(r.title_tr), 1),
                          createVNode("div", { class: "mt-2 text-[0.6rem] uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, toDisplayString(formatDate(r.published_at)), 1)
                        ]),
                        _: 2
                      }, 1032, ["href"]);
                    }), 128))
                  ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/FlashNews/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
