import { mergeProps, useSSRContext, computed, unref, ref, withCtx, createTextVNode, toDisplayString, onMounted, onUnmounted, onBeforeUnmount, openBlock, createBlock, createVNode, Fragment, renderList, createCommentVNode } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrRenderStyle } from "vue/server-renderer";
import { usePage, useForm, Link } from "@inertiajs/vue3";
import { a as _export_sfc, A as AppLayout, _ as _sfc_main$f } from "./AppLayout-DLzUu67n.js";
import { _ as _sfc_main$e, b as buildResponsiveImage } from "./PostCard-BwkqJ6T-.js";
import { u as useDate } from "./useDate-Es1AW_qO.js";
import DOMPurify from "dompurify";
import "@headlessui/vue";
const _sfc_main$d = {
  __name: "RelatedPosts",
  __ssrInlineRender: true,
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.posts.length > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-12 pt-8 border-t border-gray-200" }, _attrs))}><h2 class="text-2xl font-bold text-gray-900 mb-6">İlginizi Çekebilir</h2><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(__props.posts, (post) => {
          _push(ssrRenderComponent(_sfc_main$e, {
            key: post.id,
            post
          }, null, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Post/RelatedPosts.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const maxLength$1 = 1e3;
const _sfc_main$c = {
  __name: "CommentForm",
  __ssrInlineRender: true,
  props: {
    postSlug: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const page = usePage();
    const authUser = page.props.auth?.user;
    const form = useForm({
      content: ""
    });
    const charCount = computed(() => form.content.length);
    const isNearLimit = computed(() => charCount.value > maxLength$1 * 0.9);
    const isOverLimit = computed(() => charCount.value > maxLength$1);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-xl border border-gray-200 p-6" }, _attrs))}><h3 class="text-lg font-bold text-gray-900 mb-4">Yorum Yap</h3>`);
      if (!unref(authUser)) {
        _push(`<div class="text-center py-6 bg-gray-50 rounded-lg"><p class="text-gray-600 mb-3">Yorum yapmak için giriş yapmalısınız</p><button class="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"> Giriş Yap </button></div>`);
      } else {
        _push(`<form><div class="relative"><textarea rows="4" placeholder="Düşüncelerinizi paylaşın..." class="${ssrRenderClass([{ "border-red-500 focus:border-red-500": isOverLimit.value }, "w-full px-4 py-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"])}">${ssrInterpolate(unref(form).content)}</textarea><div class="${ssrRenderClass([{
          "text-gray-400": !isNearLimit.value && !isOverLimit.value,
          "text-orange-500": isNearLimit.value && !isOverLimit.value,
          "text-red-500 font-medium": isOverLimit.value
        }, "absolute bottom-3 right-3 text-sm"])}">${ssrInterpolate(charCount.value)}/${ssrInterpolate(maxLength$1)}</div></div>`);
        if (unref(form).errors.content) {
          _push(`<p class="mt-2 text-sm text-red-600">${ssrInterpolate(unref(form).errors.content)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-4 flex justify-end"><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing || isOverLimit.value || !unref(form).content.trim()) ? " disabled" : ""} class="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`);
        if (unref(form).processing) {
          _push(`<span>Gönderiliyor...</span>`);
        } else {
          _push(`<span>Yorum Yap</span>`);
        }
        _push(`</button></div></form>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Comment/CommentForm.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = {
  __name: "CommentList",
  __ssrInlineRender: true,
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const page = usePage();
    const authUser = page.props.auth?.user;
    const { timeAgo } = useDate();
    const sentimentConfig = {
      pozitif: { icon: "+", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", text: "Pozitif" },
      negatif: { icon: "-", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", text: "Negatif" },
      notr: { icon: "~", color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200", text: "Nötr" }
    };
    const getSentiment = (comment) => {
      if (!comment.sentiment_label) return null;
      return sentimentConfig[comment.sentiment_label] || sentimentConfig.notr;
    };
    const canDelete = (comment) => {
      if (!authUser) return false;
      return authUser.id === comment.user_id || authUser.role === "admin";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8" }, _attrs))}><h3 class="text-xl font-bold text-gray-900 mb-6"> Yorumlar (${ssrInterpolate(__props.comments.length)}) </h3>`);
      if (__props.comments.length > 0) {
        _push(`<div class="space-y-6"><!--[-->`);
        ssrRenderList(__props.comments, (comment) => {
          _push(`<div class="flex gap-4"><div class="flex-shrink-0">`);
          if (comment.user?.avatar) {
            _push(`<img${ssrRenderAttr("src", comment.user.avatar)}${ssrRenderAttr("alt", comment.user.name)} class="w-10 h-10 rounded-full object-cover">`);
          } else {
            _push(`<div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">${ssrInterpolate(comment.user?.name?.charAt(0)?.toUpperCase() || "U")}</div>`);
          }
          _push(`</div><div class="flex-1 min-w-0"><div class="bg-gray-50 rounded-lg p-4"><div class="flex items-center justify-between mb-2"><span class="font-semibold text-gray-900">${ssrInterpolate(comment.user?.name)}</span><span class="text-sm text-gray-500">${ssrInterpolate(unref(timeAgo)(comment.created_at))}</span></div><p class="text-gray-700 whitespace-pre-wrap">${ssrInterpolate(comment.content)}</p>`);
          if (getSentiment(comment)) {
            _push(`<div class="${ssrRenderClass([[getSentiment(comment).bg, getSentiment(comment).color, getSentiment(comment).border], "mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"])}"${ssrRenderAttr("title", "Duygu analizi: " + getSentiment(comment).text + " (" + comment.sentiment_score?.toFixed(2) + ")")}><span class="font-bold text-sm leading-none">${ssrInterpolate(getSentiment(comment).icon)}</span><span>${ssrInterpolate(getSentiment(comment).text)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (canDelete(comment)) {
            _push(`<div class="mt-2 flex items-center gap-4"><button class="text-sm text-red-600 hover:text-red-700 transition-colors"> Sil </button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-12 bg-gray-50 rounded-lg"><svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg><p class="text-gray-500">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Comment/CommentList.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = {
  __name: "WixComments",
  __ssrInlineRender: true,
  props: {
    comments: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const { formatDate } = useDate();
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.comments.length > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-12 pt-8 border-t border-gray-200" }, _attrs))}><h3 class="text-xl font-bold text-gray-900 mb-6"> Wix Yorumları (${ssrInterpolate(__props.comments.length)}) </h3><div class="space-y-6"><!--[-->`);
        ssrRenderList(__props.comments, (comment) => {
          _push(`<div class="bg-gray-50 rounded-xl p-6"><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center font-bold text-sm">${ssrInterpolate(comment.author?.charAt(0)?.toUpperCase() || "U")}</div><div><span class="font-semibold text-gray-900">${ssrInterpolate(comment.author || "Misafir")}</span>`);
          if (comment.created_at) {
            _push(`<p class="text-sm text-gray-500">${ssrInterpolate(unref(formatDate)(comment.created_at))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><span class="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full"> Wix </span></div><div class="text-gray-700 leading-relaxed">${ssrInterpolate(comment.content)}</div></div>`);
        });
        _push(`<!--]--></div><p class="mt-6 text-sm text-gray-500 text-center"> Bu yorumlar Wix platformundan aktarılmıştır. </p></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Comment/WixComments.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = {
  __name: "LikeButton",
  __ssrInlineRender: true,
  props: {
    postSlug: {
      type: String,
      required: true
    },
    likesCount: {
      type: Number,
      default: 0
    },
    isLiked: {
      type: Boolean,
      default: false
    }
  },
  emits: ["open-login"],
  setup(__props, { emit: __emit }) {
    const page = usePage();
    page.props.auth?.user;
    const isAnimating = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: ["flex items-center gap-2 transition-all duration-200", [
          __props.isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500",
          isAnimating.value ? "scale-125" : "scale-100"
        ]]
      }, _attrs))}><svg class="${ssrRenderClass([{ "scale-110": isAnimating.value }, "w-6 h-6 transition-transform duration-200"])}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"${ssrRenderAttr("fill", __props.isLiked ? "currentColor" : "none")} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg><span class="font-medium">${ssrInterpolate(__props.likesCount)} beğeni</span></button>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/UI/LikeButton.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {
  __name: "ShareButtons",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const showCopiedTooltip = ref(false);
    ({
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title)}&url=${encodeURIComponent(props.url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(props.title + " " + props.url)}`
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-2" }, _attrs))}><span class="text-sm text-gray-500 mr-1">Paylaş:</span><button class="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition-colors" title="Twitter&#39;da Paylaş"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg></button><button class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors" title="Facebook&#39;ta Paylaş"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg></button><button class="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors" title="WhatsApp&#39;ta Paylaş"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg></button><div class="relative"><button class="w-9 h-9 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors" title="Linki Kopyala"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>`);
      if (showCopiedTooltip.value) {
        _push(`<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"> Kopyalandı! <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Post/ShareButtons.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = {
  __name: "EntryCard",
  __ssrInlineRender: true,
  props: {
    entry: { type: Object, required: true },
    userVote: { type: Number, default: 0 }
    // -1, 0, or 1
  },
  emits: ["open-login"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const page = usePage();
    const authUser = page.props.auth?.user;
    const { timeAgo } = useDate();
    const authorName = computed(() => {
      return props.entry.user?.name ?? props.entry.display_name ?? "Anonim";
    });
    const authorInitial = computed(() => {
      return authorName.value.charAt(0).toUpperCase();
    });
    const isOwner = computed(() => {
      return authUser && props.entry.user_id === authUser.id;
    });
    const canDelete = computed(() => {
      return isOwner.value || authUser?.role === "admin";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "group flex gap-3 py-4 border-b border-gray-100 last:border-0" }, _attrs))}><div class="flex flex-col items-center gap-1 pt-1"><button class="${ssrRenderClass([__props.userVote === 1 ? "text-green-600" : "text-gray-300 hover:text-green-500", "p-1 rounded transition-colors"])}"${ssrRenderAttr("title", unref(authUser) ? "Yukarı oy" : "Oy vermek için giriş yapın")}><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"></path></svg></button><span class="${ssrRenderClass([{
        "text-green-600": __props.entry.score > 0,
        "text-red-500": __props.entry.score < 0,
        "text-gray-400": __props.entry.score === 0
      }, "text-sm font-semibold min-w-[2ch] text-center"])}">${ssrInterpolate(__props.entry.score)}</span><button class="${ssrRenderClass([__props.userVote === -1 ? "text-red-500" : "text-gray-300 hover:text-red-400", "p-1 rounded transition-colors"])}"${ssrRenderAttr("title", unref(authUser) ? "Aşağı oy" : "Oy vermek için giriş yapın")}><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button></div><div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1">`);
      if (__props.entry.user?.avatar) {
        _push(`<img${ssrRenderAttr("src", __props.entry.user.avatar)}${ssrRenderAttr("alt", authorName.value)} class="w-6 h-6 rounded-full object-cover">`);
      } else {
        _push(`<div class="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">${ssrInterpolate(authorInitial.value)}</div>`);
      }
      _push(`<span class="text-sm font-medium text-gray-700">${ssrInterpolate(authorName.value)}</span><span class="text-xs text-gray-400">${ssrInterpolate(unref(timeAgo)(__props.entry.created_at))}</span>`);
      if (__props.entry.is_spoiler) {
        _push(`<span class="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full"> Spoiler </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-gray-800 text-sm leading-relaxed whitespace-pre-line">${ssrInterpolate(__props.entry.content)}</p>`);
      if (canDelete.value) {
        _push(`<button class="mt-1 text-xs text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"> Sil </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Entry/EntryCard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const maxLength = 500;
const _sfc_main$6 = {
  __name: "EntryForm",
  __ssrInlineRender: true,
  props: {
    postSlug: { type: String, required: true }
  },
  emits: ["open-login"],
  setup(__props, { emit: __emit }) {
    const page = usePage();
    const authUser = page.props.auth?.user;
    const form = useForm({
      content: "",
      is_spoiler: false,
      display_name: ""
    });
    const charCount = computed(() => form.content.length);
    const isNearLimit = computed(() => charCount.value > maxLength * 0.9);
    const isOverLimit = computed(() => charCount.value > maxLength);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gray-50 rounded-lg p-4" }, _attrs))}><form>`);
      if (!unref(authUser)) {
        _push(`<div class="mb-3"><input${ssrRenderAttr("value", unref(form).display_name)} type="text" placeholder="Takma ad *" maxlength="50" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20">`);
        if (unref(form).errors.display_name) {
          _push(`<p class="mt-1 text-xs text-red-600">${ssrInterpolate(unref(form).errors.display_name)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative"><textarea rows="3" placeholder="Bu film/dizi hakkında kısa görüşünüz..." class="${ssrRenderClass([{ "border-red-400": isOverLimit.value }, "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"])}">${ssrInterpolate(unref(form).content)}</textarea><div class="${ssrRenderClass([{
        "text-gray-400": !isNearLimit.value && !isOverLimit.value,
        "text-orange-500": isNearLimit.value && !isOverLimit.value,
        "text-red-500 font-medium": isOverLimit.value
      }, "absolute bottom-2 right-3 text-xs"])}">${ssrInterpolate(charCount.value)}/${ssrInterpolate(maxLength)}</div></div>`);
      if (unref(form).errors.content) {
        _push(`<p class="mt-1 text-xs text-red-600">${ssrInterpolate(unref(form).errors.content)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mt-3 flex items-center justify-between"><label class="flex items-center gap-2 cursor-pointer select-none"><input${ssrIncludeBooleanAttr(Array.isArray(unref(form).is_spoiler) ? ssrLooseContain(unref(form).is_spoiler, null) : unref(form).is_spoiler) ? " checked" : ""} type="checkbox" class="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"><span class="text-sm text-gray-600">Spoiler iceriyor</span></label><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing || isOverLimit.value || !unref(form).content.trim() || !unref(authUser) && !unref(form).display_name.trim()) ? " disabled" : ""} class="px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`);
      if (unref(form).processing) {
        _push(`<span>...</span>`);
      } else {
        _push(`<span>Gonder</span>`);
      }
      _push(`</button></div></form></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Entry/EntryForm.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "EntrySection",
  __ssrInlineRender: true,
  props: {
    entries: { type: Array, default: () => [] },
    postSlug: { type: String, required: true },
    userVotes: { type: Object, default: () => ({}) }
    // { entryId: vote }
  },
  emits: ["open-login"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const activeTab = ref("all");
    const sortedEntries = computed(() => {
      let filtered = [...props.entries];
      if (activeTab.value === "spoiler") {
        filtered = filtered.filter((e) => e.is_spoiler);
      } else if (activeTab.value === "nonspoiler") {
        filtered = filtered.filter((e) => !e.is_spoiler);
      }
      return filtered.sort((a, b) => b.score - a.score || new Date(b.created_at) - new Date(a.created_at));
    });
    const spoilerCount = computed(() => props.entries.filter((e) => e.is_spoiler).length);
    const nonspoilerCount = computed(() => props.entries.filter((e) => !e.is_spoiler).length);
    const tabs = computed(() => [
      { key: "all", label: "Tumu", count: props.entries.length },
      { key: "nonspoiler", label: "Spoilersiz", count: nonspoilerCount.value },
      { key: "spoiler", label: "Spoilerli", count: spoilerCount.value }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-white rounded-xl border border-gray-200 p-6" }, _attrs))}><div class="flex items-center justify-between mb-4"><h3 class="text-lg font-bold text-gray-900">Entry&#39;ler</h3><span class="text-sm text-gray-500">${ssrInterpolate(__props.entries.length)} entry</span></div><div class="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1"><!--[-->`);
      ssrRenderList(tabs.value, (tab) => {
        _push(`<button class="${ssrRenderClass([activeTab.value === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700", "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"])}">${ssrInterpolate(tab.label)} <span class="ml-1 text-xs text-gray-400">(${ssrInterpolate(tab.count)})</span></button>`);
      });
      _push(`<!--]--></div>`);
      if (activeTab.value === "spoiler" && spoilerCount.value > 0) {
        _push(`<div class="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700"> Bu bolum spoiler icerir. Dikkatli okuyun. </div>`);
      } else {
        _push(`<!---->`);
      }
      if (sortedEntries.value.length > 0) {
        _push(`<div class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(sortedEntries.value, (entry) => {
          _push(ssrRenderComponent(_sfc_main$7, {
            key: entry.id,
            entry,
            "user-vote": __props.userVotes[entry.id] ?? 0,
            onOpenLogin: ($event) => _ctx.$emit("open-login")
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="py-8 text-center text-gray-400 text-sm">`);
        if (activeTab.value === "all") {
          _push(`<span>Henuz entry yok. Ilk siz yazin!</span>`);
        } else if (activeTab.value === "spoiler") {
          _push(`<span>Spoilerli entry yok.</span>`);
        } else {
          _push(`<span>Spoilersiz entry yok.</span>`);
        }
        _push(`</div>`);
      }
      _push(`<div class="mt-6 pt-4 border-t border-gray-200"><h4 class="text-sm font-semibold text-gray-700 mb-3">Entry Yaz</h4>`);
      _push(ssrRenderComponent(_sfc_main$6, {
        "post-slug": __props.postSlug,
        onOpenLogin: ($event) => _ctx.$emit("open-login")
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Entry/EntrySection.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "TimeCapsuleBanner",
  __ssrInlineRender: true,
  props: {
    originalPost: { type: Object, default: null },
    revisits: { type: Array, default: () => [] },
    isRevisit: { type: Boolean, default: false },
    currentPublishedAt: { type: String, default: null }
  },
  setup(__props) {
    const props = __props;
    const { formatDate } = useDate();
    const timeDifference = computed(() => {
      if (!props.isRevisit || !props.originalPost?.published_at || !props.currentPublishedAt) return "";
      const original = new Date(props.originalPost.published_at);
      const revisit = new Date(props.currentPublishedAt);
      const months = Math.round((revisit - original) / (1e3 * 60 * 60 * 24 * 30));
      if (months >= 12) {
        const years = Math.floor(months / 12);
        const remaining = months % 12;
        return remaining > 0 ? `${years} yil ${remaining} ay sonra` : `${years} yil sonra`;
      }
      return `${months} ay sonra`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (__props.isRevisit && __props.originalPost) {
        _push(`<div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"><div class="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center"><svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><p class="text-sm font-semibold text-amber-800">Zaman Kapsulu</p><p class="text-sm text-amber-700 mt-0.5"> Bu yazi, `);
        _push(ssrRenderComponent(unref(Link), {
          href: `/yazi/${__props.originalPost.slug}`,
          class: "font-medium underline hover:text-amber-900"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` &quot;${ssrInterpolate(__props.originalPost.title)}&quot; `);
            } else {
              return [
                createTextVNode(' "' + toDisplayString(__props.originalPost.title) + '" ', 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(` yazisinin ${ssrInterpolate(timeDifference.value)} tekrar degerlendirmesidir. </p><p class="text-xs text-amber-500 mt-1"> Orijinal: ${ssrInterpolate(unref(formatDate)(__props.originalPost.published_at))}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!__props.isRevisit && __props.revisits.length > 0) {
        _push(`<div class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3"><div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg></div><div><p class="text-sm font-semibold text-blue-800">Tekrar Degerlendirme Mevcut</p><!--[-->`);
        ssrRenderList(__props.revisits, (revisit) => {
          _push(`<div class="mt-1">`);
          _push(ssrRenderComponent(unref(Link), {
            href: `/yazi/${revisit.slug}`,
            class: "text-sm text-blue-700 font-medium underline hover:text-blue-900"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(revisit.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(revisit.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<span class="text-xs text-blue-500 ml-1">(${ssrInterpolate(unref(formatDate)(revisit.published_at))})</span></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Post/TimeCapsuleBanner.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "DialogueView",
  __ssrInlineRender: true,
  props: {
    exchanges: { type: Array, required: true },
    primaryAuthor: { type: Object, required: true },
    secondaryAuthor: { type: Object, default: null },
    intro: { type: String, default: "" }
  },
  setup(__props) {
    const props = __props;
    const getAuthorColor = (userId) => {
      if (userId === props.primaryAuthor?.id) return "red";
      return "blue";
    };
    const getAuthor = (exchange) => {
      if (exchange.user) return exchange.user;
      if (exchange.user_id === props.primaryAuthor?.id) return props.primaryAuthor;
      return props.secondaryAuthor;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (__props.intro) {
        _push(`<div class="prose prose-lg max-w-none mb-8 prose-p:text-gray-700"><div>${__props.intro ?? ""}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.primaryAuthor && __props.secondaryAuthor) {
        _push(`<div class="flex items-center gap-6 mb-6 pb-4 border-b border-gray-200"><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-red-500"></div>`);
        if (__props.primaryAuthor.avatar) {
          _push(`<img${ssrRenderAttr("src", __props.primaryAuthor.avatar)} class="w-6 h-6 rounded-full">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="text-sm font-medium text-gray-700">${ssrInterpolate(__props.primaryAuthor.name)}</span></div><div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-blue-500"></div>`);
        if (__props.secondaryAuthor.avatar) {
          _push(`<img${ssrRenderAttr("src", __props.secondaryAuthor.avatar)} class="w-6 h-6 rounded-full">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="text-sm font-medium text-gray-700">${ssrInterpolate(__props.secondaryAuthor.name)}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-4"><!--[-->`);
      ssrRenderList(__props.exchanges, (exchange, index) => {
        _push(`<div class="${ssrRenderClass([getAuthorColor(exchange.user_id) === "blue" ? "flex-row-reverse" : "", "flex gap-3"])}"><div class="flex-shrink-0">`);
        if (getAuthor(exchange)?.avatar) {
          _push(`<img${ssrRenderAttr("src", getAuthor(exchange).avatar)}${ssrRenderAttr("alt", getAuthor(exchange)?.name)} class="w-10 h-10 rounded-full object-cover">`);
        } else {
          _push(`<div class="${ssrRenderClass([getAuthorColor(exchange.user_id) === "red" ? "bg-red-500" : "bg-blue-500", "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"])}">${ssrInterpolate(getAuthor(exchange)?.name?.charAt(0)?.toUpperCase() || "?")}</div>`);
        }
        _push(`</div><div class="${ssrRenderClass([getAuthorColor(exchange.user_id) === "red" ? "bg-red-50 border border-red-100 rounded-tl-sm" : "bg-blue-50 border border-blue-100 rounded-tr-sm", "max-w-[75%] rounded-2xl px-4 py-3"])}"><p class="${ssrRenderClass([getAuthorColor(exchange.user_id) === "red" ? "text-red-600" : "text-blue-600", "text-xs font-semibold mb-1"])}">${ssrInterpolate(getAuthor(exchange)?.name)}</p><div class="text-sm text-gray-800 leading-relaxed whitespace-pre-line">${exchange.content ?? ""}</div></div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Post/DialogueView.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "VisualEssayView",
  __ssrInlineRender: true,
  props: {
    blocks: { type: Array, required: true }
  },
  setup(__props) {
    const blockRefs = ref([]);
    const visibleBlocks = ref(/* @__PURE__ */ new Set());
    let observer = null;
    onMounted(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const index = parseInt(entry.target.dataset.index);
            if (entry.isIntersecting) {
              visibleBlocks.value.add(index);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
      );
      blockRefs.value.forEach((el) => {
        if (el) observer.observe(el);
      });
    });
    onUnmounted(() => {
      observer?.disconnect();
    });
    const isVisible = (index) => visibleBlocks.value.has(index);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-12" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.blocks, (block, index) => {
        _push(`<div${ssrRenderAttr("data-index", index)} class="${ssrRenderClass([isVisible(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8", "transition-all duration-700 ease-out"])}">`);
        if (block.type === "text") {
          _push(`<div class="prose prose-lg max-w-none prose-p:text-gray-700"><div>${block.content.body ?? ""}</div></div>`);
        } else if (block.type === "image") {
          _push(`<figure class="space-y-3"><img${ssrRenderAttr("src", block.content.src)}${ssrRenderAttr("alt", block.content.caption || "")} class="w-full rounded-xl shadow-sm">`);
          if (block.content.caption) {
            _push(`<figcaption class="text-sm text-gray-500 text-center italic">${ssrInterpolate(block.content.caption)}</figcaption>`);
          } else {
            _push(`<!---->`);
          }
          if (block.content.annotation) {
            _push(`<p class="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">${ssrInterpolate(block.content.annotation)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</figure>`);
        } else if (block.type === "comparison") {
          _push(`<div class="space-y-3"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><figure><img${ssrRenderAttr("src", block.content.left.src)}${ssrRenderAttr("alt", block.content.left.label)} class="w-full rounded-lg"><figcaption class="text-sm text-gray-500 text-center mt-2">${ssrInterpolate(block.content.left.label)}</figcaption></figure><figure><img${ssrRenderAttr("src", block.content.right.src)}${ssrRenderAttr("alt", block.content.right.label)} class="w-full rounded-lg"><figcaption class="text-sm text-gray-500 text-center mt-2">${ssrInterpolate(block.content.right.label)}</figcaption></figure></div>`);
          if (block.content.description) {
            _push(`<p class="text-sm text-gray-600 text-center">${ssrInterpolate(block.content.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (block.type === "fullwidth") {
          _push(`<div class="relative rounded-xl overflow-hidden"><img${ssrRenderAttr("src", block.content.src)} alt="" class="w-full h-64 md:h-96 object-cover"><div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div><div class="${ssrRenderClass([{
            "bottom-0 left-0": !block.content.overlay_position || block.content.overlay_position === "bottom-left",
            "bottom-0 right-0 text-right": block.content.overlay_position === "bottom-right",
            "top-0 left-0": block.content.overlay_position === "top-left",
            "inset-0 flex items-center justify-center text-center": block.content.overlay_position === "center"
          }, "absolute p-6 md:p-10 text-white"])}"><p class="text-lg md:text-2xl font-bold leading-relaxed max-w-lg">${ssrInterpolate(block.content.overlay_text)}</p></div></div>`);
        } else if (block.type === "quote") {
          _push(`<blockquote class="border-l-4 border-red-500 pl-6 py-4"><p class="text-xl text-gray-800 italic leading-relaxed"> &quot;${ssrInterpolate(block.content.text)}&quot; </p>`);
          if (block.content.author) {
            _push(`<footer class="mt-3 text-sm text-gray-500 font-medium"> — ${ssrInterpolate(block.content.author)}</footer>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</blockquote>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Post/VisualEssayView.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "ArticleBody",
  __ssrInlineRender: true,
  props: {
    html: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    const sanitized = computed(() => {
      if (!props.html) return "";
      return DOMPurify.sanitize(props.html, {
        ALLOWED_TAGS: [
          "p",
          "br",
          "hr",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "strong",
          "b",
          "em",
          "i",
          "u",
          "s",
          "mark",
          "small",
          "sub",
          "sup",
          "a",
          "ul",
          "ol",
          "li",
          "blockquote",
          "cite",
          "q",
          "code",
          "pre",
          "kbd",
          "samp",
          "var",
          "figure",
          "figcaption",
          "img",
          "picture",
          "source",
          "video",
          "audio",
          "table",
          "thead",
          "tbody",
          "tfoot",
          "tr",
          "th",
          "td",
          "caption",
          "colgroup",
          "col",
          "div",
          "span",
          "iframe"
        ],
        ALLOWED_ATTR: [
          "href",
          "title",
          "target",
          "rel",
          "name",
          "src",
          "alt",
          "width",
          "height",
          "loading",
          "srcset",
          "sizes",
          "id",
          "class",
          "colspan",
          "rowspan",
          "controls",
          "autoplay",
          "muted",
          "loop",
          "poster",
          "cite",
          "datetime",
          "lang",
          "dir",
          "allow",
          "allowfullscreen",
          "frameborder"
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|spotify):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        FORBID_ATTR: ["style", "onerror", "onload", "onclick", "onmouseover", "onfocus"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder"]
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bi-article-body" }, _attrs))} data-v-c4199799>${sanitized.value ?? ""}</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Article/ArticleBody.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ArticleBody = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c4199799"]]);
const _sfc_main = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    post: {
      type: Object,
      required: true
    },
    relatedPosts: {
      type: Array,
      default: () => []
    },
    isLiked: {
      type: Boolean,
      default: false
    },
    userEntryVotes: {
      type: Object,
      default: () => ({})
    }
  },
  setup(__props) {
    const props = __props;
    const { formatDate } = useDate();
    const showLoginModal = ref(false);
    const readingProgress = ref(0);
    const articleBody = ref(null);
    let readingProgressFrame = null;
    const coverImage = computed(() => buildResponsiveImage(props.post.cover_image, {
      widths: [768, 1280, 1600],
      sizes: "100vw",
      fallbackWidth: 1280
    }));
    const canonicalUrl = computed(() => `https://benizledim.com/yazi/${props.post.slug}`);
    const toAbsoluteUrl = (value) => {
      if (!value) return "https://benizledim.com/images/og-default.png";
      return value.startsWith("http") ? value : `https://benizledim.com${value}`;
    };
    const stripHtml = (value = "") => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const slugifyHeading = (value = "") => value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
    const analyzeContent = (html = "") => {
      const seen = /* @__PURE__ */ new Map();
      const items = [];
      const processedHtml = html.replace(/<(h2|h3)([^>]*)>(.*?)<\/\1>/gis, (match, tag, attrs = "", inner = "") => {
        const text = stripHtml(inner);
        if (!text) {
          return match;
        }
        const baseId = slugifyHeading(text) || `section-${items.length + 1}`;
        const seenCount = seen.get(baseId) || 0;
        seen.set(baseId, seenCount + 1);
        const id = seenCount ? `${baseId}-${seenCount + 1}` : baseId;
        const cleanedAttrs = attrs.replace(/\sid=(['"]).*?\1/i, "");
        items.push({
          id,
          text,
          level: tag.toLowerCase()
        });
        return `<${tag}${cleanedAttrs} id="${id}">${inner}</${tag}>`;
      });
      const wordCount = stripHtml(html).split(/\s+/).filter(Boolean).length;
      return {
        html: processedHtml,
        items,
        wordCount
      };
    };
    const contentAnalysis = computed(() => analyzeContent(props.post.content || ""));
    const processedContent = computed(() => contentAnalysis.value.html);
    const tocItems = computed(() => contentAnalysis.value.items);
    const shouldShowToc = computed(() => {
      const isStandardPost = !props.post.format || props.post.format === "standard";
      return isStandardPost && contentAnalysis.value.wordCount > 1500 && tocItems.value.length >= 3;
    });
    const articleSchema = computed(() => {
      const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": props.post.title,
        "description": props.post.excerpt || "",
        "image": [toAbsoluteUrl(props.post.cover_image)],
        "datePublished": props.post.published_at,
        "dateModified": props.post.updated_at || props.post.published_at,
        "inLanguage": "tr-TR",
        "author": {
          "@type": "Person",
          "name": props.post.user?.name || "Ben İzledim"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Ben İzledim",
          "url": "https://benizledim.com"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": canonicalUrl.value
        }
      };
      if (contentAnalysis.value?.wordCount) {
        schema.wordCount = contentAnalysis.value.wordCount;
      }
      if (props.post.categories?.length) {
        schema.articleSection = props.post.categories[0].name;
      }
      if (props.post.tags?.length) {
        schema.keywords = props.post.tags.map((t) => t.name).filter(Boolean).join(", ");
      }
      return schema;
    });
    const articleMeta = computed(() => [
      { property: "article:published_time", content: props.post.published_at || "" },
      { property: "article:modified_time", content: props.post.updated_at || props.post.published_at || "" },
      { property: "article:author", content: props.post.user?.name || "Ben İzledim" }
    ].filter((item) => item.content));
    const formatReadingTime = (minutes) => {
      if (!minutes) return "2 dk okuma";
      return `${minutes} dk okuma`;
    };
    const openLoginModal = () => {
      showLoginModal.value = true;
    };
    const closeLoginModal = () => {
      showLoginModal.value = false;
    };
    const updateReadingProgress = () => {
      if (typeof window === "undefined" || typeof document === "undefined") {
        return;
      }
      const bodyElement = articleBody.value ?? document.querySelector("[data-reading-body]");
      const proseElement = bodyElement?.querySelector(".prose") ?? bodyElement;
      if (!proseElement) {
        readingProgress.value = 0;
        return;
      }
      const rect = proseElement.getBoundingClientRect();
      const totalScrollable = Math.max(rect.height - window.innerHeight * 0.45, 1);
      const consumed = Math.max(-rect.top + 120, 0);
      readingProgress.value = Math.min(Math.max(consumed / totalScrollable, 0), 1);
    };
    onMounted(() => {
      const syncReadingProgress = () => {
        updateReadingProgress();
        readingProgressFrame = window.requestAnimationFrame(syncReadingProgress);
      };
      syncReadingProgress();
    });
    onBeforeUnmount(() => {
      if (readingProgressFrame !== null) {
        window.cancelAnimationFrame(readingProgressFrame);
        readingProgressFrame = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: __props.post.title,
        description: __props.post.excerpt || "Film, Dizi ve Belgesel eleştirileri - Ben İzledim",
        "og-image": __props.post.cover_image || "/images/og-default.png",
        "canonical-url": canonicalUrl.value,
        "og-type": "article",
        "schema-nodes": [articleSchema.value],
        "extra-meta": articleMeta.value
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="fixed inset-x-0 top-0 z-[80] h-1 bg-black/5"${_scopeId}><div class="h-full origin-left bg-red-600 transition-transform duration-150 ease-out" style="${ssrRenderStyle({ transform: `scaleX(${readingProgress.value})` })}"${_scopeId}></div></div><article class="min-h-screen bg-white"${_scopeId}><div class="w-full h-64 md:h-96 lg:h-[500px] bg-gray-900 relative overflow-hidden"${_scopeId}>`);
            if (__props.post.cover_image) {
              _push2(`<img${ssrRenderAttr("src", coverImage.value.src)}${ssrRenderAttr("srcset", coverImage.value.srcset || void 0)}${ssrRenderAttr("sizes", coverImage.value.sizes || void 0)}${ssrRenderAttr("alt", __props.post.title)} class="w-full h-full object-cover opacity-90" loading="eager" fetchpriority="high" decoding="async" width="1600" height="900"${_scopeId}>`);
            } else {
              _push2(`<div class="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center"${_scopeId}><span class="text-white text-6xl font-bold"${_scopeId}>Bİ</span></div>`);
            }
            _push2(`<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"${_scopeId}></div></div><div class="max-w-6xl mx-auto px-4 -mt-32 relative z-10"${_scopeId}><div class="bg-white rounded-t-2xl md:rounded-2xl shadow-sm p-6 md:p-10"${_scopeId}><div class="flex flex-wrap gap-2 mb-4"${_scopeId}><!--[-->`);
            ssrRenderList(__props.post.categories, (category) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: category.id,
                href: `/yazilar?category=${category.slug}`,
                class: "px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(category.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(category.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"${_scopeId}>${ssrInterpolate(__props.post.title)}</h1><div class="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200"${_scopeId}>`);
            if (__props.post.user) {
              _push2(ssrRenderComponent(unref(Link), {
                href: `/profile/${__props.post.user.id}`,
                class: "flex items-center gap-2 hover:text-red-600 transition-colors"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (__props.post.user.avatar) {
                      _push3(`<img${ssrRenderAttr("src", __props.post.user.avatar)}${ssrRenderAttr("alt", __props.post.user.name)} class="w-10 h-10 rounded-full object-cover" loading="lazy" decoding="async"${_scopeId2}>`);
                    } else {
                      _push3(`<div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold"${_scopeId2}>${ssrInterpolate(__props.post.user.name?.charAt(0)?.toUpperCase())}</div>`);
                    }
                    _push3(`<div${_scopeId2}><span class="block font-medium text-gray-900"${_scopeId2}>${ssrInterpolate(__props.post.user.name)}</span><span class="text-gray-500"${_scopeId2}>Yazar</span></div>`);
                  } else {
                    return [
                      __props.post.user.avatar ? (openBlock(), createBlock("img", {
                        key: 0,
                        src: __props.post.user.avatar,
                        alt: __props.post.user.name,
                        class: "w-10 h-10 rounded-full object-cover",
                        loading: "lazy",
                        decoding: "async"
                      }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold"
                      }, toDisplayString(__props.post.user.name?.charAt(0)?.toUpperCase()), 1)),
                      createVNode("div", null, [
                        createVNode("span", { class: "block font-medium text-gray-900" }, toDisplayString(__props.post.user.name), 1),
                        createVNode("span", { class: "text-gray-500" }, "Yazar")
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center gap-1"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(unref(formatDate)(__props.post.published_at))}</span></div><div class="flex items-center gap-1"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(formatReadingTime(__props.post.reading_time_minutes))}</span></div><div class="flex items-center gap-1"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(__props.post.view_count?.toLocaleString("tr-TR"))} görüntülenme</span></div></div>`);
            if (__props.post.is_revisit || __props.post.revisits && __props.post.revisits.length > 0) {
              _push2(ssrRenderComponent(_sfc_main$4, {
                "original-post": __props.post.original_post,
                revisits: __props.post.revisits || [],
                "is-revisit": __props.post.is_revisit,
                "current-published-at": __props.post.published_at,
                class: "mb-8"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (__props.post.excerpt) {
              _push2(`<div class="mx-auto mb-8 max-w-[750px] text-xl leading-relaxed text-gray-600 italic"${_scopeId}>${ssrInterpolate(__props.post.excerpt)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!__props.post.format || __props.post.format === "standard") {
              _push2(`<div class="lg:grid lg:grid-cols-[minmax(0,750px)_240px] lg:items-start lg:gap-10"${_scopeId}><div data-reading-body class="min-w-0"${_scopeId}>`);
              _push2(ssrRenderComponent(ArticleBody, {
                html: processedContent.value,
                class: "prose prose-lg mx-auto max-w-[750px] prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:hover:text-red-700"
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
              if (shouldShowToc.value) {
                _push2(`<aside class="hidden lg:block"${_scopeId}><div class="sticky top-24 border border-gray-200 bg-gray-50 p-4"${_scopeId}><div class="text-xs font-bold uppercase tracking-[0.08em] text-gray-500"${_scopeId}>İçindekiler</div><nav class="mt-3 space-y-2"${_scopeId}><!--[-->`);
                ssrRenderList(tocItems.value, (item) => {
                  _push2(`<a${ssrRenderAttr("href", `#${item.id}`)} class="${ssrRenderClass([item.level === "h3" ? "pl-4" : "", "block text-sm leading-5 text-gray-600 transition-colors hover:text-red-600"])}"${_scopeId}>${ssrInterpolate(item.text)}</a>`);
                });
                _push2(`<!--]--></nav></div></aside>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else if (__props.post.format === "dialogue") {
              _push2(ssrRenderComponent(_sfc_main$3, {
                exchanges: __props.post.dialogue_exchanges || [],
                "primary-author": __props.post.user,
                "secondary-author": __props.post.secondary_author,
                intro: __props.post.content
              }, null, _parent2, _scopeId));
            } else if (__props.post.format === "visual_essay") {
              _push2(ssrRenderComponent(_sfc_main$2, {
                blocks: __props.post.visual_essay_blocks || []
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (__props.post.tags?.length > 0) {
              _push2(`<div class="mx-auto mt-10 max-w-[750px] border-t border-gray-200 pt-8"${_scopeId}><h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3"${_scopeId}>Etiketler</h3><div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(__props.post.tags, (tag) => {
                _push2(`<span class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"${_scopeId}> #${ssrInterpolate(tag.name)}</span>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="mx-auto mt-8 flex max-w-[750px] flex-col gap-4 border-t border-gray-200 pt-8 sm:flex-row sm:items-center sm:justify-between"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$9, {
              "post-slug": __props.post.slug,
              "likes-count": __props.post.likes?.length || 0,
              "is-liked": __props.isLiked,
              onOpenLogin: openLoginModal
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$8, {
              title: __props.post.title,
              url: typeof _ctx.window !== "undefined" ? _ctx.window.location.href : ""
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div><div class="max-w-4xl mx-auto px-4 py-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              entries: __props.post.entries || [],
              "post-slug": __props.post.slug,
              "user-votes": __props.userEntryVotes,
              onOpenLogin: openLoginModal
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="max-w-4xl mx-auto px-4 py-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$c, {
              "post-slug": __props.post.slug,
              onOpenLogin: openLoginModal
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$b, {
              comments: __props.post.comments || []
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$a, {
              comments: __props.post.wix_comments || []
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="max-w-7xl mx-auto px-4 py-12"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$d, { posts: __props.relatedPosts }, null, _parent2, _scopeId));
            _push2(`</div></article>`);
            _push2(ssrRenderComponent(_sfc_main$f, {
              show: showLoginModal.value,
              onClose: closeLoginModal
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "fixed inset-x-0 top-0 z-[80] h-1 bg-black/5" }, [
                createVNode("div", {
                  class: "h-full origin-left bg-red-600 transition-transform duration-150 ease-out",
                  style: { transform: `scaleX(${readingProgress.value})` }
                }, null, 4)
              ]),
              createVNode("article", { class: "min-h-screen bg-white" }, [
                createVNode("div", { class: "w-full h-64 md:h-96 lg:h-[500px] bg-gray-900 relative overflow-hidden" }, [
                  __props.post.cover_image ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: coverImage.value.src,
                    srcset: coverImage.value.srcset || void 0,
                    sizes: coverImage.value.sizes || void 0,
                    alt: __props.post.title,
                    class: "w-full h-full object-cover opacity-90",
                    loading: "eager",
                    fetchpriority: "high",
                    decoding: "async",
                    width: "1600",
                    height: "900"
                  }, null, 8, ["src", "srcset", "sizes", "alt"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center"
                  }, [
                    createVNode("span", { class: "text-white text-6xl font-bold" }, "Bİ")
                  ])),
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" })
                ]),
                createVNode("div", { class: "max-w-6xl mx-auto px-4 -mt-32 relative z-10" }, [
                  createVNode("div", { class: "bg-white rounded-t-2xl md:rounded-2xl shadow-sm p-6 md:p-10" }, [
                    createVNode("div", { class: "flex flex-wrap gap-2 mb-4" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.post.categories, (category) => {
                        return openBlock(), createBlock(unref(Link), {
                          key: category.id,
                          href: `/yazilar?category=${category.slug}`,
                          class: "px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-full hover:bg-red-700 transition-colors"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(category.name), 1)
                          ]),
                          _: 2
                        }, 1032, ["href"]);
                      }), 128))
                    ]),
                    createVNode("h1", { class: "text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight" }, toDisplayString(__props.post.title), 1),
                    createVNode("div", { class: "flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 mb-8 pb-8 border-b border-gray-200" }, [
                      __props.post.user ? (openBlock(), createBlock(unref(Link), {
                        key: 0,
                        href: `/profile/${__props.post.user.id}`,
                        class: "flex items-center gap-2 hover:text-red-600 transition-colors"
                      }, {
                        default: withCtx(() => [
                          __props.post.user.avatar ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: __props.post.user.avatar,
                            alt: __props.post.user.name,
                            class: "w-10 h-10 rounded-full object-cover",
                            loading: "lazy",
                            decoding: "async"
                          }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("div", {
                            key: 1,
                            class: "w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold"
                          }, toDisplayString(__props.post.user.name?.charAt(0)?.toUpperCase()), 1)),
                          createVNode("div", null, [
                            createVNode("span", { class: "block font-medium text-gray-900" }, toDisplayString(__props.post.user.name), 1),
                            createVNode("span", { class: "text-gray-500" }, "Yazar")
                          ])
                        ]),
                        _: 1
                      }, 8, ["href"])) : createCommentVNode("", true),
                      createVNode("div", { class: "flex items-center gap-1" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          })
                        ])),
                        createVNode("span", null, toDisplayString(unref(formatDate)(__props.post.published_at)), 1)
                      ]),
                      createVNode("div", { class: "flex items-center gap-1" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          })
                        ])),
                        createVNode("span", null, toDisplayString(formatReadingTime(__props.post.reading_time_minutes)), 1)
                      ]),
                      createVNode("div", { class: "flex items-center gap-1" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-5 h-5",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          }),
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            "stroke-width": "2",
                            d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          })
                        ])),
                        createVNode("span", null, toDisplayString(__props.post.view_count?.toLocaleString("tr-TR")) + " görüntülenme", 1)
                      ])
                    ]),
                    __props.post.is_revisit || __props.post.revisits && __props.post.revisits.length > 0 ? (openBlock(), createBlock(_sfc_main$4, {
                      key: 0,
                      "original-post": __props.post.original_post,
                      revisits: __props.post.revisits || [],
                      "is-revisit": __props.post.is_revisit,
                      "current-published-at": __props.post.published_at,
                      class: "mb-8"
                    }, null, 8, ["original-post", "revisits", "is-revisit", "current-published-at"])) : createCommentVNode("", true),
                    __props.post.excerpt ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "mx-auto mb-8 max-w-[750px] text-xl leading-relaxed text-gray-600 italic"
                    }, toDisplayString(__props.post.excerpt), 1)) : createCommentVNode("", true),
                    !__props.post.format || __props.post.format === "standard" ? (openBlock(), createBlock("div", {
                      key: 2,
                      class: "lg:grid lg:grid-cols-[minmax(0,750px)_240px] lg:items-start lg:gap-10"
                    }, [
                      createVNode("div", {
                        ref_key: "articleBody",
                        ref: articleBody,
                        "data-reading-body": "",
                        class: "min-w-0"
                      }, [
                        createVNode(ArticleBody, {
                          html: processedContent.value,
                          class: "prose prose-lg mx-auto max-w-[750px] prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-red-600 prose-a:hover:text-red-700"
                        }, null, 8, ["html"])
                      ], 512),
                      shouldShowToc.value ? (openBlock(), createBlock("aside", {
                        key: 0,
                        class: "hidden lg:block"
                      }, [
                        createVNode("div", { class: "sticky top-24 border border-gray-200 bg-gray-50 p-4" }, [
                          createVNode("div", { class: "text-xs font-bold uppercase tracking-[0.08em] text-gray-500" }, "İçindekiler"),
                          createVNode("nav", { class: "mt-3 space-y-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(tocItems.value, (item) => {
                              return openBlock(), createBlock("a", {
                                key: item.id,
                                href: `#${item.id}`,
                                class: ["block text-sm leading-5 text-gray-600 transition-colors hover:text-red-600", item.level === "h3" ? "pl-4" : ""]
                              }, toDisplayString(item.text), 11, ["href"]);
                            }), 128))
                          ])
                        ])
                      ])) : createCommentVNode("", true)
                    ])) : __props.post.format === "dialogue" ? (openBlock(), createBlock(_sfc_main$3, {
                      key: 3,
                      exchanges: __props.post.dialogue_exchanges || [],
                      "primary-author": __props.post.user,
                      "secondary-author": __props.post.secondary_author,
                      intro: __props.post.content
                    }, null, 8, ["exchanges", "primary-author", "secondary-author", "intro"])) : __props.post.format === "visual_essay" ? (openBlock(), createBlock(_sfc_main$2, {
                      key: 4,
                      blocks: __props.post.visual_essay_blocks || []
                    }, null, 8, ["blocks"])) : createCommentVNode("", true),
                    __props.post.tags?.length > 0 ? (openBlock(), createBlock("div", {
                      key: 5,
                      class: "mx-auto mt-10 max-w-[750px] border-t border-gray-200 pt-8"
                    }, [
                      createVNode("h3", { class: "text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3" }, "Etiketler"),
                      createVNode("div", { class: "flex flex-wrap gap-2" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(__props.post.tags, (tag) => {
                          return openBlock(), createBlock("span", {
                            key: tag.id,
                            class: "px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          }, " #" + toDisplayString(tag.name), 1);
                        }), 128))
                      ])
                    ])) : createCommentVNode("", true),
                    createVNode("div", { class: "mx-auto mt-8 flex max-w-[750px] flex-col gap-4 border-t border-gray-200 pt-8 sm:flex-row sm:items-center sm:justify-between" }, [
                      createVNode(_sfc_main$9, {
                        "post-slug": __props.post.slug,
                        "likes-count": __props.post.likes?.length || 0,
                        "is-liked": __props.isLiked,
                        onOpenLogin: openLoginModal
                      }, null, 8, ["post-slug", "likes-count", "is-liked"]),
                      createVNode(_sfc_main$8, {
                        title: __props.post.title,
                        url: typeof _ctx.window !== "undefined" ? _ctx.window.location.href : ""
                      }, null, 8, ["title", "url"])
                    ])
                  ])
                ]),
                createVNode("div", { class: "max-w-4xl mx-auto px-4 py-8" }, [
                  createVNode(_sfc_main$5, {
                    entries: __props.post.entries || [],
                    "post-slug": __props.post.slug,
                    "user-votes": __props.userEntryVotes,
                    onOpenLogin: openLoginModal
                  }, null, 8, ["entries", "post-slug", "user-votes"])
                ]),
                createVNode("div", { class: "max-w-4xl mx-auto px-4 py-8" }, [
                  createVNode(_sfc_main$c, {
                    "post-slug": __props.post.slug,
                    onOpenLogin: openLoginModal
                  }, null, 8, ["post-slug"]),
                  createVNode(_sfc_main$b, {
                    comments: __props.post.comments || []
                  }, null, 8, ["comments"]),
                  createVNode(_sfc_main$a, {
                    comments: __props.post.wix_comments || []
                  }, null, 8, ["comments"])
                ]),
                createVNode("div", { class: "max-w-7xl mx-auto px-4 py-12" }, [
                  createVNode(_sfc_main$d, { posts: __props.relatedPosts }, null, 8, ["posts"])
                ])
              ]),
              createVNode(_sfc_main$f, {
                show: showLoginModal.value,
                onClose: closeLoginModal
              }, null, 8, ["show"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Post/Show.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
