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

const TRAIT_COPY = {
    leadership: {
        high: 'Sahnede sen varsan, plan da sende olur. İnsanlar nereye gideceklerini sana bakarak öğrenir.',
        low: 'Yönetmek senin oyunun değil — sen kendi yolunu çiziyorsun, başkalarını sürüklemek istemiyorsun.',
        verb: 'Yönlendirme',
    },
    logic: {
        high: 'Önce kafanda kurarsın, sonra söze dökersin. Karmaşık şeyleri sade hale getirmek senin doğan.',
        low: 'Sen analizden çok sezgiyle hareket ediyorsun. Her şeyi tablolaştırmak hayatı sıkıcı kılar diye düşünüyorsun.',
        verb: 'Mantık',
    },
    empathy: {
        high: 'Karşındaki söylemeden anlıyorsun. Bu seni güvenli liman yapıyor — ama bazen başkasının yükünü çok taşıyorsun.',
        low: 'Empatin selektif: hak edene açık, klişeye değil. Acıma değil anlama tarzındasın.',
        verb: 'Empati',
    },
    ambition: {
        high: 'Hedef görürsen rahat duramıyorsun. Konfor sana enerji değil, durgunluk veriyor.',
        low: 'Yarış senin oyunun değil. Mutluluğu hedefte değil, anın içinde arıyorsun.',
        verb: 'Hırs',
    },
    risk: {
        high: 'Belirsizliği sevmiyorsun, koklayarak gidiyorsun. Riski hesapladığında atlamaktan çekinmiyorsun.',
        low: 'Önce zemini kontrol edersin, sonra adım atarsın. Sürpriz pek senin tarzın değil.',
        verb: 'Risk',
    },
    integrity: {
        high: 'Söz verirsen yapıyorsun, yalanı görürsen geri çekilmiyorsun. Bu seni az ama derin ilişki sahibi yapıyor.',
        low: 'İlkelerinde esneksin — bağlam senin için kuraldan önemli. "Duruma göre" sözü senin için klişe değil, prensip.',
        verb: 'İlkesellik',
    },
    loyalty: {
        high: 'Bir defa girdiğin çekmeceden çıkmıyorsun. Senin kaybedişlerin de, sevdiklerin de uzun.',
        low: 'Sadakatini hak etmek lazım. Otomatik bağlanmak senin tarzın değil; insan değişirse sen de değişirsin.',
        verb: 'Sadakat',
    },
    independence: {
        high: 'Tek başınalık seni yormuyor, tam tersi şarj ediyor. Birinin onayını beklemek seni boğuyor.',
        low: 'Yalnız iyi değilsin — paylaşmak senin için lüks değil, ihtiyaç. Ekipte daha hızlısın.',
        verb: 'Bağımsızlık',
    },
    sociability: {
        high: 'Kalabalık seni şarj ediyor. Tanıştığın insanları hatırlıyor, yeni bağlar kurmakta hızlısın.',
        low: 'Az ama derin — tarzın bu. Yapay sohbet yerine sessizlik tercih edersin.',
        verb: 'Sosyallik',
    },
    humor: {
        high: 'Mizah senin için kalkan değil; zekânın doğal hali. En zor sahnede bile bir cümlelik şaka çıkarabilirsin.',
        low: 'Espri yapmaktan çok izlemekten zevk alıyorsun. Ciddiyetinin altında hassas bir kalp var.',
        verb: 'Mizah',
    },
    creativity: {
        high: 'Standart çözümler seni sıkıyor. Beynin sürekli "ya şöyle olsa" diye soruyor.',
        low: 'Çark çalışıyor mu, dokunma; senin tarzın bu. Yenilik için yenilik istemiyorsun.',
        verb: 'Yaratıcılık',
    },
    resilience: {
        high: 'Dibine vursan toparlıyorsun. Senin "tamam" demen başkasının "henüz başlıyorum" demesi gibi.',
        low: 'Darbeleri içine atıyorsun ama atlatmak zaman alıyor. İyileşmek için sessizliğe ihtiyacın var.',
        verb: 'Dayanıklılık',
    },
    control: {
        high: 'Plan, takvim, liste — bunlar seni rahatlatıyor. Belirsizliği azaltmak için her zaman bir tedbir alırsın.',
        low: 'Akış senin için pusula. Çok planlamak yaratıcılığını kısıtladığını biliyorsun.',
        verb: 'Kontrol',
    },
    sensitivity: {
        high: 'Detayları, tonu, bakışı yakalıyorsun. Bu hem sanatına hem yorgunluğuna yansıyor.',
        low: 'Sen frekansı düşük tutuyorsun — duygulara değil mantığa odaklanıyorsun. Bu seni krizde sabit tutuyor.',
        verb: 'Hassasiyet',
    },
};

