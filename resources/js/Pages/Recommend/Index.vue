<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount, computed } from 'vue';
import { Link } from '@inertiajs/vue3';
import AppLayout from '../../Components/Layout/AppLayout.vue';
import ConversationHistory from '../../Components/Recommend/ConversationHistory.vue';
import axios from 'axios';

const props = defineProps({
    messages: { type: Array, default: () => [] },
    conversationId: { type: Number, default: null },
    conversations: { type: Array, default: () => [] },
});

const messages = ref([...props.messages]);
const conversationId = ref(props.conversationId);
const input = ref('');
const isLoading = ref(false);
const error = ref('');
const chatContainer = ref(null);
const waitingLabel = ref('İzliyor');
const waitingTimer = ref(null);
const showScrollTop = ref(false);

const isReturningUser = computed(() => messages.value.length > 0 && props.conversations.length > 0);

const waitingPhrases = [
    'İzliyor',
    'Tenkit ediyor',
    'Drama tartıyor',
    'Eleştirmenim lan ben',
    'Kurguyu kurcalıyor',
    'Sahneleri yokluyor',
];

const promptGroups = [
    {
        label: 'Ruh Haline Göre',
        prompts: [
            { icon: '😌', text: 'Sakin ve huzurlu bir şey izlemek istiyorum' },
            { icon: '🔥', text: 'Heyecanlı ve tempolu bir şey' },
            { icon: '😢', text: 'Duygusal bir film önerisi' },
            { icon: '🤔', text: 'Düşündürücü bir film öner' },
        ],
    },
    {
        label: 'Türe Göre',
        prompts: [
            { icon: '🎭', text: 'Gerilimli bir dizi arıyorum' },
            { icon: '😂', text: 'Komedi izlemek istiyorum' },
            { icon: '👻', text: 'Korku filmi önerisi' },
            { icon: '🔍', text: 'Suç ve gizem türünde bir şey' },
        ],
    },
    {
        label: 'Zamana Göre',
        prompts: [
            { icon: '⏱️', text: 'Kısa ve hafif bir şey (90dk)' },
            { icon: '📺', text: 'Uzun bir dizi önerisi' },
            { icon: '🎬', text: 'Son dönemin en iyi filmleri?' },
            { icon: '📱', text: 'Netflix\'te ne izlesem?' },
        ],
    },
];

