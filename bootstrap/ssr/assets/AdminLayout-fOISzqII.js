import { mergeProps, useSSRContext, computed, ref, watch, unref } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Head } from "@inertiajs/vue3";
const _sfc_main$1 = {
  __name: "AdminIcon",
  __ssrInlineRender: true,
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        class: "h-4 w-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        "aria-hidden": "true"
      }, _attrs))}>`);
      if (__props.name === "dashboard") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z"></path>`);
      } else if (__props.name === "posts") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 5h12M6 9h12M6 13h8M6 17h10"></path>`);
      } else if (__props.name === "folder") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7h7l2 2h9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"></path>`);
      } else if (__props.name === "tag") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13 13 20 4 11V4h7l9 9Z"></path>`);
      } else if (__props.name === "audio") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3Zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3Z"></path>`);
      } else if (__props.name === "film") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16v14H4V5Zm4 0v14M16 5v14M4 9h4m8 0h4M4 15h4m8 0h4"></path>`);
      } else if (__props.name === "page") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 3h7l4 4v14H7V3Zm7 0v5h5"></path>`);
      } else if (__props.name === "comments") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 6h14v9H8l-3 3V6Z"></path>`);
      } else if (__props.name === "mail") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16v12H4V6Zm0 1 8 6 8-6"></path>`);
      } else if (__props.name === "settings") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.3 2.3a1 1 0 0 1 1.4 0l1 1a1 1 0 0 0 1 .24l1.35-.36a1 1 0 0 1 1.22.7l.36 1.35a1 1 0 0 0 .7.7l1.35.36a1 1 0 0 1 .7 1.22l-.36 1.35a1 1 0 0 0 .24 1l1 1a1 1 0 0 1 0 1.4l-1 1a1 1 0 0 0-.24 1l.36 1.35a1 1 0 0 1-.7 1.22l-1.35.36a1 1 0 0 0-.7.7l-.36 1.35a1 1 0 0 1-1.22.7l-1.35-.36a1 1 0 0 0-1 .24l-1 1a1 1 0 0 1-1.4 0l-1-1a1 1 0 0 0-1-.24l-1.35.36a1 1 0 0 1-1.22-.7l-.36-1.35a1 1 0 0 0-.7-.7l-1.35-.36a1 1 0 0 1-.7-1.22l.36-1.35a1 1 0 0 0-.24-1l-1-1a1 1 0 0 1 0-1.4l1-1a1 1 0 0 0 .24-1l-.36-1.35a1 1 0 0 1 .7-1.22l1.35-.36a1 1 0 0 0 .7-.7l.36-1.35a1 1 0 0 1 1.22-.7l1.35.36a1 1 0 0 0 1-.24l1-1Z"></path>`);
      } else if (__props.name === "users") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11a4 4 0 1 0-8 0m8 0a4 4 0 0 1-8 0m8 0c2.5.7 4 2.1 4 4v2H4v-2c0-1.9 1.5-3.3 4-4"></path>`);
      } else if (__props.name === "home") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z"></path>`);
      } else if (__props.name === "logout") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6v12h4m4-9 3 3-3 3m3-3H9"></path>`);
      } else if (__props.name === "menu") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h16"></path>`);
      } else if (__props.name === "check") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 13 4 4L19 7"></path>`);
      } else if (__props.name === "alert") {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v5m0 4h.01M10.2 4.8 3 18h18L13.8 4.8a2 2 0 0 0-3.6 0Z"></path>`);
      } else {
        _push(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14M5 12h14"></path>`);
      }
      _push(`</svg>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Admin/AdminIcon.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
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
  __name: "AdminLayout",
  __ssrInlineRender: true,
  props: {
    title: String
  },
  setup(__props) {
    const page = usePage();
    const authUser = computed(() => page.props.auth?.user || {});
    const flashSuccess = computed(() => page.props.flash?.success);
    const flashError = computed(() => page.props.flash?.error);
    const isAdmin = computed(() => authUser.value?.role === "admin");
    const isManager = computed(() => ["admin", "editor"].includes(authUser.value?.role || ""));
    const panelName = computed(() => authUser.value?.role === "author" ? "Yazar Paneli" : "Yönetim Paneli");
    const roleLabel = computed(() => {
      if (isAdmin.value) return "Admin";
      if (authUser.value?.role === "editor") return "Editör";
      return "Yazar";
    });
    const showMobileSidebar = ref(false);
    const showUserMenu = ref(false);
    const isMenuActive = (href) => {
      const currentUrl = page.url;
      if (href === "/admin") {
        return currentUrl === "/admin" || currentUrl === "/admin/";
      }
      return currentUrl.startsWith(href);
    };
    const menuItems = computed(() => {
      const items = [
        { name: "Genel Bakış", href: "/admin", icon: "dashboard", roles: ["admin", "editor", "author"] },
        { name: "Yazılar", href: "/admin/posts", icon: "posts", roles: ["admin", "editor", "author"] },
        { name: "Kategoriler", href: "/admin/categories", icon: "folder", roles: ["admin", "editor"] },
        { name: "Etiketler", href: "/admin/tags", icon: "tag", roles: ["admin", "editor"] },
        { name: "Podcast", href: "/admin/podcasts", icon: "audio", roles: ["admin", "editor"] },
        { name: "Festival", href: "/admin/festival-events", icon: "film", roles: ["admin", "editor"] },
        { name: "Sayfalar", href: "/admin/pages", icon: "page", roles: ["admin", "editor"] },
        { name: "Yorumlar", href: "/admin/comments", icon: "comments", roles: ["admin", "editor"] }
      ];
      if (isManager.value) {
        items.push({ name: "Bülten", href: "/admin/newsletters", icon: "mail", roles: ["admin", "editor"] });
      }
      if (isAdmin.value) {
        items.push({ name: "Ayarlar", href: "/admin/settings", icon: "settings", roles: ["admin"] });
        items.push({ name: "Kullanıcılar", href: "/admin/users", icon: "users", roles: ["admin"] });
      }
      return items.filter((item) => item.roles.includes(authUser.value?.role || ""));
    });
    const toasts = ref([]);
    let toastId = 0;
    const addToast = (message, type = "success") => {
      const id = ++toastId;
      toasts.value.push({ id, message, type });
      setTimeout(() => {
        toasts.value = toasts.value.filter((toast) => toast.id !== id);
      }, 3200);
    };
    watch(flashSuccess, (message) => {
      if (message) addToast(message, "success");
    });
    watch(flashError, (message) => {
      if (message) addToast(message, "error");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: __props.title ? `${__props.title} - ${panelName.value}` : panelName.value
      }, null, _parent));
      _push(`<div class="min-h-screen bg-[var(--bi-paper)] text-[var(--bi-ink)]">`);
      if (showMobileSidebar.value) {
        _push(`<div class="fixed inset-0 z-40 bg-black/45 lg:hidden"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<aside class="${ssrRenderClass([
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] transition-transform duration-200 lg:translate-x-0",
        showMobileSidebar.value ? "translate-x-0" : "-translate-x-full"
      ])}"><div class="border-b-2 border-[var(--bi-ink)] px-5 py-5"><a href="/admin" class="block"><span class="bi-mono block text-[0.65rem] font-bold uppercase tracking-[0.1em] text-red-700">Ben İzledim</span><span class="mt-1 block text-2xl font-black leading-none">${ssrInterpolate(panelName.value)}</span></a></div><div class="border-b border-[var(--bi-rule-soft)] px-5 py-4"><div class="flex items-center justify-between gap-3"><div class="min-w-0"><p class="truncate text-sm font-bold">${ssrInterpolate(authUser.value?.name)}</p><p class="truncate text-xs text-[var(--bi-muted)]">${ssrInterpolate(authUser.value?.email)}</p></div><span class="border border-[var(--bi-ink)] bg-white px-2 py-1 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-red-700 bi-mono">${ssrInterpolate(roleLabel.value)}</span></div></div><nav class="flex-1 space-y-1 overflow-y-auto p-4"><!--[-->`);
      ssrRenderList(menuItems.value, (item) => {
        _push(`<a${ssrRenderAttr("href", item.href)} class="${ssrRenderClass([
          "flex items-center gap-3 border px-4 py-3 text-sm font-bold transition",
          isMenuActive(item.href) ? "border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]" : "border-transparent text-[var(--bi-ink)] hover:border-[var(--bi-ink)] hover:bg-white"
        ])}">`);
        _push(ssrRenderComponent(_sfc_main$1, {
          name: item.icon
        }, null, _parent));
        _push(`<span>${ssrInterpolate(item.name)}</span></a>`);
      });
      _push(`<!--]--></nav><div class="border-t-2 border-[var(--bi-ink)] p-4"><a href="/" class="mb-2 flex items-center gap-3 border border-transparent px-4 py-3 text-sm font-bold text-[var(--bi-ink)] hover:border-[var(--bi-ink)] hover:bg-white">`);
      _push(ssrRenderComponent(_sfc_main$1, { name: "home" }, null, _parent));
      _push(`<span>Siteye Dön</span></a><button class="flex w-full items-center gap-3 border border-transparent px-4 py-3 text-sm font-bold text-[var(--bi-ink)] hover:border-[var(--bi-ink)] hover:bg-white">`);
      _push(ssrRenderComponent(_sfc_main$1, { name: "logout" }, null, _parent));
      _push(`<span>Çıkış Yap</span></button></div></aside><div class="min-h-screen lg:pl-72"><header class="sticky top-0 z-30 border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)]/95 backdrop-blur"><div class="flex h-16 items-center justify-between px-4 lg:px-8"><div class="flex min-w-0 items-center gap-3"><button class="border border-[var(--bi-ink)] p-2 lg:hidden" aria-label="Menüyü aç">`);
      _push(ssrRenderComponent(_sfc_main$1, { name: "menu" }, null, _parent));
      _push(`</button><div class="min-w-0"><p class="bi-mono text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--bi-muted)]">${ssrInterpolate(panelName.value)}</p><h1 class="truncate text-xl font-black leading-tight text-[var(--bi-ink)]">${ssrInterpolate(__props.title)}</h1></div></div><div class="relative"><button class="flex items-center gap-2 border border-transparent px-2 py-2 transition hover:border-[var(--bi-ink)] hover:bg-white">`);
      if (authUser.value?.avatar) {
        _push(`<img${ssrRenderAttr("src", authUser.value.avatar)}${ssrRenderAttr("alt", authUser.value.name)} class="h-8 w-8 rounded-full object-cover">`);
      } else {
        _push(`<div class="grid h-8 w-8 place-items-center rounded-full bg-red-700 text-sm font-black text-white">${ssrInterpolate(authUser.value?.name?.charAt(0)?.toUpperCase() || "?")}</div>`);
      }
      _push(`<span class="hidden max-w-40 truncate text-sm font-bold sm:block">${ssrInterpolate(authUser.value?.name)}</span></button>`);
      if (showUserMenu.value) {
        _push(`<div class="absolute right-0 z-50 mt-2 w-56 border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] shadow-[6px_6px_0_var(--bi-ink)]"><div class="border-b border-[var(--bi-rule-soft)] px-4 py-3"><p class="truncate text-sm font-bold">${ssrInterpolate(authUser.value?.name)}</p><p class="truncate text-xs text-[var(--bi-muted)]">${ssrInterpolate(authUser.value?.email)}</p></div><a${ssrRenderAttr("href", `/profile/${authUser.value?.id}`)} class="block px-4 py-2 text-sm font-bold hover:bg-white"> Profilim </a><a href="/" class="block px-4 py-2 text-sm font-bold hover:bg-white"> Siteye Dön </a><button class="block w-full px-4 py-2 text-left text-sm font-bold hover:bg-white"> Çıkış Yap </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></header><main class="px-4 py-6 lg:px-8 lg:py-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div><div class="fixed right-4 top-4 z-50 space-y-2"><!--[-->`);
      ssrRenderList(toasts.value, (toast) => {
        _push(`<div class="${ssrRenderClass([
          "min-w-[280px] border-2 bg-[var(--bi-paper)] px-4 py-3 shadow-[5px_5px_0_var(--bi-ink)]",
          toast.type === "success" ? "border-emerald-700 text-emerald-900" : "border-red-700 text-red-900"
        ])}"><div class="flex items-center gap-2 text-sm font-bold">`);
        _push(ssrRenderComponent(_sfc_main$1, {
          name: toast.type === "success" ? "check" : "plus"
        }, null, _parent));
        _push(`<span>${ssrInterpolate(toast.message)}</span></div></div>`);
      });
      _push(`<!--]--></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Admin/AdminLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _,
  _sfc_main$1 as a
};
