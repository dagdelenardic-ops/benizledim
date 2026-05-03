<script setup>
import { computed, ref } from 'vue';
import { Head, usePage, router, Link, useForm } from '@inertiajs/vue3';
import LoginModal from '@/Components/Auth/LoginModal.vue';
import SearchBar from '@/Components/UI/SearchBar.vue';

const props = defineProps({
    title: String,
    description: {
        type: String,
        default: 'Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazıları - Ben İzledim',
    },
    ogImage: {
        type: String,
        default: '/images/og-default.png',
    },
    canonicalUrl: {
        type: String,
        default: '',
    },
});

const baseUrl = 'https://benizledim.com';
const currentCanonical = computed(() => {
    if (props.canonicalUrl) return props.canonicalUrl;
    const path = usePage().url?.split('?')[0] || '/';
    return `${baseUrl}${path}`;
});
const fullOgImage = computed(() => {
    if (props.ogImage.startsWith('http')) return props.ogImage;
    return `${baseUrl}${props.ogImage}`;
});
const fullTitle = computed(() => props.title ? `${props.title} - Ben İzledim` : 'Ben İzledim - Film, Dizi ve Belgesel Eleştiri Platformu');

const page = usePage();
const authUser = page.props.auth?.user;
const newsletterMessage = computed(() => page.props.flash?.newsletter_message);
const canAccessCms = computed(() => {
    return ['admin', 'editor', 'author'].includes(authUser?.role || '');
});

const showLoginModal = ref(false);
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

const openLoginModal = () => {
    showLoginModal.value = true;
};

const closeLoginModal = () => {
    showLoginModal.value = false;
};

const logout = () => {
    router.post('/logout');
};

const toggleMobileMenu = () => {
    showMobileMenu.value = !showMobileMenu.value;
};

const categoryLinks = [
    { name: 'Sinema', slug: 'sinema' },
    { name: 'Dizi', slug: 'dizi' },
    { name: 'Belgesel', slug: 'belgesel' },
    { name: 'Film', slug: 'film' },
];

// Footer Newsletter Form
const form = useForm({ email: '' });

const subscribe = () => {
    form.post('/newsletter', {
        preserveScroll: true,
        onSuccess: () => form.reset(),
    });
};

