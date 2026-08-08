<script setup>
import { computed, ref } from 'vue';
import { buildResponsiveImage } from '@/Utils/responsiveImage';

const sliderItems = [
  {
    id: 'spiderman',
    rank: '01',
    title: 'Spider-Man: Brand New Day',
    releaseDate: '31/07/2026 · TR',
    reason: 'Marvel evrenindeki güçlü marka etkisi, güçlü görsel ritim ve güçlü pazarlama potansiyeliyle bu sezonun en güçlü açılış savaşını taşıyor.',
    image: '/storage/images/releases/2026-july-plus/Spider-Man_Brand_New_Day.jpg',
  },
  {
    id: 'aang',
    rank: '02',
    title: 'Avatar: The Last Airbender (Aang)',
    releaseDate: '24/07/2026 · TR',
    reason: 'Nostalji + fantasy savaş stratejisi + büyük IP etkisi: gişe tarafında güvenli ama doğru çerçevede güçlü bir aday.',
    image: '/storage/images/releases/2026-july-plus/Avatar_Aang_The_Last_Airbender.jpg',
  },
  {
    id: 'resident-evil',
    rank: '03',
    title: 'Resident Evil',
    releaseDate: '18/09/2026 · US',
    reason: 'Korku-aksiyon evreninde güçlü marka mirasını yeni kuşağa götürme avantajı olan, yüksek ilgi alanlı bir geri dönüş.',
    image: '/storage/images/releases/2026-july-plus/Resident_Evil.jpg',
  },
  {
    id: 'dune',
    rank: '04',
    title: 'Dune: Part Three',
    releaseDate: '18/12/2026 · TR',
    reason: 'Dune ekosistemi halen “en görsel büyük film” beklentisini taşıyor; kalite ve marka gücü aynı anda yüksek.',
    image: '/storage/images/releases/2026-july-plus/Dune_Part_Three.jpg',
  },
  {
    id: 'avengers',
    rank: '05',
    title: 'Avengers: Doomsday',
    releaseDate: '18/12/2026 · TR',
    reason: 'Franchise baskısı, global sosyal etki, fan mobilizasyonu ve pazarlama çarpanı en yüksek film adaylarından biri.',
    image: '/storage/images/releases/2026-july-plus/Avengers_Doomsday.jpg',
  },
  {
    id: 'godzilla',
    rank: '06',
    title: 'Godzilla Minus Zero',
    releaseDate: '06/11/2026 · TR',
    reason: 'Kaos/afet fantazisi üst düzey seyirci çekiciliğini koruyor; güçlü görsel kurgularla ana akımda kalma şansı yüksek.',
    image: '/storage/images/releases/2026-july-plus/Godzilla_Minus_Zero.jpg',
  },
  {
    id: 'cat-hat',
    rank: '07',
    title: 'The Cat in the Hat',
    releaseDate: '06/11/2026 · US',
    reason: 'Aile segmentini hedefleyen nostaljik uyarlama hattında en güçlü pazarlama çağrışımlarından biri olarak öne çıkıyor.',
    image: '/storage/images/releases/2026-july-plus/The_Cat_in_the_Hat.jpg',
  },
  {
    id: 'angry-birds',
    rank: '08',
    title: 'The Angry Birds Movie 3',
    releaseDate: '23/12/2026 · US',
    reason: 'Animasyon IP’leri içinde genişleyen franchise kalıbına uygun; sezon sonu takviminde yüksek görselle etki alanına sahip.',
    image: '/storage/images/releases/2026-july-plus/The_Angry_Birds_Movie_3.jpg',
  },
];

// The posters are 2000-3840px wide masters, shown in a 360px-wide card. Served
// raw they cost about 8 MB on the homepage, so they go through the same variant
// endpoint every other cover on the site uses.
const cards = computed(() => sliderItems.map((item) => ({
  ...item,
  responsive: buildResponsiveImage(item.image, {
    widths: [480, 768],
    sizes: 'min(86vw, 360px)',
    fallbackWidth: 768,
  }),
})));

