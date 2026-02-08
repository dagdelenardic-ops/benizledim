# RSS Haber Akışı Özelliği - Uygulama Planı

## Özet
Film/dizi haber sitelerinden RSS beslemeleri çekip, gelen haberleri listeleyip, tıklamayla form alanlarını (başlık, alt başlık, metin, görsel, etiket, caption) otomatik dolduracak bir sistem.

## Yeni Dosyalar

### 1. `src/config/default-feeds.ts`
Önceden tanımlı Türkçe/uluslararası film-dizi haber RSS kaynakları:
- **Beyazperde** (beyazperde.com) - Türkçe film haberleri
- **Filmloverss** (filmloverss.com) - Türkçe film haberleri
- **Variety** (variety.com/feed) - Uluslararası
- **The Hollywood Reporter** - Uluslararası
- Kullanıcı kendi özel RSS URL'lerini de ekleyebilecek

### 2. `src/types/feed.ts`
```typescript
FeedSource     → { id, name, url, category, enabled }
FeedItem       → { id, title, description, link, pubDate, imageUrl, source }
FeedStore      → { sources, items, isLoading, selectedItem, ... }
```

### 3. `src/lib/rss-parser.ts`
- `rss-parser` npm paketi ile RSS/Atom beslemelerini parse etme
- HTML tag'lerini temizleme (description alanı genelde HTML gelir)
- Görsel çıkarma: `<enclosure>`, `<media:content>`, description içindeki `<img>` tag'lerinden
- Türkçe karakter desteği

### 4. `src/app/api/feeds/route.ts` (GET + POST)
- **GET**: Kayıtlı kaynaklardan son haberleri çek, parse et, döndür
  - Basit in-memory cache (5 dk TTL) ile gereksiz tekrar istekleri önle
  - Query param: `?sourceId=xxx` ile tek kaynak filtreleme
- **POST**: Yeni RSS kaynağı ekle / mevcut kaynağı güncelle/sil

### 5. `src/app/api/feeds/sources/route.ts` (GET + PUT)
- Feed kaynaklarını okuma ve güncelleme
- Kaynaklar `feeds.json` dosyasına kaydedilecek (proje kökünde)

### 6. `src/components/create/news-feed-panel.tsx`
Oluştur sayfasında formun üstüne eklenecek ana bileşen:
- **Üstte**: Kaynak seçici (dropdown) + "Haberleri Getir" butonu
- **Liste**: Kart görünümünde haber listesi (thumbnail, başlık, kaynak, tarih)
- **Tıklama**: Seçilen haber form alanlarını otomatik doldurur
- **Durum**: Yükleniyor, hata, boş durum göstergeleri
- Mevcut TMDB arama ile yan yana çalışır (kullanıcı isterse RSS'ten haber seçer, isterse manuel doldurur)

### 7. `src/store/feed-store.ts`
Ayrı Zustand store (content-store'dan bağımsız):
- `sources: FeedSource[]` — kayıtlı beslemeler
- `items: FeedItem[]` — çekilmiş haberler
- `isLoading`, `error`
- `selectedSourceId` — aktif filtre
- `fetchItems()`, `addSource()`, `removeSource()`, `toggleSource()`

## Değişecek Dosyalar

### 8. `src/components/create/content-form.tsx`
- En üste `<NewsFeedPanel />` bileşeni eklenecek
- Panel'den haber seçildiğinde mevcut store setter'ları kullanılacak:
  - `setTitle(item.title)`
  - `setSubtitle(item.description)` (ilk 120 karakter)
  - `setBodyText(item.description)` (tam metin)
  - `setBadgeText("HABER")`
  - `setPosterUrl(item.imageUrl)` (varsa)
  - `setCaption(otomatik oluşturulmuş caption + hashtag'ler)`

### 9. `src/app/ayarlar/page.tsx`
- Yeni bölüm: "RSS Kaynakları" yönetimi
- Kaynak ekleme/silme/açma-kapama
- Varsayılan kaynakları gösterme

### 10. `package.json`
- `rss-parser` bağımlılığı ekleme

## Kullanıcı Akışı
1. Oluştur sayfasını aç → RSS paneli en üstte, varsayılan kaynaklardan haberler otomatik yüklenir
2. Habere tıkla → Form alanları otomatik dolsun (yeşil bildirim: "Haber bilgileri dolduruldu")
3. İsterse TMDB'den film arayıp poster eklesin (varolan özellik)
4. İsterse manual olarak düzenlesin
5. Görsel oluştur → Instagram'a yayınla

## Teknik Notlar
- `rss-parser` server-side çalışır (API route içinde), client'ta değil
- CORS sorunu olmaz çünkü RSS fetch Next.js API route'u üzerinden yapılır
- Cache: Node.js in-memory Map (dev sunucusu yeniden başlatılınca sıfırlanır, sorun değil)
- Feed kaynakları `data/feeds.json`'da saklanır (localStorage değil, server-side erişilebilir)
