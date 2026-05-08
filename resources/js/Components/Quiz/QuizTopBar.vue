<script setup>
import QuizIcon from './QuizIcon.vue';

const props = defineProps({
    phase: { type: String, required: true },
    current: { type: Number, default: 0 },
    total: { type: Number, default: 25 },
    soundOn: { type: Boolean, default: true },
});

const emit = defineEmits(['toggleSound', 'restart']);

function pad(n) {
    return String(n).padStart(2, '0');
}
</script>

<template>
    <div class="qz-topbar">
        <div class="qz-topbar__brand">
            <span class="qz-b-tape">Benizledim</span>
            <span :style="{ fontFamily: 'var(--qz-mono)', fontSize: '11px', letterSpacing: '.14em', color: 'var(--qz-ink-soft)' }">
                / Hangi Film Karakterisin?
            </span>
        </div>
        <div class="qz-topbar__right" :style="{ flex: phase === 'question' ? 1 : 0, justifyContent: 'flex-end' }">
            <div v-if="phase === 'question'" :style="{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '520px', marginRight: '12px' }">
                <span class="qz-q-num" :style="{ whiteSpace: 'nowrap' }">
                    {{ pad(current + 1) }} / {{ pad(total) }}
                </span>
                <div class="qz-progress" :aria-label="`Soru ${current + 1} / ${total}`">
                    <div
                        v-for="i in total"
                        :key="i"
                        :class="['qz-progress__seg', i - 1 < current ? 'fill' : '', i - 1 === current ? 'cur' : '']"
                    />
                </div>
            </div>
            <button
                class="qz-iconbtn"
                :aria-label="soundOn ? 'Sesi kapat' : 'Sesi aç'"
                :title="soundOn ? 'Sesi kapat' : 'Sesi aç'"
                @click="emit('toggleSound')"
            >
                <QuizIcon :name="soundOn ? 'sound-on' : 'sound-off'" :size="20" />
            </button>
            <button
                v-if="phase !== 'start'"
                class="qz-iconbtn"
                aria-label="Baştan başla"
                title="Baştan başla"
                @click="emit('restart')"
            >
                <QuizIcon name="refresh" :size="20" />
            </button>
        </div>
    </div>
</template>