function levelOf(value) {
    if (value >= 7) return 'high';
    if (value <= 4) return 'low';
    return 'mid';
}

const superpower = computed(() => {
    const top = props.result.topTraits[0];
    const second = props.result.topTraits[1];
    if (!top) return null;
    const tCopy = TRAIT_COPY[top.key];
    const sCopy = second ? TRAIT_COPY[second.key] : null;
    return {
        title: tCopy?.verb || top.label,
        body: tCopy?.high || '',
        combo: sCopy ? `${tCopy?.verb || top.label} × ${sCopy?.verb || second.label}` : null,
    };
});

const shadowSide = computed(() => {
    const bottom = (props.result.bottomTraits || [])[0];
    if (!bottom) return null;
    const tCopy = TRAIT_COPY[bottom.key];
    return {
        title: tCopy?.verb || bottom.label,
        body: tCopy?.low || '',
        value: bottom.value,
    };
});

const shineMoments = computed(() => {
    const u = props.result.userTraits || {};
    const out = [];
    if ((u.leadership ?? 5) >= 7) out.push('Karar verilmesi gereken zor bir toplantıda — sana güveniyorlar.');
    if ((u.logic ?? 5) >= 7) out.push('Karmaşık bir problemi parçalara ayırırken — gözlerin parlıyor.');
    if ((u.empathy ?? 5) >= 7) out.push('Bir arkadaşın seni zor gününde araması — sözleri sende yer buluyor.');
    if ((u.creativity ?? 5) >= 7) out.push('Hiç kimsenin düşünmediği çözümün senden çıktığı an.');
    if ((u.humor ?? 5) >= 7) out.push('Tansiyonun yüksek olduğu bir ortamı bir cümleyle gevşettiğinde.');
    if ((u.resilience ?? 5) >= 7) out.push('Herkes pes ettiğinde seni "ayakta nasıl duruyor" diye izleyenlerin gözünde.');
    if ((u.independence ?? 5) >= 7) out.push('Tek başına bir şeyi sıfırdan kurduğunda — kimseye sormadın, oldu.');
    return out.slice(0, 4);
});

const struggleMoments = computed(() => {
    const u = props.result.userTraits || {};
    const out = [];
    if ((u.sociability ?? 5) <= 4) out.push('Tanımadığın insanlarla zorunlu small talk yaparken.');
    if ((u.control ?? 5) >= 7) out.push('Plan dışı bir şey çıktığında — esnekleşmek için bir an gerekiyor.');
    if ((u.humor ?? 5) <= 4) out.push('Klişe esprilere doğal tepki veremediğinde.');
    if ((u.empathy ?? 5) <= 4) out.push('Birinin "anlamak değil sadece dinle" istediğini fark ettiğinde.');
    if ((u.risk ?? 5) <= 4) out.push('Hesapsız bir karar vermen gerektiğinde — beynin durmuyor.');
    if ((u.resilience ?? 5) <= 4) out.push('Üst üste gelen darbelerden sonra toparlanma süren uzadığında.');
    if ((u.independence ?? 5) <= 4) out.push('Uzun süre yalnız çalışmak zorunda kaldığında — sosyal pile ihtiyacın var.');
    if ((u.leadership ?? 5) <= 4) out.push('Kimse karar vermiyorsa ve sıra sana geliyorsa.');
    return out.slice(0, 3);
});

const relationshipText = computed(() => {
    const score = props.result.profile?.relationships ?? 20;
    if (score >= 30) return 'İlişkilerinde derin ve sıcaksın. İnsanlar seninle kendilerini güvende hissediyor; ama bazen başkasının duygusal yükünü taşımaktan yoruluyorsun. Sınır koymak öğrenilesi bir kas senin için.';
    if (score >= 22) return 'İlişkilerinde dengeli; yakın ama mesafeli durabilen biri. Az ama gerçek bağ kurmayı seçiyorsun. Yapay yakınlık seni rahatsız ediyor.';
    return 'İlişkilerinde özgürlük öncelik. Birine bağlanırken kendini kaybetmemek senin için kritik. Bu seni soğuk değil, kendine sadık yapıyor.';
});