const scrollToBottom = async () => {
    await nextTick();
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

const scrollToTop = () => {
    if (chatContainer.value) {
        chatContainer.value.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const handleScroll = () => {
    if (chatContainer.value) {
        showScrollTop.value = chatContainer.value.scrollTop > 300;
    }
};

const renderMarkdown = (text) => {
    if (!text) return '';
    return text
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="ne-izlesem__inline-link">$1</a>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[ID:\d+\]\s*/g, '')
        .replace(/^- (.+)$/gm, '<span class="block pl-4 border-l-2 border-[var(--bi-red)] my-1">$1</span>')
        .replace(/\n/g, '<br>');
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

    error.value = '';
    input.value = '';
    isLoading.value = true;
    startWaitingAnimation();

    messages.value.push({
        id: Date.now(),
        role: 'user',
        content: text,
        created_at: new Date().toISOString(),
    });
    scrollToBottom();

    try {
        const response = await axios.post('/ne-izlesem/chat', {
            message: text,
            conversation_id: conversationId.value,
        });
        messages.value.push(response.data.message);
        conversationId.value = response.data.message?.conversation_id || conversationId.value;
    } catch (err) {
        if (err.response?.status === 429) {
            error.value = err.response.data.error;
        } else {
            error.value = 'Bir hata oluştu. Lütfen tekrar deneyin.';
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
    chatContainer.value?.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    stopWaitingAnimation();
    chatContainer.value?.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <AppLayout>
        <div class="ne-izlesem">
            <!-- Hero Header -->
            <header class="ne-izlesem__header">
                <div class="ne-izlesem__header-inner">
                    <div class="ne-izlesem__kicker">SİNEMA REHBERİ</div>
                    <h1 class="ne-izlesem__title">Ne İzlesem?</h1>
                    <p class="ne-izlesem__subtitle">
                        Ruh haline, zamanına ve tercihlerine göre sana özel film &amp; dizi önerileri.
                        <span class="ne-izlesem__badge">Vertex AI</span>
                    </p>
                </div>
            </header>

            <!-- Main Layout -->
            <div class="ne-izlesem__layout">
                <!-- Sidebar: Conversation History -->
                <ConversationHistory
                    :conversations="conversations"
                    :active-id="conversationId"
                />

                <!-- Chat Container -->
                <div class="ne-izlesem__body">
                    <div class="ne-izlesem__chat-wrapper">
                        <!-- Returning user banner -->
                        <div v-if="isReturningUser && messages.length > 0" class="ne-izlesem__resume-banner">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 8v4l3 3"/>
                                <circle cx="12" cy="12" r="9"/>
                            </svg>
                            <span>Son sohbetine devam ediyorsun</span>
                        </div>

                        <!-- Messages -->
                        <div ref="chatContainer" class="ne-izlesem__messages">
                            <!-- Empty State -->
                            <div v-if="messages.length === 0" class="ne-izlesem__empty">
                                <div class="ne-izlesem__empty-icon">
                                    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="4" y="8" width="40" height="32" rx="2" stroke="currentColor" stroke-width="2"/>
                                        <rect x="8" y="12" width="8" height="6" rx="1" fill="currentColor" opacity="0.3"/>
                                        <rect x="20" y="12" width="8" height="6" rx="1" fill="currentColor" opacity="0.3"/>
                                        <rect x="32" y="12" width="8" height="6" rx="1" fill="currentColor" opacity="0.3"/>
                                        <rect x="8" y="22" width="8" height="6" rx="1" fill="currentColor" opacity="0.3"/>
                                        <rect x="20" y="22" width="8" height="6" rx="1" fill="currentColor" opacity="0.3"/>
                                        <rect x="32" y="22" width="8" height="6" rx="1" fill="currentColor" opacity="0.3"/>
                                        <rect x="8" y="32" width="8" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                                        <rect x="20" y="32" width="8" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                                        <rect x="32" y="32" width="8" height="4" rx="1" fill="currentColor" opacity="0.3"/>
                                    </svg>
                                </div>
                                <h2 class="ne-izlesem__empty-title">Merhaba, sinema sever!</h2>
                                <p class="ne-izlesem__empty-desc">
                                    Ruh halini ya da ne tarz bir şey izlemek istediğini yaz, sana en uygun filmleri ve dizileri önereyim.
                                </p>

                                <!-- Grouped Quick Prompts -->
                                <div class="ne-izlesem__prompt-groups">
                                    <div
                                        v-for="group in promptGroups"
                                        :key="group.label"
                                        class="ne-izlesem__prompt-group"
                                    >
                                        <div class="ne-izlesem__prompt-group-label">{{ group.label }}</div>
                                        <div class="ne-izlesem__prompts">
                                            <button
                                                v-for="prompt in group.prompts"
                                                :key="prompt.text"
                                                @click="sendQuickPrompt(prompt.text)"
                                                class="ne-izlesem__prompt-btn"
                                            >
                                                <span class="ne-izlesem__prompt-icon">{{ prompt.icon }}</span>
                                                {{ prompt.text }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Message Bubbles -->
                            <div
                                v-for="msg in messages"
                                :key="msg.id"
                                class="ne-izlesem__msg"
                                :class="msg.role === 'user' ? 'ne-izlesem__msg--user' : 'ne-izlesem__msg--ai'"
                            >
                                <div v-if="msg.role !== 'user'" class="ne-izlesem__msg-avatar">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path d="M15.91 11.72a.5.5 0 010 .56l-1.2 2.08a.5.5 0 01-.43.25H12.6a.5.5 0 01-.44-.25l-1.2-2.08a.5.5 0 010-.56l1.2-2.08a.5.5 0 01.44-.25h1.68a.5.5 0 01.43.25l1.2 2.08z"/>
                                        <circle cx="12" cy="12" r="10"/>
                                    </svg>
                                </div>
                                <div class="ne-izlesem__msg-bubble">
                                    <div v-if="msg.role === 'user'" class="ne-izlesem__msg-text">{{ msg.content }}</div>
                                    <template v-else>
                                        <div class="ne-izlesem__msg-text" v-html="renderMarkdown(msg.content)"></div>

                                        <div v-if="assistantMeta(msg).site_posts?.length" class="ne-izlesem__link-block">
                                            <div class="ne-izlesem__link-title">Ben İzledim içinde</div>
                                            <div class="ne-izlesem__suggestion-grid">
                                                <Link
                                                    v-for="post in assistantMeta(msg).site_posts"
                                                    :key="`site-${post.id}`"
                                                    :href="`/yazi/${post.slug}`"
                                                    class="ne-izlesem__suggestion-card"
                                                >
                                                    <span class="ne-izlesem__suggestion-kicker">Yazı linki</span>
                                                    <span class="ne-izlesem__suggestion-name">{{ post.title }}</span>
                                                </Link>
                                            </div>
                                        </div>

                                        <div v-if="assistantMeta(msg).external_suggestions?.length" class="ne-izlesem__link-block">
                                            <div class="ne-izlesem__link-title">Site dışında da bak</div>
                                            <div class="ne-izlesem__suggestion-grid">
                                                <component
                                                    :is="item.url ? 'a' : 'div'"
                                                    v-for="item in assistantMeta(msg).external_suggestions"
                                                    :key="`${item.title}-${item.year || 'na'}`"
                                                    :href="item.url || undefined"
                                                    :target="item.url ? '_blank' : undefined"
                                                    :rel="item.url ? 'noopener noreferrer' : undefined"
                                                    class="ne-izlesem__suggestion-card ne-izlesem__suggestion-card--external"
                                                    :class="{ 'is-disabled': !item.url }"
                                                >
                                                    <span class="ne-izlesem__suggestion-kicker">{{ item.type === 'series' ? 'Dizi' : 'Film' }}{{ item.year ? ` / ${item.year}` : '' }}</span>
                                                    <span class="ne-izlesem__suggestion-name">{{ item.title }}</span>
                                                    <span v-if="item.reason" class="ne-izlesem__suggestion-desc">{{ item.reason }}</span>
                                                </component>
                                            </div>
                                        </div>

                                        <div v-if="assistantMeta(msg).follow_up_options?.length" class="ne-izlesem__followups">
                                            <button
                                                v-for="option in assistantMeta(msg).follow_up_options"
                                                :key="option"
                                                type="button"
                                                class="ne-izlesem__followup-btn"
                                                @click="sendQuickPrompt(option)"
                                            >
                                                {{ option }}
                                            </button>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <!-- Loading -->
                            <div v-if="isLoading" class="ne-izlesem__msg ne-izlesem__msg--ai">
                                <div class="ne-izlesem__msg-avatar">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path d="M15.91 11.72a.5.5 0 010 .56l-1.2 2.08a.5.5 0 01-.43.25H12.6a.5.5 0 01-.44-.25l-1.2-2.08a.5.5 0 010-.56l1.2-2.08a.5.5 0 01.44-.25h1.68a.5.5 0 01.43.25l1.2 2.08z"/>
                                        <circle cx="12" cy="12" r="10"/>
                                    </svg>
                                </div>
                                <div class="ne-izlesem__msg-bubble">
                                    <div class="ne-izlesem__loading-wrap">
                                        <div class="ne-izlesem__loading-label">{{ waitingLabel }}</div>
                                        <div class="ne-izlesem__loading-svg" aria-hidden="true">
                                            <svg viewBox="0 0 120 24" fill="none">
                                                <rect x="2" y="5" width="26" height="14" rx="1.5" />
                                                <rect x="34" y="5" width="26" height="14" rx="1.5" />
                                                <rect x="66" y="5" width="26" height="14" rx="1.5" />
                                                <path d="M98 12H118" stroke-linecap="square" />
                                            </svg>
                                        </div>
                                        <div class="ne-izlesem__typing">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Scroll to Top -->
                        <button
                            v-show="showScrollTop"
                            class="ne-izlesem__scroll-top"
                            @click="scrollToTop"
                            aria-label="Basa don"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="18 15 12 9 6 15"/>
                            </svg>
                        </button>

                        <!-- Error -->
                        <div v-if="error" class="ne-izlesem__error">
                            {{ error }}
                        </div>

                        <!-- Input -->
                        <form @submit.prevent="sendMessage" class="ne-izlesem__form">
                            <input
                                v-model="input"
                                type="text"
                                placeholder="Ruh halini veya ne izlemek istediğini yaz..."
                                maxlength="500"
                                :disabled="isLoading"
                                class="ne-izlesem__input"
                                @keydown.enter.prevent="sendMessage"
                            />
                            <button
                                type="submit"
                                :disabled="isLoading || !input.trim()"
                                class="ne-izlesem__send"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"/>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                </svg>
                                <span>Gönder</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<style scoped>
.ne-izlesem {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* -- Header -- */
.ne-izlesem__header {
    border-bottom: 3px solid var(--bi-ink);
    background: var(--bi-paper);
}
.ne-izlesem__header-inner {
    max-width: 1060px;
    margin: 0 auto;
    padding: 2rem 1.5rem 1.5rem;
}
.ne-izlesem__kicker {
    font-family: var(--bi-mono);
    font-size: 0.7rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--bi-red);
    font-weight: 700;
    margin-bottom: 0.25rem;
}
.ne-izlesem__title {
    font-family: var(--bi-serif);
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 900;
    color: var(--bi-ink);
    line-height: 1.1;
    margin: 0;
}
.ne-izlesem__subtitle {
    font-family: var(--bi-mono);
    font-size: 0.8rem;
    color: var(--bi-muted);
    margin-top: 0.5rem;
    line-height: 1.5;
}
.ne-izlesem__badge {
    display: inline-block;
    background: var(--bi-ink);
    color: var(--bi-paper);
    font-size: 0.6rem;
    font-weight: 700;
    padding: 2px 8px;
    letter-spacing: 0.1em;
    vertical-align: middle;
    margin-left: 4px;
}

/* -- Layout -- */
.ne-izlesem__layout {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 1060px;
    width: 100%;
    margin: 0 auto;
}

/* -- Body -- */
.ne-izlesem__body {
    flex: 1;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    position: relative;
}
.ne-izlesem__chat-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* -- Resume Banner -- */
.ne-izlesem__resume-banner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 0.9rem;
    border: 1px solid var(--bi-rule);
    background: #faf7ef;
    font-family: var(--bi-mono);
    font-size: 0.72rem;
    color: var(--bi-muted);
    margin-bottom: 0.75rem;
}
.ne-izlesem__resume-banner svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

/* -- Messages -- */
.ne-izlesem__messages {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 1rem;
    max-height: calc(100vh - 380px);
    min-height: 300px;
}

/* -- Empty State -- */
.ne-izlesem__empty {
    padding: 2rem 1rem 1rem;
}
.ne-izlesem__empty-icon {
    width: 64px;
    height: 64px;
    margin: 0 auto 1.5rem;
    color: var(--bi-ink);
    opacity: 0.6;
}
.ne-izlesem__empty-icon svg { width: 100%; height: 100%; }
.ne-izlesem__empty-title {
    font-family: var(--bi-serif);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--bi-ink);
    margin-bottom: 0.5rem;
    text-align: center;
}
.ne-izlesem__empty-desc {
    font-family: var(--bi-mono);
    font-size: 0.8rem;
    color: var(--bi-muted);
    max-width: 420px;
    margin: 0 auto 2rem;
    line-height: 1.6;
    text-align: center;
}

/* -- Grouped Quick Prompts -- */
.ne-izlesem__prompt-groups {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}
.ne-izlesem__prompt-group-label {
    font-family: var(--bi-mono);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--bi-muted);
    margin-bottom: 0.4rem;
    padding-left: 0.2rem;
}
.ne-izlesem__prompts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}
.ne-izlesem__prompt-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.6rem 0.9rem;
    border: 2px solid var(--bi-ink);
    background: var(--bi-paper);
    color: var(--bi-ink);
    font-family: var(--bi-mono);
    font-size: 0.73rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 44px;
}
.ne-izlesem__prompt-btn:hover {
    background: var(--bi-ink);
    color: var(--bi-paper);
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 var(--bi-ink);
}
.ne-izlesem__prompt-icon { font-size: 1rem; }

/* -- Message Bubbles -- */
.ne-izlesem__msg {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    animation: msgIn 0.3s ease;
}
@keyframes msgIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
}
.ne-izlesem__msg--user {
    flex-direction: row-reverse;
}
.ne-izlesem__msg-avatar {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border: 2px solid var(--bi-ink);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bi-paper);
    margin-top: 2px;
}
.ne-izlesem__msg-avatar svg { width: 18px; height: 18px; color: var(--bi-ink); }

