# Ben İzledim — Codex Handoff

**Tarih**: 3 Mayıs 2026  
**Son commit**: `b425514` (main branch, güncel)  
**Canlı site**: https://benizledim.com  
**Stack**: Laravel 11 + Vue 3 + Inertia.js + Tailwind CSS 4

---

## Bugün (3 Mayıs 2026) Yapılanlar

### 1. Deploy Altyapısı Değişikliği
- **FTP deploy** shared hosting'de çok yavaş ve timeout hatası alıyordu (vendor/ klasörü ~40 dk)
- **Çözüm**: cPanel'de web Terminal erişimi keşfedildi → `git pull` ile deploy yapılıyor artık
- `.gitignore`'dan `/public/build` kaldırıldı → build asset'leri git'te takip ediliyor
- **Deploy akışı artık**: lokal `npm run build` → `git push` → cPanel Terminal'den `git pull` + `php artisan config:cache`

### 2. Ne İzlesem (AI Chat) — Tamamen Yenilendi
- **Sorun**: Gemini API çalışmıyordu (`.env`'de API key yoktu)
- **Çözüm**:
  - `.env`'ye `GEMINI_API_KEY` ve `GEMINI_TEXT_MODEL=gemini-2.5-flash` eklendi
  - `AiRecommendationService.php` system prompt'u zenginleştirildi (sinema tutkunu kişilik, markdown çıktı)
  - `Recommend/Index.vue` tamamen redesign edildi → gazete temasına uygun brutalist chat UI
  - Quick prompt'lar, markdown rendering, önerilen yazı kartları eklendi

### 3. Daha Önce (2 Mayıs) Tamamlanan İşler
- **P0**: Gemini API servis fix, "Tüm yazıları gör" UX fix, og-default.png/favicon.ico oluşturuldu
- **P1 SEO**: Canonical URL, Twitter meta, JSON-LD (WebSite + Article), SecurityHeaders middleware
- **P2**: Clean URL'ler (`/yazilar/{category:slug}`), RSS feed (`/feed`), mobil 44px touch target'lar

---

## Mevcut Teknik Durum

### Çalışan Özellikler ✅
- Ana sayfa (gazete teması)
- Yazı listesi + kategori filtreleme (clean URL)
- Yazı detay + yorum + beğeni + entry sistemi
- Ne İzlesem (Gemini AI chat)
- Podcast, Festival, Sinemalar sayfaları
- Arama
- Admin panel (gazete teması — SVG ikonlar, brutalist tasarım)
- RSS feed, Sitemap
- SEO meta (canonical, OG, JSON-LD)
- Güvenlik başlıkları (HSTS, CSP, Permissions-Policy)
- Google OAuth login

### Bilinen Sorunlar / Eksikler
- `/giris` sayfası 404 dönüyor (login route `/login` olarak tanımlı, `/giris` redirect yok)
- Admin panelden API key yönetimi henüz yok (`.env`'de elle değiştiriliyor)
- Facebook OAuth henüz kurulmadı
- Dark mode yok (gelecek faz)
- Wix'ten taşınan içeriklerdeki görseller hâlâ `static.wixstatic.com`'dan yükleniyor

### Sunucu Bilgileri
- **Hosting**: Shared hosting (LiteSpeed, cPanel, Linux)
- **cPanel**: `cpanel07-web-host-cl.turkticaret.net:2083`
- **SSH**: Portlar kapalı (22, 2222) — deploy cPanel Terminal üzerinden
- **Deploy**: `git pull` + `php artisan config:cache` (cPanel Terminal)
- **Node/npm**: Sunucuda yok — build lokal yapılıp git'e push ediliyor

### Önemli Dosyalar
| Dosya | Açıklama |
|-------|----------|
| `routes/web.php` | Tüm route tanımları |
| `config/services.php` | Gemini, Google, Facebook API config |
| `app/Services/AiRecommendationService.php` | Gemini AI chat servisi |
| `resources/js/Pages/Recommend/Index.vue` | Ne İzlesem chat UI |
| `resources/js/Components/Admin/AdminLayout.vue` | Admin panel layout (gazete teması) |
| `resources/js/Components/Layout/AppLayout.vue` | Ana layout (SEO meta, JSON-LD) |
| `resources/css/app.css` | CSS token'ları (bi-ink, bi-paper, bi-red vb.) |
| `bootstrap/app.php` | Middleware kaydı (SecurityHeaders) |

### Proje Kuralları
- `AGENTS.md` dosyasını oku — tüm mimari kararlar, veritabanı şeması ve faz planı orada
- Kod İngilizce, yorum yazma
- Composition API + `<script setup>` (Vue)
- Fat model, skinny controller (Laravel)
- Ana renk paleti: Kırmızı (#DC2626), Siyah, Krem (bi-paper: #f6f1e8)

---

## Sonraki Adımlar (Önerilen)

### Kısa Vadeli
1. `/giris` → `/login` redirect ekle
2. Wix görsellerini lokal storage'a taşı
3. Admin panelden site ayarları yönetimi (API key dahil)

### Orta Vadeli (AGENTS.md Faz 6-7)
4. Admin panel: Rich text editor iyileştirmeleri
5. Wix veri import script'i (kalan görseller)
6. Performance optimizasyonu (lazy loading, image optimization)

### Uzun Vadeli
7. Dark mode
8. İngilizce dil desteği
9. PWA desteği
