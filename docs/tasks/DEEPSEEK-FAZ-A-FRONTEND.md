# Deepseek Ödev — Faz A Frontend + PWA (Benizledim)

> **Not:** Bu görev paralel olarak Codex backend (`CODEX-FAZ-A-BACKEND.md`) ile yürür. API'ler orada yazılıyor; sen burada **sadece tüketicisin**. Endpoint'lerin/JSON şemalarının değişmesini isteme — değişiklik talebin varsa PR yorumunda belirt.

## 1. Bağlam (kısa)

Benizledim film/dizi/belgesel platformu (Laravel 12 + Inertia 2 + Vue 3.5 + Vite 7 + Tailwind 4, SSR aktif). Yazarlar mobilden:
- PWA olarak ana ekrana ekliyor
- Push bildirim alıyor
- 30 saniyede TMDB'den film bulup "watch-log" notu girebiliyor
- Letterboxd hesabını bağlayabiliyor
- Profilinde Letterboxd-tarzı stat kartı görüyor
- Mobil bottom nav'la hızlı dolaşabiliyor

Bu görev **sadece frontend (Vue + sw.js + Vite PWA + Blade meta)** kısmıdır.

## 2. Branch ve PR

- Branch: `feature/faz-a-frontend`
- PR başlığı: `feat(faz-a): frontend — PWA, bottom nav, quick-log modal, stat card, letterboxd connect`
- Backend PR'ından sonra rebase edip merge et (sözleşme orada).

## 3. Kabul Kriterleri

