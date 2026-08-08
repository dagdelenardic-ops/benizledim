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

const FORMAT_BY_ID = {
    q05: 'cards', q10: 'cards', q14: 'cards', q19: 'cards', q23: 'cards',
    q08: 'vs', q16: 'vs', q21: 'vs',
    q12: 'slider', q25: 'slider',
};
const questionFormats = computed(() => {
    return props.questions.map(q => q.format || FORMAT_BY_ID[q.id] || 'text');
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

// The page ships trait vectors for all 60 characters but no prose. The winner's
// full record is fetched here; the result screen holds a 950 ms reveal
// animation, so it lands before any of that prose is on screen. Every prose
// block is v-if guarded, so a failed fetch degrades instead of breaking.
const characterCache = new Map();

async function hydrateCharacter(result) {
    const id = result?.character?.id;
    if (!id) return;

    try {
        if (!characterCache.has(id)) {
            const response = await fetch(`/quiz/karakter/${encodeURIComponent(id)}`, {
                headers: { Accept: 'application/json' },
            });
            if (!response.ok) return;
            characterCache.set(id, await response.json());
        }

        Object.assign(result.character, characterCache.get(id));
    } catch (error) {
        // Keep the scoring-only record on screen.
    }
}

function goNext() {
    if (idx.value < total.value - 1) {
        idx.value++;
        audio.sfx.next();
    } else {
        phase.value = 'result';
        hydrateCharacter(scoring.calculateResult());
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
    <AppLayout>
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
                :characters="characters"
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
