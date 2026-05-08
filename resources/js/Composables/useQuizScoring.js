import { ref, computed } from 'vue';

export function useQuizScoring(traits, questions, characters, recommendation) {
    const baseline = 5;
    const traitMin = 0;
    const traitMax = 10;
    const traitKeys = traits.map(t => t.key);

    const userTraits = ref({});
    const answers = ref({});
    const result = ref(null);

    function initialize() {
        const initial = {};
        traitKeys.forEach(k => { initial[k] = baseline; });
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
            const current = { ...userTraits.value };
            Object.entries(prevEffects).forEach(([k, v]) => {
                if (current[k] !== undefined) current[k] = clamp(current[k] - v * effectScale);
            });
            userTraits.value = current;
        }

        answers.value = { ...answers.value, [qIndex]: optIndex };

        const effects = questions[qIndex].options[optIndex]?.effects || {};
        const current = { ...userTraits.value };
        Object.entries(effects).forEach(([k, v]) => {
            if (current[k] !== undefined) current[k] = clamp(current[k] + v * effectScale);
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
        const metric = recommendation.distance_metric === 'euclidean' ? euclideanDistance : manhattanDistance;
        const maxPossible = recommendation.distance_metric === 'euclidean'
            ? Math.sqrt(traitKeys.length * traitMax * traitMax)
            : traitKeys.length * traitMax;

        const tieBreakers = recommendation.tie_breakers || ['resilience', 'logic', 'integrity'];

        const scored = characters.map(char => {
            const distance = metric(userTraits.value, char.traits);
            return { ...char, distance };
        });

        scored.sort((a, b) => {
            if (Math.abs(a.distance - b.distance) > 0.001) return a.distance - b.distance;
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
            archetype: c.result_archetype_tr,
        }));

        const topTraits = [...traitKeys]
            .map(k => ({ key: k, value: Math.round(userTraits.value[k] * 10) / 10, label: traits.find(t => t.key === k)?.label_tr || k }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        result.value = {
            character: best,
            matchPct,
            similar: scored.slice(1, topN + 1),
            distribution,
            topTraits,
            userTraits: { ...userTraits.value },
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
        reset,
    };
}