1. Mobilde (Chrome devtools 390x844) yazar girişli kullanıcı `AuthorBottomNav` görür; reader veya logged-out görmez.
2. Bottom nav orta `+` butonuna basınca `QuickLogModal` (mobilde full-screen, desktop'ta modal) açılır; TMDB'den arama → seçim → 1-10 yıldız → max 3 mood chip → 280 char not → "Yayınla" → toast "Not eklendi" + redirect `/yazar`.
3. `/yazar` route'u `Author/Home.vue` render eder; Stat Card 4-grid Letterboxd-style; "Letterboxd Bağla" CTA; "Push Aktif Et" CTA.
4. Push opt-in çalışır — Notification.requestPermission → PushManager.subscribe → backend'e POST → test push gelir (Codex tarafı `/api/push/test` sağlıyor).
5. PWA install: Chrome address bar'da install icon görünür, install sonrası standalone window açılır, splash kırmızı (#dc2626).
6. iOS Safari'de: "Paylaş ▸ Ana Ekrana Ekle" sonrası ikon ana ekranda; standalone'da `usePWAInstall` iOS algılar ve push opt-in'den önce "Önce ana ekrana ekle" mesajı verir.
7. Service worker `image.tmdb.org` ve `/api/tmdb/search` cache'ler (DevTools Application sekmesinde Cache Storage görünür).
8. `/profile/{user}` sayfasında hero altında `AuthorStatCard` görünür; sekmeler "Yazılar / Watch-Log / Listeler" çalışır (query param `?format=...`).
9. Letterboxd connect: username gir → preview 5 entry görünür → "evet bu ben" → confirm; "Şimdi sync et" butonu sonuç toast'lar.

## 4. Bağımlılıklar (NPM)

```
npm i -D vite-plugin-pwa workbox-window
npm i workbox-strategies workbox-routing workbox-precaching workbox-expiration workbox-cacheable-response
```

## 5. Vite PWA Config

`vite.config.js`'e `VitePWA` plugin ekle:
```js
import { VitePWA } from 'vite-plugin-pwa';

VitePWA({
  registerType: 'autoUpdate',
  strategies: 'injectManifest',
  srcDir: 'resources/js',
  filename: 'sw.js',
  injectRegister: false,                 // Blade'de manuel register edeceğiz
  injectManifest: { swSrc: 'resources/js/sw.js', swDest: 'public/build/sw.js' },
  manifest: {
    name: 'Ben/İzledim',
    short_name: 'Ben/İzledim',
    description: 'Film, dizi, belgesel notları',
    start_url: '/yazar',
    scope: '/',
    display: 'standalone',
    theme_color: '#dc2626',
    background_color: '#ffffff',
    lang: 'tr',
    icons: [
      { src: '/icons/192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' }
    ],
    shortcuts: [
      { name: 'Hızlı Not', url: '/yazar?action=log', icons: [{ src: '/icons/192.png', sizes: '192x192' }] }
    ]
  }
})
```

İkonlar: `public/icons/{192,512,192-maskable}.png`. Geçici olarak red-600 düz renk + beyaz "B/İ" tipografi ile placeholder oluştur (`docs/tasks/icon-placeholder.txt`'a Figma/Photopea talimatı bırak); finalden önce gerçek ikon bekle.

## 6. Service Worker (`resources/js/sw.js`)

```js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

precacheAndRoute(self.__WB_MANIFEST);

// TMDB CDN — uzun cache
registerRoute(
  ({ url }) => url.hostname === 'image.tmdb.org',
  new CacheFirst({
    cacheName: 'tmdb-images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// TMDB search — stale-while-revalidate
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/tmdb/search'),
  new StaleWhileRevalidate({ cacheName: 'tmdb-search', plugins: [new ExpirationPlugin({ maxAgeSeconds: 86400 })] })
);

// Public yazılar — network first, fallback offline
registerRoute(
  ({ url, request }) => url.pathname.startsWith('/yazi/') && request.headers.get('X-Inertia') !== 'true',
  new NetworkFirst({ cacheName: 'posts', networkTimeoutSeconds: 3, plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 7 * 86400 })] })
);

// Admin / yazar / API write paths — asla cache'leme
registerRoute(
  ({ url }) => url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/quick-log') || url.pathname.startsWith('/api/push') || url.pathname.startsWith('/api/letterboxd'),
  new NetworkOnly()
);

// Inertia partial reload — bypass
registerRoute(
  ({ request }) => request.headers.get('X-Inertia') === 'true',
  new NetworkOnly()
);

// Push handler
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(self.registration.showNotification(data.title || 'Ben/İzledim', {
    body: data.body || '',
    icon: '/icons/192.png',
    badge: '/icons/badge.png',
    data: { url: data.url || '/' },
    tag: data.tag || undefined,
  }));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

self.addEventListener('message', event => { if (event.data?.type === 'SKIP_WAITING') self.skipWaiting(); });
```

## 7. Blade Değişikliği — `resources/views/app.blade.php`

`<head>` içine ekle:
```html
<meta name="theme-color" content="#dc2626">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Ben/İzledim">
<link rel="apple-touch-icon" href="/icons/192.png">
<link rel="manifest" href="/build/manifest.webmanifest">
```

`@inertiaHead` sonrası, `</body>` öncesi:
```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/build/sw.js'));
  }
</script>
```

## 8. Yazılacak Vue Component'leri (yol → sorumluluk → props/emit)

### `resources/js/Components/Layout/AuthorBottomNav.vue`
- `lg:hidden`, `fixed inset-x-0 bottom-0 z-40`, `pb-[env(safe-area-inset-bottom)]`.
- 5 tab: Anasayfa (`/yazar`), Akış (`/akis`, Faz B'ye kadar disabled chip "Yakında"), **+** (büyük FAB, ortalanmış, kırmızı), Bildirimler (`/bildirimler`, Faz A'da basit `localStorage.unread` count'u — backend yok), Profil (`/profile/{me}`).
- TipTap editor sayfasında gizle — `route().current('admin.posts.edit')` kontrolü veya layout'a slot prop ile.

### `resources/js/Components/Author/QuickLogModal.vue`
Props: `open: boolean`, `presetTmdb?: object`. Emits: `close`, `submitted(post)`.
- `useMediaQuery` veya basit `window.innerWidth < 768` ile mobilde full-screen drawer (Tailwind transform), desktop'ta `<dialog>` veya `@headlessui/vue Dialog`.
- Adım 1: TMDB autocomplete — input + `axios.get('/api/tmdb/search', { params: { q, type: 'multi' } })` 300ms debounce. Sonuç listesi: küçük poster + başlık + (yıl) + tip rozeti.
- Adım 2: Seçilince üstte selected card (poster + başlık + yıl + X). Form alanları:
  - Yıldız (1-10): 10 tap noktası, doluk-içi-doluk visual.
  - Mood chip: Mevcut `mood_tags` taksonomisinden (Codex'ten property al; yoksa hardcode liste: `romantik, gerilim, melankolik, vintage, suç, zihin-büküşü, retro, cesur, duygusal, sessiz`). Max 3 select.
  - Not textarea: 280 char counter, sayı kırmızıya yaklaşırsa renk değişir.
  - Tarih: `<input type="date">` default bugün.
  - Toggle: "Yayınla" (default) / "Taslak".
- Submit: Inertia `useForm({...}).post('/api/quick-log', { onSuccess: () => emit('submitted'), onError: ... })`.
- TMDB seçilmediyse manuel `external_title` + `external_year` alanları görünür.
- `cover_image` = TMDB poster `https://image.tmdb.org/t/p/w780{poster_path}` — request body'sine ekle.

### `resources/js/Components/Author/AuthorStatCard.vue`
Props: `stats: object` (Codex'in döndürdüğü 12 anahtarlı obje), `year?: number`.
4-grid layout (`grid grid-cols-2 lg:grid-cols-4 gap-3`):
- Card 1: "Bu Yıl" — büyük rakam = `posts_count + watch_logs_count`, alt: "{posts_count} yazı, {watch_logs_count} not"
- Card 2: "Beğeni" — `total_likes_received`, alt: avg_rating varsa "Ortalama X.X ⭐"
- Card 3: "En çok beğenilen" — most_liked_post varsa mini card (cover + title), yoksa "Henüz yok"
- Card 4: "Mood Paletin" — top_mood_tags chip rozetleri (en fazla 3)
Tüm kartlar: `bg-white border border-gray-100 rounded-xl p-4 shadow-sm`. Sayılar `text-3xl font-bold text-red-600`.

### `resources/js/Components/Author/PushOptInCard.vue`
- Görünüm: `localStorage.visit_count >= 2` ve `Notification.permission === 'default'` ve `localStorage.push_dismissed_at` 7 günden eski.
- "Bildirim Al" butonu → `usePushSubscription().subscribe()` → success toast + test push (`POST /api/push/test`).
- "Şimdi değil" butonu → `localStorage.push_dismissed_at = now`.
- iOS algılanırsa (Safari + standalone değil) farklı mesaj: "Önce Paylaş ▸ Ana Ekrana Ekle".

### `resources/js/Components/Author/LetterboxdConnectCard.vue`
- Props: `letterboxd: { username, enabled, lastSyncAt }`.
- Üç durum: bağlı değil → input + "Bağla"; preview onay → 5 entry listesi + "Bu benim" / "Hayır"; bağlı → son sync tarihi + "Şimdi sync et" + "Bağlantıyı kes".
- API: `/api/letterboxd/connect` → preview, `/api/letterboxd/confirm`, `/api/letterboxd/sync-now`, `/api/letterboxd` DELETE.

### `resources/js/Components/Post/WatchLogCard.vue`
Props: `post: Post`.
- Aspect-ratio kareye yakın (`aspect-[2/3]` poster üst, alt 1/3 metadata).
- Poster: `post.cover_image` (TMDB CDN URL doğrudan, lazy load, `srcset` opsiyonel).
- Üst sol köşe: yazar avatar + isim. Üst sağ: yıldız (filled count = `post.rating`).
- Alt: başlık (1 satır clamp), watched_on tarih, mood chips (max 2).
- Tıklanabilir → `/yazi/{slug}` (Inertia Link).

### `resources/js/Pages/Author/Home.vue`
- Layout: `AppLayout`.
- Üst: hoşgeldin başlık + büyük "+" CTA Quick Log açar.
- `<AuthorStatCard :stats="stats" />`.
- `<PushOptInCard />` (koşullu).
- `<LetterboxdConnectCard :letterboxd="letterboxd" />`.
- "Son Notların" başlık + `recentLogs` `WatchLogCard` grid (3 sütun mobil 1).
- "Son Yazıların" başlık + `recentPosts` PostCard.
- `pendingDrafts > 0` ise üstte sarı banner: "X Letterboxd taslağın gözden geçirilmeyi bekliyor".

### Composables — `resources/js/Composables/`

**`usePWAInstall.js`**
```js
import { ref, onMounted } from 'vue';
export function usePWAInstall() {
  const deferredPrompt = ref(null);
  const canInstall = ref(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  onMounted(() => {
    window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredPrompt.value = e; canInstall.value = true; });
  });
  const install = async () => { if (!deferredPrompt.value) return; deferredPrompt.value.prompt(); await deferredPrompt.value.userChoice; deferredPrompt.value = null; canInstall.value = false; };
  return { canInstall, install, isIOS, isStandalone };
}
```

**`usePushSubscription.js`**
```js
import { ref } from 'vue';
import axios from 'axios';

export function usePushSubscription() {
  const isSubscribed = ref(false);
  const supported = 'serviceWorker' in navigator && 'PushManager' in window;

  const urlBase64ToUint8Array = (b64) => { const padding = '='.repeat((4 - b64.length % 4) % 4); const base64 = (b64 + padding).replace(/-/g,'+').replace(/_/g,'/'); const raw = atob(base64); return Uint8Array.from([...raw].map(c => c.charCodeAt(0))); };

  const subscribe = async (vapidPublicKey) => {
    if (!supported) throw new Error('Push desteklenmiyor');
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') throw new Error('İzin verilmedi');
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) });
    await axios.post('/api/push/subscribe', sub.toJSON());
    isSubscribed.value = true;
    await axios.post('/api/push/test');
  };
  const unsubscribe = async () => { const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.getSubscription(); if (sub) { await axios.delete('/api/push/subscribe', { data: { endpoint: sub.endpoint } }); await sub.unsubscribe(); } isSubscribed.value = false; };

  return { supported, isSubscribed, subscribe, unsubscribe };
}
```

**`useUnreadNotifications.js`** — Faz A'da minimal: `localStorage.unread_count` döndür. Faz B'de backend bağlanır.

## 9. AppLayout Değişikliği — `resources/js/Components/Layout/AppLayout.vue`

- `<AuthorBottomNav v-if="$page.props.auth?.user?.canAccessCms" />` (Codex `auth.user.canAccessCms` boolean'ı sharedData'ya ekleyecek; şimdiden destekle).
- `<main>` class'ına `pb-20 lg:pb-0` ekle ki bottom nav içeriği örtmesin.

## 10. Profile Sayfası Değişikliği — `resources/js/Pages/Profile/Show.vue`

- Hero altına `<AuthorStatCard :stats="stats" />` (Codex `stats` prop'u verecek).
- Sekmeler: "Yazılar" / "Watch-Log" / "Listeler" (Faz C'ye kadar Listeler disabled).
- Sekme tıklayınca Inertia router visit `?format=standard` / `?format=watch_log`.
- Watch-log sekmesinde grid `WatchLogCard`, yazı sekmesinde mevcut `PostCard`.

## 11. Backend Sözleşme Hatırlatması (Codex'ten geliyor)

Endpoint'ler ve şemalar `CODEX-FAZ-A-BACKEND.md` Bölüm 10'da tam olarak. Değiştirme.

## 12. Test ve Doğrulama

**Lokal:**
1. `npm install && npm run dev`, ayrı terminalde `php artisan serve`.
2. Chrome devtools 390x844 emule, login (yazar) → `/yazar` redirect mi.
3. Bottom nav görünüyor; reader hesabıyla login → görünmüyor.
4. "+" tıkla → modal açıldı, "inception" yaz → autocomplete listeyi getirdi mi (network tab `/api/tmdb/search` 200).
5. Sonuç seç, 8 yıldız + "gerilim,sessiz" + "Yıllar sonra hala işliyor." + Yayınla → `/yazar` redirect, toast.
6. `/profile/{me}` → Stat Card "Bu Yıl: 1 not", Watch-Log sekmesinde card görünüyor, poster `image.tmdb.org`'tan yükleniyor.
7. PushOptInCard'ı tetiklemek için `localStorage.setItem('visit_count', '3')` → reload → "Bildirim Al" görünüyor → izin ver → test push geldi mi.
8. Application sekmesi → Manifest (Lighthouse PWA testi geçiyor mu) → Service Workers (sw.js active) → Cache Storage (`tmdb-images`, `tmdb-search`).
9. Chrome Lighthouse PWA score ≥ 90.
10. iOS gerçek cihaz Safari → Paylaş → Ana Ekrana Ekle → ikon kırmızı, açınca standalone.
11. Letterboxd connect: bilinen bir public username ile dene (örn. `dave`), preview döndü mü, sync sonrası taslaklar oluştu mu.

**Build:**
```
npm run build
ls -la public/build/sw.js public/build/manifest.webmanifest
```

## 13. Risk Notları

- Inertia 2 + Vue 3.5 + Vite 7 + vite-plugin-pwa son sürüm uyumu — eğer `injectManifest` build'de "self.__WB_MANIFEST not replaced" hatası verirse, vite-plugin-pwa version'ı `^0.20`'a sabitle.
- SSR build (`vite build --ssr`) servisworker dosyasını işlemeye çalışmamalı; `sw.js` rollupOptions input'undan dışlanmalı (vite-plugin-pwa otomatik halleder ama doğrula).
- `image.tmdb.org` CSP — `app.blade.php`'de Content-Security-Policy varsa `img-src` listesine ekle (`https://image.tmdb.org`). Mevcut CSP yoksa atla.
- iOS standalone'da `window.location.reload()` davranışı bozuk olabilir — `Inertia.reload()` tercih.
- Bottom nav z-index Tiptap editor toolbar (`z-50`) ile çakışmasın; `z-40` kullan + admin/posts/edit'te gizle.
- TipTap zaten kurulu (`@tiptap/starter-kit`), yeni editor istemiyoruz; Quick Log textarea düz `<textarea>`.

## 14. Tamamlanma Sinyali

PR açtığında:
- Bölüm 12'deki test maddelerinin her biri için checkmark.
- Lighthouse PWA puanı ekran görüntüsü.
- Mobil video (15 sn) Quick Log akışını gösteren — opsiyonel ama tercih.
- Bilinmeyen breakage: Codex API'si geç gelirse, `axios` çağrılarını `try/catch` + console.warn ile koru ki UI build kırılmasın.
