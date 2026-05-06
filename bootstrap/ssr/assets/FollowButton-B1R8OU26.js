import { ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate } from "vue/server-renderer";
const _sfc_main = {
  __name: "FollowButton",
  __ssrInlineRender: true,
  props: {
    user: { type: Object, required: true },
    initialFollowing: { type: Boolean, default: false },
    initialFollowersCount: { type: Number, default: 0 }
  },
  setup(__props) {
    const props = __props;
    const following = ref(props.initialFollowing);
    const followersCount = ref(props.initialFollowersCount);
    const loading = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: "button",
        disabled: loading.value,
        class: ["inline-flex items-center justify-center rounded-md border-2 border-[var(--bi-ink)] px-3 py-1.5 text-sm font-black transition disabled:opacity-50", following.value ? "bg-white text-[var(--bi-ink)] hover:bg-gray-50" : "bg-red-600 text-white hover:bg-red-700"]
      }, _attrs))}>${ssrInterpolate(following.value ? "Takipte" : "Takip Et")} <span class="ml-2 text-xs opacity-75">${ssrInterpolate(followersCount.value)}</span></button>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Social/FollowButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
