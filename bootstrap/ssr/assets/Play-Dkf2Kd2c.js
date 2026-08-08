import { mergeProps, useSSRContext, withCtx, openBlock, createBlock, Fragment, renderList, createVNode, toDisplayString, computed, ref, watch, onMounted, onUnmounted, unref, createCommentVNode, nextTick } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderSlot, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { a as _export_sfc, A as AppLayout } from "./AppLayout-DRxfLCYb.js";
import "@inertiajs/vue3";
import "@headlessui/vue";
import "axios";
const _sfc_main$7 = {
  __name: "QuizIcon",
  __ssrInlineRender: true,
  props: {
    name: { type: String, required: true },
    size: { type: Number, default: 24 },
    stroke: { type: String, default: "currentColor" },
    fill: { type: String, default: "none" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        width: __props.size,
        height: __props.size,
        viewBox: "0 0 24 24",
        stroke: __props.stroke,
        fill: __props.fill,
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        style: { "display": "inline-block", "flex": "none" }
      }, _attrs))}>`);
      if (__props.name === "play") {
        _push(`<path d="M7 5l12 7-12 7V5z"${ssrRenderAttr("fill", __props.stroke)}></path>`);
      } else if (__props.name === "arrow-left") {
        _push(`<path d="M19 12H5M12 19l-7-7 7-7"></path>`);
      } else if (__props.name === "arrow-right") {
        _push(`<path d="M5 12h14M12 5l7 7-7 7"></path>`);
      } else if (__props.name === "sound-on") {
        _push(`<!--[--><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M15.5 8.5a5 5 0 010 7"></path><path d="M19 5a9 9 0 010 14"></path><!--]-->`);
      } else if (__props.name === "sound-off") {
        _push(`<!--[--><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M22 9l-6 6M16 9l6 6"></path><!--]-->`);
      } else if (__props.name === "share") {
        _push(`<!--[--><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"></path><!--]-->`);
      } else if (__props.name === "refresh") {
        _push(`<!--[--><path d="M3 12a9 9 0 0115.2-6.5L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 01-15.2 6.5L3 16"></path><path d="M3 21v-5h5"></path><!--]-->`);
      } else if (__props.name === "twitter") {
        _push(`<path${ssrRenderAttr("fill", __props.stroke)} stroke="none" d="M18.244 2H21l-6.523 7.452L22 22h-6.842l-4.79-6.26L4.8 22H2.044l6.99-7.987L2 2h6.91l4.34 5.74L18.244 2zm-1.166 18h1.832L7.04 4H5.062l12.016 16z"></path>`);
      } else if (__props.name === "link") {
        _push(`<!--[--><path d="M10 14a4 4 0 005.6.6l3-3a4 4 0 00-5.6-5.6L11 8"></path><path d="M14 10a4 4 0 00-5.6-.6l-3 3a4 4 0 005.6 5.6L13 16"></path><!--]-->`);
      } else {
        _push(`<circle cx="12" cy="12" r="9"></circle>`);
      }
      _push(`</svg>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Quiz/QuizIcon.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: "QuizTopBar",
  __ssrInlineRender: true,
  props: {
    phase: { type: String, required: true },
    current: { type: Number, default: 0 },
    total: { type: Number, default: 25 },
    soundOn: { type: Boolean, default: true }
  },
  emits: ["toggleSound", "restart"],
  setup(__props, { emit: __emit }) {
    function pad(n) {
      return String(n).padStart(2, "0");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "qz-topbar" }, _attrs))}><div class="qz-topbar__brand"><span class="qz-b-tape">Benizledim</span><span style="${ssrRenderStyle({ fontFamily: "var(--qz-mono)", fontSize: "11px", letterSpacing: ".14em", color: "var(--qz-ink-soft)" })}"> / Hangi Film Karakterisin? </span></div><div class="qz-topbar__right" style="${ssrRenderStyle({ flex: __props.phase === "question" ? 1 : 0, justifyContent: "flex-end" })}">`);
      if (__props.phase === "question") {
        _push(`<div style="${ssrRenderStyle({ flex: 1, display: "flex", alignItems: "center", gap: "12px", maxWidth: "520px", marginRight: "12px" })}"><span class="qz-q-num" style="${ssrRenderStyle({ whiteSpace: "nowrap" })}">${ssrInterpolate(pad(__props.current + 1))} / ${ssrInterpolate(pad(__props.total))}</span><div class="qz-progress"${ssrRenderAttr("aria-label", `Soru ${__props.current + 1} / ${__props.total}`)}><!--[-->`);
        ssrRenderList(__props.total, (i) => {
          _push(`<div class="${ssrRenderClass(["qz-progress__seg", i - 1 < __props.current ? "fill" : "", i - 1 === __props.current ? "cur" : ""])}"></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="qz-iconbtn"${ssrRenderAttr("aria-label", __props.soundOn ? "Sesi kapat" : "Sesi aç")}${ssrRenderAttr("title", __props.soundOn ? "Sesi kapat" : "Sesi aç")}>`);
      _push(ssrRenderComponent(_sfc_main$7, {
        name: __props.soundOn ? "sound-on" : "sound-off",
        size: 20
      }, null, _parent));
      _push(`</button>`);
      if (__props.phase !== "start") {
        _push(`<button class="qz-iconbtn" aria-label="Baştan başla" title="Baştan başla">`);
        _push(ssrRenderComponent(_sfc_main$7, {
          name: "refresh",
          size: 20
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Quiz/QuizTopBar.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "QuizPosterArt",
  __ssrInlineRender: true,
  props: {
    bg: { type: String, default: "#161410" },
    accent: { type: String, default: "#E73626" },
    text: { type: String, default: "#FFE9B3" },
    name: { type: String, default: "" },
    year: { type: [String, Number], default: "" },
    director: { type: String, default: "" },
    tagline: { type: String, default: "" },
    big: { type: Boolean, default: false },
    filmStrip: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const grainId = "grain-" + (props.name || "").replace(/\s/g, "");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        style: { position: "absolute", inset: 0, background: __props.bg, color: __props.text }
      }, _attrs))}><svg width="100%" height="100%" viewBox="0 0 100 150" preserveAspectRatio="none" style="${ssrRenderStyle({ "position": "absolute", "inset": "0", "opacity": "0.5", "mix-blend-mode": "multiply" })}"><defs><pattern${ssrRenderAttr("id", grainId)} width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.6"${ssrRenderAttr("fill", __props.accent)} opacity="0.4"></circle></pattern></defs><rect width="100" height="150"${ssrRenderAttr("fill", `url(#${grainId})`)}></rect><circle cx="80" cy="35" r="20"${ssrRenderAttr("fill", __props.accent)} opacity="0.35"></circle><path d="M0 100 Q50 80 100 100 L100 150 L0 150 Z"${ssrRenderAttr("fill", __props.accent)} opacity="0.25"></path></svg><div class="${ssrRenderClass(["qz-poster-art", __props.filmStrip ? "qz-film-strip" : ""])}" style="${ssrRenderStyle({ color: __props.text })}"><div><div style="${ssrRenderStyle({ fontFamily: "var(--qz-mono)", fontSize: __props.big ? "11px" : "10px", letterSpacing: ".18em", opacity: 0.85 })}"> BENİZLEDİM · QUIZ </div>`);
      if (__props.tagline && __props.big) {
        _push(`<div class="qz-pa-tag" style="${ssrRenderStyle({ "margin-top": "6px" })}">&quot;${ssrInterpolate(__props.tagline)}&quot;</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><div class="qz-pa-name" style="${ssrRenderStyle({ fontSize: __props.big ? "clamp(34px, 4.4vw, 64px)" : "clamp(20px,3vw,30px)" })}">${ssrInterpolate(__props.name)}</div><div class="qz-pa-meta" style="${ssrRenderStyle({ "margin-top": "8px" })}"><span>${ssrInterpolate(__props.year)}</span><span>${ssrInterpolate(__props.director)}</span></div></div></div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Quiz/QuizPosterArt.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "qz-marquee" }, _attrs))}><div class="qz-marquee__track"><!--[-->`);
  ssrRenderList(2, (n) => {
    _push(`<span>`);
    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    _push(`</span>`);
  });
  _push(`<!--]--></div></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Quiz/QuizMarquee.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const QuizMarquee = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$3 = {
  __name: "QuizStart",
  __ssrInlineRender: true,
  props: {
    totalQuestions: { type: Number, default: 25 },
    totalCharacters: { type: Number, default: 60 },
    characters: { type: Array, default: () => [] }
  },
  emits: ["start"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const posters = [
      { name: "WALTER", year: "2008", director: "Gilligan", bg: "#161410", accent: "#1ec46a", text: "#FFE9B3", tag: "Say my name" },
      { name: "AMÉLIE", year: "2001", director: "Jeunet", bg: "#C8102E", accent: "#0E5C2F", text: "#FFE7B0", tag: "Le Fabuleux Destin" },
      { name: "DAENERYS", year: "2011", director: "Benioff", bg: "#161410", accent: "#E73626", text: "#FFE9B3", tag: "Fire and Blood" },
      { name: "JACK", year: "2003", director: "Verbinski", bg: "#1F6E8C", accent: "#F5C518", text: "#FFE9B3", tag: "Freedom" }
    ];
    const steps = [
      { n: "01", t: "Cevapla", d: "Metin, görsel, this-or-that ve slider — karışık format." },
      { n: "02", t: "Eşleş", d: `Cevapların ${props.totalCharacters} karaktere ağırlıklı olarak puan dağıtır.` },
      { n: "03", t: "Keşfet", d: "Sonucunda film önerileri ve repliklerle çıkıyorsun." }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="qz-start qz-fade-in"><div class="qz-start__copy"><div class="qz-row" style="${ssrRenderStyle({ "margin-bottom": "6px" })}"><span class="qz-sticker" style="${ssrRenderStyle({ background: "var(--qz-green)", color: "#fff" })}">● CANLI</span><span class="qz-sticker">VHS · Ed. 03</span><span class="qz-kicker">${ssrInterpolate(__props.totalQuestions)} SORU · ~5 DK</span></div><h1 class="qz-display qz-chroma"> Hangi <em>film</em><br>karakterisin? </h1><p class="qz-lede">${ssrInterpolate(__props.totalQuestions)} soru, ${ssrInterpolate(__props.totalCharacters)} olası karakter. Cevap verirken kimseye danışma — içgüdün hangi sahnede, orada karakterin saklı. </p><div class="qz-start__cta"><button class="qz-btn">`);
      _push(ssrRenderComponent(_sfc_main$7, {
        name: "play",
        size: 22
      }, null, _parent));
      _push(` Quiz&#39;e başla </button></div><div class="qz-start__how"><!--[-->`);
      ssrRenderList(steps, (s) => {
        _push(`<div class="qz-card-hard" style="${ssrRenderStyle({ "padding": "16px" })}"><div class="qz-kicker" style="${ssrRenderStyle({ "margin-bottom": "8px" })}">ADIM ${ssrInterpolate(s.n)}</div><div style="${ssrRenderStyle({ fontFamily: "var(--qz-display)", fontSize: "22px", textTransform: "uppercase", lineHeight: 1, marginBottom: "6px" })}">${ssrInterpolate(s.t)}</div><div style="${ssrRenderStyle({ fontSize: "14px", lineHeight: 1.4, color: "var(--qz-ink-soft)" })}">${ssrInterpolate(s.d)}</div></div>`);
      });
      _push(`<!--]--></div></div><div class="qz-poster-stack"><span class="qz-sticker qz-float-sticker s-2">YENİ</span><span class="qz-sticker qz-float-sticker s-3">★ ED. PİCK</span><span class="qz-sticker qz-float-sticker s-4">VHS</span><!--[-->`);
      ssrRenderList(posters, (p, i) => {
        _push(`<div class="qz-poster-stack__item">`);
        _push(ssrRenderComponent(_sfc_main$5, {
          name: p.name,
          year: p.year,
          director: p.director,
          tagline: p.tag,
          bg: p.bg,
          accent: p.accent,
          text: p.text
        }, null, _parent));
        _push(`<div class="qz-tape" style="${ssrRenderStyle({ top: "12px", left: "14px" })}"></div></div>`);
      });
      _push(`<!--]--></div></div>`);
      _push(ssrRenderComponent(QuizMarquee, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(__props.characters, (c) => {
              _push2(`<!--[--><span${_scopeId}>${ssrInterpolate(c.symbol || "★")}</span><span${_scopeId}>${ssrInterpolate(c.name.toUpperCase())}</span><!--]-->`);
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(__props.characters, (c) => {
                return openBlock(), createBlock(Fragment, {
                  key: c.id
                }, [
                  createVNode("span", null, toDisplayString(c.symbol || "★"), 1),
                  createVNode("span", null, toDisplayString(c.name.toUpperCase()), 1)
                ], 64);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Quiz/QuizStart.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "QuizQuestion",
  __ssrInlineRender: true,
  props: {
    question: { type: Object, required: true },
    questionIndex: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    picked: { type: [Number, null], default: null },
    format: { type: String, default: "text" },
    isLast: { type: Boolean, default: false },
    canPrev: { type: Boolean, default: false },
    canNext: { type: Boolean, default: false }
  },
  emits: ["pick", "prev", "next", "tapFeedback"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const letters = ["A", "B", "C", "D", "E", "F"];
    const formatLabel = computed(() => {
      const map = { text: "metin", cards: "görsel kart", vs: "this or that", slider: "kaydır" };
      return map[props.format] || "metin";
    });
    const sliderValue = ref(50);
    const sliderReadout = computed(() => {
      const v = sliderValue.value;
      if (v < 15) return "Kesinlikle sol";
      if (v < 35) return "Sola yakın";
      if (v < 55) return "Ortada bir yerde";
      if (v < 75) return "Sağa yakın";
      if (v < 90) return "Sağ tarafta";
      return "Kesinlikle sağ";
    });
    watch(() => props.picked, (val) => {
      if (props.format === "slider" && val != null) {
        sliderValue.value = val;
      }
    });
    const cardColors = [
      { bg: "#FF7AB6", accent: "#1B43FF" },
      { bg: "#161410", accent: "#F5C518" },
      { bg: "#6E8B3D", accent: "#FAEBC8" },
      { bg: "#E73626", accent: "#161410" }
    ];
    function pad(n) {
      return String(n).padStart(2, "0");
    }
    const cardImageUrl = (optIdx) => {
      const qid = props.question?.id;
      const oid = props.question?.options?.[optIdx]?.id;
      if (!qid || !oid) return null;
      return `/images/quiz/cards/${qid}_${oid}.webp`;
    };
    const vsImageUrl = (optIdx) => {
      const qid = props.question?.id;
      const oid = props.question?.options?.[optIdx]?.id;
      if (!qid || !oid) return null;
      return `/images/quiz/vs/${qid}_${oid}.webp`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "qz-stage qz-fade-in",
        key: __props.questionIndex
      }, _attrs))}><div class="qz-kicker" style="${ssrRenderStyle({ "margin-bottom": "8px" })}"> Soru ${ssrInterpolate(pad(__props.questionIndex + 1))} / ${ssrInterpolate(pad(__props.totalQuestions))} · ${ssrInterpolate(formatLabel.value)}</div><h2 class="qz-q-text">${ssrInterpolate(__props.question.text_tr)}</h2>`);
      if (__props.format === "text") {
        _push(`<div class="qz-answers-text"><!--[-->`);
        ssrRenderList(__props.question.options, (opt, i) => {
          _push(`<button class="${ssrRenderClass(["qz-answer-text", __props.picked === i ? "is-picked" : ""])}"><span class="qz-a-letter">${ssrInterpolate(letters[i])}</span><span style="${ssrRenderStyle({ "flex": "1" })}">${ssrInterpolate(opt.text_tr)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else if (__props.format === "cards") {
        _push(`<div class="qz-answers-cards"><!--[-->`);
        ssrRenderList(__props.question.options, (opt, i) => {
          _push(`<button class="${ssrRenderClass(["qz-answer-card", __props.picked === i ? "is-picked" : ""])}"><div class="qz-acard-art" style="${ssrRenderStyle({ background: cardColors[i % cardColors.length].bg })}">`);
          if (cardImageUrl(i)) {
            _push(`<img${ssrRenderAttr("src", cardImageUrl(i))}${ssrRenderAttr("alt", opt.text_tr)} class="qz-acard-img" loading="lazy">`);
          } else {
            _push(`<!---->`);
          }
          _push(`<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="${ssrRenderStyle({ "position": "absolute", "inset": "0", "pointer-events": "none" })}"><circle cx="50" cy="50" r="22"${ssrRenderAttr("fill", cardColors[i % cardColors.length].accent)} opacity=".15"></circle></svg></div><div class="qz-acard-cap"><span>${ssrInterpolate(opt.text_tr)}</span><small>Seçenek ${ssrInterpolate(letters[i])}</small></div></button>`);
        });
        _push(`<!--]--></div>`);
      } else if (__props.format === "vs") {
        _push(`<div class="qz-answers-vs"><!--[-->`);
        ssrRenderList(__props.question.options.slice(0, 2), (opt, i) => {
          _push(`<div class="${ssrRenderClass(["qz-vs-side", __props.picked === i ? "is-picked" : ""])}">`);
          if (vsImageUrl(i)) {
            _push(`<img${ssrRenderAttr("src", vsImageUrl(i))}${ssrRenderAttr("alt", opt.text_tr)} class="qz-vs-img" loading="lazy">`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="qz-vs-text"><div style="${ssrRenderStyle({ fontFamily: "var(--qz-display)", fontSize: "24px", textTransform: "uppercase", lineHeight: 1.1 })}">${ssrInterpolate(opt.text_tr)}</div><small>Seçenek ${ssrInterpolate(letters[i])}</small></div></div>`);
        });
        _push(`<!--]--><div class="qz-vs-divider">VS</div></div>`);
      } else if (__props.format === "slider") {
        _push(`<div class="qz-answers-slider"><div class="qz-slider-readout">${ssrInterpolate(sliderReadout.value)}</div><div class="qz-slider-track-wrap"><div class="qz-slider-track"></div><input type="range" min="0" max="100" step="1"${ssrRenderAttr("value", sliderValue.value)} class="qz-slider-input"></div><div class="qz-slider-labels"><span>${ssrInterpolate(__props.question.options[0]?.text_tr || "Sol")}</span><span>${ssrInterpolate(__props.question.options[__props.question.options.length - 1]?.text_tr || "Sağ")}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="qz-qfooter"><button class="qz-iconbtn" aria-label="Önceki"${ssrIncludeBooleanAttr(!__props.canPrev) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(_sfc_main$7, {
        name: "arrow-left",
        size: 22
      }, null, _parent));
      _push(`</button><div class="qz-qfooter__hint">`);
      if (__props.picked == null) {
        _push(`<!--[-->Bir cevap seç →<!--]-->`);
      } else if (__props.isLast) {
        _push(`<!--[-->Sonucu görmek için ileri →<!--]-->`);
      } else {
        _push(`<!--[-->Otomatik ilerliyor — yine de geri dönebilirsin<!--]-->`);
      }
      _push(`</div><button class="qz-btn qz-btn--pink" style="${ssrRenderStyle({ fontSize: "16px", padding: "12px 22px" })}"${ssrIncludeBooleanAttr(__props.picked == null) ? " disabled" : ""}>${ssrInterpolate(__props.isLast ? "Sonucu gör" : "İleri")} `);
      _push(ssrRenderComponent(_sfc_main$7, {
        name: "arrow-right",
        size: 20
      }, null, _parent));
      _push(`</button></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Quiz/QuizQuestion.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "QuizResult",
  __ssrInlineRender: true,
  props: {
    result: { type: Object, required: true }
  },
  emits: ["restart", "tapFeedback"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const revealed = ref(false);
    const loadPct = ref(Math.floor(Math.random() * 30 + 60));
    onMounted(() => {
      const t = setTimeout(() => {
        revealed.value = true;
      }, 950);
      return () => clearTimeout(t);
    });
    const character = computed(() => props.result.character);
    const charImageUrl = computed(() => `/images/quiz/characters/${character.value.id}.webp`);
    const imgFailed = ref(false);
    const posterConfig = computed(() => {
      const palettes = [
        { bg: "#161410", accent: "#E73626", text: "#FFE9B3" },
        { bg: "#C8102E", accent: "#0E5C2F", text: "#FFE7B0" },
        { bg: "#1F6E8C", accent: "#F5C518", text: "#FFE9B3" },
        { bg: "#1B43FF", accent: "#FFD23F", text: "#FFE9B3" },
        { bg: "#6E8B3D", accent: "#FAEBC8", text: "#161410" }
      ];
      const hash = (character.value.name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      return palettes[hash % palettes.length];
    });
    const filmPalettes = [
      { bg: "#FF7AB6", accent: "#1B43FF" },
      { bg: "#1B43FF", accent: "#FFD23F" },
      { bg: "#161410", accent: "#E73626" },
      { bg: "#1F6E8C", accent: "#FFE9B3" },
      { bg: "#E73626", accent: "#161410" }
    ];
    const distColors = [
      "var(--qz-pink)",
      "var(--qz-blue)",
      "var(--qz-green)",
      "var(--qz-lilac)",
      "var(--qz-yellow)",
      "var(--qz-red)",
      "var(--qz-ink)",
      "var(--qz-ink-soft)",
      "var(--qz-pink)",
      "var(--qz-blue)"
    ];
    const recommendedFilms = computed(() => {
      const c = character.value;
      const films = [];
      if (c.work) {
        films.push({ title: c.work, year: c.year, dir: "" });
      }
      const similar = props.result.similar || [];
      similar.forEach((s) => {
        if (s.work && !films.find((f) => f.title === s.work)) {
          films.push({ title: s.work, year: s.year, dir: "" });
        }
      });
      return films.slice(0, 5);
    });
    computed(
      () => `Ben bir ${character.value.name}'ım! Hangi film karakterisin? Sen de dene → benizledim.com/quiz`
    );
    function pad(n) {
      return String(n).padStart(2, "0");
    }
    const TRAIT_COPY = {
      leadership: {
        high: "Sahnede sen varsan, plan da sende olur. İnsanlar nereye gideceklerini sana bakarak öğrenir.",
        low: "Yönetmek senin oyunun değil — sen kendi yolunu çiziyorsun, başkalarını sürüklemek istemiyorsun.",
        verb: "Yönlendirme"
      },
      logic: {
        high: "Önce kafanda kurarsın, sonra söze dökersin. Karmaşık şeyleri sade hale getirmek senin doğan.",
        low: "Sen analizden çok sezgiyle hareket ediyorsun. Her şeyi tablolaştırmak hayatı sıkıcı kılar diye düşünüyorsun.",
        verb: "Mantık"
      },
      empathy: {
        high: "Karşındaki söylemeden anlıyorsun. Bu seni güvenli liman yapıyor — ama bazen başkasının yükünü çok taşıyorsun.",
        low: "Empatin selektif: hak edene açık, klişeye değil. Acıma değil anlama tarzındasın.",
        verb: "Empati"
      },
      ambition: {
        high: "Hedef görürsen rahat duramıyorsun. Konfor sana enerji değil, durgunluk veriyor.",
        low: "Yarış senin oyunun değil. Mutluluğu hedefte değil, anın içinde arıyorsun.",
        verb: "Hırs"
      },
      risk: {
        high: "Belirsizliği sevmiyorsun, koklayarak gidiyorsun. Riski hesapladığında atlamaktan çekinmiyorsun.",
        low: "Önce zemini kontrol edersin, sonra adım atarsın. Sürpriz pek senin tarzın değil.",
        verb: "Risk"
      },
      integrity: {
        high: "Söz verirsen yapıyorsun, yalanı görürsen geri çekilmiyorsun. Bu seni az ama derin ilişki sahibi yapıyor.",
        low: 'İlkelerinde esneksin — bağlam senin için kuraldan önemli. "Duruma göre" sözü senin için klişe değil, prensip.',
        verb: "İlkesellik"
      },
      loyalty: {
        high: "Bir defa girdiğin çekmeceden çıkmıyorsun. Senin kaybedişlerin de, sevdiklerin de uzun.",
        low: "Sadakatini hak etmek lazım. Otomatik bağlanmak senin tarzın değil; insan değişirse sen de değişirsin.",
        verb: "Sadakat"
      },
      independence: {
        high: "Tek başınalık seni yormuyor, tam tersi şarj ediyor. Birinin onayını beklemek seni boğuyor.",
        low: "Yalnız iyi değilsin — paylaşmak senin için lüks değil, ihtiyaç. Ekipte daha hızlısın.",
        verb: "Bağımsızlık"
      },
      sociability: {
        high: "Kalabalık seni şarj ediyor. Tanıştığın insanları hatırlıyor, yeni bağlar kurmakta hızlısın.",
        low: "Az ama derin — tarzın bu. Yapay sohbet yerine sessizlik tercih edersin.",
        verb: "Sosyallik"
      },
      humor: {
        high: "Mizah senin için kalkan değil; zekânın doğal hali. En zor sahnede bile bir cümlelik şaka çıkarabilirsin.",
        low: "Espri yapmaktan çok izlemekten zevk alıyorsun. Ciddiyetinin altında hassas bir kalp var.",
        verb: "Mizah"
      },
      creativity: {
        high: 'Standart çözümler seni sıkıyor. Beynin sürekli "ya şöyle olsa" diye soruyor.',
        low: "Çark çalışıyor mu, dokunma; senin tarzın bu. Yenilik için yenilik istemiyorsun.",
        verb: "Yaratıcılık"
      },
      resilience: {
        high: 'Dibine vursan toparlıyorsun. Senin "tamam" demen başkasının "henüz başlıyorum" demesi gibi.',
        low: "Darbeleri içine atıyorsun ama atlatmak zaman alıyor. İyileşmek için sessizliğe ihtiyacın var.",
        verb: "Dayanıklılık"
      },
      control: {
        high: "Plan, takvim, liste — bunlar seni rahatlatıyor. Belirsizliği azaltmak için her zaman bir tedbir alırsın.",
        low: "Akış senin için pusula. Çok planlamak yaratıcılığını kısıtladığını biliyorsun.",
        verb: "Kontrol"
      },
      sensitivity: {
        high: "Detayları, tonu, bakışı yakalıyorsun. Bu hem sanatına hem yorgunluğuna yansıyor.",
        low: "Sen frekansı düşük tutuyorsun — duygulara değil mantığa odaklanıyorsun. Bu seni krizde sabit tutuyor.",
        verb: "Hassasiyet"
      }
    };
    const superpower = computed(() => {
      const top = props.result.topTraits[0];
      const second = props.result.topTraits[1];
      if (!top) return null;
      const tCopy = TRAIT_COPY[top.key];
      const sCopy = second ? TRAIT_COPY[second.key] : null;
      return {
        title: tCopy?.verb || top.label,
        body: tCopy?.high || "",
        combo: sCopy ? `${tCopy?.verb || top.label} × ${sCopy?.verb || second.label}` : null
      };
    });
    const shadowSide = computed(() => {
      const bottom = (props.result.bottomTraits || [])[0];
      if (!bottom) return null;
      const tCopy = TRAIT_COPY[bottom.key];
      return {
        title: tCopy?.verb || bottom.label,
        body: tCopy?.low || "",
        value: bottom.value
      };
    });
    const shineMoments = computed(() => {
      const u = props.result.userTraits || {};
      const out = [];
      if ((u.leadership ?? 5) >= 7) out.push("Karar verilmesi gereken zor bir toplantıda — sana güveniyorlar.");
      if ((u.logic ?? 5) >= 7) out.push("Karmaşık bir problemi parçalara ayırırken — gözlerin parlıyor.");
      if ((u.empathy ?? 5) >= 7) out.push("Bir arkadaşın seni zor gününde araması — sözleri sende yer buluyor.");
      if ((u.creativity ?? 5) >= 7) out.push("Hiç kimsenin düşünmediği çözümün senden çıktığı an.");
      if ((u.humor ?? 5) >= 7) out.push("Tansiyonun yüksek olduğu bir ortamı bir cümleyle gevşettiğinde.");
      if ((u.resilience ?? 5) >= 7) out.push('Herkes pes ettiğinde seni "ayakta nasıl duruyor" diye izleyenlerin gözünde.');
      if ((u.independence ?? 5) >= 7) out.push("Tek başına bir şeyi sıfırdan kurduğunda — kimseye sormadın, oldu.");
      return out.slice(0, 4);
    });
    const struggleMoments = computed(() => {
      const u = props.result.userTraits || {};
      const out = [];
      if ((u.sociability ?? 5) <= 4) out.push("Tanımadığın insanlarla zorunlu small talk yaparken.");
      if ((u.control ?? 5) >= 7) out.push("Plan dışı bir şey çıktığında — esnekleşmek için bir an gerekiyor.");
      if ((u.humor ?? 5) <= 4) out.push("Klişe esprilere doğal tepki veremediğinde.");
      if ((u.empathy ?? 5) <= 4) out.push('Birinin "anlamak değil sadece dinle" istediğini fark ettiğinde.');
      if ((u.risk ?? 5) <= 4) out.push("Hesapsız bir karar vermen gerektiğinde — beynin durmuyor.");
      if ((u.resilience ?? 5) <= 4) out.push("Üst üste gelen darbelerden sonra toparlanma süren uzadığında.");
      if ((u.independence ?? 5) <= 4) out.push("Uzun süre yalnız çalışmak zorunda kaldığında — sosyal pile ihtiyacın var.");
      if ((u.leadership ?? 5) <= 4) out.push("Kimse karar vermiyorsa ve sıra sana geliyorsa.");
      return out.slice(0, 3);
    });
    const relationshipText = computed(() => {
      const score = props.result.profile?.relationships ?? 20;
      if (score >= 30) return "İlişkilerinde derin ve sıcaksın. İnsanlar seninle kendilerini güvende hissediyor; ama bazen başkasının duygusal yükünü taşımaktan yoruluyorsun. Sınır koymak öğrenilesi bir kas senin için.";
      if (score >= 22) return "İlişkilerinde dengeli; yakın ama mesafeli durabilen biri. Az ama gerçek bağ kurmayı seçiyorsun. Yapay yakınlık seni rahatsız ediyor.";
      return "İlişkilerinde özgürlük öncelik. Birine bağlanırken kendini kaybetmemek senin için kritik. Bu seni soğuk değil, kendine sadık yapıyor.";
    });
    const careerText = computed(() => {
      const score = props.result.profile?.career ?? 20;
      if (score >= 32) return 'Kariyerde rotada giden tipsin. Hedef belirleyip ona kilitlenmen kolay; "ne istediğini bilmek" senin avantajın. Risk: tükenmişlik. Mola da bir strateji.';
      if (score >= 24) return "Kariyerde ne çok yarışçı ne de pasif — kendi temponla ilerliyorsun. Ölçüsünü kendin koyuyorsun, dış başarı kriterleri seni o kadar etkilemiyor.";
      return 'Kariyer senin için bir öncelik değil, anlam senin için öncelik. Klasik başarı çizelgesi yerine "kendine yakın hissettiğin iş" peşindesin.';
    });
    const stressText = computed(() => {
      const u = props.result.userTraits || {};
      if ((u.humor ?? 5) >= 7) return "Stres anında mizaha kaçıyorsun — kendinle dalga geçmek senin sigortan. Bu sağlıklı bir kas, ama bazen hissi de çağırmayı dene.";
      if ((u.resilience ?? 5) >= 7) return 'Stres seni kolay yıkmıyor. Ama "yıkılmamak" hissetmemekle aynı şey değil — toparlanma süreni de hak ediyorsun.';
      if ((u.control ?? 5) >= 7) return "Stres anında plan yaparak rahatlıyorsun. Listeler, tablolar, takvimler senin nefesin. Belirsizlikle barışmak öğrenilesi.";
      return "Stres anında içine çekiliyor, sessizliği seçiyorsun. Bu senin işleme tarzın; ama yalnızlık çok uzarsa konuşacak biri lazım.";
    });
    const weekTip = computed(() => {
      const u = props.result.userTraits || {};
      const tips = [];
      if ((u.creativity ?? 5) >= 7) tips.push("Bu hafta hiç planlamadığın bir film aç. Yorum okumadan bitir, sonra hissini yaz.");
      if ((u.empathy ?? 5) >= 7) tips.push('Bir yakınına "sadece dinlemek istedim" diye mesaj at. Cevap bekleme.');
      if ((u.control ?? 5) >= 7) tips.push('Bu hafta tek bir günü "plansız" geçir. Gerilimi yeniden gözlemle.');
      if ((u.humor ?? 5) >= 7) tips.push("En sevdiğin komedi karakterini izle — kendini görüyor olabilirsin.");
      if ((u.independence ?? 5) >= 7) tips.push("Bu hafta birinden küçük bir şey iste. Yardım kabul etmek de bir kas.");
      if ((u.sensitivity ?? 5) >= 7) tips.push("Hissettiğini hemen yazmaya çalışma. 24 saat bekle, sonra bak.");
      return tips.length ? tips[0] : "Bu hafta hiç tanışmadığın bir yönetmenin filmiyle başla. Yeni bir frekans dene.";
    });
    const tagLabels = {
      pratik_zeka: "Pratik zekâ",
      dayanıklılık: "Dayanıklılık",
      mizah: "Mizah",
      problem_cozucu: "Problem çözücü",
      lider: "Lider",
      karizma: "Karizma",
      cesaret: "Cesaret",
      zekâ: "Zekâ",
      analitik: "Analitik",
      duygusal: "Duygusal",
      yaratıcı: "Yaratıcı",
      bağımsız: "Bağımsız",
      sadık: "Sadık",
      empatik: "Empatik",
      karanlık: "Karanlık",
      vizyoner: "Vizyoner",
      direngen: "Dirençli",
      sosyal: "Sosyal",
      melankolik: "Melankolik"
    };
    const characterTags = computed(() => {
      return (character.value.tags || []).map((t) => tagLabels[t] || t.replace(/_/g, " "));
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (!revealed.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "qz-stage",
          style: { "text-align": "center", "padding-top": "80px" }
        }, _attrs))}><div class="qz-kicker qz-glitch-in">// VHS · OYNATILIYOR //</div><div class="qz-display qz-chroma-strong" style="${ssrRenderStyle({
          fontSize: "clamp(56px, 12vw, 140px)",
          margin: "20px auto",
          animation: "qz-glitchin .9s steps(8, end) infinite alternate"
        })}"> KARAKTER<br>ARANIYOR… </div><div style="${ssrRenderStyle({
          display: "inline-block",
          background: "var(--qz-ink)",
          color: "var(--qz-paper)",
          padding: "10px 18px",
          border: "2px solid var(--qz-ink)",
          fontFamily: "var(--qz-mono)",
          letterSpacing: ".18em"
        })}"> ░░░░░ %${ssrInterpolate(loadPct.value)} ░░░░░ </div></div>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "qz-result qz-fade-in" }, _attrs))}><div class="qz-result__hero"><div class="qz-result__poster">`);
        if (!imgFailed.value) {
          _push(`<img${ssrRenderAttr("src", charImageUrl.value)}${ssrRenderAttr("alt", character.value.name)} class="qz-result__img">`);
        } else {
          _push(ssrRenderComponent(_sfc_main$5, {
            name: character.value.name.split(" ")[0].toUpperCase(),
            year: String(character.value.year || ""),
            director: "",
            tagline: character.value.result_archetype_tr || "",
            bg: posterConfig.value.bg,
            accent: posterConfig.value.accent,
            text: posterConfig.value.text,
            big: true,
            "film-strip": true
          }, null, _parent));
        }
        _push(`<div class="qz-tape" style="${ssrRenderStyle({ top: "16px", left: "22px" })}"></div><div class="qz-tape" style="${ssrRenderStyle({ bottom: "24px", right: "18px", transform: "rotate(7deg)" })}"></div></div><div class="qz-result__copy"><h2>SEN BİR…</h2><h1 class="qz-display qz-chroma">${ssrInterpolate(character.value.name)}</h1><div class="qz-row" style="${ssrRenderStyle({ gap: "10px", marginBottom: "4px" })}"><span class="qz-result__match"> %${ssrInterpolate(__props.result.matchPct)} <small style="${ssrRenderStyle({ marginLeft: "8px" })}">EŞLEŞME</small></span><span class="qz-sticker" style="${ssrRenderStyle({ background: "var(--qz-paper)" })}">${ssrInterpolate(character.value.work)} · ${ssrInterpolate(character.value.year)}</span></div>`);
        if (character.value.result_archetype_tr) {
          _push(`<div class="qz-sticker" style="${ssrRenderStyle({ background: "var(--qz-lilac)", marginBottom: "12px" })}">${ssrInterpolate(character.value.result_archetype_tr)}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (character.value.summary_tr) {
          _push(`<div class="qz-result__quote"> &quot;${ssrInterpolate(character.value.summary_tr)}&quot; </div>`);
        } else {
          _push(`<!---->`);
        }
        if (character.value.result_blurb_tr) {
          _push(`<p class="qz-result__bio">${ssrInterpolate(character.value.result_blurb_tr)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (characterTags.value.length) {
          _push(`<div class="qz-row" style="${ssrRenderStyle({ gap: "6px", flexWrap: "wrap", marginTop: "10px" })}"><!--[-->`);
          ssrRenderList(characterTags.value, (tag) => {
            _push(`<span class="qz-sticker" style="${ssrRenderStyle({ background: "var(--qz-paper)", fontSize: "11px", padding: "4px 10px" })}"> #${ssrInterpolate(tag)}</span>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.result.profile?.mbti) {
          _push(`<div class="qz-kicker" style="${ssrRenderStyle({ marginTop: "14px", fontFamily: "var(--qz-mono)", color: "var(--qz-ink-soft)" })}"> MBTI ipucu: <b style="${ssrRenderStyle({ color: "var(--qz-ink)" })}">${ssrInterpolate(__props.result.profile.mbti)}</b></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="qz-share-row" style="${ssrRenderStyle({ marginTop: "14px" })}"><button class="qz-btn qz-btn--ghost">`);
        _push(ssrRenderComponent(_sfc_main$7, {
          name: "link",
          size: 18
        }, null, _parent));
        _push(` Linki kopyala </button><button class="qz-btn qz-btn--ghost">`);
        _push(ssrRenderComponent(_sfc_main$7, {
          name: "twitter",
          size: 18
        }, null, _parent));
        _push(` Paylaş </button></div></div></div>`);
        if (character.value.famous_quote_tr) {
          _push(`<div class="qz-section qz-quote-feature"><div class="qz-kicker">// ${ssrInterpolate(character.value.name.toUpperCase())} DİYOR Kİ //</div><blockquote class="qz-quote-big"><span class="qz-quote-mark">&quot;</span>${ssrInterpolate(character.value.famous_quote_tr)}<span class="qz-quote-mark">&quot;</span></blockquote><div class="qz-kicker" style="${ssrRenderStyle({ color: "var(--qz-ink-soft)", textAlign: "right" })}"> — ${ssrInterpolate(character.value.work)} (${ssrInterpolate(character.value.year)}) </div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (character.value.if_you_are_tr) {
          _push(`<div class="qz-section qz-section--narrative"><div class="qz-kicker">// SEN VE BU KARAKTER //</div><p class="qz-narrative-body">${ssrInterpolate(character.value.if_you_are_tr)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="qz-section"><h3>Karakterin haritası</h3><div class="qz-kicker" style="${ssrRenderStyle({ marginBottom: "18px" })}">${ssrInterpolate(character.value.name)} hangi köklerden besleniyor — neyin altında ezilebiliyor? </div><div class="qz-map-grid">`);
        if (character.value.depth_tr) {
          _push(`<div class="qz-map-card qz-map-card--depth"><div class="qz-map-label">DERİNLİK · KÖKLERİ</div><p>${ssrInterpolate(character.value.depth_tr)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (character.value.shadow_tr) {
          _push(`<div class="qz-map-card qz-map-card--shadow"><div class="qz-map-label">GÖRMEDİĞİ KARANLIK</div><p>${ssrInterpolate(character.value.shadow_tr)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (character.value.challenge_tr) {
          _push(`<div class="qz-map-card qz-map-card--challenge"><div class="qz-map-label">EN ZORLANDIĞI YER</div><p>${ssrInterpolate(character.value.challenge_tr)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (character.value.growth_arc_tr) {
          _push(`<div class="qz-map-card qz-map-card--growth"><div class="qz-map-label">İÇ YOLCULUĞU</div><p>${ssrInterpolate(character.value.growth_arc_tr)}</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (character.value.as_friend_tr || character.value.as_partner_tr) {
          _push(`<div class="qz-section qz-twocol">`);
          if (character.value.as_friend_tr) {
            _push(`<div class="qz-rel-card"><div class="qz-rel-icon" style="${ssrRenderStyle({ background: "var(--qz-yellow)" })}">★</div><div class="qz-rel-title">ARKADAŞ OLARAK</div><p>${ssrInterpolate(character.value.as_friend_tr)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (character.value.as_partner_tr) {
            _push(`<div class="qz-rel-card"><div class="qz-rel-icon" style="${ssrRenderStyle({ background: "var(--qz-pink)" })}">♥</div><div class="qz-rel-title">PARTNER OLARAK</div><p>${ssrInterpolate(character.value.as_partner_tr)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (character.value.career_dna_tr) {
          _push(`<div class="qz-section"><h3>Bugün yaşasaydı…</h3><div class="qz-kicker" style="${ssrRenderStyle({ marginBottom: "14px" })}"> Karakterin DNA&#39;sı modern bir ofiste / serbest hayatta nasıl çalışırdı — </div><div class="qz-modern-card"><p>${ssrInterpolate(character.value.career_dna_tr)}</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (superpower.value) {
          _push(`<div class="qz-section qz-twocol"><div class="qz-card-feature qz-card-feature--bright"><div class="qz-kicker">// SÜPER GÜCÜN //</div><h2 class="qz-display qz-chroma" style="${ssrRenderStyle({ fontSize: "clamp(38px, 5vw, 64px)", lineHeight: "0.9", margin: "8px 0 12px" })}">${ssrInterpolate(superpower.value.title)}</h2><p class="qz-feature-body">${ssrInterpolate(superpower.value.body)}</p>`);
          if (superpower.value.combo) {
            _push(`<div class="qz-sticker" style="${ssrRenderStyle({ background: "var(--qz-yellow)", marginTop: "14px" })}"> KOMBO · ${ssrInterpolate(superpower.value.combo)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (shadowSide.value) {
            _push(`<div class="qz-card-feature qz-card-feature--dark"><div class="qz-kicker" style="${ssrRenderStyle({ color: "var(--qz-paper)" })}">// KARANLIK TARAFIN //</div><h2 class="qz-display" style="${ssrRenderStyle({ fontSize: "clamp(38px, 5vw, 64px)", lineHeight: "0.9", margin: "8px 0 12px", color: "var(--qz-paper)" })}">${ssrInterpolate(shadowSide.value.title)}</h2><p class="qz-feature-body" style="${ssrRenderStyle({ color: "var(--qz-paper)" })}">${ssrInterpolate(shadowSide.value.body)}</p><div class="qz-sticker" style="${ssrRenderStyle({ background: "var(--qz-red)", color: "var(--qz-paper)", marginTop: "14px" })}">${ssrInterpolate(shadowSide.value.value)}/10 · GELİŞİM ALANI </div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="qz-section qz-twocol">`);
        if (shineMoments.value.length) {
          _push(`<div><h3>Nasıl parlarsın?</h3><div class="qz-kicker" style="${ssrRenderStyle({ marginBottom: "14px" })}"> Bu sahnelerde sen tam kendinsin — </div><ul class="qz-list"><!--[-->`);
          ssrRenderList(shineMoments.value, (m, i) => {
            _push(`<li><span class="qz-list-num">${ssrInterpolate(pad(i + 1))}</span> ${ssrInterpolate(m)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        if (struggleMoments.value.length) {
          _push(`<div><h3>Nerede zorlanırsın?</h3><div class="qz-kicker" style="${ssrRenderStyle({ marginBottom: "14px" })}"> Bu anlarda sen biraz kendinden uzaktasın — </div><ul class="qz-list qz-list--alt"><!--[-->`);
          ssrRenderList(struggleMoments.value, (m, i) => {
            _push(`<li><span class="qz-list-num">${ssrInterpolate(pad(i + 1))}</span> ${ssrInterpolate(m)}</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="qz-section"><h3>Hayatın üç alanında sen</h3><div class="qz-kicker" style="${ssrRenderStyle({ marginBottom: "18px" })}"> İlişkilerin · Kariyerin · Stres anın </div><div class="qz-life"><div class="qz-life-card"><div class="qz-life-icon" style="${ssrRenderStyle({ background: "var(--qz-pink)" })}">♥</div><div class="qz-life-title">İlişkilerinde</div><p>${ssrInterpolate(relationshipText.value)}</p></div><div class="qz-life-card"><div class="qz-life-icon" style="${ssrRenderStyle({ background: "var(--qz-yellow)" })}">★</div><div class="qz-life-title">İş &amp; kariyerinde</div><p>${ssrInterpolate(careerText.value)}</p></div><div class="qz-life-card"><div class="qz-life-icon" style="${ssrRenderStyle({ background: "var(--qz-blue)", color: "var(--qz-paper)" })}">⚡</div><div class="qz-life-title">Stres anında</div><p>${ssrInterpolate(stressText.value)}</p></div></div></div><div class="qz-section qz-week-tip"><div class="qz-kicker">// BU HAFTA İÇİN BİR DENEY //</div><h2 class="qz-display" style="${ssrRenderStyle({ fontSize: "clamp(28px, 4vw, 44px)", margin: "10px 0" })}">${ssrInterpolate(weekTip.value)}</h2><small style="${ssrRenderStyle({ fontFamily: "var(--qz-mono)", color: "var(--qz-ink-soft)" })}"> Quiz&#39;in sana özel önerisi · 7 gün sonra kendine sor </small></div>`);
        if (__props.result.opposite) {
          _push(`<div class="qz-section qz-opposite"><div class="qz-row" style="${ssrRenderStyle({ gap: "18px", alignItems: "center", flexWrap: "wrap" })}"><img${ssrRenderAttr("src", `/images/quiz/characters/${__props.result.opposite.id}.webp`)}${ssrRenderAttr("alt", __props.result.opposite.name)} class="qz-opposite-img" loading="lazy"><div style="${ssrRenderStyle({ flex: "1 1 280px" })}"><div class="qz-kicker">// EN UZAK FREKANSIN //</div><h3 style="${ssrRenderStyle({ margin: "6px 0 8px" })}">${ssrInterpolate(__props.result.opposite.name)} senin zıt kutbun.</h3><p style="${ssrRenderStyle({ margin: 0, color: "var(--qz-ink-soft)" })}"><em>${ssrInterpolate(__props.result.opposite.work)}</em> (${ssrInterpolate(__props.result.opposite.year)}) · ${ssrInterpolate(__props.result.opposite.archetype)}. Bu karakter sana yabancı geliyor; ama tam olarak senin geliştirmediğin yanların onda var. Bir akşam onun filmini izle — kendine yabancı bir şey öğrenmek için. </p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="qz-section"><h3>İçindeki diğerleri</h3><div class="qz-kicker" style="${ssrRenderStyle({ marginBottom: "14px" })}"> Saf bir karakter yok — herkes bir karışımdır. Senin dağılımın: </div><div class="qz-dist-list"><!--[-->`);
        ssrRenderList(__props.result.distribution, (r, i) => {
          _push(`<div class="qz-dist-row"><div class="qz-dist-name"><img${ssrRenderAttr("src", `/images/quiz/characters/${r.id}.webp`)}${ssrRenderAttr("alt", r.name)} class="qz-dist-thumb" loading="lazy"> ${ssrInterpolate(r.name.split(" ")[0])}</div><div class="qz-dist-bar"><div class="qz-dist-fill" style="${ssrRenderStyle({ width: r.pct + "%", background: distColors[i % distColors.length] })}"></div></div><div class="qz-dist-pct">%${ssrInterpolate(r.pct)}</div></div>`);
        });
        _push(`<!--]--></div></div>`);
        if (__props.result.topTraits && __props.result.topTraits.length) {
          _push(`<div class="qz-section"><h3>Belirgin özelliklerin</h3><div class="qz-kicker" style="${ssrRenderStyle({ marginBottom: "14px" })}"> 14 özellik arasında en çok öne çıkanlar: </div><div class="qz-dist-list"><!--[-->`);
          ssrRenderList(__props.result.topTraits, (t) => {
            _push(`<div class="qz-dist-row"><div class="qz-dist-name">${ssrInterpolate(t.label)}</div><div class="qz-dist-bar"><div class="qz-dist-fill" style="${ssrRenderStyle({ width: t.value * 10 + "%", background: "var(--qz-pink)" })}"></div></div><div class="qz-dist-pct">${ssrInterpolate(t.value)}/10</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (recommendedFilms.value.length) {
          _push(`<div class="qz-section"><h3>Sana yakışan filmler</h3><div class="qz-kicker" style="${ssrRenderStyle({ marginBottom: "14px" })}">${ssrInterpolate(character.value.name.split(" ")[0])}&#39;ın sinematik evreninden — Benizledim listesine ekle. </div><div class="qz-films"><!--[-->`);
          ssrRenderList(recommendedFilms.value, (f, i) => {
            _push(`<div class="qz-film"><div class="qz-film__art" style="${ssrRenderStyle({ background: filmPalettes[i % filmPalettes.length].bg })}">`);
            _push(ssrRenderComponent(_sfc_main$5, {
              name: f.title.split(" ").slice(0, 2).join(" ").toUpperCase(),
              year: String(f.year || ""),
              director: f.dir || "",
              bg: filmPalettes[i % filmPalettes.length].bg,
              accent: filmPalettes[i % filmPalettes.length].accent,
              text: "#FFE9B3",
              big: false
            }, null, _parent));
            _push(`</div><div class="qz-film__cap">${ssrInterpolate(f.title)} <small>${ssrInterpolate(f.year)}</small></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="qz-section qz-spaced"><div><div class="qz-kicker" style="${ssrRenderStyle({ marginBottom: "6px" })}">YA SEN?</div><div class="qz-display" style="${ssrRenderStyle({ fontSize: "32px" })}">Tekrar çöz, başka bir sahnede çık.</div></div><div class="qz-row"><button class="qz-btn">`);
        _push(ssrRenderComponent(_sfc_main$7, {
          name: "refresh",
          size: 20
        }, null, _parent));
        _push(` Tekrar çöz </button></div></div></div>`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Quiz/QuizResult.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
function useQuizScoring(traits, questions, characters, recommendation) {
  const baseline = 5;
  const traitMin = 0;
  const traitMax = 10;
  const traitKeys = traits.map((t) => t.key);
  const userTraits = ref({});
  const answers = ref({});
  const result = ref(null);
  function initialize() {
    const initial = {};
    traitKeys.forEach((k) => {
      initial[k] = baseline;
    });
    userTraits.value = initial;
    answers.value = {};
    result.value = null;
  }
  function clamp(val) {
    return Math.max(traitMin, Math.min(traitMax, val));
  }
  const effectScale = 0.4;
  function answerQuestion(qIndex, optIndex) {
    const prev = answers.value[qIndex];
    if (prev != null) {
      const prevEffects = questions[qIndex].options[prev]?.effects || {};
      const current2 = { ...userTraits.value };
      Object.entries(prevEffects).forEach(([k, v]) => {
        if (current2[k] !== void 0) current2[k] = clamp(current2[k] - v * effectScale);
      });
      userTraits.value = current2;
    }
    answers.value = { ...answers.value, [qIndex]: optIndex };
    const effects = questions[qIndex].options[optIndex]?.effects || {};
    const current = { ...userTraits.value };
    Object.entries(effects).forEach(([k, v]) => {
      if (current[k] !== void 0) current[k] = clamp(current[k] + v * effectScale);
    });
    userTraits.value = current;
  }
  function answerSlider(qIndex, value) {
    answers.value = { ...answers.value, [qIndex]: value };
  }
  function manhattanDistance(a, b) {
    return traitKeys.reduce((sum, k) => sum + Math.abs((a[k] || baseline) - (b[k] || baseline)), 0);
  }
  function euclideanDistance(a, b) {
    return Math.sqrt(traitKeys.reduce((sum, k) => {
      const diff = (a[k] || baseline) - (b[k] || baseline);
      return sum + diff * diff;
    }, 0));
  }
  function calculateResult() {
    const metric = recommendation.distance_metric === "euclidean" ? euclideanDistance : manhattanDistance;
    const maxPossible = recommendation.distance_metric === "euclidean" ? Math.sqrt(traitKeys.length * traitMax * traitMax) : traitKeys.length * traitMax;
    const tieBreakers = recommendation.tie_breakers || ["resilience", "logic", "integrity"];
    const scored = characters.map((char) => {
      const distance = metric(userTraits.value, char.traits);
      return { ...char, distance };
    });
    scored.sort((a, b) => {
      if (Math.abs(a.distance - b.distance) > 1e-3) return a.distance - b.distance;
      const tieA = tieBreakers.reduce((sum, k) => sum + (a.traits[k] || 0), 0);
      const tieB = tieBreakers.reduce((sum, k) => sum + (b.traits[k] || 0), 0);
      return tieB - tieA;
    });
    const best = scored[0];
    const matchPct = Math.round((1 - best.distance / maxPossible) * 100);
    const topN = recommendation.top_n_suggestions || 3;
    const distribution = scored.slice(0, 10).map((c, i) => ({
      id: c.id,
      name: c.name,
      work: c.work,
      distance: c.distance,
      pct: Math.round((1 - c.distance / maxPossible) * 100),
      archetype: c.result_archetype_tr
    }));
    const allTraits = [...traitKeys].map((k) => ({ key: k, value: Math.round(userTraits.value[k] * 10) / 10, label: traits.find((t2) => t2.key === k)?.label_tr || k })).sort((a, b) => b.value - a.value);
    const topTraits = allTraits.slice(0, 5);
    const bottomTraits = [...allTraits].reverse().slice(0, 3);
    const opposite = scored[scored.length - 1];
    const userMap = userTraits.value;
    const t = (k) => userMap[k] ?? baseline;
    const profile = {
      relationships: t("empathy") + t("sociability") + t("sensitivity") + t("loyalty"),
      career: t("ambition") + t("leadership") + t("logic") + t("control"),
      stress: t("resilience") + t("humor") + (10 - t("control")),
      shadow: bottomTraits,
      mbti: best.mbti_hint || "",
      tags: best.tags || []
    };
    result.value = {
      character: best,
      matchPct,
      similar: scored.slice(1, topN + 1),
      distribution,
      topTraits,
      bottomTraits,
      opposite: opposite ? {
        id: opposite.id,
        name: opposite.name,
        work: opposite.work,
        year: opposite.year,
        archetype: opposite.result_archetype_tr
      } : null,
      profile,
      userTraits: { ...userTraits.value }
    };
    return result.value;
  }
  function reset() {
    initialize();
  }
  const answeredCount = computed(() => Object.keys(answers.value).length);
  const isComplete = computed(() => answeredCount.value >= questions.length);
  initialize();
  return {
    userTraits,
    answers,
    result,
    answeredCount,
    isComplete,
    answerQuestion,
    answerSlider,
    calculateResult,
    reset
  };
}
function useQuizAudio() {
  const soundOn = ref(true);
  let ctx = null;
  function ac() {
    if (typeof window === "undefined") return null;
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        ctx = null;
      }
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function blip(freq, dur, type, gain) {
    if (!soundOn.value) return;
    const a = ac();
    if (!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type || "square";
    o.frequency.setValueAtTime(freq, a.currentTime);
    g.gain.setValueAtTime(0, a.currentTime);
    g.gain.linearRampToValueAtTime(gain || 0.06, a.currentTime + 5e-3);
    g.gain.exponentialRampToValueAtTime(1e-4, a.currentTime + dur);
    o.connect(g).connect(a.destination);
    o.start();
    o.stop(a.currentTime + dur + 0.02);
  }
  function noise(dur, gain) {
    if (!soundOn.value) return;
    const a = ac();
    if (!a) return;
    const buf = a.createBuffer(1, a.sampleRate * dur, a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = a.createBufferSource();
    src.buffer = buf;
    const g = a.createGain();
    g.gain.value = gain || 0.04;
    const filt = a.createBiquadFilter();
    filt.type = "highpass";
    filt.frequency.value = 800;
    src.connect(filt).connect(g).connect(a.destination);
    src.start();
  }
  function vibrate(ms = 8) {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
  }
  const sfx = {
    hover: () => blip(880, 0.04, "triangle", 0.025),
    tap: () => blip(620, 0.06, "square", 0.05),
    pick: () => {
      blip(880, 0.05, "square", 0.05);
      setTimeout(() => blip(1320, 0.07, "square", 0.04), 40);
    },
    next: () => {
      blip(740, 0.06, "sawtooth", 0.05);
      setTimeout(() => blip(1100, 0.08, "square", 0.04), 60);
    },
    back: () => blip(420, 0.06, "square", 0.04),
    rewind: () => noise(0.6, 0.05),
    reveal: () => {
      const seq = [440, 660, 880, 1320];
      seq.forEach((f, i) => setTimeout(() => blip(f, 0.12, "square", 0.05), i * 100));
      setTimeout(() => noise(0.4, 0.04), 0);
    }
  };
  function popBurst(x, y) {
    if (typeof document === "undefined") return;
    const colors = ["var(--qz-pink)", "var(--qz-blue)", "var(--qz-yellow)", "var(--qz-green)"];
    const wrap = document.createElement("div");
    wrap.className = "qz-pickburst";
    wrap.style.left = x + "px";
    wrap.style.top = y + "px";
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("span");
      const ang = Math.PI * 2 * i / 14 + Math.random() * 0.4;
      const dist = 60 + Math.random() * 80;
      s.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      s.style.setProperty("--dy", Math.sin(ang) * dist + "px");
      s.style.setProperty("--rot", Math.random() * 720 - 360 + "deg");
      s.style.background = colors[i % colors.length];
      s.style.borderRadius = i % 3 === 0 ? "50%" : "2px";
      wrap.appendChild(s);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 700);
  }
  function tapFeedback(e, sfxName) {
    if (sfx[sfxName]) sfx[sfxName]();
    vibrate();
    const r = e?.currentTarget?.getBoundingClientRect?.();
    if (r) popBurst(r.left + r.width / 2, r.top + r.height / 2);
  }
  function toggleSound() {
    soundOn.value = !soundOn.value;
  }
  return { soundOn, sfx, tapFeedback, popBurst, toggleSound };
}
const _sfc_main = {
  __name: "Play",
  __ssrInlineRender: true,
  props: {
    questions: { type: Array, required: true },
    traits: { type: Array, required: true },
    meta: { type: Object, required: true },
    recommendation: { type: Object, required: true },
    characters: { type: Array, required: true }
  },
  setup(__props) {
    const props = __props;
    const FORMAT_BY_ID = {
      q05: "cards",
      q10: "cards",
      q14: "cards",
      q19: "cards",
      q23: "cards",
      q08: "vs",
      q16: "vs",
      q21: "vs",
      q12: "slider",
      q25: "slider"
    };
    const questionFormats = computed(() => {
      return props.questions.map((q) => q.format || FORMAT_BY_ID[q.id] || "text");
    });
    const phase = ref("start");
    const idx = ref(0);
    const scoring = useQuizScoring(props.traits, props.questions, props.characters, props.recommendation);
    const audio = useQuizAudio();
    const currentQuestion = computed(() => props.questions[idx.value]);
    const currentFormat = computed(() => questionFormats.value[idx.value]);
    const total = computed(() => props.questions.length);
    function start() {
      idx.value = 0;
      scoring.reset();
      phase.value = "question";
      window.scrollTo({ top: 0, behavior: "instant" });
      audio.sfx.next();
    }
    function pick(value) {
      const format = currentFormat.value;
      if (format === "slider") {
        scoring.answerSlider(idx.value, value);
      } else {
        scoring.answerQuestion(idx.value, value);
      }
      const isFinal = idx.value === total.value - 1;
      if (format !== "slider" && !isFinal) {
        setTimeout(() => {
          idx.value = Math.min(idx.value + 1, total.value - 1);
          audio.sfx.next();
        }, 380);
      }
    }
    function goPrev() {
      if (idx.value > 0) {
        idx.value--;
        audio.sfx.back();
      }
    }
    const characterCache = /* @__PURE__ */ new Map();
    async function hydrateCharacter(result) {
      const id = result?.character?.id;
      if (!id) return;
      try {
        if (!characterCache.has(id)) {
          const response = await fetch(`/quiz/karakter/${encodeURIComponent(id)}`, {
            headers: { Accept: "application/json" }
          });
          if (!response.ok) return;
          characterCache.set(id, await response.json());
        }
        Object.assign(result.character, characterCache.get(id));
      } catch (error) {
      }
    }
    function goNext() {
      if (idx.value < total.value - 1) {
        idx.value++;
        audio.sfx.next();
      } else {
        phase.value = "result";
        hydrateCharacter(scoring.calculateResult());
        audio.sfx.rewind();
        nextTick(() => {
          window.scrollTo({ top: 0, behavior: "instant" });
        });
        setTimeout(() => audio.sfx.reveal(), 950);
      }
    }
    function restart() {
      phase.value = "start";
      idx.value = 0;
      scoring.reset();
      audio.sfx.back();
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    function handleTapFeedback(sfxName) {
      if (audio.sfx[sfxName]) audio.sfx[sfxName]();
    }
    function onKeydown(e) {
      if (phase.value !== "question") return;
      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (scoring.answers.value[idx.value] != null) goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (/^[1-4]$/.test(e.key)) {
        const optIdx = Number(e.key) - 1;
        const format = currentFormat.value;
        if ((format === "text" || format === "cards") && currentQuestion.value.options[optIdx]) {
          pick(optIdx);
        } else if (format === "vs" && optIdx < 2) {
          pick(optIdx);
        }
      }
    }
    onMounted(() => {
      window.addEventListener("keydown", onKeydown);
      document.body.setAttribute("data-palette", "candy");
      document.body.setAttribute("data-vhs", "subtle");
      document.body.setAttribute("data-crt", "on");
    });
    onUnmounted(() => {
      window.removeEventListener("keydown", onKeydown);
      document.body.removeAttribute("data-palette");
      document.body.removeAttribute("data-vhs");
      document.body.removeAttribute("data-crt");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="quiz-shell"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              phase: phase.value,
              current: idx.value,
              total: total.value,
              "sound-on": unref(audio).soundOn.value,
              onToggleSound: unref(audio).toggleSound,
              onRestart: restart
            }, null, _parent2, _scopeId));
            if (phase.value === "start") {
              _push2(ssrRenderComponent(_sfc_main$3, {
                "total-questions": total.value,
                "total-characters": __props.characters.length,
                characters: __props.characters,
                onStart: start
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (phase.value === "question") {
              _push2(ssrRenderComponent(_sfc_main$2, {
                key: idx.value,
                question: currentQuestion.value,
                "question-index": idx.value,
                "total-questions": total.value,
                picked: unref(scoring).answers.value[idx.value],
                format: currentFormat.value,
                "is-last": idx.value === total.value - 1,
                "can-prev": idx.value > 0,
                "can-next": unref(scoring).answers.value[idx.value] != null,
                onPick: pick,
                onPrev: goPrev,
                onNext: goNext,
                onTapFeedback: handleTapFeedback
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (phase.value === "result" && unref(scoring).result.value) {
              _push2(ssrRenderComponent(_sfc_main$1, {
                result: unref(scoring).result.value,
                onRestart: restart,
                onTapFeedback: handleTapFeedback
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "quiz-shell" }, [
                createVNode(_sfc_main$6, {
                  phase: phase.value,
                  current: idx.value,
                  total: total.value,
                  "sound-on": unref(audio).soundOn.value,
                  onToggleSound: unref(audio).toggleSound,
                  onRestart: restart
                }, null, 8, ["phase", "current", "total", "sound-on", "onToggleSound"]),
                phase.value === "start" ? (openBlock(), createBlock(_sfc_main$3, {
                  key: 0,
                  "total-questions": total.value,
                  "total-characters": __props.characters.length,
                  characters: __props.characters,
                  onStart: start
                }, null, 8, ["total-questions", "total-characters", "characters"])) : createCommentVNode("", true),
                phase.value === "question" ? (openBlock(), createBlock(_sfc_main$2, {
                  key: idx.value,
                  question: currentQuestion.value,
                  "question-index": idx.value,
                  "total-questions": total.value,
                  picked: unref(scoring).answers.value[idx.value],
                  format: currentFormat.value,
                  "is-last": idx.value === total.value - 1,
                  "can-prev": idx.value > 0,
                  "can-next": unref(scoring).answers.value[idx.value] != null,
                  onPick: pick,
                  onPrev: goPrev,
                  onNext: goNext,
                  onTapFeedback: handleTapFeedback
                }, null, 8, ["question", "question-index", "total-questions", "picked", "format", "is-last", "can-prev", "can-next"])) : createCommentVNode("", true),
                phase.value === "result" && unref(scoring).result.value ? (openBlock(), createBlock(_sfc_main$1, {
                  key: 2,
                  result: unref(scoring).result.value,
                  onRestart: restart,
                  onTapFeedback: handleTapFeedback
                }, null, 8, ["result"])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Quiz/Play.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
