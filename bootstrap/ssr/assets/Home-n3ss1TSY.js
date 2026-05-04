import { computed, mergeProps, withCtx, unref, createVNode, openBlock, createBlock, toDisplayString, createTextVNode, Fragment, renderList, createCommentVNode, withModifiers, withDirectives, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useForm, usePage, Link } from "@inertiajs/vue3";
import { a as _export_sfc, A as AppLayout } from "./AppLayout-DLzUu67n.js";
import { _ as _sfc_main$1 } from "./PostGrid-XfxM0aNu.js";
import { b as buildResponsiveImage } from "./PostCard-BwkqJ6T-.js";
import "@headlessui/vue";
import "./useDate-Es1AW_qO.js";
const homeDescription = "Film, dizi ve belgesel eleştirileri, izleme önerileri, podcast notları ve festival rehberi.";
const _sfc_main = {
  __name: "Home",
  __ssrInlineRender: true,
  props: {
    posts: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    spotlights: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const form = useForm({ email: "" });
    const page = usePage();
    const newsletterMessage = computed(() => page.props.flash?.newsletter_message);
    const featuredPost = computed(() => props.posts[0] || null);
    const gridPosts = computed(() => props.posts.slice(1, 7));
    const railPosts = computed(() => props.posts.slice(0, 5));
    const secondarySpotlights = computed(() => props.spotlights.filter((item) => item.label !== "Ne İzlesem"));
    const featuredImage = computed(() => buildResponsiveImage(featuredPost.value?.cover_image, {
      widths: [480, 768, 1280, 1600],
      sizes: "100vw",
      fallbackWidth: 1280
    }));
    const firstCategoryName = (post) => {
      return post?.categories?.[0]?.name || "Yazı";
    };
    const formatReadingTime = (minutes) => {
      return minutes ? `${minutes} dk okuma` : "2 dk okuma";
    };
    const coverImageStyle = (post) => ({
      "--hero-image-position-mobile": `${post?.cover_image_mobile_focus_x ?? post?.cover_image_focus_x ?? 50}% ${post?.cover_image_mobile_focus_y ?? post?.cover_image_focus_y ?? 50}%`,
      "--hero-image-position-desktop": `${post?.cover_image_focus_x ?? 50}% ${post?.cover_image_focus_y ?? 50}%`
    });
    const subscribe = () => {
      form.post("/newsletter", {
        preserveScroll: true,
        onSuccess: () => form.reset()
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: "Ana Sayfa",
        description: homeDescription,
        "canonical-url": "https://benizledim.com/",
        "og-image": featuredPost.value?.cover_image || "/images/og-default.png"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)]" data-v-c67ba9b4${_scopeId}>`);
            if (featuredPost.value) {
              _push2(`<div class="bi-wrap py-5" data-v-c67ba9b4${_scopeId}><div class="grid gap-5" data-v-c67ba9b4${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/yazi/${featuredPost.value.slug}`,
                class: "group overflow-hidden border border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="relative h-[150px] overflow-hidden border-b border-[var(--bi-ink)] bg-[var(--bi-ink)] md:h-[174px] lg:h-[190px]" data-v-c67ba9b4${_scopeId2}>`);
                    if (featuredPost.value.cover_image) {
                      _push3(`<img${ssrRenderAttr("src", featuredImage.value.src)}${ssrRenderAttr("srcset", featuredImage.value.srcset || void 0)}${ssrRenderAttr("sizes", featuredImage.value.sizes || void 0)}${ssrRenderAttr("alt", featuredPost.value.title)} style="${ssrRenderStyle(coverImageStyle(featuredPost.value))}" class="featured-hero-image h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105" loading="eager" fetchpriority="high" decoding="async" width="1600" height="900" data-v-c67ba9b4${_scopeId2}>`);
                    } else {
                      _push3(`<div class="grid h-full place-items-center text-7xl font-bold text-[var(--bi-paper)] bi-serif" data-v-c67ba9b4${_scopeId2}> Bİ </div>`);
                    }
                    _push3(`<div class="absolute bottom-0 left-0 border-r border-t border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3" data-v-c67ba9b4${_scopeId2}><span class="block text-3xl font-bold leading-none bi-serif" data-v-c67ba9b4${_scopeId2}>Manşet</span><span class="block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" data-v-c67ba9b4${_scopeId2}>Bu haftanın yazısı</span></div></div><div class="relative flex flex-col p-5 md:p-6" data-v-c67ba9b4${_scopeId2}><div data-v-c67ba9b4${_scopeId2}><div class="flex items-start justify-between gap-4" data-v-c67ba9b4${_scopeId2}><div data-v-c67ba9b4${_scopeId2}><span class="bi-kicker" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(firstCategoryName(featuredPost.value))}</span><h1 class="bi-serif mt-3 max-w-4xl text-[clamp(2rem,4.2vw,3.9rem)] font-bold leading-[0.96] text-[var(--bi-ink)]" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(featuredPost.value.title)}</h1></div><span class="hidden text-6xl font-bold leading-none text-black/5 bi-serif md:block" data-v-c67ba9b4${_scopeId2}>01</span></div><p class="mt-4 max-w-2xl text-sm leading-6 text-[var(--bi-muted)] md:text-base md:leading-7" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(featuredPost.value.excerpt)}</p></div><div class="mt-5 flex flex-wrap items-center gap-3" data-v-c67ba9b4${_scopeId2}><span class="inline-flex items-center gap-3 bg-[var(--bi-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] transition group-hover:bg-red-700 bi-mono" data-v-c67ba9b4${_scopeId2}> Yazıyı oku <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c67ba9b4${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M13 6l6 6-6 6" data-v-c67ba9b4${_scopeId2}></path></svg></span><div class="text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(featuredPost.value.user?.name || "Ben İzledim")} <span class="mx-2 text-black/20" data-v-c67ba9b4${_scopeId2}>/</span> ${ssrInterpolate(formatReadingTime(featuredPost.value.reading_time_minutes))}</div></div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "relative h-[150px] overflow-hidden border-b border-[var(--bi-ink)] bg-[var(--bi-ink)] md:h-[174px] lg:h-[190px]" }, [
                        featuredPost.value.cover_image ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: featuredImage.value.src,
                          srcset: featuredImage.value.srcset || void 0,
                          sizes: featuredImage.value.sizes || void 0,
                          alt: featuredPost.value.title,
                          style: coverImageStyle(featuredPost.value),
                          class: "featured-hero-image h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105",
                          loading: "eager",
                          fetchpriority: "high",
                          decoding: "async",
                          width: "1600",
                          height: "900"
                        }, null, 12, ["src", "srcset", "sizes", "alt"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "grid h-full place-items-center text-7xl font-bold text-[var(--bi-paper)] bi-serif"
                        }, " Bİ ")),
                        createVNode("div", { class: "absolute bottom-0 left-0 border-r border-t border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3" }, [
                          createVNode("span", { class: "block text-3xl font-bold leading-none bi-serif" }, "Manşet"),
                          createVNode("span", { class: "block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, "Bu haftanın yazısı")
                        ])
                      ]),
                      createVNode("div", { class: "relative flex flex-col p-5 md:p-6" }, [
                        createVNode("div", null, [
                          createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                            createVNode("div", null, [
                              createVNode("span", { class: "bi-kicker" }, toDisplayString(firstCategoryName(featuredPost.value)), 1),
                              createVNode("h1", { class: "bi-serif mt-3 max-w-4xl text-[clamp(2rem,4.2vw,3.9rem)] font-bold leading-[0.96] text-[var(--bi-ink)]" }, toDisplayString(featuredPost.value.title), 1)
                            ]),
                            createVNode("span", { class: "hidden text-6xl font-bold leading-none text-black/5 bi-serif md:block" }, "01")
                          ]),
                          createVNode("p", { class: "mt-4 max-w-2xl text-sm leading-6 text-[var(--bi-muted)] md:text-base md:leading-7" }, toDisplayString(featuredPost.value.excerpt), 1)
                        ]),
                        createVNode("div", { class: "mt-5 flex flex-wrap items-center gap-3" }, [
                          createVNode("span", { class: "inline-flex items-center gap-3 bg-[var(--bi-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] transition group-hover:bg-red-700 bi-mono" }, [
                            createTextVNode(" Yazıyı oku "),
                            (openBlock(), createBlock("svg", {
                              class: "h-4 w-4",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M5 12h14M13 6l6 6-6 6"
                              })
                            ]))
                          ]),
                          createVNode("div", { class: "text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, [
                            createTextVNode(toDisplayString(featuredPost.value.user?.name || "Ben İzledim") + " ", 1),
                            createVNode("span", { class: "mx-2 text-black/20" }, "/"),
                            createTextVNode(" " + toDisplayString(formatReadingTime(featuredPost.value.reading_time_minutes)), 1)
                          ])
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              _push2(`<div class="bi-wrap py-16" data-v-c67ba9b4${_scopeId}><div class="bi-rule-box p-8 text-center" data-v-c67ba9b4${_scopeId}><h1 class="bi-serif text-5xl font-bold" data-v-c67ba9b4${_scopeId}>Ben İzledim</h1><p class="mt-4 text-[var(--bi-muted)]" data-v-c67ba9b4${_scopeId}>Yazılar hazırlanıyor.</p></div></div>`);
            }
            _push2(`</section><section class="bi-wrap grid gap-8 py-8 lg:grid-cols-[1fr_320px]" data-v-c67ba9b4${_scopeId}><div data-v-c67ba9b4${_scopeId}><div class="mb-6 flex items-end justify-between border-b border-[var(--bi-ink)] pb-4" data-v-c67ba9b4${_scopeId}><div data-v-c67ba9b4${_scopeId}><span class="bi-kicker" data-v-c67ba9b4${_scopeId}>01</span><h2 class="bi-serif mt-2 text-4xl font-bold text-[var(--bi-ink)] md:text-5xl" data-v-c67ba9b4${_scopeId}>Son Yazılar</h2></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/yazilar",
              class: "hidden text-sm font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900 bi-mono md:inline-flex"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Tüm yazılar `);
                } else {
                  return [
                    createTextVNode(" Tüm yazılar ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              posts: gridPosts.value.length ? gridPosts.value : __props.posts
            }, null, _parent2, _scopeId));
            _push2(`</div><aside class="h-fit border border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]" data-v-c67ba9b4${_scopeId}><div class="border-b border-[var(--bi-ink)] bg-[var(--bi-ink)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] bi-mono" data-v-c67ba9b4${_scopeId}> En Yeni </div><!--[-->`);
            ssrRenderList(railPosts.value, (post, index) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: post.id,
                href: `/yazi/${post.slug}`,
                class: "grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[var(--bi-rule-soft)] p-4 last:border-b-0 hover:bg-[var(--bi-paper)]"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="text-3xl font-bold leading-none text-red-700 bi-serif" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(String(index + 1).padStart(2, "0"))}</span><span data-v-c67ba9b4${_scopeId2}><span class="bi-mono block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(firstCategoryName(post))}</span><span class="bi-serif mt-1 block text-xl font-bold leading-tight" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(post.title)}</span></span>`);
                  } else {
                    return [
                      createVNode("span", { class: "text-3xl font-bold leading-none text-red-700 bi-serif" }, toDisplayString(String(index + 1).padStart(2, "0")), 1),
                      createVNode("span", null, [
                        createVNode("span", { class: "bi-mono block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]" }, toDisplayString(firstCategoryName(post)), 1),
                        createVNode("span", { class: "bi-serif mt-1 block text-xl font-bold leading-tight" }, toDisplayString(post.title), 1)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></aside></section><section class="border-y border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]" data-v-c67ba9b4${_scopeId}><div class="bi-wrap py-10" data-v-c67ba9b4${_scopeId}><div class="mb-6 flex items-end justify-between gap-4 border-b border-[var(--bi-ink)] pb-4" data-v-c67ba9b4${_scopeId}><div data-v-c67ba9b4${_scopeId}><span class="bi-kicker" data-v-c67ba9b4${_scopeId}>Aşağıda Daha Fazlası Var</span><h2 class="bi-serif mt-2 text-3xl font-bold text-[var(--bi-ink)] md:text-4xl" data-v-c67ba9b4${_scopeId}>İncelemelerin Yanında Bunlar da Var</h2></div><span class="hidden text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono md:block" data-v-c67ba9b4${_scopeId}>Scroll ettikçe keşfet</span></div><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-v-c67ba9b4${_scopeId}><!--[-->`);
            ssrRenderList(secondarySpotlights.value, (item) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: item.label,
                href: item.href,
                class: ["group flex min-h-[220px] flex-col justify-between border border-[var(--bi-ink)] bg-white p-5 transition-transform duration-300 hover:-translate-y-1 hover:bg-[var(--bi-paper)]", {
                  "shadow-[10px_10px_0_rgba(176,0,32,0.08)]": item.tone === "red",
                  "shadow-[10px_10px_0_rgba(17,17,17,0.08)]": item.tone === "ink",
                  "shadow-[10px_10px_0_rgba(120,113,108,0.12)]": item.tone === "stone"
                }]
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div data-v-c67ba9b4${_scopeId2}><span class="bi-kicker" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(item.label)}</span><h3 class="bi-serif mt-3 text-3xl font-bold leading-tight text-[var(--bi-ink)]" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(item.title)}</h3><p class="mt-3 text-sm leading-6 text-[var(--bi-muted)]" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(item.description)}</p></div><div class="mt-6 flex items-end justify-between gap-3 border-t border-[var(--bi-rule-soft)] pt-4" data-v-c67ba9b4${_scopeId2}><div class="text-xs font-bold uppercase tracking-[0.08em] text-red-700 bi-mono" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(item.metric)}</div><span class="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--bi-ink)] bi-mono group-hover:text-red-700" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(item.cta)} <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-c67ba9b4${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M13 6l6 6-6 6" data-v-c67ba9b4${_scopeId2}></path></svg></span></div>`);
                  } else {
                    return [
                      createVNode("div", null, [
                        createVNode("span", { class: "bi-kicker" }, toDisplayString(item.label), 1),
                        createVNode("h3", { class: "bi-serif mt-3 text-3xl font-bold leading-tight text-[var(--bi-ink)]" }, toDisplayString(item.title), 1),
                        createVNode("p", { class: "mt-3 text-sm leading-6 text-[var(--bi-muted)]" }, toDisplayString(item.description), 1)
                      ]),
                      createVNode("div", { class: "mt-6 flex items-end justify-between gap-3 border-t border-[var(--bi-rule-soft)] pt-4" }, [
                        createVNode("div", { class: "text-xs font-bold uppercase tracking-[0.08em] text-red-700 bi-mono" }, toDisplayString(item.metric), 1),
                        createVNode("span", { class: "inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--bi-ink)] bi-mono group-hover:text-red-700" }, [
                          createTextVNode(toDisplayString(item.cta) + " ", 1),
                          (openBlock(), createBlock("svg", {
                            class: "h-4 w-4",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M5 12h14M13 6l6 6-6 6"
                            })
                          ]))
                        ])
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div></section><section class="border-y-2 border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]" data-v-c67ba9b4${_scopeId}><div class="bi-wrap grid gap-8 py-12 md:grid-cols-[1fr_1.1fr] md:items-center" data-v-c67ba9b4${_scopeId}><div data-v-c67ba9b4${_scopeId}><span class="bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-300" data-v-c67ba9b4${_scopeId}>Bülten</span><h2 class="bi-serif mt-2 text-4xl font-bold md:text-5xl" data-v-c67ba9b4${_scopeId}>Önce Siz Okuyun</h2><p class="mt-4 max-w-xl text-stone-300" data-v-c67ba9b4${_scopeId}> Yeni yazılar, festival notları ve izleme önerileri. Kısa, seçilmiş, gürültüsüz. </p></div><div data-v-c67ba9b4${_scopeId}>`);
            if (newsletterMessage.value) {
              _push2(`<div class="mb-4 border border-green-200 bg-green-100 px-4 py-3 text-green-700" data-v-c67ba9b4${_scopeId}>${ssrInterpolate(newsletterMessage.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="flex flex-col gap-3 sm:flex-row" novalidate data-v-c67ba9b4${_scopeId}><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="E-posta adresiniz" class="${ssrRenderClass([{ "border-red-500": unref(form).errors.email }, "min-w-0 flex-1 border border-stone-500 bg-transparent px-4 py-3 text-white placeholder-stone-400 focus:border-red-400 focus:outline-none"])}" data-v-c67ba9b4${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50" data-v-c67ba9b4${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span data-v-c67ba9b4${_scopeId}>Gönderiliyor...</span>`);
            } else {
              _push2(`<span data-v-c67ba9b4${_scopeId}>Abone Ol</span>`);
            }
            _push2(`</button></form>`);
            if (unref(form).errors.email) {
              _push2(`<p class="mt-2 text-sm text-red-300" data-v-c67ba9b4${_scopeId}>${ssrInterpolate(unref(form).errors.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></section><section class="border-t border-[var(--bi-rule-soft)] bg-[var(--bi-paper)]" data-v-c67ba9b4${_scopeId}><div class="bi-wrap py-8" data-v-c67ba9b4${_scopeId}><details class="border border-[var(--bi-rule-soft)] bg-[var(--bi-paper-deep)] open:bg-[var(--bi-paper)]" data-v-c67ba9b4${_scopeId}><summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left" data-v-c67ba9b4${_scopeId}><span data-v-c67ba9b4${_scopeId}><span class="block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" data-v-c67ba9b4${_scopeId}>İstersen bak</span><span class="bi-serif mt-1 block text-2xl font-bold text-[var(--bi-ink)]" data-v-c67ba9b4${_scopeId}>Keşfet</span></span><span class="text-xs font-bold uppercase tracking-[0.08em] text-red-700 bi-mono" data-v-c67ba9b4${_scopeId}>Kategorileri Aç</span></summary><div class="border-t border-[var(--bi-rule-soft)] px-4 py-4" data-v-c67ba9b4${_scopeId}><div class="flex flex-wrap items-center gap-3" data-v-c67ba9b4${_scopeId}><!--[-->`);
            ssrRenderList(__props.categories, (category) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: category.id,
                href: `/yazilar?category=${category.slug}`,
                class: "bi-chip whitespace-nowrap"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(category.name)} <span class="text-current/60" data-v-c67ba9b4${_scopeId2}>${ssrInterpolate(category.posts_count)}</span>`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(category.name) + " ", 1),
                      createVNode("span", { class: "text-current/60" }, toDisplayString(category.posts_count), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div></details></div></section>`);
          } else {
            return [
              createVNode("section", { class: "border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)]" }, [
                featuredPost.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bi-wrap py-5"
                }, [
                  createVNode("div", { class: "grid gap-5" }, [
                    createVNode(unref(Link), {
                      href: `/yazi/${featuredPost.value.slug}`,
                      class: "group overflow-hidden border border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", { class: "relative h-[150px] overflow-hidden border-b border-[var(--bi-ink)] bg-[var(--bi-ink)] md:h-[174px] lg:h-[190px]" }, [
                          featuredPost.value.cover_image ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: featuredImage.value.src,
                            srcset: featuredImage.value.srcset || void 0,
                            sizes: featuredImage.value.sizes || void 0,
                            alt: featuredPost.value.title,
                            style: coverImageStyle(featuredPost.value),
                            class: "featured-hero-image h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105",
                            loading: "eager",
                            fetchpriority: "high",
                            decoding: "async",
                            width: "1600",
                            height: "900"
                          }, null, 12, ["src", "srcset", "sizes", "alt"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "grid h-full place-items-center text-7xl font-bold text-[var(--bi-paper)] bi-serif"
                          }, " Bİ ")),
                          createVNode("div", { class: "absolute bottom-0 left-0 border-r border-t border-[var(--bi-ink)] bg-[var(--bi-paper)] px-4 py-3" }, [
                            createVNode("span", { class: "block text-3xl font-bold leading-none bi-serif" }, "Manşet"),
                            createVNode("span", { class: "block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, "Bu haftanın yazısı")
                          ])
                        ]),
                        createVNode("div", { class: "relative flex flex-col p-5 md:p-6" }, [
                          createVNode("div", null, [
                            createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                              createVNode("div", null, [
                                createVNode("span", { class: "bi-kicker" }, toDisplayString(firstCategoryName(featuredPost.value)), 1),
                                createVNode("h1", { class: "bi-serif mt-3 max-w-4xl text-[clamp(2rem,4.2vw,3.9rem)] font-bold leading-[0.96] text-[var(--bi-ink)]" }, toDisplayString(featuredPost.value.title), 1)
                              ]),
                              createVNode("span", { class: "hidden text-6xl font-bold leading-none text-black/5 bi-serif md:block" }, "01")
                            ]),
                            createVNode("p", { class: "mt-4 max-w-2xl text-sm leading-6 text-[var(--bi-muted)] md:text-base md:leading-7" }, toDisplayString(featuredPost.value.excerpt), 1)
                          ]),
                          createVNode("div", { class: "mt-5 flex flex-wrap items-center gap-3" }, [
                            createVNode("span", { class: "inline-flex items-center gap-3 bg-[var(--bi-ink)] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] transition group-hover:bg-red-700 bi-mono" }, [
                              createTextVNode(" Yazıyı oku "),
                              (openBlock(), createBlock("svg", {
                                class: "h-4 w-4",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M5 12h14M13 6l6 6-6 6"
                                })
                              ]))
                            ]),
                            createVNode("div", { class: "text-xs uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, [
                              createTextVNode(toDisplayString(featuredPost.value.user?.name || "Ben İzledim") + " ", 1),
                              createVNode("span", { class: "mx-2 text-black/20" }, "/"),
                              createTextVNode(" " + toDisplayString(formatReadingTime(featuredPost.value.reading_time_minutes)), 1)
                            ])
                          ])
                        ])
                      ]),
                      _: 1
                    }, 8, ["href"])
                  ])
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "bi-wrap py-16"
                }, [
                  createVNode("div", { class: "bi-rule-box p-8 text-center" }, [
                    createVNode("h1", { class: "bi-serif text-5xl font-bold" }, "Ben İzledim"),
                    createVNode("p", { class: "mt-4 text-[var(--bi-muted)]" }, "Yazılar hazırlanıyor.")
                  ])
                ]))
              ]),
              createVNode("section", { class: "bi-wrap grid gap-8 py-8 lg:grid-cols-[1fr_320px]" }, [
                createVNode("div", null, [
                  createVNode("div", { class: "mb-6 flex items-end justify-between border-b border-[var(--bi-ink)] pb-4" }, [
                    createVNode("div", null, [
                      createVNode("span", { class: "bi-kicker" }, "01"),
                      createVNode("h2", { class: "bi-serif mt-2 text-4xl font-bold text-[var(--bi-ink)] md:text-5xl" }, "Son Yazılar")
                    ]),
                    createVNode(unref(Link), {
                      href: "/yazilar",
                      class: "hidden text-sm font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900 bi-mono md:inline-flex"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Tüm yazılar ")
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_sfc_main$1, {
                    posts: gridPosts.value.length ? gridPosts.value : __props.posts
                  }, null, 8, ["posts"])
                ]),
                createVNode("aside", { class: "h-fit border border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]" }, [
                  createVNode("div", { class: "border-b border-[var(--bi-ink)] bg-[var(--bi-ink)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-paper)] bi-mono" }, " En Yeni "),
                  (openBlock(true), createBlock(Fragment, null, renderList(railPosts.value, (post, index) => {
                    return openBlock(), createBlock(unref(Link), {
                      key: post.id,
                      href: `/yazi/${post.slug}`,
                      class: "grid grid-cols-[2.5rem_1fr] gap-4 border-b border-[var(--bi-rule-soft)] p-4 last:border-b-0 hover:bg-[var(--bi-paper)]"
                    }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "text-3xl font-bold leading-none text-red-700 bi-serif" }, toDisplayString(String(index + 1).padStart(2, "0")), 1),
                        createVNode("span", null, [
                          createVNode("span", { class: "bi-mono block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]" }, toDisplayString(firstCategoryName(post)), 1),
                          createVNode("span", { class: "bi-serif mt-1 block text-xl font-bold leading-tight" }, toDisplayString(post.title), 1)
                        ])
                      ]),
                      _: 2
                    }, 1032, ["href"]);
                  }), 128))
                ])
              ]),
              createVNode("section", { class: "border-y border-[var(--bi-ink)] bg-[var(--bi-paper-deep)]" }, [
                createVNode("div", { class: "bi-wrap py-10" }, [
                  createVNode("div", { class: "mb-6 flex items-end justify-between gap-4 border-b border-[var(--bi-ink)] pb-4" }, [
                    createVNode("div", null, [
                      createVNode("span", { class: "bi-kicker" }, "Aşağıda Daha Fazlası Var"),
                      createVNode("h2", { class: "bi-serif mt-2 text-3xl font-bold text-[var(--bi-ink)] md:text-4xl" }, "İncelemelerin Yanında Bunlar da Var")
                    ]),
                    createVNode("span", { class: "hidden text-xs font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono md:block" }, "Scroll ettikçe keşfet")
                  ]),
                  createVNode("div", { class: "grid gap-4 md:grid-cols-2 xl:grid-cols-3" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(secondarySpotlights.value, (item) => {
                      return openBlock(), createBlock(unref(Link), {
                        key: item.label,
                        href: item.href,
                        class: ["group flex min-h-[220px] flex-col justify-between border border-[var(--bi-ink)] bg-white p-5 transition-transform duration-300 hover:-translate-y-1 hover:bg-[var(--bi-paper)]", {
                          "shadow-[10px_10px_0_rgba(176,0,32,0.08)]": item.tone === "red",
                          "shadow-[10px_10px_0_rgba(17,17,17,0.08)]": item.tone === "ink",
                          "shadow-[10px_10px_0_rgba(120,113,108,0.12)]": item.tone === "stone"
                        }]
                      }, {
                        default: withCtx(() => [
                          createVNode("div", null, [
                            createVNode("span", { class: "bi-kicker" }, toDisplayString(item.label), 1),
                            createVNode("h3", { class: "bi-serif mt-3 text-3xl font-bold leading-tight text-[var(--bi-ink)]" }, toDisplayString(item.title), 1),
                            createVNode("p", { class: "mt-3 text-sm leading-6 text-[var(--bi-muted)]" }, toDisplayString(item.description), 1)
                          ]),
                          createVNode("div", { class: "mt-6 flex items-end justify-between gap-3 border-t border-[var(--bi-rule-soft)] pt-4" }, [
                            createVNode("div", { class: "text-xs font-bold uppercase tracking-[0.08em] text-red-700 bi-mono" }, toDisplayString(item.metric), 1),
                            createVNode("span", { class: "inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[var(--bi-ink)] bi-mono group-hover:text-red-700" }, [
                              createTextVNode(toDisplayString(item.cta) + " ", 1),
                              (openBlock(), createBlock("svg", {
                                class: "h-4 w-4",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M5 12h14M13 6l6 6-6 6"
                                })
                              ]))
                            ])
                          ])
                        ]),
                        _: 2
                      }, 1032, ["href", "class"]);
                    }), 128))
                  ])
                ])
              ]),
              createVNode("section", { class: "border-y-2 border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]" }, [
                createVNode("div", { class: "bi-wrap grid gap-8 py-12 md:grid-cols-[1fr_1.1fr] md:items-center" }, [
                  createVNode("div", null, [
                    createVNode("span", { class: "bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-300" }, "Bülten"),
                    createVNode("h2", { class: "bi-serif mt-2 text-4xl font-bold md:text-5xl" }, "Önce Siz Okuyun"),
                    createVNode("p", { class: "mt-4 max-w-xl text-stone-300" }, " Yeni yazılar, festival notları ve izleme önerileri. Kısa, seçilmiş, gürültüsüz. ")
                  ]),
                  createVNode("div", null, [
                    newsletterMessage.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mb-4 border border-green-200 bg-green-100 px-4 py-3 text-green-700"
                    }, toDisplayString(newsletterMessage.value), 1)) : createCommentVNode("", true),
                    createVNode("form", {
                      onSubmit: withModifiers(subscribe, ["prevent"]),
                      class: "flex flex-col gap-3 sm:flex-row",
                      novalidate: ""
                    }, [
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).email = $event,
                        type: "email",
                        placeholder: "E-posta adresiniz",
                        class: ["min-w-0 flex-1 border border-stone-500 bg-transparent px-4 py-3 text-white placeholder-stone-400 focus:border-red-400 focus:outline-none", { "border-red-500": unref(form).errors.email }]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).email]
                      ]),
                      createVNode("button", {
                        type: "submit",
                        disabled: unref(form).processing,
                        class: "bg-red-700 px-6 py-3 font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
                      }, [
                        unref(form).processing ? (openBlock(), createBlock("span", { key: 0 }, "Gönderiliyor...")) : (openBlock(), createBlock("span", { key: 1 }, "Abone Ol"))
                      ], 8, ["disabled"])
                    ], 32),
                    unref(form).errors.email ? (openBlock(), createBlock("p", {
                      key: 1,
                      class: "mt-2 text-sm text-red-300"
                    }, toDisplayString(unref(form).errors.email), 1)) : createCommentVNode("", true)
                  ])
                ])
              ]),
              createVNode("section", { class: "border-t border-[var(--bi-rule-soft)] bg-[var(--bi-paper)]" }, [
                createVNode("div", { class: "bi-wrap py-8" }, [
                  createVNode("details", { class: "border border-[var(--bi-rule-soft)] bg-[var(--bi-paper-deep)] open:bg-[var(--bi-paper)]" }, [
                    createVNode("summary", { class: "flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left" }, [
                      createVNode("span", null, [
                        createVNode("span", { class: "block text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)] bi-mono" }, "İstersen bak"),
                        createVNode("span", { class: "bi-serif mt-1 block text-2xl font-bold text-[var(--bi-ink)]" }, "Keşfet")
                      ]),
                      createVNode("span", { class: "text-xs font-bold uppercase tracking-[0.08em] text-red-700 bi-mono" }, "Kategorileri Aç")
                    ]),
                    createVNode("div", { class: "border-t border-[var(--bi-rule-soft)] px-4 py-4" }, [
                      createVNode("div", { class: "flex flex-wrap items-center gap-3" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.categories, (category) => {
                          return openBlock(), createBlock(unref(Link), {
                            key: category.id,
                            href: `/yazilar?category=${category.slug}`,
                            class: "bi-chip whitespace-nowrap"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(category.name) + " ", 1),
                              createVNode("span", { class: "text-current/60" }, toDisplayString(category.posts_count), 1)
                            ]),
                            _: 2
                          }, 1032, ["href"]);
                        }), 128))
                      ])
                    ])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Home = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c67ba9b4"]]);
export {
  Home as default
};
