<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import AppLayout from '@/Components/Layout/AppLayout.vue';
import QuizTopBar from '@/Components/Quiz/QuizTopBar.vue';
import QuizStart from '@/Components/Quiz/QuizStart.vue';
import QuizQuestion from '@/Components/Quiz/QuizQuestion.vue';
import QuizResult from '@/Components/Quiz/QuizResult.vue';
import { useQuizScoring } from '@/Composables/useQuizScoring';
import { useQuizAudio } from '@/Composables/useQuizAudio';

const props = defineProps({
    questions: { type: Array, required: true },
    traits: { type: Array, required: true },
    meta: { type: Object, required: true },
    recommendation: { type: Object, required: true },
    characters: { type: Array, required: true },
});

const questionFormats = computed(() => {
    return props.questions.map((q, i) => {
        if (q.format) return q.format;
        if ([4, 9, 13, 18, 22].includes(i)) return 'cards';
        if ([7, 15, 20].includes(i)) return 'vs';
        if ([11, 24].includes(i)) return 'slider';
        return 'text';
    });
});

const phase = ref('start');
const idx = ref(0);

const scoring = useQuizScoring(props.traits, props.questions, props.characters, props.recommendation);
const audio = useQuizAudio();

const currentQuestion = computed(() => props.questions[idx.value]);
const currentFormat = computed(() => questionFormats.value[idx.value]);
const total = computed(() => props.questions.length);

function start() {
    idx.value = 0;
    scoring.reset();
    phase.value = 'question';
    window.scrollTo({ top: 0, behavior: 'instant' });
    audio.sfx.next();
}

function pick(value) {
    const format = currentFormat.value;
    if (format === 'slider') {
        scoring.answerSlider(idx.value, value);
    } else {
        scoring.answerQuestion(idx.value, value);
    }

    const isFinal = idx.value === total.value - 1;
    if (format !== 'slider' && !isFinal) {
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

function goNext() {
    if (idx.value < total.value - 1) {
        idx.value++;
        audio.sfx.next();
    } else {
        scoring.calculateResult();
        phase.value = 'result';
        audio.sfx.rewind();
        nextTick(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
        });
        setTimeout(() => audio.sfx.reveal(), 950);
    }
}

function restart() {
    phase.value = 'start';
    idx.value = 0;
    scoring.reset();
    audio.sfx.back();
    window.scrollTo({ top: 0, behavior: 'instant' });
}

function handleTapFeedback(sfxName) {
    if (audio.sfx[sfxName]) audio.sfx[sfxName]();
}

function onKeydown(e) {
    if (phase.value !== 'question') return;

    if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (scoring.answers.value[idx.value] != null) goNext();
    } else if (e.key === 'ArrowLeft') {
        goPrev();
    } else if (/^[1-4]$/.test(e.key)) {
        const optIdx = Number(e.key) - 1;
        const format = currentFormat.value;
        if ((format === 'text' || format === 'cards') && currentQuestion.value.options[optIdx]) {
            pick(optIdx);
        } else if (format === 'vs' && optIdx < 2) {
            pick(optIdx);
        }
    }
}

onMounted(() => {
    window.addEventListener('keydown', onKeydown);
    document.body.setAttribute('data-palette', 'candy');
    document.body.setAttribute('data-vhs', 'subtle');
    document.body.setAttribute('data-crt', 'on');
});
onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
    document.body.removeAttribute('data-palette');
    document.body.removeAttribute('data-vhs');
    document.body.removeAttribute('data-crt');
});
</script>

<template>
    <AppLayout
        title="Hangi Film Karakterisin? — Quiz"
        description="25 soru, 60 karakter. Senin içindeki film karakterini keşfet."
        og-image="/images/quiz-og.png"
    >
        <div class="quiz-shell">
            <QuizTopBar
                :phase="phase"
                :current="idx"
                :total="total"
                :sound-on="audio.soundOn.value"
                @toggle-sound="audio.toggleSound"
                @restart="restart"
            />

            <QuizStart
                v-if="phase === 'start'"
                :total-questions="total"
                :total-characters="characters.length"
                @start="start"
            />

            <QuizQuestion
                v-if="phase === 'question'"
                :key="idx"
                :question="currentQuestion"
                :question-index="idx"
                :total-questions="total"
                :picked="scoring.answers.value[idx]"
                :format="currentFormat"
                :is-last="idx === total - 1"
                :can-prev="idx > 0"
                :can-next="scoring.answers.value[idx] != null"
                @pick="pick"
                @prev="goPrev"
                @next="goNext"
                @tap-feedback="handleTapFeedback"
            />

            <QuizResult
                v-if="phase === 'result' && scoring.result.value"
                :result="scoring.result.value"
                @restart="restart"
                @tap-feedback="handleTapFeedback"
            />
        </div>
    </AppLayout>
</template>