.ne-izlesem__msg-bubble {
    max-width: 75%;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    line-height: 1.6;
}
.ne-izlesem__msg--user .ne-izlesem__msg-bubble {
    background: var(--bi-ink);
    color: var(--bi-paper);
    border: 2px solid var(--bi-ink);
    font-family: var(--bi-mono);
    font-size: 0.8rem;
}
.ne-izlesem__msg--ai .ne-izlesem__msg-bubble {
    background: white;
    color: var(--bi-ink);
    border: 2px solid var(--bi-ink);
    font-family: var(--bi-serif);
}
.ne-izlesem__msg-text :deep(strong) {
    font-weight: 800;
    color: var(--bi-red);
}
.ne-izlesem__msg-text :deep(em) {
    font-style: italic;
    color: var(--bi-muted);
}
.ne-izlesem__msg-text :deep(.ne-izlesem__inline-link) {
    color: var(--bi-red);
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 2px;
}
.ne-izlesem__msg-text :deep(.ne-izlesem__inline-link:hover) {
    color: var(--bi-ink);
}

.ne-izlesem__link-block {
    margin-top: 0.9rem;
}

.ne-izlesem__link-title {
    font-family: var(--bi-mono);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    color: var(--bi-muted);
}

.ne-izlesem__suggestion-grid {
    display: grid;
    gap: 0.5rem;
}

