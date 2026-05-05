<script setup>
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import axios from 'axios';

const props = defineProps({
    conversations: { type: Array, default: () => [] },
    activeId: { type: Number, default: null },
});

const isOpen = ref(false);

const switchConversation = (id) => {
    router.visit(`/ne-izlesem?conversation_id=${id}`, { preserveScroll: false });
};

const startNew = async () => {
    try {
        const { data } = await axios.post('/ne-izlesem/new');
        router.visit(`/ne-izlesem?conversation_id=${data.conversationId}`, { preserveScroll: false });
    } catch {
        router.visit('/ne-izlesem');
    }
};
</script>

<template>
    <div class="ne-izlesem__history">
        <!-- Toggle (mobile) -->
        <button
            class="ne-izlesem__history-toggle"
            @click="isOpen = !isOpen"
            :aria-expanded="isOpen"
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 8v4l3 3"/>
                <circle cx="12" cy="12" r="9"/>
            </svg>
            <span>Sohbet Gecmisi ({{ conversations.length }})</span>
            <svg class="ne-izlesem__history-chevron" :class="{ 'is-open': isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
            </svg>
        </button>

        <!-- Content -->
        <div class="ne-izlesem__history-content" :class="{ 'is-open': isOpen }">
            <button class="ne-izlesem__history-new" @click="startNew">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Yeni Sohbet
            </button>

            <div v-if="conversations.length === 0" class="ne-izlesem__history-empty">
                Henuz sohbet yok
            </div>

            <ul v-else class="ne-izlesem__history-list">
                <li
                    v-for="conv in conversations"
                    :key="conv.id"
                    class="ne-izlesem__history-item"
                    :class="{ 'is-active': conv.id === activeId }"
                    @click="switchConversation(conv.id)"
                >
                    <span class="ne-izlesem__history-item-title">{{ conv.title }}</span>
                    <span class="ne-izlesem__history-item-meta">
                        {{ conv.created_at }} &middot; {{ conv.message_count }} mesaj
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.ne-izlesem__history {
    border-bottom: 2px solid var(--bi-ink);
    background: var(--bi-paper);
}

.ne-izlesem__history-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    font-family: var(--bi-mono);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--bi-ink);
    cursor: pointer;
}

.ne-izlesem__history-toggle svg:first-child {
    width: 16px;
    height: 16px;
}

.ne-izlesem__history-chevron {
    width: 14px;
    height: 14px;
    margin-left: auto;
    transition: transform 0.2s;
}

.ne-izlesem__history-chevron.is-open {
    transform: rotate(180deg);
}

.ne-izlesem__history-content {
    display: none;
    padding: 0 1rem 0.75rem;
}

.ne-izlesem__history-content.is-open {
    display: block;
}

.ne-izlesem__history-new {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    width: 100%;
    padding: 0.6rem 0.8rem;
    border: 2px solid var(--bi-ink);
    background: var(--bi-paper);
    color: var(--bi-ink);
    font-family: var(--bi-mono);
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
    margin-bottom: 0.5rem;
}

.ne-izlesem__history-new svg {
    width: 14px;
    height: 14px;
}

.ne-izlesem__history-new:hover {
    background: var(--bi-ink);
    color: var(--bi-paper);
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 var(--bi-ink);
}

.ne-izlesem__history-empty {
    font-family: var(--bi-mono);
    font-size: 0.72rem;
    color: var(--bi-muted);
    padding: 0.5rem 0;
}

.ne-izlesem__history-list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 200px;
    overflow-y: auto;
}

.ne-izlesem__history-item {
    padding: 0.55rem 0.7rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.12s;
}

.ne-izlesem__history-item:hover {
    border-color: var(--bi-ink);
    background: white;
}

.ne-izlesem__history-item.is-active {
    border-color: var(--bi-ink);
    background: white;
    box-shadow: 2px 2px 0 var(--bi-ink);
}

.ne-izlesem__history-item-title {
    display: block;
    font-family: var(--bi-serif);
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--bi-ink);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ne-izlesem__history-item-meta {
    display: block;
    font-family: var(--bi-mono);
    font-size: 0.62rem;
    color: var(--bi-muted);
    margin-top: 0.15rem;
}

@media (min-width: 768px) {
    .ne-izlesem__history-toggle {
        display: none;
    }

    .ne-izlesem__history-content {
        display: block;
        padding: 0.75rem 1rem;
    }

    .ne-izlesem__history {
        border-bottom: none;
        border-right: 2px solid var(--bi-ink);
        min-width: 220px;
        max-width: 260px;
    }

    .ne-izlesem__history-list {
        max-height: calc(100vh - 380px);
    }
}
</style>
