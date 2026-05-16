import { computed, mergeProps, withCtx, unref, createVNode, toDisplayString, createTextVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { A as AppLayout } from "./AppLayout-BH4qZStO.js";
import "@headlessui/vue";
import "axios";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    items: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const formatDate = (date) => {
      if (!date) return "";
      try {
        return new Date(date).toLocaleString("tr-TR", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch (e) {
        return "";
      }
    };
    const canonicalUrl = computed(() => {
      const page = props.items?.current_page ?? 1;
      return page > 1 ? `https://benizledim.com/haberler?page=${page}` : "https://benizledim.com/haberler";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: "Haberler",
        description: "Sinema dünyasından flash haberlerin tam arşivi — yabancı ve yerli kaynaklardan film, dizi, festival haberleri.",
        "canonical-url": canonicalUrl.value
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-[var(--bi-paper)]"${_scopeId}><div class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]"${_scopeId}><div class="bi-wrap py-10"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><span class="inline-flex items-center gap-2 bg-red-600 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white bi-mono"${_scopeId}><span class="inline-block h-2 w-2 animate-pulse rounded-full bg-white"${_scopeId}></span> Canlı </span><span class="bi-kicker"${_scopeId}>Arşiv</span></div><h1 class="bi-serif mt-3 text-5xl font-bold leading-none text-[var(--bi-ink)] md:text-7xl"${_scopeId}> Haberler </h1><p class="mt-4 max-w-2xl text-[var(--bi-muted)]"${_scopeId}> Sinema dünyasından flash haberlerin tam arşivi. Yabancı ve yerli kaynaklardan film, dizi ve festival haberleri. </p></div></div><div class="bi-wrap py-10"${_scopeId}>`);
            if (__props.items.data.length === 0) {
              _push2(`<div class="bi-rule-box text-center py-16"${_scopeId}><h3 class="bi-serif text-3xl font-bold text-[var(--bi-ink)] mb-2"${_scopeId}>Henüz haber yok</h3><p class="text-[var(--bi-muted)]"${_scopeId}>Yakında burada arşivlenmiş haberleri göreceksin.</p></div>`);
            } else {
              _push2(`<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.items.data, (item) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: item.id,
                  href: `/haber/${item.slug}`,
                  class: "group flex flex-col overflow-hidden border border-[var(--bi-ink)] bg-[var(--bi-paper)] text-left transition hover:bg-white"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--bi-ink)] bg-[var(--bi-ink)]"${_scopeId2}><img${ssrRenderAttr("src", item.image_url)}${ssrRenderAttr("alt", item.title_tr)} class="h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105" loading="lazy" decoding="async" referrerpolicy="no-referrer"${_scopeId2}><span class="absolute left-0 top-0 bg-red-600 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-white bi-mono"${_scopeId2}>${ssrInterpolate(item.source_name)}</span></div><div class="flex flex-1 flex-col gap-2 p-4"${_scopeId2}><h3 class="bi-serif text-base font-bold leading-snug text-[var(--bi-ink)] line-clamp-3 md:text-lg"${_scopeId2}>${ssrInterpolate(item.title_tr)}</h3><p class="text-xs leading-5 text-[var(--bi-muted)] line-clamp-4"${_scopeId2}>${ssrInterpolate(item.summary_tr)}</p><div class="mt-auto flex items-center justify-between pt-2 text-[0.65rem] uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono"${_scopeId2}><span${_scopeId2}>${ssrInterpolate(formatDate(item.published_at))}</span><span class="text-red-700 group-hover:text-red-900"${_scopeId2}>Devamını oku →</span></div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--bi-ink)] bg-[var(--bi-ink)]" }, [
                          createVNode("img", {
                            src: item.image_url,
                            alt: item.title_tr,
                            class: "h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105",
                            loading: "lazy",
                            decoding: "async",
                            referrerpolicy: "no-referrer"
                          }, null, 8, ["src", "alt"]),
                          createVNode("span", { class: "absolute left-0 top-0 bg-red-600 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-white bi-mono" }, toDisplayString(item.source_name), 1)
                        ]),
                        createVNode("div", { class: "flex flex-1 flex-col gap-2 p-4" }, [
                          createVNode("h3", { class: "bi-serif text-base font-bold leading-snug text-[var(--bi-ink)] line-clamp-3 md:text-lg" }, toDisplayString(item.title_tr), 1),
                          createVNode("p", { class: "text-xs leading-5 text-[var(--bi-muted)] line-clamp-4" }, toDisplayString(item.summary_tr), 1),
                          createVNode("div", { class: "mt-auto flex items-center justify-between pt-2 text-[0.65rem] uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, [
                            createVNode("span", null, toDisplayString(formatDate(item.published_at)), 1),
                            createVNode("span", { class: "text-red-700 group-hover:text-red-900" }, "Devamını oku →")
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            }
            if (__props.items.links && __props.items.data.length > 0) {
              _push2(`<div class="mt-12 flex justify-center"${_scopeId}><div class="flex items-center gap-2 flex-wrap justify-center"${_scopeId}><!--[-->`);
              ssrRenderList(__props.items.links, (link, index) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: index,
                  href: link.url || "#",
                  class: [
                    "border px-4 py-2 text-sm font-bold transition-colors",
                    link.active ? "border-red-700 bg-red-700 text-white" : link.url ? "border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]" : "border-[var(--bi-rule-soft)] text-[var(--bi-muted)] cursor-not-allowed"
                  ]
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-[var(--bi-paper)]" }, [
                createVNode("div", { class: "border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]" }, [
                  createVNode("div", { class: "bi-wrap py-10" }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("span", { class: "inline-flex items-center gap-2 bg-red-600 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white bi-mono" }, [
                        createVNode("span", { class: "inline-block h-2 w-2 animate-pulse rounded-full bg-white" }),
                        createTextVNode(" Canlı ")
                      ]),
                      createVNode("span", { class: "bi-kicker" }, "Arşiv")
                    ]),
                    createVNode("h1", { class: "bi-serif mt-3 text-5xl font-bold leading-none text-[var(--bi-ink)] md:text-7xl" }, " Haberler "),
                    createVNode("p", { class: "mt-4 max-w-2xl text-[var(--bi-muted)]" }, " Sinema dünyasından flash haberlerin tam arşivi. Yabancı ve yerli kaynaklardan film, dizi ve festival haberleri. ")
                  ])
                ]),
                createVNode("div", { class: "bi-wrap py-10" }, [
                  __props.items.data.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "bi-rule-box text-center py-16"
                  }, [
                    createVNode("h3", { class: "bi-serif text-3xl font-bold text-[var(--bi-ink)] mb-2" }, "Henüz haber yok"),
                    createVNode("p", { class: "text-[var(--bi-muted)]" }, "Yakında burada arşivlenmiş haberleri göreceksin.")
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.items.data, (item) => {
                      return openBlock(), createBlock(unref(Link), {
                        key: item.id,
                        href: `/haber/${item.slug}`,
                        class: "group flex flex-col overflow-hidden border border-[var(--bi-ink)] bg-[var(--bi-paper)] text-left transition hover:bg-white"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--bi-ink)] bg-[var(--bi-ink)]" }, [
                            createVNode("img", {
                              src: item.image_url,
                              alt: item.title_tr,
                              class: "h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105",
                              loading: "lazy",
                              decoding: "async",
                              referrerpolicy: "no-referrer"
                            }, null, 8, ["src", "alt"]),
                            createVNode("span", { class: "absolute left-0 top-0 bg-red-600 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-white bi-mono" }, toDisplayString(item.source_name), 1)
                          ]),
                          createVNode("div", { class: "flex flex-1 flex-col gap-2 p-4" }, [
                            createVNode("h3", { class: "bi-serif text-base font-bold leading-snug text-[var(--bi-ink)] line-clamp-3 md:text-lg" }, toDisplayString(item.title_tr), 1),
                            createVNode("p", { class: "text-xs leading-5 text-[var(--bi-muted)] line-clamp-4" }, toDisplayString(item.summary_tr), 1),
                            createVNode("div", { class: "mt-auto flex items-center justify-between pt-2 text-[0.65rem] uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, [
                              createVNode("span", null, toDisplayString(formatDate(item.published_at)), 1),
                              createVNode("span", { class: "text-red-700 group-hover:text-red-900" }, "Devamını oku →")
                            ])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["href"]);
                    }), 128))
                  ])),
                  __props.items.links && __props.items.data.length > 0 ? (openBlock(), createBlock("div", {
                    key: 2,
                    class: "mt-12 flex justify-center"
                  }, [
                    createVNode("div", { class: "flex items-center gap-2 flex-wrap justify-center" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.items.links, (link, index) => {
                        return openBlock(), createBlock(unref(Link), {
                          key: index,
                          href: link.url || "#",
                          class: [
                            "border px-4 py-2 text-sm font-bold transition-colors",
                            link.active ? "border-red-700 bg-red-700 text-white" : link.url ? "border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]" : "border-[var(--bi-rule-soft)] text-[var(--bi-muted)] cursor-not-allowed"
                          ],
                          innerHTML: link.label
                        }, null, 8, ["href", "class", "innerHTML"]);
                      }), 128))
                    ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/FlashNews/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
