<script setup>
import { ref, onMounted, computed } from 'vue';
import QuizIcon from './QuizIcon.vue';
import QuizPosterArt from './QuizPosterArt.vue';

const props = defineProps({
    result: { type: Object, required: true },
});

const emit = defineEmits(['restart', 'tapFeedback']);

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
        { bg: '#161410', accent: '#E73626', text: '#FFE9B3' },
        { bg: '#C8102E', accent: '#0E5C2F', text: '#FFE7B0' },
        { bg: '#1F6E8C', accent: '#F5C518', text: '#FFE9B3' },
        { bg: '#1B43FF', accent: '#FFD23F', text: '#FFE9B3' },
        { bg: '#6E8B3D', accent: '#FAEBC8', text: '#161410' },
    ];
    const hash = (character.value.name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return palettes[hash % palettes.length];
});

const filmPalettes = [
    { bg: '#FF7AB6', accent: '#1B43FF' },
    { bg: '#1B43FF', accent: '#FFD23F' },
    { bg: '#161410', accent: '#E73626' },
    { bg: '#1F6E8C', accent: '#FFE9B3' },
    { bg: '#E73626', accent: '#161410' },
];

const distColors = [
    'var(--qz-pink)', 'var(--qz-blue)', 'var(--qz-green)',
    'var(--qz-lilac)', 'var(--qz-yellow)', 'var(--qz-red)',
    'var(--qz-ink)', 'var(--qz-ink-soft)', 'var(--qz-pink)', 'var(--qz-blue)',
];

const recommendedFilms = computed(() => {
    const c = character.value;
    const films = [];
    if (c.work) {
        films.push({ title: c.work, year: c.year, dir: '' });
    }
    const similar = props.result.similar || [];
    similar.forEach(s => {
        if (s.work && !films.find(f => f.title === s.work)) {
            films.push({ title: s.work, year: s.year, dir: '' });
        }
    });
    return films.slice(0, 5);
});

const shareText = computed(() =>
    `Ben bir ${character.value.name}'ım! Hangi film karakterisin? Sen de dene → benizledim.com/quiz`
);

function copyLink() {
    navigator.clipboard?.writeText(shareText.value);
}

function pad(n) {
    return String(n).padStart(2, '0');
}
</script>

