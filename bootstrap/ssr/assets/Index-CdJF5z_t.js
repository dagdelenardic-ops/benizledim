import { ref, watch, mergeProps, withCtx, unref, createVNode, createTextVNode, toDisplayString, withDirectives, vModelText, vModelSelect, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderClass } from "vue/server-renderer";
import { usePage, router, Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1, a as _sfc_main$2 } from "./AdminLayout-fOISzqII.js";
import { u as useDate } from "./useDate-Es1AW_qO.js";
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    posts: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      default: () => ({})
    },
    permissions: {
      type: Object,
      default: () => ({
        canApproveDeletion: false,
        canManageAllPosts: false
      })
    },
    owners: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const { timeAgo } = useDate();
    const page = usePage();
    const search = ref(props.filters.search || "");
    const status = ref(props.filters.status || "");
    const owner = ref(props.filters.owner || "");
    let searchTimeout;
    watch([search, status, owner], () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        router.get("/admin/posts", {
          search: search.value,
          status: status.value,
          owner: owner.value
        }, {
          preserveState: true,
          replace: true
        });
      }, 300);
    });
    const getStatusLabel = (postStatus) => {
      if (postStatus === "pending_deletion") return "Silme Talebi";
      if (postStatus === "pending_review") return "İncelemede";
      return postStatus === "published" ? "Yayında" : "Taslak";
    };
    const getStatusBadge = (postStatus) => {
      if (postStatus === "pending_deletion") return "border-red-700 bg-red-50 text-red-800";
      if (postStatus === "pending_review") return "border-amber-700 bg-amber-50 text-amber-800";
      if (postStatus === "published") return "border-emerald-700 bg-emerald-50 text-emerald-800";
      return "border-[var(--bi-ink)] bg-white text-[var(--bi-ink)]";
    };
    const deletePost = (post) => {
      const role = page.props.auth?.user?.role;
      const isAdmin = role === "admin";
      const confirmText = isAdmin ? `"${post.title}" yazısını kalıcı olarak silmek istediğinize emin misiniz?` : `"${post.title}" yazısını yayından kaldırıp admin onayına göndermek istiyor musunuz?`;
      if (!confirm(confirmText)) return;
      router.delete(`/admin/posts/${post.id}`);
    };
    const approveDeletion = (post) => {
      if (!confirm(`"${post.title}" için silme talebini onaylayıp kalıcı silmek istiyor musunuz?`)) return;
      router.post(`/admin/posts/${post.id}/approve-deletion`);
    };
    const rejectDeletion = (post) => {
      if (!confirm(`"${post.title}" için silme talebini reddedip tekrar yayına almak istiyor musunuz?`)) return;
      router.post(`/admin/posts/${post.id}/reject-deletion`);
    };
    const approveReview = (post) => {
      if (!confirm(`"${post.title}" yazısını yayına almak istiyor musunuz?`)) return;
      router.post(`/admin/posts/${post.id}/approve-review`);
    };
    const rejectReview = (post) => {
      if (!confirm(`"${post.title}" yazısını taslağa geri almak istiyor musunuz?`)) return;
      router.post(`/admin/posts/${post.id}/reject-review`);
    };
    const updateOwner = (post, userId) => {
      router.put(`/admin/posts/${post.id}/owner`, {
        user_id: Number(userId)
      }, {
        preserveScroll: true
      });
    };
    const resolveStatus = (post) => post.resolved_status || (post.is_deletion_pending ? "pending_deletion" : post.status);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ title: "Yazılar" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><section class="border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5"${_scopeId}><div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"${_scopeId}><div${_scopeId}><span class="bi-kicker"${_scopeId}>İçerik</span><h1 class="mt-3 text-3xl font-black text-[var(--bi-ink)]"${_scopeId}>Yazılar</h1><p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--bi-muted)]"${_scopeId}> Taslak, inceleme ve yayın akışını buradan yönetin. </p></div>`);
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
            _push2(`</div></section><section class="grid gap-3 border-2 border-[var(--bi-ink)] bg-white p-4 lg:grid-cols-[1fr_180px_220px]"${_scopeId}><input${ssrRenderAttr("value", search.value)} type="text" placeholder="Başlık veya özet ara" class="min-w-0 border border-[var(--bi-ink)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}><select class="border border-[var(--bi-ink)] bg-white px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "") : ssrLooseEqual(status.value, "")) ? " selected" : ""}${_scopeId}>Tüm Durumlar</option><option value="published"${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "published") : ssrLooseEqual(status.value, "published")) ? " selected" : ""}${_scopeId}>Yayında</option><option value="pending_review"${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "pending_review") : ssrLooseEqual(status.value, "pending_review")) ? " selected" : ""}${_scopeId}>İncelemede</option><option value="draft"${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "draft") : ssrLooseEqual(status.value, "draft")) ? " selected" : ""}${_scopeId}>Taslak</option><option value="pending_deletion"${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "pending_deletion") : ssrLooseEqual(status.value, "pending_deletion")) ? " selected" : ""}${_scopeId}>Silme Talebi</option></select>`);
            if (__props.permissions.canManageAllPosts) {
              _push2(`<select class="border border-[var(--bi-ink)] bg-white px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(owner.value) ? ssrLooseContain(owner.value, "") : ssrLooseEqual(owner.value, "")) ? " selected" : ""}${_scopeId}>Tüm Yazarlar</option><!--[-->`);
              ssrRenderList(__props.owners, (item) => {
                _push2(`<option${ssrRenderAttr("value", item.id)}${ssrIncludeBooleanAttr(Array.isArray(owner.value) ? ssrLooseContain(owner.value, item.id) : ssrLooseEqual(owner.value, item.id)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(item.name)}</option>`);
              });
              _push2(`<!--]--></select>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section><section class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.posts.data, (post) => {
              _push2(`<article class="border-2 border-[var(--bi-ink)] bg-white p-4 shadow-[4px_4px_0_var(--bi-ink)]"${_scopeId}><div class="grid gap-4 xl:grid-cols-[1fr_240px_230px] xl:items-start"${_scopeId}><div class="min-w-0"${_scopeId}><div class="flex flex-wrap items-center gap-2"${_scopeId}><span class="${ssrRenderClass(["border px-2 py-1 text-xs font-bold", getStatusBadge(resolveStatus(post))])}"${_scopeId}>${ssrInterpolate(getStatusLabel(resolveStatus(post)))}</span><span class="text-xs font-bold text-[var(--bi-muted)]"${_scopeId}>${ssrInterpolate(unref(timeAgo)(post.created_at))}</span><span class="text-xs font-bold text-[var(--bi-muted)]"${_scopeId}>${ssrInterpolate(post.view_count?.toLocaleString())} görüntülenme</span></div>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/posts/${post.id}/edit`,
                class: "mt-3 block text-xl font-black leading-tight text-[var(--bi-ink)] hover:text-red-700"
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
              if (post.excerpt) {
                _push2(`<p class="mt-2 line-clamp-2 text-sm leading-6 text-[var(--bi-muted)]"${_scopeId}>${ssrInterpolate(post.excerpt)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="mt-3 space-y-1 text-xs text-[var(--bi-muted)]"${_scopeId}>`);
              if (post.reviewed_by?.name) {
                _push2(`<p${_scopeId}>Son inceleyen: ${ssrInterpolate(post.reviewed_by.name)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              if (resolveStatus(post) === "pending_review" && post.pending_review_by?.name) {
                _push2(`<p${_scopeId}> İncelemeye gönderen: ${ssrInterpolate(post.pending_review_by.name)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div${_scopeId}><p class="bi-mono mb-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]"${_scopeId}>Yazar</p>`);
              if (__props.permissions.canReassignPosts) {
                _push2(`<!--[--><select${ssrRenderAttr("value", post.user?.id)} class="w-full border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-700/20"${_scopeId}><!--[-->`);
                ssrRenderList(__props.owners, (item) => {
                  _push2(`<option${ssrRenderAttr("value", item.id)}${_scopeId}>${ssrInterpolate(item.name)}</option>`);
                });
                _push2(`<!--]--></select><p class="mt-1 truncate text-xs text-[var(--bi-muted)]"${_scopeId}>${ssrInterpolate(post.user?.email)}</p><!--]-->`);
              } else {
                _push2(`<!--[--><p class="font-bold text-[var(--bi-ink)]"${_scopeId}>${ssrInterpolate(post.user?.name)}</p><p class="truncate text-xs text-[var(--bi-muted)]"${_scopeId}>${ssrInterpolate(post.user?.email)}</p><!--]-->`);
              }
              _push2(`</div><div class="flex flex-wrap gap-2 xl:justify-end"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: `/admin/posts/${post.id}/edit`,
                class: "border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm font-bold hover:bg-[var(--bi-paper)]"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Düzenle `);
                  } else {
                    return [
                      createTextVNode(" Düzenle ")
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              if (resolveStatus(post) === "pending_review" && __props.permissions.canReviewPosts) {
                _push2(`<!--[--><button class="border border-emerald-700 bg-emerald-700 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-800"${_scopeId}> Yayına Al </button><button class="border border-amber-700 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 hover:bg-amber-100"${_scopeId}> Taslağa Al </button><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              if (post.is_deletion_pending && __props.permissions.canApproveDeletion) {
                _push2(`<!--[--><button class="border border-red-700 bg-red-700 px-3 py-2 text-sm font-bold text-white hover:bg-red-800"${_scopeId}> Kalıcı Sil </button><button class="border border-emerald-700 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100"${_scopeId}> Yayına Al </button><!--]-->`);
              } else {
                _push2(`<button class="border border-red-700 bg-red-50 px-3 py-2 text-sm font-bold text-red-800 hover:bg-red-100"${_scopeId}>${ssrInterpolate(unref(page).props.auth?.user?.role === "admin" ? "Sil" : "Silme Talebi")}</button>`);
              }
              _push2(`</div></div></article>`);
            });
            _push2(`<!--]-->`);
            if (__props.posts.data.length === 0) {
              _push2(`<div class="border-2 border-[var(--bi-ink)] bg-white px-5 py-12 text-center text-sm text-[var(--bi-muted)]"${_scopeId}> Yazı bulunamadı. </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</section>`);
            if (__props.posts.links) {
              _push2(`<nav class="flex flex-wrap justify-center gap-2 border-2 border-[var(--bi-ink)] bg-white p-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.posts.links, (link, index) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: index,
                  href: link.url || "#",
                  class: [
                    "border px-3 py-2 text-sm font-bold",
                    link.active ? "border-red-700 bg-red-700 text-white" : link.url ? "border-[var(--bi-ink)] text-[var(--bi-ink)] hover:bg-[var(--bi-paper)]" : "border-[var(--bi-rule-soft)] text-[var(--bi-muted)]"
                  ]
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></nav>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("section", { class: "border-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] p-5" }, [
                  createVNode("div", { class: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between" }, [
                    createVNode("div", null, [
                      createVNode("span", { class: "bi-kicker" }, "İçerik"),
                      createVNode("h1", { class: "mt-3 text-3xl font-black text-[var(--bi-ink)]" }, "Yazılar"),
                      createVNode("p", { class: "mt-2 max-w-2xl text-sm leading-6 text-[var(--bi-muted)]" }, " Taslak, inceleme ve yayın akışını buradan yönetin. ")
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
                createVNode("section", { class: "grid gap-3 border-2 border-[var(--bi-ink)] bg-white p-4 lg:grid-cols-[1fr_180px_220px]" }, [
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => search.value = $event,
                    type: "text",
                    placeholder: "Başlık veya özet ara",
                    class: "min-w-0 border border-[var(--bi-ink)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-700/20"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, search.value]
                  ]),
                  withDirectives(createVNode("select", {
                    "onUpdate:modelValue": ($event) => status.value = $event,
                    class: "border border-[var(--bi-ink)] bg-white px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-700/20"
                  }, [
                    createVNode("option", { value: "" }, "Tüm Durumlar"),
                    createVNode("option", { value: "published" }, "Yayında"),
                    createVNode("option", { value: "pending_review" }, "İncelemede"),
                    createVNode("option", { value: "draft" }, "Taslak"),
                    createVNode("option", { value: "pending_deletion" }, "Silme Talebi")
                  ], 8, ["onUpdate:modelValue"]), [
                    [vModelSelect, status.value]
                  ]),
                  __props.permissions.canManageAllPosts ? withDirectives((openBlock(), createBlock("select", {
                    key: 0,
                    "onUpdate:modelValue": ($event) => owner.value = $event,
                    class: "border border-[var(--bi-ink)] bg-white px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-700/20"
                  }, [
                    createVNode("option", { value: "" }, "Tüm Yazarlar"),
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.owners, (item) => {
                      return openBlock(), createBlock("option", {
                        key: item.id,
                        value: item.id
                      }, toDisplayString(item.name), 9, ["value"]);
                    }), 128))
                  ], 8, ["onUpdate:modelValue"])), [
                    [vModelSelect, owner.value]
                  ]) : createCommentVNode("", true)
                ]),
                createVNode("section", { class: "space-y-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.posts.data, (post) => {
                    return openBlock(), createBlock("article", {
                      key: post.id,
                      class: "border-2 border-[var(--bi-ink)] bg-white p-4 shadow-[4px_4px_0_var(--bi-ink)]"
                    }, [
                      createVNode("div", { class: "grid gap-4 xl:grid-cols-[1fr_240px_230px] xl:items-start" }, [
                        createVNode("div", { class: "min-w-0" }, [
                          createVNode("div", { class: "flex flex-wrap items-center gap-2" }, [
                            createVNode("span", {
                              class: ["border px-2 py-1 text-xs font-bold", getStatusBadge(resolveStatus(post))]
                            }, toDisplayString(getStatusLabel(resolveStatus(post))), 3),
                            createVNode("span", { class: "text-xs font-bold text-[var(--bi-muted)]" }, toDisplayString(unref(timeAgo)(post.created_at)), 1),
                            createVNode("span", { class: "text-xs font-bold text-[var(--bi-muted)]" }, toDisplayString(post.view_count?.toLocaleString()) + " görüntülenme", 1)
                          ]),
                          createVNode(unref(Link), {
                            href: `/admin/posts/${post.id}/edit`,
                            class: "mt-3 block text-xl font-black leading-tight text-[var(--bi-ink)] hover:text-red-700"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(post.title), 1)
                            ]),
                            _: 2
                          }, 1032, ["href"]),
                          post.excerpt ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "mt-2 line-clamp-2 text-sm leading-6 text-[var(--bi-muted)]"
                          }, toDisplayString(post.excerpt), 1)) : createCommentVNode("", true),
                          createVNode("div", { class: "mt-3 space-y-1 text-xs text-[var(--bi-muted)]" }, [
                            post.reviewed_by?.name ? (openBlock(), createBlock("p", { key: 0 }, "Son inceleyen: " + toDisplayString(post.reviewed_by.name), 1)) : createCommentVNode("", true),
                            resolveStatus(post) === "pending_review" && post.pending_review_by?.name ? (openBlock(), createBlock("p", { key: 1 }, " İncelemeye gönderen: " + toDisplayString(post.pending_review_by.name), 1)) : createCommentVNode("", true)
                          ])
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "bi-mono mb-2 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-[var(--bi-muted)]" }, "Yazar"),
                          __props.permissions.canReassignPosts ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createVNode("select", {
                              value: post.user?.id,
                              onChange: ($event) => updateOwner(post, $event.target.value),
                              class: "w-full border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-700/20"
                            }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(__props.owners, (item) => {
                                return openBlock(), createBlock("option", {
                                  key: item.id,
                                  value: item.id
                                }, toDisplayString(item.name), 9, ["value"]);
                              }), 128))
                            ], 40, ["value", "onChange"]),
                            createVNode("p", { class: "mt-1 truncate text-xs text-[var(--bi-muted)]" }, toDisplayString(post.user?.email), 1)
                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                            createVNode("p", { class: "font-bold text-[var(--bi-ink)]" }, toDisplayString(post.user?.name), 1),
                            createVNode("p", { class: "truncate text-xs text-[var(--bi-muted)]" }, toDisplayString(post.user?.email), 1)
                          ], 64))
                        ]),
                        createVNode("div", { class: "flex flex-wrap gap-2 xl:justify-end" }, [
                          createVNode(unref(Link), {
                            href: `/admin/posts/${post.id}/edit`,
                            class: "border border-[var(--bi-ink)] bg-white px-3 py-2 text-sm font-bold hover:bg-[var(--bi-paper)]"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Düzenle ")
                            ]),
                            _: 1
                          }, 8, ["href"]),
                          resolveStatus(post) === "pending_review" && __props.permissions.canReviewPosts ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createVNode("button", {
                              onClick: ($event) => approveReview(post),
                              class: "border border-emerald-700 bg-emerald-700 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-800"
                            }, " Yayına Al ", 8, ["onClick"]),
                            createVNode("button", {
                              onClick: ($event) => rejectReview(post),
                              class: "border border-amber-700 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 hover:bg-amber-100"
                            }, " Taslağa Al ", 8, ["onClick"])
                          ], 64)) : createCommentVNode("", true),
                          post.is_deletion_pending && __props.permissions.canApproveDeletion ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                            createVNode("button", {
                              onClick: ($event) => approveDeletion(post),
                              class: "border border-red-700 bg-red-700 px-3 py-2 text-sm font-bold text-white hover:bg-red-800"
                            }, " Kalıcı Sil ", 8, ["onClick"]),
                            createVNode("button", {
                              onClick: ($event) => rejectDeletion(post),
                              class: "border border-emerald-700 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100"
                            }, " Yayına Al ", 8, ["onClick"])
                          ], 64)) : (openBlock(), createBlock("button", {
                            key: 2,
                            onClick: ($event) => deletePost(post),
                            class: "border border-red-700 bg-red-50 px-3 py-2 text-sm font-bold text-red-800 hover:bg-red-100"
                          }, toDisplayString(unref(page).props.auth?.user?.role === "admin" ? "Sil" : "Silme Talebi"), 9, ["onClick"]))
                        ])
                      ])
                    ]);
                  }), 128)),
                  __props.posts.data.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "border-2 border-[var(--bi-ink)] bg-white px-5 py-12 text-center text-sm text-[var(--bi-muted)]"
                  }, " Yazı bulunamadı. ")) : createCommentVNode("", true)
                ]),
                __props.posts.links ? (openBlock(), createBlock("nav", {
                  key: 0,
                  class: "flex flex-wrap justify-center gap-2 border-2 border-[var(--bi-ink)] bg-white p-4"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.posts.links, (link, index) => {
                    return openBlock(), createBlock(unref(Link), {
                      key: index,
                      href: link.url || "#",
                      class: [
                        "border px-3 py-2 text-sm font-bold",
                        link.active ? "border-red-700 bg-red-700 text-white" : link.url ? "border-[var(--bi-ink)] text-[var(--bi-ink)] hover:bg-[var(--bi-paper)]" : "border-[var(--bi-rule-soft)] text-[var(--bi-muted)]"
                      ],
                      innerHTML: link.label
                    }, null, 8, ["href", "class", "innerHTML"]);
                  }), 128))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin/Posts/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