const careerText = computed(() => {
    const score = props.result.profile?.career ?? 20;
    if (score >= 32) return 'Kariyerde rotada giden tipsin. Hedef belirleyip ona kilitlenmen kolay; "ne istediğini bilmek" senin avantajın. Risk: tükenmişlik. Mola da bir strateji.';
    if (score >= 24) return 'Kariyerde ne çok yarışçı ne de pasif — kendi temponla ilerliyorsun. Ölçüsünü kendin koyuyorsun, dış başarı kriterleri seni o kadar etkilemiyor.';
    return 'Kariyer senin için bir öncelik değil, anlam senin için öncelik. Klasik başarı çizelgesi yerine "kendine yakın hissettiğin iş" peşindesin.';
});

const stressText = computed(() => {
    const u = props.result.userTraits || {};
    if ((u.humor ?? 5) >= 7) return 'Stres anında mizaha kaçıyorsun — kendinle dalga geçmek senin sigortan. Bu sağlıklı bir kas, ama bazen hissi de çağırmayı dene.';
    if ((u.resilience ?? 5) >= 7) return 'Stres seni kolay yıkmıyor. Ama "yıkılmamak" hissetmemekle aynı şey değil — toparlanma süreni de hak ediyorsun.';
    if ((u.control ?? 5) >= 7) return 'Stres anında plan yaparak rahatlıyorsun. Listeler, tablolar, takvimler senin nefesin. Belirsizlikle barışmak öğrenilesi.';
    return 'Stres anında içine çekiliyor, sessizliği seçiyorsun. Bu senin işleme tarzın; ama yalnızlık çok uzarsa konuşacak biri lazım.';
});

const weekTip = computed(() => {
    const u = props.result.userTraits || {};
    const tips = [];
    if ((u.creativity ?? 5) >= 7) tips.push('Bu hafta hiç planlamadığın bir film aç. Yorum okumadan bitir, sonra hissini yaz.');
    if ((u.empathy ?? 5) >= 7) tips.push('Bir yakınına "sadece dinlemek istedim" diye mesaj at. Cevap bekleme.');
    if ((u.control ?? 5) >= 7) tips.push('Bu hafta tek bir günü "plansız" geçir. Gerilimi yeniden gözlemle.');
    if ((u.humor ?? 5) >= 7) tips.push('En sevdiğin komedi karakterini izle — kendini görüyor olabilirsin.');
    if ((u.independence ?? 5) >= 7) tips.push('Bu hafta birinden küçük bir şey iste. Yardım kabul etmek de bir kas.');
    if ((u.sensitivity ?? 5) >= 7) tips.push('Hissettiğini hemen yazmaya çalışma. 24 saat bekle, sonra bak.');
    return tips.length ? tips[0] : 'Bu hafta hiç tanışmadığın bir yönetmenin filmiyle başla. Yeni bir frekans dene.';
});

const tagLabels = {
    pratik_zeka: 'Pratik zekâ',
    dayanıklılık: 'Dayanıklılık',
    mizah: 'Mizah',
    problem_cozucu: 'Problem çözücü',
    lider: 'Lider',
    karizma: 'Karizma',
    cesaret: 'Cesaret',
    zekâ: 'Zekâ',
    analitik: 'Analitik',
    duygusal: 'Duygusal',
    yaratıcı: 'Yaratıcı',
    bağımsız: 'Bağımsız',
    sadık: 'Sadık',
    empatik: 'Empatik',
    karanlık: 'Karanlık',
    vizyoner: 'Vizyoner',
    direngen: 'Dirençli',
    sosyal: 'Sosyal',
    melankolik: 'Melankolik',
};

