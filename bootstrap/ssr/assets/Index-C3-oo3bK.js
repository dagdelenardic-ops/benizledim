import { ref, mergeProps, useSSRContext, computed, onMounted, onBeforeUnmount, withCtx, unref, createVNode, toDisplayString, resolveDynamicComponent, openBlock, createBlock, createCommentVNode, createTextVNode, Fragment, renderList, withDirectives, vShow, withModifiers, withKeys, vModelText, nextTick } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrRenderVNode, ssrRenderStyle, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { a as _export_sfc, A as AppLayout } from "./AppLayout-BbFbHk45.js";
import axios from "axios";
import "@headlessui/vue";
const _sfc_main$1 = {
  __name: "ConversationHistory",
  __ssrInlineRender: true,
  props: {
    conversations: { type: Array, default: () => [] },
    activeId: { type: Number, default: null }
  },
  setup(__props) {
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "ne-izlesem__history" }, _attrs))} data-v-d825bab5><button class="ne-izlesem__history-toggle"${ssrRenderAttr("aria-expanded", isOpen.value)} data-v-d825bab5><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-d825bab5><path d="M12 8v4l3 3" data-v-d825bab5></path><circle cx="12" cy="12" r="9" data-v-d825bab5></circle></svg><span data-v-d825bab5>Sohbet Gecmisi (${ssrInterpolate(__props.conversations.length)})</span><svg class="${ssrRenderClass([{ "is-open": isOpen.value }, "ne-izlesem__history-chevron"])}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-d825bab5><polyline points="6 9 12 15 18 9" data-v-d825bab5></polyline></svg></button><div class="${ssrRenderClass([{ "is-open": isOpen.value }, "ne-izlesem__history-content"])}" data-v-d825bab5><button class="ne-izlesem__history-new" data-v-d825bab5><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-d825bab5><line x1="12" y1="5" x2="12" y2="19" data-v-d825bab5></line><line x1="5" y1="12" x2="19" y2="12" data-v-d825bab5></line></svg> Yeni Sohbet </button>`);
      if (__props.conversations.length === 0) {
        _push(`<div class="ne-izlesem__history-empty" data-v-d825bab5> Henuz sohbet yok </div>`);
      } else {
        _push(`<ul class="ne-izlesem__history-list" data-v-d825bab5><!--[-->`);
        ssrRenderList(__props.conversations, (conv) => {
          _push(`<li class="${ssrRenderClass([{ "is-active": conv.id === __props.activeId }, "ne-izlesem__history-item"])}" data-v-d825bab5><span class="ne-izlesem__history-item-title" data-v-d825bab5>${ssrInterpolate(conv.title)}</span><span class="ne-izlesem__history-item-meta" data-v-d825bab5>${ssrInterpolate(conv.created_at)} · ${ssrInterpolate(conv.message_count)} mesaj </span></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/Recommend/ConversationHistory.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ConversationHistory = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d825bab5"]]);
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  props: {
    messages: { type: Array, default: () => [] },
    conversationId: { type: Number, default: null },
    conversations: { type: Array, default: () => [] }
  },
  setup(__props) {
    const props = __props;
    const messages = ref([...props.messages]);
    const conversationId = ref(props.conversationId);
    const input = ref("");
    const isLoading = ref(false);
    const error = ref("");
    const chatContainer = ref(null);
    const waitingLabel = ref("İzliyor");
    const waitingTimer = ref(null);
    const showScrollTop = ref(false);
    const isReturningUser = computed(() => messages.value.length > 0 && props.conversations.length > 0);
    const waitingPhrases = [
      "İzliyor",
      "Tenkit ediyor",
      "Drama tartıyor",
      "Eleştirmenim lan ben",
      "Kurguyu kurcalıyor",
      "Sahneleri yokluyor"
    ];
    const promptGroups = [
      {
        label: "Ruh Haline Göre",
        prompts: [
          { icon: "😌", text: "Sakin ve huzurlu bir şey izlemek istiyorum" },
          { icon: "🔥", text: "Heyecanlı ve tempolu bir şey" },
          { icon: "😢", text: "Duygusal bir film önerisi" },
          { icon: "🤔", text: "Düşündürücü bir film öner" }
        ]
      },
      {
        label: "Türe Göre",
        prompts: [
          { icon: "🎭", text: "Gerilimli bir dizi arıyorum" },
          { icon: "😂", text: "Komedi izlemek istiyorum" },
          { icon: "👻", text: "Korku filmi önerisi" },
          { icon: "🔍", text: "Suç ve gizem türünde bir şey" }
        ]
      },
      {
        label: "Zamana Göre",
        prompts: [
          { icon: "⏱️", text: "Kısa ve hafif bir şey (90dk)" },
          { icon: "📺", text: "Uzun bir dizi önerisi" },
          { icon: "🎬", text: "Son dönemin en iyi filmleri?" },
          { icon: "📱", text: "Netflix'te ne izlesem?" }
        ]
      }
    ];
    const scrollToBottom = async () => {
      await nextTick();
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
      }
    };
    const scrollToTop = () => {
      if (chatContainer.value) {
        chatContainer.value.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    const handleScroll = () => {
      if (chatContainer.value) {
        showScrollTop.value = chatContainer.value.scrollTop > 300;
      }
    };
    const renderMarkdown = (text) => {
      if (!text) return "";
      return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="ne-izlesem__inline-link">$1</a>').replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/\[ID:\d+\]\s*/g, "").replace(/^- (.+)$/gm, '<span class="block pl-4 border-l-2 border-[var(--bi-red)] my-1">$1</span>').replace(/\n/g, "<br>");
    };
    const assistantMeta = (msg) => msg?.meta || {};
    const startWaitingAnimation = () => {
      stopWaitingAnimation();
      waitingLabel.value = waitingPhrases[Math.floor(Math.random() * waitingPhrases.length)];
      waitingTimer.value = window.setInterval(() => {
        waitingLabel.value = waitingPhrases[Math.floor(Math.random() * waitingPhrases.length)];
      }, 950);
    };
    const stopWaitingAnimation = () => {
      if (waitingTimer.value) {
        window.clearInterval(waitingTimer.value);
        waitingTimer.value = null;
      }
    };
    const sendMessage = async () => {
      const text = input.value.trim();
      if (!text || isLoading.value) return;
      error.value = "";
      input.value = "";
      isLoading.value = true;
      startWaitingAnimation();
      messages.value.push({
        id: Date.now(),
        role: "user",
        content: text,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      scrollToBottom();
      try {
        const response = await axios.post("/ne-izlesem/chat", {
          message: text,
          conversation_id: conversationId.value
        });
        messages.value.push(response.data.message);
        conversationId.value = response.data.message?.conversation_id || conversationId.value;
      } catch (err) {
        if (err.response?.status === 429) {
          error.value = err.response.data.error;
        } else {
          error.value = "Bir hata oluştu. Lütfen tekrar deneyin.";
        }
      } finally {
        isLoading.value = false;
        stopWaitingAnimation();
        scrollToBottom();
      }
    };
    const sendQuickPrompt = (prompt) => {
      input.value = prompt;
      sendMessage();
    };
    onMounted(() => {
      scrollToBottom();
      chatContainer.value?.addEventListener("scroll", handleScroll);
    });
    onBeforeUnmount(() => {
      stopWaitingAnimation();
      chatContainer.value?.removeEventListener("scroll", handleScroll);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(AppLayout, mergeProps({
        title: "Ne İzlesem?",
        description: "Ruh haline göre film ve dizi önerisi"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="ne-izlesem" data-v-b5999232${_scopeId}><header class="ne-izlesem__header" data-v-b5999232${_scopeId}><div class="ne-izlesem__header-inner" data-v-b5999232${_scopeId}><div class="ne-izlesem__kicker" data-v-b5999232${_scopeId}>SİNEMA REHBERİ</div><h1 class="ne-izlesem__title" data-v-b5999232${_scopeId}>Ne İzlesem?</h1><p class="ne-izlesem__subtitle" data-v-b5999232${_scopeId}> Ruh haline, zamanına ve tercihlerine göre sana özel film &amp; dizi önerileri. <span class="ne-izlesem__badge" data-v-b5999232${_scopeId}>Gemini AI</span></p></div></header><div class="ne-izlesem__layout" data-v-b5999232${_scopeId}>`);
            _push2(ssrRenderComponent(ConversationHistory, {
              conversations: __props.conversations,
              "active-id": conversationId.value
            }, null, _parent2, _scopeId));
            _push2(`<div class="ne-izlesem__body" data-v-b5999232${_scopeId}><div class="ne-izlesem__chat-wrapper" data-v-b5999232${_scopeId}>`);
            if (isReturningUser.value && messages.value.length > 0) {
              _push2(`<div class="ne-izlesem__resume-banner" data-v-b5999232${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-b5999232${_scopeId}><path d="M12 8v4l3 3" data-v-b5999232${_scopeId}></path><circle cx="12" cy="12" r="9" data-v-b5999232${_scopeId}></circle></svg><span data-v-b5999232${_scopeId}>Son sohbetine devam ediyorsun</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="ne-izlesem__messages" data-v-b5999232${_scopeId}>`);
            if (messages.value.length === 0) {
              _push2(`<div class="ne-izlesem__empty" data-v-b5999232${_scopeId}><div class="ne-izlesem__empty-icon" data-v-b5999232${_scopeId}><svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" data-v-b5999232${_scopeId}><rect x="4" y="8" width="40" height="32" rx="2" stroke="currentColor" stroke-width="2" data-v-b5999232${_scopeId}></rect><rect x="8" y="12" width="8" height="6" rx="1" fill="currentColor" opacity="0.3" data-v-b5999232${_scopeId}></rect><rect x="20" y="12" width="8" height="6" rx="1" fill="currentColor" opacity="0.3" data-v-b5999232${_scopeId}></rect><rect x="32" y="12" width="8" height="6" rx="1" fill="currentColor" opacity="0.3" data-v-b5999232${_scopeId}></rect><rect x="8" y="22" width="8" height="6" rx="1" fill="currentColor" opacity="0.3" data-v-b5999232${_scopeId}></rect><rect x="20" y="22" width="8" height="6" rx="1" fill="currentColor" opacity="0.3" data-v-b5999232${_scopeId}></rect><rect x="32" y="22" width="8" height="6" rx="1" fill="currentColor" opacity="0.3" data-v-b5999232${_scopeId}></rect><rect x="8" y="32" width="8" height="4" rx="1" fill="currentColor" opacity="0.3" data-v-b5999232${_scopeId}></rect><rect x="20" y="32" width="8" height="4" rx="1" fill="currentColor" opacity="0.3" data-v-b5999232${_scopeId}></rect><rect x="32" y="32" width="8" height="4" rx="1" fill="currentColor" opacity="0.3" data-v-b5999232${_scopeId}></rect></svg></div><h2 class="ne-izlesem__empty-title" data-v-b5999232${_scopeId}>Merhaba, sinema sever!</h2><p class="ne-izlesem__empty-desc" data-v-b5999232${_scopeId}> Ruh halini ya da ne tarz bir şey izlemek istediğini yaz, sana en uygun filmleri ve dizileri önereyim. </p><div class="ne-izlesem__prompt-groups" data-v-b5999232${_scopeId}><!--[-->`);
              ssrRenderList(promptGroups, (group) => {
                _push2(`<div class="ne-izlesem__prompt-group" data-v-b5999232${_scopeId}><div class="ne-izlesem__prompt-group-label" data-v-b5999232${_scopeId}>${ssrInterpolate(group.label)}</div><div class="ne-izlesem__prompts" data-v-b5999232${_scopeId}><!--[-->`);
                ssrRenderList(group.prompts, (prompt) => {
                  _push2(`<button class="ne-izlesem__prompt-btn" data-v-b5999232${_scopeId}><span class="ne-izlesem__prompt-icon" data-v-b5999232${_scopeId}>${ssrInterpolate(prompt.icon)}</span> ${ssrInterpolate(prompt.text)}</button>`);
                });
                _push2(`<!--]--></div></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(messages.value, (msg) => {
              _push2(`<div class="${ssrRenderClass([msg.role === "user" ? "ne-izlesem__msg--user" : "ne-izlesem__msg--ai", "ne-izlesem__msg"])}" data-v-b5999232${_scopeId}>`);
              if (msg.role !== "user") {
                _push2(`<div class="ne-izlesem__msg-avatar" data-v-b5999232${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-b5999232${_scopeId}><path d="M15.91 11.72a.5.5 0 010 .56l-1.2 2.08a.5.5 0 01-.43.25H12.6a.5.5 0 01-.44-.25l-1.2-2.08a.5.5 0 010-.56l1.2-2.08a.5.5 0 01.44-.25h1.68a.5.5 0 01.43.25l1.2 2.08z" data-v-b5999232${_scopeId}></path><circle cx="12" cy="12" r="10" data-v-b5999232${_scopeId}></circle></svg></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="ne-izlesem__msg-bubble" data-v-b5999232${_scopeId}>`);
              if (msg.role === "user") {
                _push2(`<div class="ne-izlesem__msg-text" data-v-b5999232${_scopeId}>${ssrInterpolate(msg.content)}</div>`);
              } else {
                _push2(`<!--[--><div class="ne-izlesem__msg-text" data-v-b5999232${_scopeId}>${renderMarkdown(msg.content) ?? ""}</div>`);
                if (assistantMeta(msg).site_posts?.length) {
                  _push2(`<div class="ne-izlesem__link-block" data-v-b5999232${_scopeId}><div class="ne-izlesem__link-title" data-v-b5999232${_scopeId}>Ben İzledim içinde</div><div class="ne-izlesem__suggestion-grid" data-v-b5999232${_scopeId}><!--[-->`);
                  ssrRenderList(assistantMeta(msg).site_posts, (post) => {
                    _push2(ssrRenderComponent(unref(Link), {
                      key: `site-${post.id}`,
                      href: `/yazi/${post.slug}`,
                      class: "ne-izlesem__suggestion-card"
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`<span class="ne-izlesem__suggestion-kicker" data-v-b5999232${_scopeId2}>Yazı linki</span><span class="ne-izlesem__suggestion-name" data-v-b5999232${_scopeId2}>${ssrInterpolate(post.title)}</span>`);
                        } else {
                          return [
                            createVNode("span", { class: "ne-izlesem__suggestion-kicker" }, "Yazı linki"),
                            createVNode("span", { class: "ne-izlesem__suggestion-name" }, toDisplayString(post.title), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent2, _scopeId));
                  });
                  _push2(`<!--]--></div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (assistantMeta(msg).external_suggestions?.length) {
                  _push2(`<div class="ne-izlesem__link-block" data-v-b5999232${_scopeId}><div class="ne-izlesem__link-title" data-v-b5999232${_scopeId}>Site dışında da bak</div><div class="ne-izlesem__suggestion-grid" data-v-b5999232${_scopeId}><!--[-->`);
                  ssrRenderList(assistantMeta(msg).external_suggestions, (item) => {
                    ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(item.url ? "a" : "div"), {
                      key: `${item.title}-${item.year || "na"}`,
                      href: item.url || void 0,
                      target: item.url ? "_blank" : void 0,
                      rel: item.url ? "noopener noreferrer" : void 0,
                      class: ["ne-izlesem__suggestion-card ne-izlesem__suggestion-card--external", { "is-disabled": !item.url }]
                    }, {
                      default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                        if (_push3) {
                          _push3(`<span class="ne-izlesem__suggestion-kicker" data-v-b5999232${_scopeId2}>${ssrInterpolate(item.type === "series" ? "Dizi" : "Film")}${ssrInterpolate(item.year ? ` / ${item.year}` : "")}</span><span class="ne-izlesem__suggestion-name" data-v-b5999232${_scopeId2}>${ssrInterpolate(item.title)}</span>`);
                          if (item.reason) {
                            _push3(`<span class="ne-izlesem__suggestion-desc" data-v-b5999232${_scopeId2}>${ssrInterpolate(item.reason)}</span>`);
                          } else {
                            _push3(`<!---->`);
                          }
                        } else {
                          return [
                            createVNode("span", { class: "ne-izlesem__suggestion-kicker" }, toDisplayString(item.type === "series" ? "Dizi" : "Film") + toDisplayString(item.year ? ` / ${item.year}` : ""), 1),
                            createVNode("span", { class: "ne-izlesem__suggestion-name" }, toDisplayString(item.title), 1),
                            item.reason ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "ne-izlesem__suggestion-desc"
                            }, toDisplayString(item.reason), 1)) : createCommentVNode("", true)
                          ];
                        }
                      }),
                      _: 2
                    }), _parent2, _scopeId);
                  });
                  _push2(`<!--]--></div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                if (assistantMeta(msg).follow_up_options?.length) {
                  _push2(`<div class="ne-izlesem__followups" data-v-b5999232${_scopeId}><!--[-->`);
                  ssrRenderList(assistantMeta(msg).follow_up_options, (option) => {
                    _push2(`<button type="button" class="ne-izlesem__followup-btn" data-v-b5999232${_scopeId}>${ssrInterpolate(option)}</button>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              }
              _push2(`</div></div>`);
            });
            _push2(`<!--]-->`);
            if (isLoading.value) {
              _push2(`<div class="ne-izlesem__msg ne-izlesem__msg--ai" data-v-b5999232${_scopeId}><div class="ne-izlesem__msg-avatar" data-v-b5999232${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-b5999232${_scopeId}><path d="M15.91 11.72a.5.5 0 010 .56l-1.2 2.08a.5.5 0 01-.43.25H12.6a.5.5 0 01-.44-.25l-1.2-2.08a.5.5 0 010-.56l1.2-2.08a.5.5 0 01.44-.25h1.68a.5.5 0 01.43.25l1.2 2.08z" data-v-b5999232${_scopeId}></path><circle cx="12" cy="12" r="10" data-v-b5999232${_scopeId}></circle></svg></div><div class="ne-izlesem__msg-bubble" data-v-b5999232${_scopeId}><div class="ne-izlesem__loading-wrap" data-v-b5999232${_scopeId}><div class="ne-izlesem__loading-label" data-v-b5999232${_scopeId}>${ssrInterpolate(waitingLabel.value)}</div><div class="ne-izlesem__loading-svg" aria-hidden="true" data-v-b5999232${_scopeId}><svg viewBox="0 0 120 24" fill="none" data-v-b5999232${_scopeId}><rect x="2" y="5" width="26" height="14" rx="1.5" data-v-b5999232${_scopeId}></rect><rect x="34" y="5" width="26" height="14" rx="1.5" data-v-b5999232${_scopeId}></rect><rect x="66" y="5" width="26" height="14" rx="1.5" data-v-b5999232${_scopeId}></rect><path d="M98 12H118" stroke-linecap="square" data-v-b5999232${_scopeId}></path></svg></div><div class="ne-izlesem__typing" data-v-b5999232${_scopeId}><span data-v-b5999232${_scopeId}></span><span data-v-b5999232${_scopeId}></span><span data-v-b5999232${_scopeId}></span></div></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><button class="ne-izlesem__scroll-top" aria-label="Basa don" style="${ssrRenderStyle(showScrollTop.value ? null : { display: "none" })}" data-v-b5999232${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-v-b5999232${_scopeId}><polyline points="18 15 12 9 6 15" data-v-b5999232${_scopeId}></polyline></svg></button>`);
            if (error.value) {
              _push2(`<div class="ne-izlesem__error" data-v-b5999232${_scopeId}>${ssrInterpolate(error.value)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="ne-izlesem__form" data-v-b5999232${_scopeId}><input${ssrRenderAttr("value", input.value)} type="text" placeholder="Ruh halini veya ne izlemek istediğini yaz..." maxlength="500"${ssrIncludeBooleanAttr(isLoading.value) ? " disabled" : ""} class="ne-izlesem__input" data-v-b5999232${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(isLoading.value || !input.value.trim()) ? " disabled" : ""} class="ne-izlesem__send" data-v-b5999232${_scopeId}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-b5999232${_scopeId}><line x1="22" y1="2" x2="11" y2="13" data-v-b5999232${_scopeId}></line><polygon points="22 2 15 22 11 13 2 9 22 2" data-v-b5999232${_scopeId}></polygon></svg><span data-v-b5999232${_scopeId}>Gönder</span></button></form></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "ne-izlesem" }, [
                createVNode("header", { class: "ne-izlesem__header" }, [
                  createVNode("div", { class: "ne-izlesem__header-inner" }, [
                    createVNode("div", { class: "ne-izlesem__kicker" }, "SİNEMA REHBERİ"),
                    createVNode("h1", { class: "ne-izlesem__title" }, "Ne İzlesem?"),
                    createVNode("p", { class: "ne-izlesem__subtitle" }, [
                      createTextVNode(" Ruh haline, zamanına ve tercihlerine göre sana özel film & dizi önerileri. "),
                      createVNode("span", { class: "ne-izlesem__badge" }, "Gemini AI")
                    ])
                  ])
                ]),
                createVNode("div", { class: "ne-izlesem__layout" }, [
                  createVNode(ConversationHistory, {
                    conversations: __props.conversations,
                    "active-id": conversationId.value
                  }, null, 8, ["conversations", "active-id"]),
                  createVNode("div", { class: "ne-izlesem__body" }, [
                    createVNode("div", { class: "ne-izlesem__chat-wrapper" }, [
                      isReturningUser.value && messages.value.length > 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "ne-izlesem__resume-banner"
                      }, [
                        (openBlock(), createBlock("svg", {
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2"
                        }, [
                          createVNode("path", { d: "M12 8v4l3 3" }),
                          createVNode("circle", {
                            cx: "12",
                            cy: "12",
                            r: "9"
                          })
                        ])),
                        createVNode("span", null, "Son sohbetine devam ediyorsun")
                      ])) : createCommentVNode("", true),
                      createVNode("div", {
                        ref_key: "chatContainer",
                        ref: chatContainer,
                        class: "ne-izlesem__messages"
                      }, [
                        messages.value.length === 0 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "ne-izlesem__empty"
                        }, [
                          createVNode("div", { class: "ne-izlesem__empty-icon" }, [
                            (openBlock(), createBlock("svg", {
                              viewBox: "0 0 48 48",
                              fill: "none",
                              xmlns: "http://www.w3.org/2000/svg"
                            }, [
                              createVNode("rect", {
                                x: "4",
                                y: "8",
                                width: "40",
                                height: "32",
                                rx: "2",
                                stroke: "currentColor",
                                "stroke-width": "2"
                              }),
                              createVNode("rect", {
                                x: "8",
                                y: "12",
                                width: "8",
                                height: "6",
                                rx: "1",
                                fill: "currentColor",
                                opacity: "0.3"
                              }),
                              createVNode("rect", {
                                x: "20",
                                y: "12",
                                width: "8",
                                height: "6",
                                rx: "1",
                                fill: "currentColor",
                                opacity: "0.3"
                              }),
                              createVNode("rect", {
                                x: "32",
                                y: "12",
                                width: "8",
                                height: "6",
                                rx: "1",
                                fill: "currentColor",
                                opacity: "0.3"
                              }),
                              createVNode("rect", {
                                x: "8",
                                y: "22",
                                width: "8",
                                height: "6",
                                rx: "1",
                                fill: "currentColor",
                                opacity: "0.3"
                              }),
                              createVNode("rect", {
                                x: "20",
                                y: "22",
                                width: "8",
                                height: "6",
                                rx: "1",
                                fill: "currentColor",
                                opacity: "0.3"
                              }),
                              createVNode("rect", {
                                x: "32",
                                y: "22",
                                width: "8",
                                height: "6",
                                rx: "1",
                                fill: "currentColor",
                                opacity: "0.3"
                              }),
                              createVNode("rect", {
                                x: "8",
                                y: "32",
                                width: "8",
                                height: "4",
                                rx: "1",
                                fill: "currentColor",
                                opacity: "0.3"
                              }),
                              createVNode("rect", {
                                x: "20",
                                y: "32",
                                width: "8",
                                height: "4",
                                rx: "1",
                                fill: "currentColor",
                                opacity: "0.3"
                              }),
                              createVNode("rect", {
                                x: "32",
                                y: "32",
                                width: "8",
                                height: "4",
                                rx: "1",
                                fill: "currentColor",
                                opacity: "0.3"
                              })
                            ]))
                          ]),
                          createVNode("h2", { class: "ne-izlesem__empty-title" }, "Merhaba, sinema sever!"),
                          createVNode("p", { class: "ne-izlesem__empty-desc" }, " Ruh halini ya da ne tarz bir şey izlemek istediğini yaz, sana en uygun filmleri ve dizileri önereyim. "),
                          createVNode("div", { class: "ne-izlesem__prompt-groups" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(promptGroups, (group) => {
                              return createVNode("div", {
                                key: group.label,
                                class: "ne-izlesem__prompt-group"
                              }, [
                                createVNode("div", { class: "ne-izlesem__prompt-group-label" }, toDisplayString(group.label), 1),
                                createVNode("div", { class: "ne-izlesem__prompts" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(group.prompts, (prompt) => {
                                    return openBlock(), createBlock("button", {
                                      key: prompt.text,
                                      onClick: ($event) => sendQuickPrompt(prompt.text),
                                      class: "ne-izlesem__prompt-btn"
                                    }, [
                                      createVNode("span", { class: "ne-izlesem__prompt-icon" }, toDisplayString(prompt.icon), 1),
                                      createTextVNode(" " + toDisplayString(prompt.text), 1)
                                    ], 8, ["onClick"]);
                                  }), 128))
                                ])
                              ]);
                            }), 64))
                          ])
                        ])) : createCommentVNode("", true),
                        (openBlock(true), createBlock(Fragment, null, renderList(messages.value, (msg) => {
                          return openBlock(), createBlock("div", {
                            key: msg.id,
                            class: ["ne-izlesem__msg", msg.role === "user" ? "ne-izlesem__msg--user" : "ne-izlesem__msg--ai"]
                          }, [
                            msg.role !== "user" ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "ne-izlesem__msg-avatar"
                            }, [
                              (openBlock(), createBlock("svg", {
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                "stroke-width": "1.5"
                              }, [
                                createVNode("path", { d: "M15.91 11.72a.5.5 0 010 .56l-1.2 2.08a.5.5 0 01-.43.25H12.6a.5.5 0 01-.44-.25l-1.2-2.08a.5.5 0 010-.56l1.2-2.08a.5.5 0 01.44-.25h1.68a.5.5 0 01.43.25l1.2 2.08z" }),
                                createVNode("circle", {
                                  cx: "12",
                                  cy: "12",
                                  r: "10"
                                })
                              ]))
                            ])) : createCommentVNode("", true),
                            createVNode("div", { class: "ne-izlesem__msg-bubble" }, [
                              msg.role === "user" ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "ne-izlesem__msg-text"
                              }, toDisplayString(msg.content), 1)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                                createVNode("div", {
                                  class: "ne-izlesem__msg-text",
                                  innerHTML: renderMarkdown(msg.content)
                                }, null, 8, ["innerHTML"]),
                                assistantMeta(msg).site_posts?.length ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "ne-izlesem__link-block"
                                }, [
                                  createVNode("div", { class: "ne-izlesem__link-title" }, "Ben İzledim içinde"),
                                  createVNode("div", { class: "ne-izlesem__suggestion-grid" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(assistantMeta(msg).site_posts, (post) => {
                                      return openBlock(), createBlock(unref(Link), {
                                        key: `site-${post.id}`,
                                        href: `/yazi/${post.slug}`,
                                        class: "ne-izlesem__suggestion-card"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("span", { class: "ne-izlesem__suggestion-kicker" }, "Yazı linki"),
                                          createVNode("span", { class: "ne-izlesem__suggestion-name" }, toDisplayString(post.title), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["href"]);
                                    }), 128))
                                  ])
                                ])) : createCommentVNode("", true),
                                assistantMeta(msg).external_suggestions?.length ? (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "ne-izlesem__link-block"
                                }, [
                                  createVNode("div", { class: "ne-izlesem__link-title" }, "Site dışında da bak"),
                                  createVNode("div", { class: "ne-izlesem__suggestion-grid" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(assistantMeta(msg).external_suggestions, (item) => {
                                      return openBlock(), createBlock(resolveDynamicComponent(item.url ? "a" : "div"), {
                                        key: `${item.title}-${item.year || "na"}`,
                                        href: item.url || void 0,
                                        target: item.url ? "_blank" : void 0,
                                        rel: item.url ? "noopener noreferrer" : void 0,
                                        class: ["ne-izlesem__suggestion-card ne-izlesem__suggestion-card--external", { "is-disabled": !item.url }]
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("span", { class: "ne-izlesem__suggestion-kicker" }, toDisplayString(item.type === "series" ? "Dizi" : "Film") + toDisplayString(item.year ? ` / ${item.year}` : ""), 1),
                                          createVNode("span", { class: "ne-izlesem__suggestion-name" }, toDisplayString(item.title), 1),
                                          item.reason ? (openBlock(), createBlock("span", {
                                            key: 0,
                                            class: "ne-izlesem__suggestion-desc"
                                          }, toDisplayString(item.reason), 1)) : createCommentVNode("", true)
                                        ]),
                                        _: 2
                                      }, 1032, ["href", "target", "rel", "class"]);
                                    }), 128))
                                  ])
                                ])) : createCommentVNode("", true),
                                assistantMeta(msg).follow_up_options?.length ? (openBlock(), createBlock("div", {
                                  key: 2,
                                  class: "ne-izlesem__followups"
                                }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(assistantMeta(msg).follow_up_options, (option) => {
                                    return openBlock(), createBlock("button", {
                                      key: option,
                                      type: "button",
                                      class: "ne-izlesem__followup-btn",
                                      onClick: ($event) => sendQuickPrompt(option)
                                    }, toDisplayString(option), 9, ["onClick"]);
                                  }), 128))
                                ])) : createCommentVNode("", true)
                              ], 64))
                            ])
                          ], 2);
                        }), 128)),
                        isLoading.value ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "ne-izlesem__msg ne-izlesem__msg--ai"
                        }, [
                          createVNode("div", { class: "ne-izlesem__msg-avatar" }, [
                            (openBlock(), createBlock("svg", {
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              "stroke-width": "1.5"
                            }, [
                              createVNode("path", { d: "M15.91 11.72a.5.5 0 010 .56l-1.2 2.08a.5.5 0 01-.43.25H12.6a.5.5 0 01-.44-.25l-1.2-2.08a.5.5 0 010-.56l1.2-2.08a.5.5 0 01.44-.25h1.68a.5.5 0 01.43.25l1.2 2.08z" }),
                              createVNode("circle", {
                                cx: "12",
                                cy: "12",
                                r: "10"
                              })
                            ]))
                          ]),
                          createVNode("div", { class: "ne-izlesem__msg-bubble" }, [
                            createVNode("div", { class: "ne-izlesem__loading-wrap" }, [
                              createVNode("div", { class: "ne-izlesem__loading-label" }, toDisplayString(waitingLabel.value), 1),
                              createVNode("div", {
                                class: "ne-izlesem__loading-svg",
                                "aria-hidden": "true"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  viewBox: "0 0 120 24",
                                  fill: "none"
                                }, [
                                  createVNode("rect", {
                                    x: "2",
                                    y: "5",
                                    width: "26",
                                    height: "14",
                                    rx: "1.5"
                                  }),
                                  createVNode("rect", {
                                    x: "34",
                                    y: "5",
                                    width: "26",
                                    height: "14",
                                    rx: "1.5"
                                  }),
                                  createVNode("rect", {
                                    x: "66",
                                    y: "5",
                                    width: "26",
                                    height: "14",
                                    rx: "1.5"
                                  }),
                                  createVNode("path", {
                                    d: "M98 12H118",
                                    "stroke-linecap": "square"
                                  })
                                ]))
                              ]),
                              createVNode("div", { class: "ne-izlesem__typing" }, [
                                createVNode("span"),
                                createVNode("span"),
                                createVNode("span")
                              ])
                            ])
                          ])
                        ])) : createCommentVNode("", true)
                      ], 512),
                      withDirectives(createVNode("button", {
                        class: "ne-izlesem__scroll-top",
                        onClick: scrollToTop,
                        "aria-label": "Basa don"
                      }, [
                        (openBlock(), createBlock("svg", {
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2.5",
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round"
                        }, [
                          createVNode("polyline", { points: "18 15 12 9 6 15" })
                        ]))
                      ], 512), [
                        [vShow, showScrollTop.value]
                      ]),
                      error.value ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "ne-izlesem__error"
                      }, toDisplayString(error.value), 1)) : createCommentVNode("", true),
                      createVNode("form", {
                        onSubmit: withModifiers(sendMessage, ["prevent"]),
                        class: "ne-izlesem__form"
                      }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => input.value = $event,
                          type: "text",
                          placeholder: "Ruh halini veya ne izlemek istediğini yaz...",
                          maxlength: "500",
                          disabled: isLoading.value,
                          class: "ne-izlesem__input",
                          onKeydown: withKeys(withModifiers(sendMessage, ["prevent"]), ["enter"])
                        }, null, 40, ["onUpdate:modelValue", "disabled", "onKeydown"]), [
                          [vModelText, input.value]
                        ]),
                        createVNode("button", {
                          type: "submit",
                          disabled: isLoading.value || !input.value.trim(),
                          class: "ne-izlesem__send"
                        }, [
                          (openBlock(), createBlock("svg", {
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            "stroke-width": "2",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                          }, [
                            createVNode("line", {
                              x1: "22",
                              y1: "2",
                              x2: "11",
                              y2: "13"
                            }),
                            createVNode("polygon", { points: "22 2 15 22 11 13 2 9 22 2" })
                          ])),
                          createVNode("span", null, "Gönder")
                        ], 8, ["disabled"])
                      ], 32)
                    ])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Recommend/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b5999232"]]);
export {
  Index as default
};
