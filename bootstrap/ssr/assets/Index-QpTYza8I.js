import { mergeProps, unref, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, createVNode, useSSRContext, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { A as AppLayout } from "./AppLayout-Bunikqc4.js";
import "@headlessui/vue";
const _sfc_main$1 = {
  __name: "ActivityItem",
  __ssrInlineRender: true,
  props: {
    item: { type: Object, required: true }
  },
  setup(__props) {
    const labels = {
      post_published: "yeni yazı yayınladı",
      watch_log_created: "izleme notu ekledi",
      followed_user: "bir yazarı takip etti",
      commented: "yorum yaptı",
      entry_created: "entry yazdı",
      mentioned: "birinden bahsetti"
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "border-b-2 border-gray-100 py-4" }, _attrs))}><div class="flex gap-3">`);
      if (__props.item.actor?.avatar) {
        _push(`<img${ssrRenderAttr("src", __props.item.actor.avatar)}${ssrRenderAttr("alt", __props.item.actor.name)} class="h-10 w-10 rounded-full object-cover">`);
      } else {
        _push(`<div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-black text-red-700">${ssrInterpolate(__props.item.actor?.name?.charAt(0) || "B")}</div>`);
      }
      _push(`<div class="min-w-0 flex-1"><p class="text-sm text-gray-700">`);
      if (__props.item.actor) {
        _push(ssrRenderComponent(unref(Link), {
          href: `/profile/${__props.item.actor.id}`,
          class: "font-black text-[var(--bi-ink)] hover:text-red-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.item.actor.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.item.actor.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<span class="font-black">Ben/İzledim</span>`);
      }
      _push(` ${ssrInterpolate(labels[__props.item.type] || __props.item.type)}</p>`);
      if (__props.item.post) {
        _push(ssrRenderComponent(unref(Link), {
          href: `/yazi/${__props.item.post.slug}`,
          class: "mt-2 flex gap-3 rounded-md border border-gray-200 p-2 transition hover:border-red-200"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (__props.item.post.cover_image) {
                _push2(`<img${ssrRenderAttr("src", __props.item.post.cover_image)}${ssrRenderAttr("alt", __props.item.post.title)} class="h-14 w-10 rounded object-cover"${_scopeId}>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="min-w-0"${_scopeId}><p class="truncate text-sm font-black text-[var(--bi-ink)]"${_scopeId}>${ssrInterpolate(__props.item.post.title)}</p><p class="mt-1 text-xs uppercase tracking-wide text-red-700"${_scopeId}>${ssrInterpolate(__props.item.post.format || "post")}</p></div>`);
            } else {
              return [
                __props.item.post.cover_image ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: __props.item.post.cover_image,
                  alt: __props.item.post.title,
                  class: "h-14 w-10 rounded object-cover"
                }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                createVNode("div", { class: "min-w-0" }, [
                  createVNode("p", { class: "truncate text-sm font-black text-[var(--bi-ink)]" }, toDisplayString(__props.item.post.title), 1),
                  createVNode("p", { class: "mt-1 text-xs uppercase tracking-wide text-red-700" }, toDisplayString(__props.item.post.format || "post"), 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></article>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Social/ActivityItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    items: { type: Object, required: true }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({ title: "Akış" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="mx-auto max-w-3xl px-4 py-8"${_scopeId}><h1 class="mb-4 text-2xl font-black text-[var(--bi-ink)]"${_scopeId}>Akış</h1>`);
            if (__props.items.data.length) {
              _push2(`<div class="bg-white"${_scopeId}><!--[-->`);
              ssrRenderList(__props.items.data, (item) => {
                _push2(ssrRenderComponent(_sfc_main$1, {
                  key: item.id,
                  item
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="rounded-md border-2 border-[var(--bi-ink)] bg-white p-6 text-center"${_scopeId}><p class="font-bold text-[var(--bi-ink)]"${_scopeId}>Akışın henüz boş.</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/yazarlar",
                class: "mt-3 inline-flex rounded-md bg-red-600 px-4 py-2 text-sm font-black text-white"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Yazar keşfet `);
                  } else {
                    return [
                      createTextVNode(" Yazar keşfet ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
            }
            _push2(`</section>`);
          } else {
            return [
              createVNode("section", { class: "mx-auto max-w-3xl px-4 py-8" }, [
                createVNode("h1", { class: "mb-4 text-2xl font-black text-[var(--bi-ink)]" }, "Akış"),
                __props.items.data.length ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-white"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.items.data, (item) => {
                    return openBlock(), createBlock(_sfc_main$1, {
                      key: item.id,
                      item
                    }, null, 8, ["item"]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "rounded-md border-2 border-[var(--bi-ink)] bg-white p-6 text-center"
                }, [
                  createVNode("p", { class: "font-bold text-[var(--bi-ink)]" }, "Akışın henüz boş."),
                  createVNode(unref(Link), {
                    href: "/yazarlar",
                    class: "mt-3 inline-flex rounded-md bg-red-600 px-4 py-2 text-sm font-black text-white"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Yazar keşfet ")
                    ]),
                    _: 1
                  })
                ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Activity/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