const characterTags = computed(() => {
    return (character.value.tags || []).map(t => tagLabels[t] || t.replace(/_/g, ' '));
});
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

                <div v-if="characterTags.length" class="qz-row" :style="{ gap: '6px', flexWrap: 'wrap', marginTop: '10px' }">
                    <span v-for="tag in characterTags" :key="tag" class="qz-sticker" :style="{ background: 'var(--qz-paper)', fontSize: '11px', padding: '4px 10px' }">
                        #{{ tag }}
                    </span>
                </div>

                <div v-if="result.profile?.mbti" class="qz-kicker" :style="{ marginTop: '14px', fontFamily: 'var(--qz-mono)', color: 'var(--qz-ink-soft)' }">
                    MBTI ipucu: <b :style="{ color: 'var(--qz-ink)' }">{{ result.profile.mbti }}</b>
                </div>

                <div class="qz-share-row" :style="{ marginTop: '14px' }">
                    <button class="qz-btn qz-btn--ghost" @click="(e) => { emit('tapFeedback', 'tap'); copyLink(); }">
                        <QuizIcon name="link" :size="18" /> Linki kopyala
                    </button>
                    <button class="qz-btn qz-btn--ghost" @click="emit('tapFeedback', 'tap')">
                        <QuizIcon name="twitter" :size="18" /> Paylaş
                    </button>
                </div>
            </div>
        </div>

        <!-- Karakterin ünlü repliği -->
        <div v-if="character.famous_quote_tr" class="qz-section qz-quote-feature">
            <div class="qz-kicker">// {{ character.name.toUpperCase() }} DİYOR Kİ //</div>
            <blockquote class="qz-quote-big">
                <span class="qz-quote-mark">"</span>{{ character.famous_quote_tr }}<span class="qz-quote-mark">"</span>
            </blockquote>
            <div class="qz-kicker" :style="{ color: 'var(--qz-ink-soft)', textAlign: 'right' }">
                — {{ character.work }} ({{ character.year }})
            </div>
        </div>

        <!-- Sen & karakter — kişiselleştirilmiş anlatı -->
        <div v-if="character.if_you_are_tr" class="qz-section qz-section--narrative">
            <div class="qz-kicker">// SEN VE BU KARAKTER //</div>
            <p class="qz-narrative-body">{{ character.if_you_are_tr }}</p>
        </div>

        <!-- Derinlik + Karanlık + Sınanma -->
        <div class="qz-section">
            <h3>Karakterin haritası</h3>
            <div class="qz-kicker" :style="{ marginBottom: '18px' }">
                {{ character.name }} hangi köklerden besleniyor — neyin altında ezilebiliyor?
            </div>
            <div class="qz-map-grid">
                <div v-if="character.depth_tr" class="qz-map-card qz-map-card--depth">
                    <div class="qz-map-label">DERİNLİK · KÖKLERİ</div>
                    <p>{{ character.depth_tr }}</p>
                </div>
                <div v-if="character.shadow_tr" class="qz-map-card qz-map-card--shadow">
                    <div class="qz-map-label">GÖRMEDİĞİ KARANLIK</div>
                    <p>{{ character.shadow_tr }}</p>
                </div>
                <div v-if="character.challenge_tr" class="qz-map-card qz-map-card--challenge">
                    <div class="qz-map-label">EN ZORLANDIĞI YER</div>
                    <p>{{ character.challenge_tr }}</p>
                </div>
                <div v-if="character.growth_arc_tr" class="qz-map-card qz-map-card--growth">
                    <div class="qz-map-label">İÇ YOLCULUĞU</div>
                    <p>{{ character.growth_arc_tr }}</p>
                </div>
            </div>
        </div>

        <!-- İlişkilerinde + Modern dünyada -->
        <div class="qz-section qz-twocol" v-if="character.as_friend_tr || character.as_partner_tr">
            <div v-if="character.as_friend_tr" class="qz-rel-card">
                <div class="qz-rel-icon" :style="{ background: 'var(--qz-yellow)' }">★</div>
                <div class="qz-rel-title">ARKADAŞ OLARAK</div>
                <p>{{ character.as_friend_tr }}</p>
            </div>
            <div v-if="character.as_partner_tr" class="qz-rel-card">
                <div class="qz-rel-icon" :style="{ background: 'var(--qz-pink)' }">♥</div>
                <div class="qz-rel-title">PARTNER OLARAK</div>
                <p>{{ character.as_partner_tr }}</p>
            </div>
        </div>

        <div class="qz-section" v-if="character.career_dna_tr">
            <h3>Bugün yaşasaydı…</h3>
            <div class="qz-kicker" :style="{ marginBottom: '14px' }">
                Karakterin DNA'sı modern bir ofiste / serbest hayatta nasıl çalışırdı —
            </div>
            <div class="qz-modern-card">
                <p>{{ character.career_dna_tr }}</p>
            </div>
        </div>

        <!-- Süper Güç + Karanlık Taraf -->
        <div class="qz-section qz-twocol" v-if="superpower">
            <div class="qz-card-feature qz-card-feature--bright">
                <div class="qz-kicker">// SÜPER GÜCÜN //</div>
                <h2 class="qz-display qz-chroma" :style="{ fontSize: 'clamp(38px, 5vw, 64px)', lineHeight: '0.9', margin: '8px 0 12px' }">
                    {{ superpower.title }}
                </h2>
                <p class="qz-feature-body">{{ superpower.body }}</p>
                <div v-if="superpower.combo" class="qz-sticker" :style="{ background: 'var(--qz-yellow)', marginTop: '14px' }">
                    KOMBO · {{ superpower.combo }}
                </div>
            </div>
            <div v-if="shadowSide" class="qz-card-feature qz-card-feature--dark">
                <div class="qz-kicker" :style="{ color: 'var(--qz-paper)' }">// KARANLIK TARAFIN //</div>
                <h2 class="qz-display" :style="{ fontSize: 'clamp(38px, 5vw, 64px)', lineHeight: '0.9', margin: '8px 0 12px', color: 'var(--qz-paper)' }">
                    {{ shadowSide.title }}
                </h2>
                <p class="qz-feature-body" :style="{ color: 'var(--qz-paper)' }">{{ shadowSide.body }}</p>
                <div class="qz-sticker" :style="{ background: 'var(--qz-red)', color: 'var(--qz-paper)', marginTop: '14px' }">
                    {{ shadowSide.value }}/10 · GELİŞİM ALANI
                </div>
            </div>
        </div>

        <!-- Nasıl Parlarsın / Nerede Zorlanırsın -->
        <div class="qz-section qz-twocol">
            <div v-if="shineMoments.length">
                <h3>Nasıl parlarsın?</h3>
                <div class="qz-kicker" :style="{ marginBottom: '14px' }">
                    Bu sahnelerde sen tam kendinsin —
                </div>
                <ul class="qz-list">
                    <li v-for="(m, i) in shineMoments" :key="i">
                        <span class="qz-list-num">{{ pad(i + 1) }}</span>
                        {{ m }}
                    </li>
                </ul>
            </div>
            <div v-if="struggleMoments.length">
                <h3>Nerede zorlanırsın?</h3>
                <div class="qz-kicker" :style="{ marginBottom: '14px' }">
                    Bu anlarda sen biraz kendinden uzaktasın —
                </div>
                <ul class="qz-list qz-list--alt">
                    <li v-for="(m, i) in struggleMoments" :key="i">
                        <span class="qz-list-num">{{ pad(i + 1) }}</span>
                        {{ m }}
                    </li>
                </ul>
            </div>
        </div>

        <!-- 3 hayat alanı -->
        <div class="qz-section">
            <h3>Hayatın üç alanında sen</h3>
            <div class="qz-kicker" :style="{ marginBottom: '18px' }">
                İlişkilerin · Kariyerin · Stres anın
            </div>
            <div class="qz-life">
                <div class="qz-life-card">
                    <div class="qz-life-icon" :style="{ background: 'var(--qz-pink)' }">♥</div>
                    <div class="qz-life-title">İlişkilerinde</div>
                    <p>{{ relationshipText }}</p>
                </div>
                <div class="qz-life-card">
                    <div class="qz-life-icon" :style="{ background: 'var(--qz-yellow)' }">★</div>
                    <div class="qz-life-title">İş & kariyerinde</div>
                    <p>{{ careerText }}</p>
                </div>
                <div class="qz-life-card">
                    <div class="qz-life-icon" :style="{ background: 'var(--qz-blue)', color: 'var(--qz-paper)' }">⚡</div>
                    <div class="qz-life-title">Stres anında</div>
                    <p>{{ stressText }}</p>
                </div>
            </div>
        </div>

        <!-- Bu hafta için -->
        <div class="qz-section qz-week-tip">
            <div class="qz-kicker">// BU HAFTA İÇİN BİR DENEY //</div>
            <h2 class="qz-display" :style="{ fontSize: 'clamp(28px, 4vw, 44px)', margin: '10px 0' }">
                {{ weekTip }}
            </h2>
            <small :style="{ fontFamily: 'var(--qz-mono)', color: 'var(--qz-ink-soft)' }">
                Quiz'in sana özel önerisi · 7 gün sonra kendine sor
            </small>
        </div>

        <!-- Zıt kutbun -->
        <div v-if="result.opposite" class="qz-section qz-opposite">
            <div class="qz-row" :style="{ gap: '18px', alignItems: 'center', flexWrap: 'wrap' }">
                <img
                    :src="`/images/quiz/characters/${result.opposite.id}.webp`"
                    :alt="result.opposite.name"
                    class="qz-opposite-img"
                    loading="lazy"
                />
                <div :style="{ flex: '1 1 280px' }">
                    <div class="qz-kicker">// EN UZAK FREKANSIN //</div>
                    <h3 :style="{ margin: '6px 0 8px' }">{{ result.opposite.name }} senin zıt kutbun.</h3>
                    <p :style="{ margin: 0, color: 'var(--qz-ink-soft)' }">
                        <em>{{ result.opposite.work }}</em> ({{ result.opposite.year }}) · {{ result.opposite.archetype }}.
                        Bu karakter sana yabancı geliyor; ama tam olarak senin geliştirmediğin yanların onda var.
                        Bir akşam onun filmini izle — kendine yabancı bir şey öğrenmek için.
                    </p>
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