const sliderRef = ref(null);

const moveSlider = (step) => {
  const el = sliderRef.value;
  if (!el) {
    return;
  }

  const card = el.querySelector('.movie-slider-card');
  const gap = 24;
  const distance = (card?.offsetWidth || Math.floor(el.clientWidth * 0.9)) + gap;

  el.scrollBy({
    left: distance * step,
    behavior: 'smooth',
  });
};
</script>

<template>
  <section class="border-y-2 border-[var(--bi-ink)] bg-[var(--bi-paper)] text-[var(--bi-ink)]">
    <div class="bi-wrap py-10">
      <div class="mb-5 flex flex-col gap-3 border-b border-[var(--bi-rule-soft)] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span class="bi-kicker">2026 Temmuz sonrası</span>
          <h2 class="bi-serif mt-2 text-4xl font-bold leading-tight text-[var(--bi-ink)] md:text-5xl">Vizyona Girecek 8 Büyük Film</h2>
          <p class="mt-3 max-w-3xl text-sm leading-6 text-[var(--bi-muted)]">Görsel-odaklı slider formatı: her kart tek bir aday filmi taşır, başlık + kısa neden + çıkış tarihi ile.</p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="inline-flex h-12 w-12 items-center justify-center border border-[var(--bi-ink)] bg-white font-bold transition hover:bg-black hover:text-white"
            aria-label="Önceki kart"
            @click="moveSlider(-1)"
          >
            ‹
          </button>
          <button
            type="button"
            class="inline-flex h-12 w-12 items-center justify-center border border-[var(--bi-ink)] bg-white font-bold transition hover:bg-black hover:text-white"
            aria-label="Sonraki kart"
            @click="moveSlider(1)"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref="sliderRef"
        class="movie-slider-track scrollbar-hide flex snap-x snap-mandatory overflow-x-auto pb-4"
        role="region"
        aria-label="2026 Temmuz sonrası film sliderı"
      >
        <article
          v-for="item in cards"
          :key="item.id"
          class="movie-slider-card relative flex-shrink-0 border border-[var(--bi-ink)] bg-white shadow-[8px_8px_0_rgba(16,16,16,0.10)]"
          style="width: min(86vw, 360px);"
        >
          <div class="relative h-56 overflow-hidden border-b border-[var(--bi-rule)]">
            <img
              :src="item.responsive.src"
              :srcset="item.responsive.srcset"
              :sizes="item.responsive.sizes"
              :alt="`${item.title} görsel`"
              class="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/0" />
            <div class="absolute left-3 top-3 inline-flex items-center border border-black bg-white/85 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-black">
              {{ item.rank }}
            </div>
            <div class="absolute bottom-3 right-3 rounded-sm border border-white bg-black/70 px-3 py-1 text-xs font-bold text-white">
              {{ item.releaseDate }}
            </div>
          </div>

          <div class="p-4">
            <h3 class="bi-serif text-2xl font-bold leading-tight text-[var(--bi-ink)]">{{ item.title }}</h3>
            <p class="mt-3 text-sm leading-6 text-[var(--bi-muted)]">{{ item.reason }}</p>
            <div class="mt-4 border-t border-[var(--bi-rule-soft)] pt-4">
              <button
                type="button"
                class="inline-flex items-center gap-2 border border-[var(--bi-ink)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] transition hover:bg-black hover:text-white"
                aria-label="Detay"
              >
                Detay
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.movie-slider-track {
  gap: 1.2rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.movie-slider-track::-webkit-scrollbar {
  display: none;
}

.movie-slider-card {
  scroll-snap-align: start;
}

.movie-slider-card:first-child {
  margin-left: 0.25rem;
}

@media (min-width: 768px) {
  .movie-slider-card {
    width: 360px;
  }
}
</style>