.ne-izlesem__suggestion-card {
    display: block;
    border: 1px solid var(--bi-ink);
    padding: 0.7rem 0.8rem;
    text-decoration: none;
    color: inherit;
    background: rgba(255, 255, 255, 0.7);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.ne-izlesem__suggestion-card:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--bi-ink);
}

.ne-izlesem__suggestion-card--external {
    background: #faf7ef;
}

.ne-izlesem__suggestion-kicker {
    display: block;
    font-family: var(--bi-mono);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--bi-red);
}

.ne-izlesem__suggestion-name {
    display: block;
    margin-top: 0.3rem;
    font-family: var(--bi-serif);
    font-size: 1rem;
    font-weight: 800;
    line-height: 1.2;
}

.ne-izlesem__suggestion-desc {
    display: block;
    margin-top: 0.35rem;
    font-family: var(--bi-mono);
    font-size: 0.72rem;
    line-height: 1.5;
    color: var(--bi-muted);
}

.ne-izlesem__followups {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.9rem;
}

.ne-izlesem__followup-btn {
    border: 1px solid var(--bi-ink);
    background: var(--bi-paper);
    color: var(--bi-ink);
    font-family: var(--bi-mono);
    font-size: 0.72rem;
    font-weight: 700;
    min-height: 44px;
    padding: 0.55rem 0.8rem;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.ne-izlesem__followup-btn:hover {
    background: var(--bi-ink);
    color: var(--bi-paper);
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--bi-ink);
}

