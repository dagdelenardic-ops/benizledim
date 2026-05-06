# Deepseek Odev — Faz B Frontend (Benizledim)

> Backend sozlesmesi `CODEX-FAZ-B-BACKEND.md`. Bu gorev Vue/Inertia tarafidir; endpoint sekillerini degistirme.

## 1. Baglam

Faz B, yazarlari ve okurlari sosyal bir cekirdekte bulusturur: yazar dizini, takip butonlari, activity feed, watchlist ve mention UX. Tasarim mevcut kirmizi/beyaz/siyah palete ve Faz A mobil yazar deneyimine uymali.

## 2. Branch ve PR

- Branch: `feature/faz-b-social-core`
- PR basligi: `feat(faz-b): social core frontend`
- Backend tamamlaninca sozlesmeye gore bagla.

## 3. Kabul Kriterleri

1. `/yazarlar` public yazar dizini acilir; arama ve takip durumu gorunur.
2. Auth kullanici yazar kartindan follow/unfollow yapabilir; sayac optimistic degil, backend cevabina gore guncellenir.
3. `/akis` auth kullanici icin takip edilen yazarlarin aktivitelerini listeler.
4. `/watchlist` auth kullanicinin kaydettigi postlari gosterir; status update ve remove calisir.
5. Post card/detail yuzeyinde watchlist butonu kullanilabilir.
6. Comment ve Entry formlarinda `@` yazinca basit mention yardimi gorunur; secim metne eklenir.
7. Mobilde bottom nav'daki "Akis" artik `/akis` route'una gider.
8. Reader/logged-out icin auth gereken islemler login modal veya login redirect ile sonlanir.

## 4. Sayfalar

### `resources/js/Pages/Author/Index.vue`

Props:

```js
authors: {
  data: [{ id, name, avatar, bio, role, posts_count, followers_count, is_following }],
  links, meta
},
filters: { q: '' }
```

UI:
- Ustte kompakt search input.
- Kartlar: avatar, isim, bio 2 satir, yazilar/follower sayisi, FollowButton.
- Public sayfa; auth yoksa follow tiklamasi LoginModal acar.

### `resources/js/Pages/Activity/Index.vue`

Props:

```js
items: { data: [{ id, type, actor, post, meta, created_at }], links, meta }
```

UI:
- Dense timeline, kart icinde kart yok.
- Type label: `post_published`, `watch_log_created`, `followed_user`, `commented`, `entry_created`, `mentioned`.
- Post varsa mini cover + title + format chip.
- Empty state: takip edilecek yazar onerisi linki `/yazarlar`.

### `resources/js/Pages/Watchlist/Index.vue`

Props:

```js
items: { data: [{ id, status, note, post, created_at, watched_at }], links, meta }
```

UI:
- Segmented filter: Hepsi / Planlanan / Izleniyor / Izlendi.
- Her item: cover, title, author, status select, remove icon button.
- Status update `PATCH /api/watchlist/{post}`.

## 5. Componentler

### `resources/js/Components/Social/FollowButton.vue`

Props: `user`, `initialFollowing`, `initialFollowersCount`, `size='sm'`.
Behavior:
- Auth yoksa `LoginModal` veya event.
- POST/DELETE `/api/users/{id}/follow`.
- Loading disabled; backend cevabiyla state update.

### `resources/js/Components/Social/WatchlistButton.vue`

Props: `post`, `initialWatchlisted`, `variant='icon'`.
Behavior:
- POST/DELETE `/api/watchlist/{post.id || post.slug}`.
- Icon button varsayilan; tooltip/title kullan.
- Detail sayfasinda text+icon olabilir.

### `resources/js/Components/Social/ActivityItem.vue`

Props: `item`.
Behavior:
- Type'a gore tek satirlik aksiyon metni.
- Post linki varsa `/yazi/{slug}`.
- Actor linki `/profile/{id}`.

### `resources/js/Components/Social/MentionTextarea.vue`

Props: `modelValue`, `placeholder`, `rows`.
Emits: `update:modelValue`.
Behavior:
- `@` sonrasi en az 2 karakterde `/yazarlar?q=` sorgusu.
- Dropdown max 5 sonuc.
- Secilince metne `@slug ` ekle.
- Native textarea gibi calismali; comment/entry formlarina entegre edilecek.

## 6. Mevcut Ekran Entegrasyonlari

- `AuthorBottomNav.vue`: "Akis" disabled olmaktan cikar, `/akis`.
- `PostCard.vue`: uygun yerde `WatchlistButton` icon.
- `Post/Show.vue`: share/like bolgesine `WatchlistButton`.
- `CommentForm.vue` ve `EntryForm.vue`: textarea yerine `MentionTextarea`.
- `Profile/Show.vue`: follow button hero alaninda; takipci sayisi stats'tan veya prop'tan.

## 7. UX Kurallari

- Kartlar sade, 8px radius veya mevcut sistem radius'u.
- Nested card yok.
- Mobilde buton metinleri tasmayacak.
- Follow/watchlist islemlerinde kisa loading state ve hata mesaji.
- Yazar dizini ve akis marketing hero degil, dogrudan kullanilabilir liste olarak acilir.

## 8. Test / QA

- `npm run build`.
- Chrome mobile 390x844:
  - `/yazarlar` arama + follow.
  - `/akis` timeline.
  - `/watchlist` status update/remove.
  - Post card/detail watchlist.
  - Comment/entry mention insertion.
- Logged-out:
  - `/yazarlar` acilir.
  - Follow/watchlist login ister.

## 9. Notlar

- Backend hazir degilken mock endpoint ekleme; Inertia props gelene kadar componentleri prop-driven yaz.
- Faz C rozet/streak/wrapped UI bu PR'a dahil degil.
