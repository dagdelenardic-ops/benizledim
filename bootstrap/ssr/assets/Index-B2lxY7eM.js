import { mergeProps, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import { router } from "@inertiajs/vue3";
import axios from "axios";
import { A as AppLayout } from "./AppLayout-lGkS_X2S.js";
import "@headlessui/vue";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    items: { type: Object, required: true },
    filters: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const statuses = [
      { value: "", label: "Hepsi" },
      { value: "planned", label: "Planlanan" },
      { value: "watching", label: "İzleniyor" },
      { value: "watched", label: "İzlendi" }
    ];
    function filter(status) {
      router.get("/watchlist", status ? { status } : {}, { preserveState: true, replace: true });
    }
    async function update(item, status) {
      await axios.patch(`/api/watchlist/${item.post.slug}`, { status });
      router.reload({ only: ["items"] });
    }
    async function remove(item) {
      await axios.delete(`/api/watchlist/${item.post.slug}`);
      router.reload({ only: ["items"] });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({ title: "Watchlist" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="mx-auto max-w-5xl px-4 py-8"${_scopeId}><div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"${_scopeId}><h1 class="text-2xl font-black text-[var(--bi-ink)]"${_scopeId}>Watchlist</h1><div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(statuses, (status) => {
              _push2(`<button class="${ssrRenderClass([(__props.filters.status || "") === status.value ? "bg-red-600 text-white" : "bg-white text-[var(--bi-ink)]", "rounded-md border-2 border-[var(--bi-ink)] px-3 py-1.5 text-sm font-black"])}"${_scopeId}>${ssrInterpolate(status.label)}</button>`);
            });
            _push2(`<!--]--></div></div><div class="divide-y-2 divide-gray-100 bg-white"${_scopeId}><!--[-->`);
            ssrRenderList(__props.items.data, (item) => {
              _push2(`<article class="flex gap-3 py-4"${_scopeId}>`);
              if (item.post.cover_image) {
                _push2(`<img${ssrRenderAttr("src", item.post.cover_image)}${ssrRenderAttr("alt", item.post.title)} class="h-24 w-16 rounded object-cover"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="min-w-0 flex-1"${_scopeId}><a${ssrRenderAttr("href", `/yazi/${item.post.slug}`)} class="font-black text-[var(--bi-ink)] hover:text-red-700"${_scopeId}>${ssrInterpolate(item.post.title)}</a><p class="mt-1 text-sm text-gray-500"${_scopeId}>${ssrInterpolate(item.post.author?.name)}</p><select${ssrRenderAttr("value", item.status)} class="mt-3 rounded-md border-2 border-[var(--bi-ink)] px-2 py-1 text-sm"${_scopeId}><option value="planned"${_scopeId}>Planlanan</option><option value="watching"${_scopeId}>İzleniyor</option><option value="watched"${_scopeId}>İzlendi</option></select></div><button class="h-9 rounded-md border-2 border-[var(--bi-ink)] px-3 text-sm font-black hover:bg-red-50"${_scopeId}> Sil </button></article>`);
            });
            _push2(`<!--]--></div></section>`);
          } else {
            return [
              createVNode("section", { class: "mx-auto max-w-5xl px-4 py-8" }, [
                createVNode("div", { class: "mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" }, [
                  createVNode("h1", { class: "text-2xl font-black text-[var(--bi-ink)]" }, "Watchlist"),
                  createVNode("div", { class: "flex flex-wrap gap-2" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(statuses, (status) => {
                      return createVNode("button", {
                        key: status.value,
                        class: ["rounded-md border-2 border-[var(--bi-ink)] px-3 py-1.5 text-sm font-black", (__props.filters.status || "") === status.value ? "bg-red-600 text-white" : "bg-white text-[var(--bi-ink)]"],
                        onClick: ($event) => filter(status.value)
                      }, toDisplayString(status.label), 11, ["onClick"]);
                    }), 64))
                  ])
                ]),
                createVNode("div", { class: "divide-y-2 divide-gray-100 bg-white" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.items.data, (item) => {
                    return openBlock(), createBlock("article", {
                      key: item.id,
                      class: "flex gap-3 py-4"
                    }, [
                      item.post.cover_image ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: item.post.cover_image,
                        alt: item.post.title,
                        class: "h-24 w-16 rounded object-cover"
                      }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                      createVNode("div", { class: "min-w-0 flex-1" }, [
                        createVNode("a", {
                          href: `/yazi/${item.post.slug}`,
                          class: "font-black text-[var(--bi-ink)] hover:text-red-700"
                        }, toDisplayString(item.post.title), 9, ["href"]),
                        createVNode("p", { class: "mt-1 text-sm text-gray-500" }, toDisplayString(item.post.author?.name), 1),
                        createVNode("select", {
                          value: item.status,
                          class: "mt-3 rounded-md border-2 border-[var(--bi-ink)] px-2 py-1 text-sm",
                          onChange: ($event) => update(item, $event.target.value)
                        }, [
                          createVNode("option", { value: "planned" }, "Planlanan"),
                          createVNode("option", { value: "watching" }, "İzleniyor"),
                          createVNode("option", { value: "watched" }, "İzlendi")
                        ], 40, ["value", "onChange"])
                      ]),
                      createVNode("button", {
                        class: "h-9 rounded-md border-2 border-[var(--bi-ink)] px-3 text-sm font-black hover:bg-red-50",
                        onClick: ($event) => remove(item)
                      }, " Sil ", 8, ["onClick"])
                    ]);
                  }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Watchlist/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