<template>
    <!-- Glitch loading -->
    <div v-if="!revealed" class="qz-stage" style="text-align: center; padding-top: 80px;">
        <div class="qz-kicker qz-glitch-in">// VHS · OYNATILIYOR //</div>
        <div
            class="qz-display qz-chroma-strong"
            :style="{
                fontSize: 'clamp(56px, 12vw, 140px)',
                margin: '20px auto',
                animation: 'qz-glitchin .9s steps(8, end) infinite alternate',
            }"
        >
            KARAKTER<br>ARANIYOR…
        </div>
        <div
            :style="{
                display: 'inline-block',
                background: 'var(--qz-ink)',
                color: 'var(--qz-paper)',
                padding: '10px 18px',
                border: '2px solid var(--qz-ink)',
                fontFamily: 'var(--qz-mono)',
                letterSpacing: '.18em',
            }"
        >
            ░░░░░ %{{ loadPct }} ░░░░░
        </div>
    </div>

    <!-- Result -->
    <div v-else class="qz-result qz-fade-in">
        <div class="qz-result__hero">
            <div class="qz-result__poster">
                <img
                    v-if="!imgFailed"
                    :src="charImageUrl"
                    :alt="character.name"
                    class="qz-result__img"
                    @error="imgFailed = true"
                />
                <QuizPosterArt
                    v-else
                    :name="character.name.split(' ')[0].toUpperCase()"
                    :year="String(character.year || '')"
                    :director="''"
                    :tagline="character.result_archetype_tr || ''"
                    :bg="posterConfig.bg"
                    :accent="posterConfig.accent"
                    :text="posterConfig.text"
                    :big="true"
                    :film-strip="true"
                />
                <div class="qz-tape" :style="{ top: '16px', left: '22px' }" />
                <div class="qz-tape" :style="{ bottom: '24px', right: '18px', transform: 'rotate(7deg)' }" />
            </div>
            <div class="qz-result__copy">
                <h2>SEN BİR…</h2>
                <h1 class="qz-display qz-chroma">{{ character.name }}</h1>
                <div class="qz-row" :style="{ gap: '10px', marginBottom: '4px' }">
                    <span class="qz-result__match">
                        %{{ result.matchPct }}
                        <small :style="{ marginLeft: '8px' }">EŞLEŞME</small>
                    </span>
                    <span class="qz-sticker" :style="{ background: 'var(--qz-paper)' }">
                        {{ character.work }} · {{ character.year }}
                    </span>
                </div>
                <div v-if="character.result_archetype_tr" class="qz-sticker" :style="{ background: 'var(--qz-lilac)', marginBottom: '12px' }">
                    {{ character.result_archetype_tr }}
                </div>

                <div class="qz-result__quote" v-if="character.summary_tr">
                    "{{ character.summary_tr }}"
                </div>

                <p class="qz-result__bio">{{ character.result_blurb_tr }}</p>

                <div class="qz-share-row" :style="{ marginTop: '8px' }">
                    <button class="qz-btn qz-btn--ghost" @click="(e) => { emit('tapFeedback', 'tap'); copyLink(); }">
                        <QuizIcon name="link" :size="18" /> Linki kopyala
                    </button>
                    <button class="qz-btn qz-btn--ghost" @click="emit('tapFeedback', 'tap')">
                        <QuizIcon name="twitter" :size="18" /> Paylaş
                    </button>
                </div>
            </div>
        </div>

        <!-- Distribution -->
        <div class="qz-section">
            <h3>İçindeki diğerleri</h3>
            <div class="qz-kicker" :style="{ marginBottom: '14px' }">
                Saf bir karakter yok — herkes bir karışımdır. Senin dağılımın:
            </div>
            <div class="qz-dist-list">
                <div v-for="(r, i) in result.distribution" :key="r.id" class="qz-dist-row">
                    <div class="qz-dist-name">
                        <img
                            :src="`/images/quiz/characters/${r.id}.webp`"
                            :alt="r.name"
                            class="qz-dist-thumb"
                            loading="lazy"
                            @error="(e) => e.target.style.display = 'none'"
                        />
                        {{ r.name.split(' ')[0] }}
                    </div>
                    <div class="qz-dist-bar">
                        <div
                            class="qz-dist-fill"
                            :style="{ width: r.pct + '%', background: distColors[i % distColors.length] }"
                        />
                    </div>
                    <div class="qz-dist-pct">%{{ r.pct }}</div>
                </div>
            </div>
        </div>

        <!-- Top traits -->
        <div class="qz-section" v-if="result.topTraits && result.topTraits.length">
            <h3>Belirgin özelliklerin</h3>
            <div class="qz-kicker" :style="{ marginBottom: '14px' }">
                14 özellik arasında en çok öne çıkanlar:
            </div>
            <div class="qz-dist-list">
                <div v-for="t in result.topTraits" :key="t.key" class="qz-dist-row">
                    <div class="qz-dist-name">{{ t.label }}</div>
                    <div class="qz-dist-bar">
                        <div
                            class="qz-dist-fill"
                            :style="{ width: (t.value * 10) + '%', background: 'var(--qz-pink)' }"
                        />
                    </div>
                    <div class="qz-dist-pct">{{ t.value }}/10</div>
                </div>
            </div>
        </div>

        <!-- Recommended films -->
        <div class="qz-section" v-if="recommendedFilms.length">
            <h3>Sana yakışan filmler</h3>
            <div class="qz-kicker" :style="{ marginBottom: '14px' }">
                {{ character.name.split(' ')[0] }}'ın sinematik evreninden — Benizledim listesine ekle.
            </div>
            <div class="qz-films">
                <div
                    v-for="(f, i) in recommendedFilms"
                    :key="i"
                    class="qz-film"
                >
                    <div class="qz-film__art" :style="{ background: filmPalettes[i % filmPalettes.length].bg }">
                        <QuizPosterArt
                            :name="f.title.split(' ').slice(0, 2).join(' ').toUpperCase()"
                            :year="String(f.year || '')"
                            :director="f.dir || ''"
                            :bg="filmPalettes[i % filmPalettes.length].bg"
                            :accent="filmPalettes[i % filmPalettes.length].accent"
                            text="#FFE9B3"
                            :big="false"
                        />
                    </div>
                    <div class="qz-film__cap">
                        {{ f.title }}
                        <small>{{ f.year }}</small>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer CTA -->
        <div class="qz-section qz-spaced">
            <div>
                <div class="qz-kicker" :style="{ marginBottom: '6px' }">YA SEN?</div>
                <div class="qz-display" :style="{ fontSize: '32px' }">Tekrar çöz, başka bir sahnede çık.</div>
            </div>
            <div class="qz-row">
                <button class="qz-btn" @click="(e) => { emit('tapFeedback', 'next'); emit('restart'); }">
                    <QuizIcon name="refresh" :size="20" /> Tekrar çöz
                </button>
            </div>
        </div>
    </div>
</template>
