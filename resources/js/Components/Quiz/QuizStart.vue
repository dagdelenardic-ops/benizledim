<script setup>
import QuizIcon from './QuizIcon.vue';
import QuizPosterArt from './QuizPosterArt.vue';
import QuizMarquee from './QuizMarquee.vue';

const props = defineProps({
    totalQuestions: { type: Number, default: 25 },
    totalCharacters: { type: Number, default: 60 },
});

const emit = defineEmits(['start']);

const posters = [
    { name: 'WALTER', year: '2008', director: 'Gilligan', bg: '#161410', accent: '#1ec46a', text: '#FFE9B3', tag: 'Say my name' },
    { name: 'AMÉLIE', year: '2001', director: 'Jeunet', bg: '#C8102E', accent: '#0E5C2F', text: '#FFE7B0', tag: 'Le Fabuleux Destin' },
    { name: 'DAENERYS', year: '2011', director: 'Benioff', bg: '#161410', accent: '#E73626', text: '#FFE9B3', tag: 'Fire and Blood' },
    { name: 'JACK', year: '2003', director: 'Verbinski', bg: '#1F6E8C', accent: '#F5C518', text: '#FFE9B3', tag: 'Freedom' },
];

const steps = [
    { n: '01', t: 'Cevapla', d: 'Metin, görsel, this-or-that ve slider — karışık format.' },
    { n: '02', t: 'Eşleş', d: `Cevapların ${props.totalCharacters} karaktere ağırlıklı olarak puan dağıtır.` },
    { n: '03', t: 'Keşfet', d: 'Sonucunda film önerileri ve repliklerle çıkıyorsun.' },
];
</script>

<template>
    <div class="qz-start qz-fade-in">
        <div class="qz-start__copy">
            <div class="qz-row" style="margin-bottom: 6px;">
                <span class="qz-sticker" :style="{ background: 'var(--qz-green)', color: '#fff' }">● CANLI</span>
                <span class="qz-sticker">VHS · Ed. 03</span>
                <span class="qz-kicker">{{ totalQuestions }} SORU · ~5 DK</span>
            </div>
            <h1 class="qz-display qz-chroma">
                Hangi <em>film</em><br>karakterisin?
            </h1>
            <p class="qz-lede">
                {{ totalQuestions }} soru, {{ totalCharacters }} olası karakter.
                Cevap verirken kimseye danışma — içgüdün hangi sahnede, orada karakterin saklı.
            </p>
            <div class="qz-start__cta">
                <button
                    class="qz-btn"
                    @click="emit('start')"
                >
                    <QuizIcon name="play" :size="22" />
                    Quiz'e başla
                </button>
            </div>
            <div class="qz-start__meta">
                <span class="qz-sticker" :style="{ background: 'var(--qz-paper)' }">
                    <span class="qz-dot" :style="{ background: 'var(--qz-pink)' }" /> 47.382 kişi çözdü
                </span>
                <span class="qz-sticker" :style="{ background: 'var(--qz-lilac)' }">● BU HAFTA #2</span>
                <span class="qz-sticker" :style="{ background: 'var(--qz-yellow)' }">★ 4.8 ortalama</span>
            </div>

            <div class="qz-start__how">
                <div v-for="s in steps" :key="s.n" class="qz-card-hard" style="padding: 16px;">
                    <div class="qz-kicker" style="margin-bottom: 8px;">ADIM {{ s.n }}</div>
                    <div :style="{ fontFamily: 'var(--qz-display)', fontSize: '22px', textTransform: 'uppercase', lineHeight: 1, marginBottom: '6px' }">
                        {{ s.t }}
                    </div>
                    <div :style="{ fontSize: '14px', lineHeight: 1.4, color: 'var(--qz-ink-soft)' }">{{ s.d }}</div>
                </div>
            </div>
        </div>

        <div class="qz-poster-stack">
            <span class="qz-sticker qz-float-sticker s-2">YENİ</span>
            <span class="qz-sticker qz-float-sticker s-3">★ ED. PİCK</span>
            <span class="qz-sticker qz-float-sticker s-4">VHS</span>
            <div v-for="(p, i) in posters" :key="i" class="qz-poster-stack__item">
                <QuizPosterArt
                    :name="p.name"
                    :year="p.year"
                    :director="p.director"
                    :tagline="p.tag"
                    :bg="p.bg"
                    :accent="p.accent"
                    :text="p.text"
                />
                <div class="qz-tape" :style="{ top: '12px', left: '14px' }" />
            </div>
        </div>
    </div>

    <QuizMarquee>
        <span>★</span><span>VHS · 2026</span>
        <span>★</span><span>BENİZLEDİM PRESENTS</span>
        <span>★</span><span>HANGİ FİLM KARAKTERİSİN</span>
        <span>★</span><span>{{ totalQuestions }} SORU · {{ totalCharacters }} KARAKTER</span>
        <span>★</span><span>SİNEMA KULÜBÜNE HOŞ GELDİN</span>
    </QuizMarquee>
</template>
