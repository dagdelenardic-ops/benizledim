import { ref, reactive, watch, unref, useSSRContext, computed, resolveDirective, withCtx, mergeProps, createVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, resolveDynamicComponent, createTextVNode } from "vue";
import { ssrRenderTeleport, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttrs, ssrRenderVNode, ssrGetDirectiveProps, ssrRenderSlot } from "vue/server-renderer";
import { usePage, useForm, Head, Link } from "@inertiajs/vue3";
const _sfc_main$2 = {
  __name: "LoginModal",
  __ssrInlineRender: true,
  props: {
    show: Boolean
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const showEmailForm = ref(false);
    const loading = ref(false);
    const googleLoading = ref(false);
    const facebookLoading = ref(false);
    const errors = reactive({});
    const page = usePage();
    const form = reactive({
      email: "",
      password: "",
      remember: false
    });
    const resetFormState = () => {
      showEmailForm.value = false;
      loading.value = false;
      googleLoading.value = false;
      facebookLoading.value = false;
      form.email = "";
      form.password = "";
      form.remember = false;
      Object.keys(errors).forEach((key) => delete errors[key]);
    };
    watch(() => props.show, (isOpen) => {
      if (!isOpen) {
        resetFormState();
      }
    });
    watch(showEmailForm, () => {
      Object.keys(errors).forEach((key) => delete errors[key]);
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.show) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"><div class="w-full max-w-md bg-white rounded-lg shadow-xl mx-4"><div class="relative px-6 pt-6 pb-4 border-b border-gray-200"><h2 class="text-xl font-bold text-gray-900 text-center">Giriş Yapın</h2><button class="absolute right-4 top-6 text-gray-400 hover:text-gray-600 transition-colors"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="px-6 py-6"><div class="space-y-3">`);
          if (unref(page).props.authProviders?.google) {
            _push2(`<button${ssrIncludeBooleanAttr(googleLoading.value) ? " disabled" : ""} class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`);
            if (googleLoading.value) {
              _push2(`<!--[--><svg class="animate-spin h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Yönlendiriliyor... <!--]-->`);
            } else {
              _push2(`<!--[--><svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg> Google ile giriş yapın <!--]-->`);
            }
            _push2(`</button>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(page).props.authProviders?.facebook) {
            _push2(`<button${ssrIncludeBooleanAttr(facebookLoading.value) ? " disabled" : ""} class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`);
            if (facebookLoading.value) {
              _push2(`<!--[--><svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Yönlendiriliyor... <!--]-->`);
            } else {
              _push2(`<!--[--><svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.22.19 2.22.19v2.45h-1.25c-1.23 0-1.62.77-1.62 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z"></path></svg> Facebook ile giriş yapın <!--]-->`);
            }
            _push2(`</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div><div class="relative my-5"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-300"></div></div><div class="relative flex justify-center text-sm"><span class="px-2 bg-white text-gray-500">veya</span></div></div>`);
          if (!showEmailForm.value) {
            _push2(`<div><button class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"><svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> E-Posta ile giriş yapın </button></div>`);
          } else {
            _push2(`<form class="space-y-4"><div><label class="block text-sm font-medium text-gray-700 mb-1">E-Posta</label><input${ssrRenderAttr("value", form.email)} type="email" required placeholder="ornek@email.com" class="${ssrRenderClass([{ "border-red-500": errors.email }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"])}">`);
            if (errors.email) {
              _push2(`<p class="mt-1 text-sm text-red-600">${ssrInterpolate(errors.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div><label class="block text-sm font-medium text-gray-700 mb-1">Şifre</label><input${ssrRenderAttr("value", form.password)} type="password" required placeholder="••••••••" class="${ssrRenderClass([{ "border-red-500": errors.password }, "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"])}">`);
            if (errors.password) {
              _push2(`<p class="mt-1 text-sm text-red-600">${ssrInterpolate(errors.password)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">${ssrInterpolate(loading.value ? "Giriş yapılıyor..." : "Giriş Yap")}</button><button type="button" class="w-full text-sm text-gray-500 hover:text-gray-700"> ← Geri dön </button></form>`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Auth/LoginModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "SearchBar",
  __ssrInlineRender: true,
  props: {
    placeholder: {
      type: String,
      default: "Ara..."
    }
  },
  setup(__props) {
    const searchQuery = ref("");
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><form class="relative hidden md:block"><input${ssrRenderAttr("value", searchQuery.value)} type="text"${ssrRenderAttr("placeholder", __props.placeholder)} class="min-h-11 w-72 border border-[var(--bi-ink)] bg-transparent py-2.5 pl-10 pr-4 text-sm text-[var(--bi-ink)] placeholder-[var(--bi-muted)] transition-all focus:border-red-700 focus:outline-none"><svg class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></form><div class="md:hidden"><button class="inline-flex h-11 w-11 items-center justify-center border border-[var(--bi-ink)] text-[var(--bi-ink)] transition-colors hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)]" aria-label="Aramayı aç"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>`);
      if (isOpen.value) {
        _push(`<div class="fixed inset-0 z-50 bg-black/50"><div class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-4"><form class="relative"><input id="mobile-search-input"${ssrRenderAttr("value", searchQuery.value)} type="text" placeholder="Yazı ara..." class="min-h-12 w-full border border-[var(--bi-ink)] bg-white py-3 pl-10 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg><button type="button" class="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-gray-400 hover:text-gray-600" aria-label="Aramayı kapat"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/UI/SearchBar.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const __default__ = {
  directives: {
    "click-outside": {
      mounted(el, binding) {
        el._clickOutside = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener("click", el._clickOutside, true);
      },
      unmounted(el) {
        document.removeEventListener("click", el._clickOutside, true);
      }
    }
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "AppLayout",
  __ssrInlineRender: true,
  props: {
    title: String,
    description: {
      type: String,
      default: "Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazıları - Ben İzledim"
    },
    ogImage: {
      type: String,
      default: "/images/og-default.png"
    },
    canonicalUrl: {
      type: String,
      default: ""
    },
    ogType: {
      type: String,
      default: "website"
    },
    schemaNodes: {
      type: Array,
      default: () => []
    },
    extraMeta: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const baseUrl = "https://benizledim.com";
    const currentCanonical = computed(() => {
      if (props.canonicalUrl) return props.canonicalUrl;
      const path = usePage().url?.split("?")[0] || "/";
      return `${baseUrl}${path}`;
    });
    const fullOgImage = computed(() => {
      if (props.ogImage.startsWith("http")) return props.ogImage;
      return `${baseUrl}${props.ogImage}`;
    });
    const fullTitle = computed(() => props.title ? `${props.title} - Ben İzledim` : "Ben İzledim - Film, Dizi ve Belgesel Eleştiri Platformu");
    const websiteSchema = computed(() => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Ben İzledim",
      "url": baseUrl,
      "description": "Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazıları",
      "inLanguage": "tr-TR",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://benizledim.com/ara?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }));
    const webPageSchema = computed(() => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": props.title || "Ben İzledim",
      "headline": props.title || "Ben İzledim",
      "description": props.description,
      "url": currentCanonical.value,
      "image": fullOgImage.value,
      "inLanguage": "tr-TR",
      "isPartOf": {
        "@type": "WebSite",
        "name": "Ben İzledim",
        "url": baseUrl
      }
    }));
    const resolvedSchemaNodes = computed(() => [
      websiteSchema.value,
      webPageSchema.value,
      ...props.schemaNodes.filter(Boolean)
    ]);
    const page = usePage();
    const authUser = page.props.auth?.user;
    const newsletterMessage = computed(() => page.props.flash?.newsletter_message);
    const canAccessCms = computed(() => {
      return ["admin", "editor", "author"].includes(authUser?.role || "");
    });
    const showLoginModal = ref(false);
    const showUserMenu = ref(false);
    const showMobileMenu = ref(false);
    const closeLoginModal = () => {
      showLoginModal.value = false;
    };
    const categoryLinks = [
      { name: "Sinema", slug: "sinema" },
      { name: "Dizi", slug: "dizi" },
      { name: "Belgesel", slug: "belgesel" },
      { name: "Film", slug: "film" }
    ];
    const form = useForm({ email: "" });
    const todayLabel = computed(() => {
      return new Intl.DateTimeFormat("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(/* @__PURE__ */ new Date());
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_click_outside = resolveDirective("click-outside");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-e735e45d${_scopeId}>${ssrInterpolate(fullTitle.value)}</title><link rel="canonical"${ssrRenderAttr("href", currentCanonical.value)} data-v-e735e45d${_scopeId}><link rel="alternate" type="application/rss+xml" title="Ben İzledim RSS" href="https://benizledim.com/feed" data-v-e735e45d${_scopeId}><meta name="description"${ssrRenderAttr("content", __props.description)} data-v-e735e45d${_scopeId}><meta property="og:title"${ssrRenderAttr("content", __props.title || "Ben İzledim")} data-v-e735e45d${_scopeId}><meta property="og:description"${ssrRenderAttr("content", __props.description)} data-v-e735e45d${_scopeId}><meta property="og:image"${ssrRenderAttr("content", fullOgImage.value)} data-v-e735e45d${_scopeId}><meta property="og:url"${ssrRenderAttr("content", currentCanonical.value)} data-v-e735e45d${_scopeId}><meta property="og:type"${ssrRenderAttr("content", __props.ogType)} data-v-e735e45d${_scopeId}><meta property="og:site_name" content="Ben İzledim" data-v-e735e45d${_scopeId}><meta property="og:locale" content="tr_TR" data-v-e735e45d${_scopeId}><!--[-->`);
            ssrRenderList(__props.extraMeta, (meta, index) => {
              _push2(`<meta${ssrRenderAttrs(mergeProps({
                key: `meta-${index}`
              }, { ref_for: true }, meta.property ? { property: meta.property } : { name: meta.name }, {
                content: meta.content
              }))} data-v-e735e45d${_scopeId}>`);
            });
            _push2(`<!--]--><meta name="twitter:card" content="summary_large_image" data-v-e735e45d${_scopeId}><meta name="twitter:title"${ssrRenderAttr("content", __props.title || "Ben İzledim")} data-v-e735e45d${_scopeId}><meta name="twitter:description"${ssrRenderAttr("content", __props.description)} data-v-e735e45d${_scopeId}><meta name="twitter:image"${ssrRenderAttr("content", fullOgImage.value)} data-v-e735e45d${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(fullTitle.value), 1),
              createVNode("link", {
                rel: "canonical",
                href: currentCanonical.value
              }, null, 8, ["href"]),
              createVNode("link", {
                rel: "alternate",
                type: "application/rss+xml",
                title: "Ben İzledim RSS",
                href: "https://benizledim.com/feed"
              }),
              createVNode("meta", {
                name: "description",
                content: __props.description
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:title",
                content: __props.title || "Ben İzledim"
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:description",
                content: __props.description
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:image",
                content: fullOgImage.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:url",
                content: currentCanonical.value
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:type",
                content: __props.ogType
              }, null, 8, ["content"]),
              createVNode("meta", {
                property: "og:site_name",
                content: "Ben İzledim"
              }),
              createVNode("meta", {
                property: "og:locale",
                content: "tr_TR"
              }),
              (openBlock(true), createBlock(Fragment, null, renderList(__props.extraMeta, (meta, index) => {
                return openBlock(), createBlock("meta", mergeProps({
                  key: `meta-${index}`
                }, { ref_for: true }, meta.property ? { property: meta.property } : { name: meta.name }, {
                  content: meta.content
                }), null, 16, ["content"]);
              }), 128)),
              createVNode("meta", {
                name: "twitter:card",
                content: "summary_large_image"
              }),
              createVNode("meta", {
                name: "twitter:title",
                content: __props.title || "Ben İzledim"
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:description",
                content: __props.description
              }, null, 8, ["content"]),
              createVNode("meta", {
                name: "twitter:image",
                content: fullOgImage.value
              }, null, 8, ["content"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(resolvedSchemaNodes.value, (schema, index) => {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent("script"), {
          key: `schema-${index}`,
          type: "application/ld+json"
        }, null), _parent);
      });
      _push(`<!--]--><header class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)]" data-v-e735e45d><div class="bg-[var(--bi-ink)] text-[var(--bi-paper)]" data-v-e735e45d><div class="bi-wrap flex h-8 items-center justify-between gap-4 text-[0.68rem] font-bold uppercase tracking-[0.08em] bi-mono" data-v-e735e45d><span data-v-e735e45d>${ssrInterpolate(todayLabel.value)} · İstanbul</span><div class="hidden items-center gap-4 sm:flex" data-v-e735e45d>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/#bulten",
        class: "inline-flex items-center py-2 hover:text-red-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Bülten`);
          } else {
            return [
              createTextVNode("Bülten")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/podcast",
        class: "inline-flex items-center py-2 hover:text-red-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Podcast`);
          } else {
            return [
              createTextVNode("Podcast")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (!unref(authUser)) {
        _push(`<button class="inline-flex items-center py-2 hover:text-red-300" data-v-e735e45d>Giriş</button>`);
      } else if (canAccessCms.value) {
        _push(ssrRenderComponent(unref(Link), {
          href: "/admin",
          class: "inline-flex items-center py-2 hover:text-red-300"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Admin`);
            } else {
              return [
                createTextVNode("Admin")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="bi-wrap grid gap-5 border-b border-[var(--bi-ink)] py-5 lg:grid-cols-[auto_1fr_auto] lg:items-end" data-v-e735e45d><button class="inline-flex h-11 w-11 items-center justify-center border border-[var(--bi-ink)] lg:hidden" aria-label="Menüyü aç" data-v-e735e45d>`);
      if (!showMobileMenu.value) {
        _push(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-e735e45d><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 17h16" data-v-e735e45d></path></svg>`);
      } else {
        _push(`<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-e735e45d><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-e735e45d></path></svg>`);
      }
      _push(`</button>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "bi-serif text-[clamp(2.7rem,8vw,5.8rem)] font-bold leading-none text-[var(--bi-ink)]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ben<span class="px-1 text-red-700" data-v-e735e45d${_scopeId}>/</span>İzledim `);
          } else {
            return [
              createTextVNode(" Ben"),
              createVNode("span", { class: "px-1 text-red-700" }, "/"),
              createTextVNode("İzledim ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="hidden max-w-[24ch] border-l border-[var(--bi-ink)] pl-4 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-[var(--bi-muted)] bi-mono lg:block" data-v-e735e45d> Film, dizi ve belgesel üzerine bağımsız eleştiri </p><div class="flex flex-wrap items-center gap-3 lg:justify-end" data-v-e735e45d>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/ne-izlesem",
        class: "ne-izlesem-nav-button inline-flex min-h-11 items-center justify-center px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white bi-mono lg:hidden"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ne İzlesem? `);
          } else {
            return [
              createTextVNode(" Ne İzlesem? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$1, { placeholder: "Film, dizi, yazar ara..." }, null, _parent));
      if (!unref(authUser)) {
        _push(`<button class="hidden min-h-11 items-center border border-[var(--bi-ink)] bg-[var(--bi-ink)] px-4 py-2 text-sm font-bold text-[var(--bi-paper)] transition hover:bg-red-700 md:inline-flex" data-v-e735e45d> Giriş </button>`);
      } else {
        _push(`<div class="relative hidden md:block" data-v-e735e45d><button class="flex min-h-11 items-center gap-2 border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-3 py-2 text-sm font-bold" data-v-e735e45d>`);
        if (unref(authUser).avatar) {
          _push(`<img${ssrRenderAttr("src", unref(authUser).avatar)}${ssrRenderAttr("alt", unref(authUser).name)} class="h-7 w-7 rounded-full object-cover" data-v-e735e45d>`);
        } else {
          _push(`<span class="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white" data-v-e735e45d>${ssrInterpolate(unref(authUser)?.name?.charAt(0)?.toUpperCase() || "?")}</span>`);
        }
        _push(`<span class="max-w-32 truncate" data-v-e735e45d>${ssrInterpolate(unref(authUser).name)}</span></button>`);
        if (showUserMenu.value) {
          _push(`<div${ssrRenderAttrs(mergeProps({ class: "absolute right-0 z-50 mt-2 w-52 border border-[var(--bi-ink)] bg-[var(--bi-paper)] py-1 shadow-[6px_6px_0_var(--bi-ink)]" }, ssrGetDirectiveProps(_ctx, _directive_click_outside, () => showUserMenu.value = false)))} data-v-e735e45d>`);
          _push(ssrRenderComponent(unref(Link), {
            href: `/profile/${unref(authUser).id}`,
            class: "flex min-h-11 items-center px-4 py-2 text-sm hover:bg-[var(--bi-paper-deep)]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Profilim`);
              } else {
                return [
                  createTextVNode("Profilim")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (canAccessCms.value) {
            _push(ssrRenderComponent(unref(Link), {
              href: "/admin",
              class: "flex min-h-11 items-center px-4 py-2 text-sm hover:bg-[var(--bi-paper-deep)]"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Admin Panel`);
                } else {
                  return [
                    createTextVNode("Admin Panel")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="flex min-h-11 w-full items-center px-4 py-2 text-left text-sm hover:bg-[var(--bi-paper-deep)]" data-v-e735e45d>Çıkış Yap</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div><nav class="bi-wrap hidden h-12 items-stretch justify-between border-b border-[var(--bi-ink)] lg:flex" data-v-e735e45d><div class="flex" data-v-e735e45d>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/",
        class: "inline-flex min-h-12 items-center border-x border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Ana Sayfa`);
          } else {
            return [
              createTextVNode("Ana Sayfa")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(categoryLinks, (cat) => {
        _push(ssrRenderComponent(unref(Link), {
          key: cat.slug,
          href: `/yazilar?category=${cat.slug}`,
          class: "inline-flex min-h-12 items-center border-r border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(cat.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(cat.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/podcast",
        class: "inline-flex min-h-12 items-center border-r border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Podcast`);
          } else {
            return [
              createTextVNode("Podcast")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "/festival",
        class: "inline-flex min-h-12 items-center border-r border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Festival`);
          } else {
            return [
              createTextVNode("Festival")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/ne-izlesem",
        class: "ne-izlesem-nav-button inline-flex min-h-12 min-w-[132px] items-center justify-center px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white bi-mono"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ne İzlesem? `);
          } else {
            return [
              createTextVNode(" Ne İzlesem? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav>`);
      if (showMobileMenu.value) {
        _push(`<div class="bi-wrap border-b border-[var(--bi-ink)] py-4 lg:hidden" data-v-e735e45d><div class="grid gap-2" data-v-e735e45d>`);
        _push(ssrRenderComponent(unref(Link), {
          href: "/",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Ana Sayfa`);
            } else {
              return [
                createTextVNode("Ana Sayfa")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--[-->`);
        ssrRenderList(categoryLinks, (cat) => {
          _push(ssrRenderComponent(unref(Link), {
            key: cat.slug,
            href: `/yazilar?category=${cat.slug}`,
            class: "bi-chip",
            onClick: ($event) => showMobileMenu.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(cat.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(cat.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]-->`);
        _push(ssrRenderComponent(unref(Link), {
          href: "/podcast",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Podcast`);
            } else {
              return [
                createTextVNode("Podcast")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Link), {
          href: "/festival",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Festival`);
            } else {
              return [
                createTextVNode("Festival")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Link), {
          href: "/sinemalar",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Sinemalar`);
            } else {
              return [
                createTextVNode("Sinemalar")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Link), {
          href: "/ne-izlesem",
          class: "bi-chip",
          onClick: ($event) => showMobileMenu.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Ne İzlesem?`);
            } else {
              return [
                createTextVNode("Ne İzlesem?")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (!unref(authUser)) {
          _push(`<button class="bi-chip text-left" data-v-e735e45d>Giriş Yap</button>`);
        } else if (canAccessCms.value) {
          _push(ssrRenderComponent(unref(Link), {
            href: "/admin",
            class: "bi-chip",
            onClick: ($event) => showMobileMenu.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Admin Panel`);
              } else {
                return [
                  createTextVNode("Admin Panel")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><main class="min-h-screen" data-v-e735e45d>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="border-t-2 border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]" data-v-e735e45d><div class="bi-wrap py-12" data-v-e735e45d><div class="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr_1fr]" data-v-e735e45d><div id="bulten" data-v-e735e45d><h3 class="bi-serif mb-4 text-4xl font-bold" data-v-e735e45d>Ben/İzledim</h3><p class="max-w-md text-sm leading-relaxed text-stone-300" data-v-e735e45d> Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazılarının yer aldığı bir medya ve eğlence platformudur. </p></div><div data-v-e735e45d><h4 class="bi-mono mb-4 text-xs font-bold uppercase tracking-[0.08em] text-red-300" data-v-e735e45d>Kategoriler</h4><ul class="space-y-2 text-sm" data-v-e735e45d><li data-v-e735e45d>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/yazilar?category=sinema",
        class: "text-stone-300 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sinema `);
          } else {
            return [
              createTextVNode(" Sinema ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-e735e45d>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/yazilar?category=dizi",
        class: "text-stone-300 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Dizi `);
          } else {
            return [
              createTextVNode(" Dizi ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-e735e45d>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/yazilar?category=belgesel",
        class: "text-stone-300 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Belgesel `);
          } else {
            return [
              createTextVNode(" Belgesel ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-e735e45d>`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/yazilar?category=film",
        class: "text-stone-300 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Film `);
          } else {
            return [
              createTextVNode(" Film ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div data-v-e735e45d><h4 class="bi-mono mb-4 text-xs font-bold uppercase tracking-[0.08em] text-red-300" data-v-e735e45d>Önce Siz Okuyun</h4><p class="mb-4 text-sm text-stone-300" data-v-e735e45d> Yeni blog yazılarımızdan ve haberlerden ilk siz haberdar olun! </p>`);
      if (newsletterMessage.value) {
        _push(`<div class="mb-3" data-v-e735e45d><div class="border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-700" data-v-e735e45d>${ssrInterpolate(newsletterMessage.value)}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="flex gap-2" novalidate data-v-e735e45d><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="E-posta adresiniz" class="${ssrRenderClass([{ "border-red-500": unref(form).errors.email }, "min-w-0 flex-1 border border-stone-500 bg-transparent px-3 py-2 text-sm text-white placeholder-stone-400 focus:border-red-400 focus:outline-none"])}" data-v-e735e45d><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="bg-red-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50" data-v-e735e45d> Abone </button></form>`);
      if (unref(form).errors.email) {
        _push(`<p class="mt-2 text-red-400 text-xs" data-v-e735e45d>${ssrInterpolate(unref(form).errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="bi-mono mt-8 border-t border-stone-700 pt-8 text-center text-xs uppercase tracking-[0.08em] text-stone-500" data-v-e735e45d> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Ben İzledim. Tüm hakları saklıdır. </div></div></footer>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        show: showLoginModal.value,
        onClose: closeLoginModal
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Layout/AppLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AppLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e735e45d"]]);
export {
  AppLayout as A,
  _sfc_main$2 as _,
  _export_sfc as a
};
