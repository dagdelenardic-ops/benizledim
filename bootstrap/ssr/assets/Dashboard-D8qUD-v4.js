import { computed, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1, a as _sfc_main$2 } from "./AdminLayout-fOISzqII.js";
import { u as useDate } from "./useDate-CbchC0lg.js";
const _sfc_main = {
  __name: "Dashboard",
  __ssrInlineRender: true,
  props: {
    stats: {
      type: Object,
      required: true
    },
    recentPosts: {
      type: Array,
      required: true
    },
    recentComments: {
      type: Array,
      required: true
    },
    authorBreakdown: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const { timeAgo } = useDate();
    const page = usePage();
    const authUser = computed(() => page.props.auth?.user || {});
    const canManageAll = computed(() => ["admin", "editor"].includes(authUser.value.role || ""));
    const heading = computed(() => canManageAll.value ? "Yönetim Özeti" : "Yazı Masam");
    const intro = computed(() => canManageAll.value ? "Onay bekleyen içerikleri, son hareketleri ve yazar dağılımını tek ekranda takip edin." : "Taslaklarını, incelemeye giden yazılarını ve yayındaki içeriklerini hızlıca gör.");
    const statCards = computed(() => {
      const managerCards = [
        { key: "pending_review_posts", label: "İncelemede", icon: "posts", tone: "red" },
        { key: "pending_deletion_posts", label: "Silme Talebi", icon: "alert", tone: "black" },
        { key: "published_posts", label: "Yayında", icon: "check", tone: "green" },
        { key: "total_posts", label: "Toplam Yazı", icon: "dashboard", tone: "neutral" },
        { key: "total_comments", label: "Yorum", icon: "comments", tone: "neutral" },
        { key: "total_users", label: "Kullanıcı", icon: "users", tone: "neutral" }
      ];
      const authorCards = [
        { key: "draft_posts", label: "Taslaklarım", icon: "page", tone: "neutral" },
        { key: "pending_review_posts", label: "İncelemede", icon: "posts", tone: "red" },
        { key: "published_posts", label: "Yayında", icon: "check", tone: "green" },
        { key: "total_comments", label: "Yorum", icon: "comments", tone: "neutral" }
      ];
      return (canManageAll.value ? managerCards : authorCards).filter((card) => props.stats[card.key] !== null && props.stats[card.key] !== void 0);
    });
    const getStatusBadge = (status) => {
      if (status === "pending_deletion") return "border-red-700 bg-red-50 text-red-800";
      if (status === "pending_review") return "border-amber-700 bg-amber-50 text-amber-800";
      if (status === "published") return "border-emerald-700 bg-emerald-50 text-emerald-800";
      return "border-[var(--bi-ink)] bg-white text-[var(--bi-ink)]";
    };
    const getStatusLabel = (status) => {
      if (status === "pending_deletion") return "Silme Talebi";
      if (status === "pending_review") return "İncelemede";
      return status === "published" ? "Yayında" : "Taslak";
    };
    const resolveStatus = (post) => post.deletion_requested_at ? "pending_deletion" : post.status;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Genel Bakış" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-8"${_scopeId}><section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5 md:p-6"${_scopeId}><div class="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"${_scopeId}><div${_scopeId}><span class="bi-kicker"${_scopeId}>${ssrInterpolate(canManageAll.value ? "Panel" : "Yazar")}</span><h2 class="mt-3 text-3xl font-black leading-tight text-[var(--bi-ink)] md:text-4xl"${_scopeId}>${ssrInterpolate(heading.value)}</h2><p class="mt-3 max-w-2xl text-sm leading-6 text-[var(--bi-muted)] md:text-base"${_scopeId}>${ssrInterpolate(intro.value)}</p></div>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/posts/create",
              class: "inline-flex items-center justify-center gap-2 bg-red-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-800"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$2, { name: "posts" }, null, _parent3, _scopeId2));
                  _push3(` Yeni Yazı `);
                } else {
                  return [
                    createVNode(_sfc_main$2, { name: "posts" }),
                    createTextVNode(" Yeni Yazı ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></section><section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"${_scopeId}><!--[-->`);
            ssrRenderList(statCards.value, (card) => {
              _push2(`<div class="border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]"${_scopeId}><div class="flex items-start justify-between gap-4"${_scopeId}><div${_scopeId}><p class="bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]"${_scopeId}>${ssrInterpolate(card.label)}</p><p class="mt-3 text-3xl font-black text-[var(--bi-ink)]"${_scopeId}>${ssrInterpolate(__props.stats[card.key]?.toLocaleString())}</p></div><div class="${ssrRenderClass([
                "grid h-10 w-10 place-items-center border-2",
                card.tone === "red" ? "border-red-700 bg-red-700 text-white" : card.tone === "green" ? "border-emerald-700 bg-emerald-700 text-white" : "border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)]"
              ])}"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                name: card.icon
              }, null, _parent2, _scopeId));
              _push2(`</div></div></div>`);
            });
            _push2(`<!--]--></section><section class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"${_scopeId}><div class="border-2 border-[var(--bi-ink)] bg-white"${_scopeId}><div class="flex items-center justify-between border-b-2 border-[var(--bi-ink)] px-5 py-4"${_scopeId}><h2 class="text-lg font-black text-[var(--bi-ink)]"${_scopeId}>Son Yazılar</h2>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin/posts",
              class: "bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Tümünü Gör `);
                } else {
                  return [
                    createTextVNode(" Tümünü Gör ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div><div class="divide-y divide-[var(--bi-rule-soft)]"${_scopeId}><!--[-->`);
            ssrRenderList(__props.recentPosts, (post) => {
              _push2(`<div class="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center"${_scopeId}><div class="min-w-0"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/posts/${post.id}/edit`,
                class: "block truncate text-base font-black text-[var(--bi-ink)] hover:text-red-700"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(post.title)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(post.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`<p class="mt-1 text-sm text-[var(--bi-muted)]"${_scopeId}>${ssrInterpolate(post.user?.name)} · ${ssrInterpolate(unref(timeAgo)(post.created_at))}</p></div><span class="${ssrRenderClass(["w-fit border px-2 py-1 text-xs font-bold", getStatusBadge(resolveStatus(post))])}"${_scopeId}>${ssrInterpolate(getStatusLabel(resolveStatus(post)))}</span></div>`);
            });
            _push2(`<!--]-->`);
            if (__props.recentPosts.length === 0) {
              _push2(`<div class="px-5 py-10 text-center text-sm text-[var(--bi-muted)]"${_scopeId}> Henüz yazı yok. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="border-2 border-[var(--bi-ink)] bg-white"${_scopeId}><div class="border-b-2 border-[var(--bi-ink)] px-5 py-4"${_scopeId}><h2 class="text-lg font-black text-[var(--bi-ink)]"${_scopeId}>Son Yorumlar</h2></div><div class="divide-y divide-[var(--bi-rule-soft)]"${_scopeId}><!--[-->`);
            ssrRenderList(__props.recentComments, (comment) => {
              _push2(`<div class="px-5 py-4"${_scopeId}><p class="text-sm font-bold text-[var(--bi-ink)]"${_scopeId}>${ssrInterpolate(comment.user?.name)}</p><p class="mt-1 line-clamp-2 text-sm leading-6 text-[var(--bi-muted)]"${_scopeId}>${ssrInterpolate(comment.content)}</p>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/yazi/${comment.post?.slug}`,
                class: "mt-2 block truncate text-xs font-bold text-red-700 hover:text-red-900"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(comment.post?.title)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(comment.post?.title), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div>`);
            });
            _push2(`<!--]-->`);
            if (__props.recentComments.length === 0) {
              _push2(`<div class="px-5 py-10 text-center text-sm text-[var(--bi-muted)]"${_scopeId}> Henüz yorum yok. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></section>`);
            if (__props.authorBreakdown.length) {
              _push2(`<section class="border-2 border-[var(--bi-ink)] bg-white"${_scopeId}><div class="flex items-center justify-between border-b-2 border-[var(--bi-ink)] px-5 py-4"${_scopeId}><h2 class="text-lg font-black text-[var(--bi-ink)]"${_scopeId}>Yazı Sahipliği</h2>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/admin/posts",
                class: "bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Yönet `);
                  } else {
                    return [
                      createTextVNode(" Yönet ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><div class="divide-y divide-[var(--bi-rule-soft)]"${_scopeId}><!--[-->`);
              ssrRenderList(__props.authorBreakdown, (author) => {
                _push2(`<div class="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"${_scopeId}><div class="min-w-0"${_scopeId}><p class="truncate font-bold text-[var(--bi-ink)]"${_scopeId}>${ssrInterpolate(author.name)}</p><p class="truncate text-sm text-[var(--bi-muted)]"${_scopeId}>${ssrInterpolate(author.email)} · ${ssrInterpolate(author.role)}</p></div><span class="text-sm font-black text-[var(--bi-ink)]"${_scopeId}>${ssrInterpolate(author.posts_count)} yazı</span></div>`);
              });
              _push2(`<!--]--></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-8" }, [
                createVNode("section", { class: "border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5 md:p-6" }, [
                  createVNode("div", { class: "flex flex-col gap-5 md:flex-row md:items-end md:justify-between" }, [
                    createVNode("div", null, [
                      createVNode("span", { class: "bi-kicker" }, toDisplayString(canManageAll.value ? "Panel" : "Yazar"), 1),
                      createVNode("h2", { class: "mt-3 text-3xl font-black leading-tight text-[var(--bi-ink)] md:text-4xl" }, toDisplayString(heading.value), 1),
                      createVNode("p", { class: "mt-3 max-w-2xl text-sm leading-6 text-[var(--bi-muted)] md:text-base" }, toDisplayString(intro.value), 1)
                    ]),
                    createVNode(unref(Link), {
                      href: "/admin/posts/create",
                      class: "inline-flex items-center justify-center gap-2 bg-red-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-800"
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$2, { name: "posts" }),
                        createTextVNode(" Yeni Yazı ")
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode("section", { class: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(statCards.value, (card) => {
                    return openBlock(), createBlock("div", {
                      key: card.key,
                      class: "border-2 border-[var(--bi-ink)] bg-white p-5 shadow-[5px_5px_0_var(--bi-ink)]"
                    }, [
                      createVNode("div", { class: "flex items-start justify-between gap-4" }, [
                        createVNode("div", null, [
                          createVNode("p", { class: "bi-mono text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]" }, toDisplayString(card.label), 1),
                          createVNode("p", { class: "mt-3 text-3xl font-black text-[var(--bi-ink)]" }, toDisplayString(__props.stats[card.key]?.toLocaleString()), 1)
                        ]),
                        createVNode("div", {
                          class: [
                            "grid h-10 w-10 place-items-center border-2",
                            card.tone === "red" ? "border-red-700 bg-red-700 text-white" : card.tone === "green" ? "border-emerald-700 bg-emerald-700 text-white" : "border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)]"
                          ]
                        }, [
                          createVNode(_sfc_main$2, {
                            name: card.icon
                          }, null, 8, ["name"])
                        ], 2)
                      ])
                    ]);
                  }), 128))
                ]),
                createVNode("section", { class: "grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" }, [
                  createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white" }, [
                    createVNode("div", { class: "flex items-center justify-between border-b-2 border-[var(--bi-ink)] px-5 py-4" }, [
                      createVNode("h2", { class: "text-lg font-black text-[var(--bi-ink)]" }, "Son Yazılar"),
                      createVNode(unref(Link), {
                        href: "/admin/posts",
                        class: "bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Tümünü Gör ")
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "divide-y divide-[var(--bi-rule-soft)]" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.recentPosts, (post) => {
                        return openBlock(), createBlock("div", {
                          key: post.id,
                          class: "grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center"
                        }, [
                          createVNode("div", { class: "min-w-0" }, [
                            createVNode(unref(Link), {
                              href: `/admin/posts/${post.id}/edit`,
                              class: "block truncate text-base font-black text-[var(--bi-ink)] hover:text-red-700"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(post.title), 1)
                              ]),
                              _: 2
                            }, 1032, ["href"]),
                            createVNode("p", { class: "mt-1 text-sm text-[var(--bi-muted)]" }, toDisplayString(post.user?.name) + " · " + toDisplayString(unref(timeAgo)(post.created_at)), 1)
                          ]),
                          createVNode("span", {
                            class: ["w-fit border px-2 py-1 text-xs font-bold", getStatusBadge(resolveStatus(post))]
                          }, toDisplayString(getStatusLabel(resolveStatus(post))), 3)
                        ]);
                      }), 128)),
                      __props.recentPosts.length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "px-5 py-10 text-center text-sm text-[var(--bi-muted)]"
                      }, " Henüz yazı yok. ")) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "border-2 border-[var(--bi-ink)] bg-white" }, [
                    createVNode("div", { class: "border-b-2 border-[var(--bi-ink)] px-5 py-4" }, [
                      createVNode("h2", { class: "text-lg font-black text-[var(--bi-ink)]" }, "Son Yorumlar")
                    ]),
                    createVNode("div", { class: "divide-y divide-[var(--bi-rule-soft)]" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.recentComments, (comment) => {
                        return openBlock(), createBlock("div", {
                          key: comment.id,
                          class: "px-5 py-4"
                        }, [
                          createVNode("p", { class: "text-sm font-bold text-[var(--bi-ink)]" }, toDisplayString(comment.user?.name), 1),
                          createVNode("p", { class: "mt-1 line-clamp-2 text-sm leading-6 text-[var(--bi-muted)]" }, toDisplayString(comment.content), 1),
                          createVNode(unref(Link), {
                            href: `/yazi/${comment.post?.slug}`,
                            class: "mt-2 block truncate text-xs font-bold text-red-700 hover:text-red-900"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(comment.post?.title), 1)
                            ]),
                            _: 2
                          }, 1032, ["href"])
                        ]);
                      }), 128)),
                      __props.recentComments.length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "px-5 py-10 text-center text-sm text-[var(--bi-muted)]"
                      }, " Henüz yorum yok. ")) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                __props.authorBreakdown.length ? (openBlock(), createBlock("section", {
                  key: 0,
                  class: "border-2 border-[var(--bi-ink)] bg-white"
                }, [
                  createVNode("div", { class: "flex items-center justify-between border-b-2 border-[var(--bi-ink)] px-5 py-4" }, [
                    createVNode("h2", { class: "text-lg font-black text-[var(--bi-ink)]" }, "Yazı Sahipliği"),
                    createVNode(unref(Link), {
                      href: "/admin/posts",
                      class: "bi-mono text-xs font-bold uppercase tracking-[0.08em] text-red-700 hover:text-red-900"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Yönet ")
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "divide-y divide-[var(--bi-rule-soft)]" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.authorBreakdown, (author) => {
                      return openBlock(), createBlock("div", {
                        key: author.id,
                        class: "grid gap-2 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center"
                      }, [
                        createVNode("div", { class: "min-w-0" }, [
                          createVNode("p", { class: "truncate font-bold text-[var(--bi-ink)]" }, toDisplayString(author.name), 1),
                          createVNode("p", { class: "truncate text-sm text-[var(--bi-muted)]" }, toDisplayString(author.email) + " · " + toDisplayString(author.role), 1)
                        ]),
                        createVNode("span", { class: "text-sm font-black text-[var(--bi-ink)]" }, toDisplayString(author.posts_count) + " yazı", 1)
                      ]);
                    }), 128))
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
