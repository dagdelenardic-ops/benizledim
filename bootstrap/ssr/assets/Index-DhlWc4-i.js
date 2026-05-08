import { computed, ref, mergeProps, withCtx, unref, createTextVNode, toDisplayString, createVNode, withModifiers, withDirectives, vModelText, openBlock, createBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { usePage, Link, router } from "@inertiajs/vue3";
import { A as AppLayout } from "./AppLayout-ogTCebx3.js";
import { _ as _sfc_main$1 } from "./FollowButton-B1R8OU26.js";
import "@headlessui/vue";
import "axios";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    authors: { type: Object, required: true },
    filters: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const authUser = computed(() => page.props.auth?.user);
    const q = ref(props.filters.q || "");
    function search() {
      router.get("/yazarlar", { q: q.value }, { preserveState: true, replace: true });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({ title: "Yazarlar" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="mx-auto max-w-6xl px-4 py-8"${_scopeId}><div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"${_scopeId}><h1 class="text-2xl font-black text-[var(--bi-ink)]"${_scopeId}>Yazarlar</h1><form class="flex gap-2"${_scopeId}><input${ssrRenderAttr("value", q.value)} type="search" placeholder="Yazar ara" class="h-10 rounded-md border-2 border-[var(--bi-ink)] px-3 text-sm"${_scopeId}><button class="h-10 rounded-md bg-red-600 px-4 text-sm font-black text-white"${_scopeId}>Ara</button></form></div><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.authors.data, (author) => {
              _push2(`<article class="rounded-md border-2 border-[var(--bi-ink)] bg-white p-4"${_scopeId}><div class="flex gap-3"${_scopeId}>`);
              if (author.avatar) {
                _push2(`<img${ssrRenderAttr("src", author.avatar)}${ssrRenderAttr("alt", author.name)} class="h-12 w-12 rounded-full object-cover"${_scopeId}>`);
              } else {
                _push2(`<div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 font-black text-red-700"${_scopeId}>${ssrInterpolate(author.name.charAt(0))}</div>`);
              }
              _push2(`<div class="min-w-0 flex-1"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/profile/${author.id}`,
                class: "truncate text-lg font-black text-[var(--bi-ink)] hover:text-red-700"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(author.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(author.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<p class="mt-1 line-clamp-2 text-sm text-gray-600"${_scopeId}>${ssrInterpolate(author.bio || "Film, dizi ve izleme notları.")}</p></div></div><div class="mt-4 flex items-center justify-between gap-3"${_scopeId}><p class="text-xs font-bold uppercase text-gray-500"${_scopeId}>${ssrInterpolate(author.posts_count)} yazı</p>`);
              if (authUser.value && authUser.value.id !== author.id) {
                _push2(ssrRenderComponent(_sfc_main$1, {
                  user: author,
                  "initial-following": author.is_following,
                  "initial-followers-count": author.followers_count
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<span class="text-xs font-bold text-gray-500"${_scopeId}>${ssrInterpolate(author.followers_count)} takipçi</span>`);
              }
              _push2(`</div></article>`);
            });
            _push2(`<!--]--></div></section>`);
          } else {
            return [
              createVNode("section", { class: "mx-auto max-w-6xl px-4 py-8" }, [
                createVNode("div", { class: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" }, [
                  createVNode("h1", { class: "text-2xl font-black text-[var(--bi-ink)]" }, "Yazarlar"),
                  createVNode("form", {
                    class: "flex gap-2",
                    onSubmit: withModifiers(search, ["prevent"])
                  }, [
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => q.value = $event,
                      type: "search",
                      placeholder: "Yazar ara",
                      class: "h-10 rounded-md border-2 border-[var(--bi-ink)] px-3 text-sm"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, q.value]
                    ]),
                    createVNode("button", { class: "h-10 rounded-md bg-red-600 px-4 text-sm font-black text-white" }, "Ara")
                  ], 32)
                ]),
                createVNode("div", { class: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.authors.data, (author) => {
                    return openBlock(), createBlock("article", {
                      key: author.id,
                      class: "rounded-md border-2 border-[var(--bi-ink)] bg-white p-4"
                    }, [
                      createVNode("div", { class: "flex gap-3" }, [
                        author.avatar ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: author.avatar,
                          alt: author.name,
                          class: "h-12 w-12 rounded-full object-cover"
                        }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "flex h-12 w-12 items-center justify-center rounded-full bg-red-100 font-black text-red-700"
                        }, toDisplayString(author.name.charAt(0)), 1)),
                        createVNode("div", { class: "min-w-0 flex-1" }, [
                          createVNode(unref(Link), {
                            href: `/profile/${author.id}`,
                            class: "truncate text-lg font-black text-[var(--bi-ink)] hover:text-red-700"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(author.name), 1)
                            ]),
                            _: 2
                          }, 1032, ["href"]),
                          createVNode("p", { class: "mt-1 line-clamp-2 text-sm text-gray-600" }, toDisplayString(author.bio || "Film, dizi ve izleme notları."), 1)
                        ])
                      ]),
                      createVNode("div", { class: "mt-4 flex items-center justify-between gap-3" }, [
                        createVNode("p", { class: "text-xs font-bold uppercase text-gray-500" }, toDisplayString(author.posts_count) + " yazı", 1),
                        authUser.value && authUser.value.id !== author.id ? (openBlock(), createBlock(_sfc_main$1, {
                          key: 0,
                          user: author,
                          "initial-following": author.is_following,
                          "initial-followers-count": author.followers_count
                        }, null, 8, ["user", "initial-following", "initial-followers-count"])) : (openBlock(), createBlock("span", {
                          key: 1,
                          class: "text-xs font-bold text-gray-500"
                        }, toDisplayString(author.followers_count) + " takipçi", 1))
                      ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Author/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
