import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./PostCard-C09KKzTl.js";
const _sfc_main = {
  __name: "PostGrid",
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
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" }, _attrs))}><!--[-->`);
        ssrRenderList(__props.posts, (post) => {
          _push(ssrRenderComponent(_sfc_main$1, {
            key: post.id,
            post
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "bi-rule-box text-center py-16" }, _attrs))}><svg class="mx-auto mb-4 h-16 w-16 text-[var(--bi-rule-soft)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><p class="bi-serif text-2xl text-[var(--bi-ink)]">Henüz yazı bulunmuyor.</p></div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Post/PostGrid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
