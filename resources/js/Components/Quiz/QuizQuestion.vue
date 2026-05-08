<script setup>
import { ref, computed, watch } from 'vue';
import QuizIcon from './QuizIcon.vue';

const props = defineProps({
    question: { type: Object, required: true },
    questionIndex: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    picked: { type: [Number, null], default: null },
    format: { type: String, default: 'text' },
    isLast: { type: Boolean, default: false },
    canPrev: { type: Boolean, default: false },
    canNext: { type: Boolean, default: false },
});

const emit = defineEmits(['pick', 'prev', 'next', 'tapFeedback']);

const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

const formatLabel = computed(() => {
    const map = { text: 'metin', cards: 'görsel kart', vs: 'this or that', slider: 'kaydır' };
    return map[props.format] || 'metin';
});

const sliderValue = ref(50);
const sliderReadout = computed(() => {
    const v = sliderValue.value;
    if (v < 15) return 'Kesinlikle sol';
    if (v < 35) return 'Sola yakın';
    if (v < 55) return 'Ortada bir yerde';
    if (v < 75) return 'Sağa yakın';
    if (v < 90) return 'Sağ tarafta';
    return 'Kesinlikle sağ';
});

watch(() => props.picked, (val) => {
    if (props.format === 'slider' && val != null) {
        sliderValue.value = val;
    }
});

function onSliderChange(e) {
    sliderValue.value = Number(e.target.value);
    emit('pick', sliderValue.value);
}

function onPick(idx) {
    emit('tapFeedback', 'pick');
    emit('pick', idx);
}

const cardColors = [
    { bg: '#FF7AB6', accent: '#1B43FF' },
    { bg: '#161410', accent: '#F5C518' },
    { bg: '#6E8B3D', accent: '#FAEBC8' },
    { bg: '#E73626', accent: '#161410' },
];

const vsColors = [
    { bg: '#1B43FF', accent: '#FFD23F' },
    { bg: '#E73626', accent: '#FFE9B3' },
];

function pad(n) {
    return String(n).padStart(2, '0');
}

const cardImageUrl = (optIdx) => {
    const qid = props.question?.id;
    const oid = props.question?.options?.[optIdx]?.id;
    if (!qid || !oid) return null;
    return `/images/quiz/cards/${qid}_${oid}.webp`;
};
</script>

<template>
    <div class="qz-stage qz-fade-in" :key="questionIndex">
        <div class="qz-kicker" style="margin-bottom: 8px;">
            Soru {{ pad(questionIndex + 1) }} / {{ pad(totalQuestions) }} ·&nbsp;{{ formatLabel }}
        </div>
        <h2 class="qz-q-text">{{ question.text_tr }}</h2>

        <!-- TEXT format -->
        <div v-if="format === 'text'" class="qz-answers-text">
            <button
                v-for="(opt, i) in question.options"
                :key="i"
                :class="['qz-answer-text', picked === i ? 'is-picked' : '']"
                @click="onPick(i)"
            >
                <span class="qz-a-letter">{{ letters[i] }}</span>
                <span style="flex: 1;">{{ opt.text_tr }}</span>
            </button>
        </div>

        <!-- CARDS format -->
        <div v-else-if="format === 'cards'" class="qz-answers-cards">
            <button
                v-for="(opt, i) in question.options"
                :key="i"
                :class="['qz-answer-card', picked === i ? 'is-picked' : '']"
                @click="onPick(i)"
            >
                <div class="qz-acard-art" :style="{ background: cardColors[i % cardColors.length].bg }">
                    <img
                        v-if="cardImageUrl(i)"
                        :src="cardImageUrl(i)"
                        :alt="opt.text_tr"
                        class="qz-acard-img"
                        loading="lazy"
                        @error="(e) => e.target.style.display = 'none'"
                    />
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="position: absolute; inset: 0; pointer-events: none;">
                        <circle cx="50" cy="50" r="22" :fill="cardColors[i % cardColors.length].accent" opacity=".15" />
                    </svg>
                </div>
                <div class="qz-acard-cap">
                    <span>{{ opt.text_tr }}</span>
                    <small>Seçenek {{ letters[i] }}</small>
                </div>
            </button>
        </div>

        <!-- VS format -->
        <div v-else-if="format === 'vs'" class="qz-answers-vs">
            <div
                v-for="(opt, i) in question.options.slice(0, 2)"
                :key="i"
                :class="['qz-vs-side', picked === i ? 'is-picked' : '']"
                @click="onPick(i)"
            >
                <div :style="{ fontFamily: 'var(--qz-display)', fontSize: '24px', textTransform: 'uppercase', lineHeight: 1.1 }">
                    {{ opt.text_tr }}
                </div>
                <small>Seçenek {{ letters[i] }}</small>
            </div>
            <div class="qz-vs-divider">VS</div>
        </div>

        <!-- SLIDER format -->
        <div v-else-if="format === 'slider'" class="qz-answers-slider">
            <div class="qz-slider-readout">{{ sliderReadout }}</div>
            <div class="qz-slider-track-wrap">
                <div class="qz-slider-track" />
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    :value="sliderValue"
                    class="qz-slider-input"
                    @input="onSliderChange"
                />
            </div>
            <div class="qz-slider-labels">
                <span>{{ question.options[0]?.text_tr || 'Sol' }}</span>
                <span>{{ question.options[question.options.length - 1]?.text_tr || 'Sağ' }}</span>
            </div>
        </div>

        <!-- Footer -->
        <div class="qz-qfooter">
            <button
                class="qz-iconbtn"
                aria-label="Önceki"
                :disabled="!canPrev"
                @click="emit('prev')"
            >
                <QuizIcon name="arrow-left" :size="22" />
            </button>
            <div class="qz-qfooter__hint">
                <template v-if="picked == null">Bir cevap seç →</template>
                <template v-else-if="isLast">Sonucu görmek için ileri →</template>
                <template v-else>Otomatik ilerliyor — yine de geri dönebilirsin</template>
            </div>
            <button
                class="qz-btn qz-btn--pink"
                :style="{ fontSize: '16px', padding: '12px 22px' }"
                :disabled="picked == null"
                @click="emit('next')"
            >
                {{ isLast ? 'Sonucu gör' : 'İleri' }}
                <QuizIcon name="arrow-right" :size="20" />
            </button>
        </div>
    </div>
</template>
