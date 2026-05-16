import { ref, mergeProps, withCtx, unref, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, createTextVNode, Fragment, renderList, withModifiers, withDirectives, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { usePage, useForm } from "@inertiajs/vue3";
import { A as AppLayout, _ as _sfc_main$1 } from "./AppLayout-BH4qZStO.js";
import { u as useDate } from "./useDate-CbchC0lg.js";
import "@headlessui/vue";
import "axios";
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    cinema: { type: Object, required: true },
    averageRating: { type: Number, default: null },
    userReview: { type: Object, default: null }
  },
  setup(__props) {
    const props = __props;
    const page = usePage();
    const authUser = page.props.auth?.user;
    const { formatDate } = useDate();
    const showLoginModal = ref(false);
    const reviewForm = useForm({
      rating: props.userReview?.rating || 0,
      content: props.userReview?.content || ""
    });
    const submitReview = () => {
      if (!authUser) {
        showLoginModal.value = true;
        return;
      }
      reviewForm.post(`/sinema/${props.cinema.slug}/yorum`, {
        preserveScroll: true
      });
    };
    const hoverRating = ref(0);
    const stars = [1, 2, 3, 4, 5];
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: __props.cinema.name,
        description: __props.cinema.description || __props.cinema.name
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-white"${_scopeId}><div class="bg-gray-900 text-white"${_scopeId}><div class="max-w-4xl mx-auto px-4 py-12"${_scopeId}><h1 class="text-3xl font-bold"${_scopeId}>${ssrInterpolate(__props.cinema.name)}</h1><p class="mt-2 text-gray-300"${_scopeId}>${ssrInterpolate(__props.cinema.district)} · ${ssrInterpolate(__props.cinema.address)}</p><div class="flex items-center gap-4 mt-4 text-sm text-gray-400"${_scopeId}>`);
            if (__props.cinema.website) {
              _push2(`<a${ssrRenderAttr("href", __props.cinema.website)} target="_blank" class="hover:text-white"${_scopeId}>Web sitesi</a>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.cinema.phone) {
              _push2(`<span${_scopeId}>${ssrInterpolate(__props.cinema.phone)}</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.averageRating) {
              _push2(`<span class="flex items-center gap-1"${_scopeId}><svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"${_scopeId}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"${_scopeId}></path></svg> ${ssrInterpolate(__props.averageRating)}/5 (${ssrInterpolate(__props.cinema.reviews_count)} yorum) </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="max-w-4xl mx-auto px-4 py-8"${_scopeId}>`);
            if (__props.cinema.description) {
              _push2(`<div class="prose prose-lg max-w-none mb-8"${_scopeId}><p${_scopeId}>${ssrInterpolate(__props.cinema.description)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.cinema.screenings?.length > 0) {
              _push2(`<section class="mb-10"${_scopeId}><h2 class="text-xl font-bold text-gray-900 mb-4"${_scopeId}>Gosterimdeki Filmler</h2><div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(__props.cinema.screenings, (screening) => {
                _push2(`<div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"${_scopeId}><div${_scopeId}><h3 class="font-semibold text-gray-900"${_scopeId}>${ssrInterpolate(screening.title)}</h3>`);
                if (screening.original_title) {
                  _push2(`<p class="text-sm text-gray-500"${_scopeId}>${ssrInterpolate(screening.original_title)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                if (screening.notes) {
                  _push2(`<p class="text-sm text-gray-500 mt-1"${_scopeId}>${ssrInterpolate(screening.notes)}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div><div class="text-right text-sm text-gray-500"${_scopeId}><p${_scopeId}>${ssrInterpolate(unref(formatDate)(screening.starts_at))}</p>`);
                if (screening.ends_at) {
                  _push2(`<p${_scopeId}>- ${ssrInterpolate(unref(formatDate)(screening.ends_at))}</p>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div>`);
              });
              _push2(`<!--]--></div></section>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<section${_scopeId}><h2 class="text-xl font-bold text-gray-900 mb-4"${_scopeId}>Yorumlar</h2><div class="bg-gray-50 rounded-xl p-6 mb-6"${_scopeId}><h3 class="text-sm font-semibold text-gray-700 mb-3"${_scopeId}>${ssrInterpolate(__props.userReview ? "Yorumunuzu guncelleyin" : "Yorum yapin")}</h3><form${_scopeId}><div class="flex items-center gap-1 mb-3"${_scopeId}><!--[-->`);
            ssrRenderList(stars, (star) => {
              _push2(`<button type="button" class="focus:outline-none"${_scopeId}><svg class="${ssrRenderClass([(hoverRating.value || unref(reviewForm).rating) >= star ? "text-yellow-400 fill-current" : "text-gray-300", "w-7 h-7 transition-colors"])}" viewBox="0 0 20 20"${_scopeId}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"${_scopeId}></path></svg></button>`);
            });
            _push2(`<!--]--></div><textarea rows="3" placeholder="Bu sinema hakkinda ne dusunuyorsunuz?" maxlength="500" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"${_scopeId}>${ssrInterpolate(unref(reviewForm).content)}</textarea>`);
            if (unref(reviewForm).errors.content) {
              _push2(`<p class="mt-1 text-xs text-red-600"${_scopeId}>${ssrInterpolate(unref(reviewForm).errors.content)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mt-3 flex justify-end"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(reviewForm).processing || !unref(reviewForm).rating || !unref(reviewForm).content.trim()) ? " disabled" : ""} class="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"${_scopeId}>${ssrInterpolate(__props.userReview ? "Guncelle" : "Gonder")}</button></div></form></div>`);
            if (__props.cinema.reviews?.length > 0) {
              _push2(`<div class="space-y-4"${_scopeId}><!--[-->`);
              ssrRenderList(__props.cinema.reviews, (review) => {
                _push2(`<div class="p-4 border border-gray-100 rounded-lg"${_scopeId}><div class="flex items-center gap-2 mb-2"${_scopeId}>`);
                if (review.user?.avatar) {
                  _push2(`<img${ssrRenderAttr("src", review.user.avatar)} class="w-8 h-8 rounded-full"${_scopeId}>`);
                } else {
                  _push2(`<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500"${_scopeId}>${ssrInterpolate(review.user?.name?.charAt(0)?.toUpperCase())}</div>`);
                }
                _push2(`<span class="text-sm font-medium text-gray-700"${_scopeId}>${ssrInterpolate(review.user?.name)}</span><div class="flex items-center gap-0.5 ml-auto"${_scopeId}><!--[-->`);
                ssrRenderList(5, (s) => {
                  _push2(`<svg class="${ssrRenderClass([s <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300", "w-4 h-4"])}" viewBox="0 0 20 20"${_scopeId}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"${_scopeId}></path></svg>`);
                });
                _push2(`<!--]--></div></div><p class="text-sm text-gray-700"${_scopeId}>${ssrInterpolate(review.content)}</p></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-8 text-gray-400 text-sm"${_scopeId}> Henuz yorum yok. Ilk siz yazin! </div>`);
            }
            _push2(`</section></div></div>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              show: showLoginModal.value,
              onClose: ($event) => showLoginModal.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-white" }, [
                createVNode("div", { class: "bg-gray-900 text-white" }, [
                  createVNode("div", { class: "max-w-4xl mx-auto px-4 py-12" }, [
                    createVNode("h1", { class: "text-3xl font-bold" }, toDisplayString(__props.cinema.name), 1),
                    createVNode("p", { class: "mt-2 text-gray-300" }, toDisplayString(__props.cinema.district) + " · " + toDisplayString(__props.cinema.address), 1),
                    createVNode("div", { class: "flex items-center gap-4 mt-4 text-sm text-gray-400" }, [
                      __props.cinema.website ? (openBlock(), createBlock("a", {
                        key: 0,
                        href: __props.cinema.website,
                        target: "_blank",
                        class: "hover:text-white"
                      }, "Web sitesi", 8, ["href"])) : createCommentVNode("", true),
                      __props.cinema.phone ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(__props.cinema.phone), 1)) : createCommentVNode("", true),
                      __props.averageRating ? (openBlock(), createBlock("span", {
                        key: 2,
                        class: "flex items-center gap-1"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 text-yellow-400 fill-current",
                          viewBox: "0 0 20 20"
                        }, [
                          createVNode("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
                        ])),
                        createTextVNode(" " + toDisplayString(__props.averageRating) + "/5 (" + toDisplayString(__props.cinema.reviews_count) + " yorum) ", 1)
                      ])) : createCommentVNode("", true)
                    ])
                  ])
                ]),
                createVNode("div", { class: "max-w-4xl mx-auto px-4 py-8" }, [
                  __props.cinema.description ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "prose prose-lg max-w-none mb-8"
                  }, [
                    createVNode("p", null, toDisplayString(__props.cinema.description), 1)
                  ])) : createCommentVNode("", true),
                  __props.cinema.screenings?.length > 0 ? (openBlock(), createBlock("section", {
                    key: 1,
                    class: "mb-10"
                  }, [
                    createVNode("h2", { class: "text-xl font-bold text-gray-900 mb-4" }, "Gosterimdeki Filmler"),
                    createVNode("div", { class: "space-y-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.cinema.screenings, (screening) => {
                        return openBlock(), createBlock("div", {
                          key: screening.id,
                          class: "flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        }, [
                          createVNode("div", null, [
                            createVNode("h3", { class: "font-semibold text-gray-900" }, toDisplayString(screening.title), 1),
                            screening.original_title ? (openBlock(), createBlock("p", {
                              key: 0,
                              class: "text-sm text-gray-500"
                            }, toDisplayString(screening.original_title), 1)) : createCommentVNode("", true),
                            screening.notes ? (openBlock(), createBlock("p", {
                              key: 1,
                              class: "text-sm text-gray-500 mt-1"
                            }, toDisplayString(screening.notes), 1)) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "text-right text-sm text-gray-500" }, [
                            createVNode("p", null, toDisplayString(unref(formatDate)(screening.starts_at)), 1),
                            screening.ends_at ? (openBlock(), createBlock("p", { key: 0 }, "- " + toDisplayString(unref(formatDate)(screening.ends_at)), 1)) : createCommentVNode("", true)
                          ])
                        ]);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true),
                  createVNode("section", null, [
                    createVNode("h2", { class: "text-xl font-bold text-gray-900 mb-4" }, "Yorumlar"),
                    createVNode("div", { class: "bg-gray-50 rounded-xl p-6 mb-6" }, [
                      createVNode("h3", { class: "text-sm font-semibold text-gray-700 mb-3" }, toDisplayString(__props.userReview ? "Yorumunuzu guncelleyin" : "Yorum yapin"), 1),
                      createVNode("form", {
                        onSubmit: withModifiers(submitReview, ["prevent"])
                      }, [
                        createVNode("div", { class: "flex items-center gap-1 mb-3" }, [
                          (openBlock(), createBlock(Fragment, null, renderList(stars, (star) => {
                            return createVNode("button", {
                              key: star,
                              type: "button",
                              onClick: ($event) => unref(reviewForm).rating = star,
                              onMouseenter: ($event) => hoverRating.value = star,
                              onMouseleave: ($event) => hoverRating.value = 0,
                              class: "focus:outline-none"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: ["w-7 h-7 transition-colors", (hoverRating.value || unref(reviewForm).rating) >= star ? "text-yellow-400 fill-current" : "text-gray-300"],
                                viewBox: "0 0 20 20"
                              }, [
                                createVNode("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
                              ], 2))
                            ], 40, ["onClick", "onMouseenter", "onMouseleave"]);
                          }), 64))
                        ]),
                        withDirectives(createVNode("textarea", {
                          "onUpdate:modelValue": ($event) => unref(reviewForm).content = $event,
                          rows: "3",
                          placeholder: "Bu sinema hakkinda ne dusunuyorsunuz?",
                          maxlength: "500",
                          class: "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(reviewForm).content]
                        ]),
                        unref(reviewForm).errors.content ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "mt-1 text-xs text-red-600"
                        }, toDisplayString(unref(reviewForm).errors.content), 1)) : createCommentVNode("", true),
                        createVNode("div", { class: "mt-3 flex justify-end" }, [
                          createVNode("button", {
                            type: "submit",
                            disabled: unref(reviewForm).processing || !unref(reviewForm).rating || !unref(reviewForm).content.trim(),
                            class: "px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                          }, toDisplayString(__props.userReview ? "Guncelle" : "Gonder"), 9, ["disabled"])
                        ])
                      ], 32)
                    ]),
                    __props.cinema.reviews?.length > 0 ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "space-y-4"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.cinema.reviews, (review) => {
                        return openBlock(), createBlock("div", {
                          key: review.id,
                          class: "p-4 border border-gray-100 rounded-lg"
                        }, [
                          createVNode("div", { class: "flex items-center gap-2 mb-2" }, [
                            review.user?.avatar ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: review.user.avatar,
                              class: "w-8 h-8 rounded-full"
                            }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500"
                            }, toDisplayString(review.user?.name?.charAt(0)?.toUpperCase()), 1)),
                            createVNode("span", { class: "text-sm font-medium text-gray-700" }, toDisplayString(review.user?.name), 1),
                            createVNode("div", { class: "flex items-center gap-0.5 ml-auto" }, [
                              (openBlock(), createBlock(Fragment, null, renderList(5, (s) => {
                                return createVNode("svg", {
                                  key: s,
                                  class: ["w-4 h-4", s <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"],
                                  viewBox: "0 0 20 20"
                                }, [
                                  createVNode("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
                                ], 2);
                              }), 64))
                            ])
                          ]),
                          createVNode("p", { class: "text-sm text-gray-700" }, toDisplayString(review.content), 1)
                        ]);
                      }), 128))
                    ])) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-center py-8 text-gray-400 text-sm"
                    }, " Henuz yorum yok. Ilk siz yazin! "))
                  ])
                ])
              ]),
              createVNode(_sfc_main$1, {
                show: showLoginModal.value,
                onClose: ($event) => showLoginModal.value = false
              }, null, 8, ["show", "onClose"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Cinema/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