/* -- Scroll to Top -- */
.ne-izlesem__scroll-top {
    position: absolute;
    bottom: 5.5rem;
    right: 1.5rem;
    width: 40px;
    height: 40px;
    border: 2px solid var(--bi-ink);
    background: var(--bi-paper);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    z-index: 10;
}
.ne-izlesem__scroll-top svg {
    width: 18px;
    height: 18px;
    color: var(--bi-ink);
}
.ne-izlesem__scroll-top:hover {
    background: var(--bi-ink);
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--bi-ink);
}
.ne-izlesem__scroll-top:hover svg {
    color: var(--bi-paper);
}

/* -- Typing Indicator -- */
.ne-izlesem__loading-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.ne-izlesem__loading-label {
    font-family: var(--bi-mono);
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.ne-izlesem__loading-svg svg {
    width: 120px;
    height: 24px;
    stroke: var(--bi-ink);
}

.ne-izlesem__loading-svg rect {
    stroke-width: 1.5;
    animation: loadingBlocks 1.8s ease-in-out infinite;
}

.ne-izlesem__loading-svg rect:nth-child(2) {
    animation-delay: 0.18s;
}

.ne-izlesem__loading-svg rect:nth-child(3) {
    animation-delay: 0.36s;
}

.ne-izlesem__loading-svg path {
    stroke-width: 1.5;
    stroke-dasharray: 24;
    stroke-dashoffset: 24;
    animation: loadingLine 1.8s ease-in-out infinite;
}

.ne-izlesem__typing {
    display: flex;
    gap: 4px;
    padding: 4px 0;
}
.ne-izlesem__typing span {
    width: 6px;
    height: 6px;
    background: var(--bi-ink);
    border-radius: 50%;
    animation: typingBounce 1.2s infinite;
}
.ne-izlesem__typing span:nth-child(2) { animation-delay: 0.15s; }
.ne-izlesem__typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
    30% { transform: translateY(-6px); opacity: 1; }
}