const todayLabel = computed(() => {
    return new Intl.DateTimeFormat('tr-TR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());
});
</script>

<script>
export default {
    directives: {
        'click-outside': {
            mounted(el, binding) {
                el._clickOutside = (event) => {
                    if (!(el === event.target || el.contains(event.target))) {
                        binding.value();
                    }
                };
                document.addEventListener('click', el._clickOutside, true);
            },
            unmounted(el) {
                document.removeEventListener('click', el._clickOutside, true);
            },
        },
    },
};
</script>

<template>
    <Head>
        <title>{{ fullTitle }}</title>
        <link rel="canonical" :href="currentCanonical" />
        <link rel="alternate" type="application/rss+xml" title="Ben İzledim RSS" href="https://benizledim.com/feed" />
        <meta name="description" :content="description" />
        <!-- Open Graph -->
        <meta property="og:title" :content="title || 'Ben İzledim'" />
        <meta property="og:description" :content="description" />
        <meta property="og:image" :content="fullOgImage" />
        <meta property="og:url" :content="currentCanonical" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ben İzledim" />
        <meta property="og:locale" content="tr_TR" />
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" :content="title || 'Ben İzledim'" />
        <meta name="twitter:description" :content="description" />
        <meta name="twitter:image" :content="fullOgImage" />
    </Head>

    <!-- JSON-LD WebSite Schema -->
    <component :is="'script'" type="application/ld+json" v-html="JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Ben İzledim',
        'url': 'https://benizledim.com',
        'description': 'Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazıları',
        'inLanguage': 'tr-TR',
        'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://benizledim.com/ara?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    })" />

    <header class="border-b-2 border-[var(--bi-ink)] bg-[var(--bi-paper)]">
        <div class="bg-[var(--bi-ink)] text-[var(--bi-paper)]">
            <div class="bi-wrap flex h-8 items-center justify-between gap-4 text-[0.68rem] font-bold uppercase tracking-[0.08em] bi-mono">
                <span>{{ todayLabel }} · İstanbul</span>
                <div class="hidden items-center gap-4 sm:flex">
                    <Link href="/#bulten" class="hover:text-red-300">Bülten</Link>
                    <Link href="/podcast" class="hover:text-red-300">Podcast</Link>
                    <button v-if="!authUser" @click="openLoginModal" class="hover:text-red-300">Giriş</button>
                    <Link v-else-if="canAccessCms" href="/admin" class="hover:text-red-300">Admin</Link>
                </div>
            </div>
        </div>

        <div class="bi-wrap grid gap-5 border-b border-[var(--bi-ink)] py-5 lg:grid-cols-[auto_1fr_auto] lg:items-end">
            <button
                @click="toggleMobileMenu"
                class="inline-flex h-11 w-11 items-center justify-center border border-[var(--bi-ink)] lg:hidden"
                aria-label="Menüyü aç"
            >
                <svg v-if="!showMobileMenu" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 17h16" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <Link href="/" class="bi-serif text-[clamp(2.7rem,8vw,5.8rem)] font-bold leading-none text-[var(--bi-ink)]">
                Ben<span class="px-1 text-red-700">/</span>İzledim
            </Link>

            <p class="hidden max-w-[24ch] border-l border-[var(--bi-ink)] pl-4 text-xs font-bold uppercase leading-5 tracking-[0.08em] text-[var(--bi-muted)] bi-mono lg:block">
                Film, dizi ve belgesel üzerine bağımsız eleştiri
            </p>

            <div class="flex flex-wrap items-center gap-3 lg:justify-end">
                <SearchBar placeholder="Film, dizi, yazar ara..." />
                <button
                    v-if="!authUser"
                    @click="openLoginModal"
                    class="hidden border border-[var(--bi-ink)] bg-[var(--bi-ink)] px-4 py-2 text-sm font-bold text-[var(--bi-paper)] transition hover:bg-red-700 md:inline-flex"
                >
                    Giriş
                </button>

                <div v-else class="relative hidden md:block">
                    <button
                        @click="showUserMenu = !showUserMenu"
                        class="flex items-center gap-2 border border-[var(--bi-ink)] bg-[var(--bi-paper)] px-3 py-2 text-sm font-bold"
                    >
                        <img v-if="authUser.avatar" :src="authUser.avatar" :alt="authUser.name" class="h-7 w-7 rounded-full object-cover" />
                        <span v-else class="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-white">{{ authUser?.name?.charAt(0)?.toUpperCase() || '?' }}</span>
                        <span class="max-w-32 truncate">{{ authUser.name }}</span>
                    </button>
                    <Transition
                        enter-active-class="transition duration-100 ease-out"
                        enter-from-class="scale-95 opacity-0"
                        enter-to-class="scale-100 opacity-100"
                        leave-active-class="transition duration-75 ease-in"
                        leave-from-class="scale-100 opacity-100"
                        leave-to-class="scale-95 opacity-0"
                    >
                        <div
                            v-if="showUserMenu"
                            class="absolute right-0 z-50 mt-2 w-52 border border-[var(--bi-ink)] bg-[var(--bi-paper)] py-1 shadow-[6px_6px_0_var(--bi-ink)]"
                            v-click-outside="() => showUserMenu = false"
                        >
                            <Link :href="`/profile/${authUser.id}`" class="block px-4 py-2 text-sm hover:bg-[var(--bi-paper-deep)]">Profilim</Link>
                            <Link v-if="canAccessCms" href="/admin" class="block px-4 py-2 text-sm hover:bg-[var(--bi-paper-deep)]">Admin Panel</Link>
                            <button @click="logout" class="block w-full px-4 py-2 text-left text-sm hover:bg-[var(--bi-paper-deep)]">Çıkış Yap</button>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

        <nav class="bi-wrap hidden h-12 items-stretch justify-between border-b border-[var(--bi-ink)] lg:flex">
            <div class="flex">
                <Link href="/" class="border-x border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono">Ana Sayfa</Link>
                <Link
                    v-for="cat in categoryLinks"
                    :key="cat.slug"
                    :href="`/yazilar?category=${cat.slug}`"
                    class="border-r border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono"
                >
                    {{ cat.name }}
                </Link>
                <Link href="/podcast" class="border-r border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono">Podcast</Link>
                <Link href="/festival" class="border-r border-[var(--bi-rule-soft)] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] hover:bg-[var(--bi-ink)] hover:text-[var(--bi-paper)] bi-mono">Festival</Link>
            </div>
            <Link href="/ne-izlesem" class="ne-izlesem-nav-button inline-flex min-w-[132px] items-center justify-center px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.08em] text-white bi-mono">
                Ne İzlesem?
            </Link>
        </nav>

        <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
        >
            <div v-if="showMobileMenu" class="bi-wrap border-b border-[var(--bi-ink)] py-4 lg:hidden">
                <div class="grid gap-2">
                    <Link href="/" class="bi-chip" @click="showMobileMenu = false">Ana Sayfa</Link>
                    <Link v-for="cat in categoryLinks" :key="cat.slug" :href="`/yazilar?category=${cat.slug}`" class="bi-chip" @click="showMobileMenu = false">
                        {{ cat.name }}
                    </Link>
                    <Link href="/podcast" class="bi-chip" @click="showMobileMenu = false">Podcast</Link>
                    <Link href="/festival" class="bi-chip" @click="showMobileMenu = false">Festival</Link>
                    <Link href="/sinemalar" class="bi-chip" @click="showMobileMenu = false">Sinemalar</Link>
                    <Link href="/ne-izlesem" class="bi-chip" @click="showMobileMenu = false">Ne İzlesem?</Link>
                    <button v-if="!authUser" @click="openLoginModal(); showMobileMenu = false" class="bi-chip text-left">Giriş Yap</button>
                    <Link v-else-if="canAccessCms" href="/admin" class="bi-chip" @click="showMobileMenu = false">Admin Panel</Link>
                </div>
            </div>
        </Transition>
    </header>

    <!-- Content -->
    <main class="min-h-screen">
        <slot />
    </main>

    <footer class="border-t-2 border-[var(--bi-ink)] bg-[var(--bi-ink)] text-[var(--bi-paper)]">
        <div class="bi-wrap py-12">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-[1.2fr_0.8fr_1fr]">
                <div id="bulten">
                    <h3 class="bi-serif mb-4 text-4xl font-bold">Ben/İzledim</h3>
                    <p class="max-w-md text-sm leading-relaxed text-stone-300">
                        Film, Dizi ve Belgeseller hakkında eleştiri ve tavsiye yazılarının yer aldığı
                        bir medya ve eğlence platformudur.
                    </p>
                </div>

                <div>
                    <h4 class="bi-mono mb-4 text-xs font-bold uppercase tracking-[0.08em] text-red-300">Kategoriler</h4>
                    <ul class="space-y-2 text-sm">
                        <li>
                            <Link href="/yazilar?category=sinema" class="text-stone-300 hover:text-white transition-colors">
                                Sinema
                            </Link>
                        </li>
                        <li>
                            <Link href="/yazilar?category=dizi" class="text-stone-300 hover:text-white transition-colors">
                                Dizi
                            </Link>
                        </li>
                        <li>
                            <Link href="/yazilar?category=belgesel" class="text-stone-300 hover:text-white transition-colors">
                                Belgesel
                            </Link>
                        </li>
                        <li>
                            <Link href="/yazilar?category=film" class="text-stone-300 hover:text-white transition-colors">
                                Film
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 class="bi-mono mb-4 text-xs font-bold uppercase tracking-[0.08em] text-red-300">Önce Siz Okuyun</h4>
                    <p class="mb-4 text-sm text-stone-300">
                        Yeni blog yazılarımızdan ve haberlerden ilk siz haberdar olun!
                    </p>
                    
                    <div v-if="newsletterMessage" class="mb-3">
                        <div class="border border-green-200 bg-green-100 px-3 py-2 text-sm text-green-700">
                            {{ newsletterMessage }}
                        </div>
                    </div>
                    
                    <form @submit.prevent="subscribe" class="flex gap-2" novalidate>
                        <input
                            v-model="form.email"
                            type="email"
                            placeholder="E-posta adresiniz"
                            class="min-w-0 flex-1 border border-stone-500 bg-transparent px-3 py-2 text-sm text-white placeholder-stone-400 focus:border-red-400 focus:outline-none"
                            :class="{ 'border-red-500': form.errors.email }"
                        />
                        <button
                            type="submit"
                            :disabled="form.processing"
                            class="bg-red-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
                        >
                            Abone
                        </button>
                    </form>
                    <p v-if="form.errors.email" class="mt-2 text-red-400 text-xs">{{ form.errors.email }}</p>
                </div>
            </div>

            <div class="bi-mono mt-8 border-t border-stone-700 pt-8 text-center text-xs uppercase tracking-[0.08em] text-stone-500">
                © {{ new Date().getFullYear() }} Ben İzledim. Tüm hakları saklıdır.
            </div>
        </div>
    </footer>

    <!-- Login Modal -->
    <LoginModal :show="showLoginModal" @close="closeLoginModal" />
</template>

<style scoped>
.ne-izlesem-nav-button {
    background: linear-gradient(90deg, #111111 0 50%, #c40017 50% 100%);
    background-size: 200% 100%;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    animation: ne-izlesem-button-shift 3.2s steps(2, end) infinite;
}

.ne-izlesem-nav-button:hover {
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
}

@keyframes ne-izlesem-button-shift {
    0%, 49.999% { background-position: 0% 50%; }
    50%, 100% { background-position: 100% 50%; }
}
</style>
