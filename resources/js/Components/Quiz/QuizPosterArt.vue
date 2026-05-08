<script setup>
const props = defineProps({
    bg: { type: String, default: '#161410' },
    accent: { type: String, default: '#E73626' },
    text: { type: String, default: '#FFE9B3' },
    name: { type: String, default: '' },
    year: { type: [String, Number], default: '' },
    director: { type: String, default: '' },
    tagline: { type: String, default: '' },
    big: { type: Boolean, default: false },
    filmStrip: { type: Boolean, default: false },
});

const grainId = 'grain-' + (props.name || '').replace(/\s/g, '');
</script>

<template>
    <div :style="{ position: 'absolute', inset: 0, background: bg, color: text }">
        <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 150"
            preserveAspectRatio="none"
            style="position: absolute; inset: 0; opacity: 0.5; mix-blend-mode: multiply;"
        >
            <defs>
                <pattern :id="grainId" width="6" height="6" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.6" :fill="accent" opacity="0.4" />
                </pattern>
            </defs>
            <rect width="100" height="150" :fill="`url(#${grainId})`" />
            <circle cx="80" cy="35" r="20" :fill="accent" opacity="0.35" />
            <path d="M0 100 Q50 80 100 100 L100 150 L0 150 Z" :fill="accent" opacity="0.25" />
        </svg>
        <div :class="['qz-poster-art', filmStrip ? 'qz-film-strip' : '']" :style="{ color: text }">
            <div>
                <div :style="{ fontFamily: 'var(--qz-mono)', fontSize: big ? '11px' : '10px', letterSpacing: '.18em', opacity: 0.85 }">
                    BENİZLEDİM · QUIZ
                </div>
                <div v-if="tagline && big" class="qz-pa-tag" style="margin-top: 6px;">"{{ tagline }}"</div>
            </div>
            <div>
                <div class="qz-pa-name" :style="{ fontSize: big ? 'clamp(34px, 4.4vw, 64px)' : 'clamp(20px,3vw,30px)' }">
                    {{ name }}
                </div>
                <div class="qz-pa-meta" style="margin-top: 8px;">
                    <span>{{ year }}</span>
                    <span>{{ director }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