@keyframes loadingBlocks {
    0%, 100% { fill: transparent; }
    35% { fill: rgba(198, 0, 23, 0.2); }
    65% { fill: rgba(17, 17, 17, 0.12); }
}

@keyframes loadingLine {
    0% { stroke-dashoffset: 24; opacity: 0.3; }
    50% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: -24; opacity: 0.3; }
}

/* -- Error -- */
.ne-izlesem__error {
    border: 2px solid var(--bi-red);
    background: #fef2f2;
    color: var(--bi-red-dark);
    padding: 0.75rem 1rem;
    font-family: var(--bi-mono);
    font-size: 0.8rem;
    margin-bottom: 0.75rem;
}

/* -- Input Form -- */
.ne-izlesem__form {
    display: flex;
    gap: 0.5rem;
    border-top: 2px solid var(--bi-ink);
    padding-top: 1rem;
}
.ne-izlesem__input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid var(--bi-ink);
    background: white;
    font-family: var(--bi-mono);
    font-size: 0.85rem;
    color: var(--bi-ink);
    outline: none;
    transition: box-shadow 0.15s;
    min-height: 44px;
}
.ne-izlesem__input::placeholder {
    color: var(--bi-muted);
    font-size: 0.8rem;
}
.ne-izlesem__input:focus {
    box-shadow: 3px 3px 0 var(--bi-ink);
}
.ne-izlesem__send {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    padding: 0.75rem 1.25rem;
    background: var(--bi-red);
    color: white;
    border: 2px solid var(--bi-ink);
    font-family: var(--bi-mono);
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
    min-height: 48px;
}
.ne-izlesem__send:hover:not(:disabled) {
    background: var(--bi-red-dark);
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--bi-ink);
}
.ne-izlesem__send:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.ne-izlesem__send svg { width: 16px; height: 16px; }
.ne-izlesem__send span { display: none; }

/* -- Mobile -- */
@media (max-width: 767px) {
    .ne-izlesem__layout {
        flex-direction: column;
    }

    .ne-izlesem__header-inner {
        padding: 1.4rem 1rem 1.1rem;
    }

    .ne-izlesem__body {
        padding: 1rem 0.85rem 1.25rem;
    }

    .ne-izlesem__messages {
        max-height: none;
        min-height: 0;
    }

    .ne-izlesem__empty {
        padding: 1.5rem 0 1rem;
    }

    .ne-izlesem__prompts {
        display: grid;
        grid-template-columns: 1fr;
    }

    .ne-izlesem__prompt-btn {
        justify-content: flex-start;
        width: 100%;
        text-align: left;
    }

    .ne-izlesem__msg {
        gap: 0.55rem;
        margin-bottom: 0.8rem;
    }

    .ne-izlesem__msg-avatar {
        width: 28px;
        height: 28px;
    }

    .ne-izlesem__msg-avatar svg {
        width: 16px;
        height: 16px;
    }

    .ne-izlesem__msg-bubble {
        max-width: calc(100% - 2.1rem);
        padding: 0.7rem 0.8rem;
    }

    .ne-izlesem__suggestion-card {
        padding: 0.65rem 0.7rem;
    }

    .ne-izlesem__suggestion-name {
        font-size: 0.94rem;
    }

    .ne-izlesem__suggestion-desc {
        font-size: 0.68rem;
    }

    .ne-izlesem__form {
        flex-direction: column;
    }

    .ne-izlesem__send {
        width: 100%;
    }

    .ne-izlesem__send span {
        display: inline;
    }

    .ne-izlesem__scroll-top {
        bottom: 7.5rem;
        right: 1rem;
    }
}

@media (min-width: 768px) {
    .ne-izlesem__layout {
        flex-direction: row;
    }

    .ne-izlesem__send span { display: inline; }
}
</style>
