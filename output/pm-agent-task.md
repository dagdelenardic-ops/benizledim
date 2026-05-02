# PM Agent Task for hermesos.cloud

## Task: Ben İzledim — 6 Yeni Özellik İçin Ürün Strateji Paketi

Aşağıdaki bilgileri kullanarak **TEK BİR HTML dosyası** olarak teslim et. HTML güzel tasarlanmış, yazdırılabilir ve interaktif olmalı (CSS dahil, harici bağımlılık yok).

---

## Proje Bağlamı

**Ben İzledim** (benizledim.com) — Türkçe film, dizi ve belgesel eleştiri/tavsiye platformu. 7+ yazar, 8 kategori, ~200 yazı. Wix'ten Laravel + Vue.js'e taşındı, canlı yayında. Hedef kitle: Türkiye'deki sinema severler, özellikle 25-40 yaş, aktif sosyal medya kullanıcısı, bağımsız sinema ve kaliteli dizi takipçileri.

**Rakipler/Referanslar:**
- Letterboxd (global, film odaklı, sosyal)
- IMDb (global, veritabanı odaklı)
- Ekşi Sözlük (Türkiye, genel entry platformu)
- FilmLoverss.com (Türkiye, film haberleri)
- Beyazperde.com (Türkiye, AlloCiné Türkiye)
- Altyazı Fasikül (Türkiye, sinema dergisi)
- FilmHafızası.com (Türkiye, sinema arşivi)

**Yeni Geliştirilen 6 Özellik:**

### 1. Entry Sistemi (Sosyal Tartışma Katmanı)
Film sayfalarında Ekşi Sözlük tarzı kısa (max 500 karakter), oylanan entry'ler. Spoiler/non-spoiler ayrımı var. Anonim yazılabilir (takma ad ile). En çok oylananlar yukarıda. Mevcut yorum sisteminden ayrı — yorumlar tartışma, entry'ler kısa fikir/take.

### 2. Zaman Kapsülü
Yazar bir filmi çıktığında değerlendirir, sonra (1 yıl sonra gibi) aynı yazar "tekrar baktım" yazısı yazar. İki yazı birbirine bağlı. Yazarın fikirlerinin evrimini gösterir. SEO avantajı: güncellenmiş içerik.

### 3. Birlikte İzle (Diyalog Formatı)
İki yazar aynı filmi tartışıyor — karşılıklı konuşma formatında (chat balonu stili). Biri seviyor biri sevmiyor, veya ikisi farklı sebeplerle seviyor. Podcast'te yapılıyor ama yazılı olarak Türkçe'de yok.

### 4. Görsel Essay
Dikey scroll'lu, interaktif görsel analiz yazıları. Sahne analizi, kadraj, renk paleti, yan yana karşılaştırma blokları. Scroll tetiklemeli animasyonlar. "Every Frame a Painting"in yazılı ve interaktif versiyonu. Türkçe sinema dünyasında hiç yok.

### 5. Yerel Sinema Haritası (İstanbul)
Hangi bağımsız sinemada hangi film oynuyor, sinema deneyimi yorumları, harita üzerinde gösterim. İlk aşamada İstanbul odaklı. Kullanıcılar sinemaları 1-5 arası puanlayıp yorum yazabiliyor.

### 6. "Ne İzlesem?" AI Öneri Motoru
Claude API ile çalışan doğal dilde film önerisi. "45 dakikam var, hafif ama komedi değil" gibi ruh haline göre arayüz. Sitedeki mevcut yazılardan öncelikli olarak öneriyor. Letterboxd/IMDb'den farkı: "beğendiklerine benzer" değil, "şu anki ruh haline göre" mantığı.

---

## İstenen Çıktılar (HTML formatında)

### Bölüm 1: Rekabet Analizi (Web Araştırması Gerekli)
- **Letterboxd, Ekşi Sözlük, FilmLoverss, Beyazperde** ve benzer Türkçe/global platformların bu 6 özellik açısından karşılaştırması
- Her platform için: ne yapıyor, ne yapmıyor, güçlü/zayıf yönleri
- Ben İzledim'in farklılaşma noktaları matris tablosu
- Türkiye sinema topluluğu hakkında web araştırması (Reddit, Ekşi, Twitter/X konuşmaları)

### Bölüm 2: Opportunity Assessment (Her 6 Özellik İçin)
RICE skoru dahil, her özellik için:
- Reach (hedef kullanıcı sayısı tahmini)
- Impact (1-3 skala)
- Confidence (% — mevcut kanıta göre)
- Effort (zaten build edildi, ama ongoing maintenance effort)
- Önceliklendirme sıralaması ve gerekçe

### Bölüm 3: Go-to-Market Planı
- 6 özelliğin lansmanı için aşamalı GTM planı
- Türk sinema topluluğuna ulaşmak için kanal stratejisi (Twitter/X, Reddit r/Turkey, Ekşi Sözlük, Instagram sinema hesapları, film festivalleri)
- Her özellik için tek cümlelik value proposition (Türkçe)
- İlk 30-60-90 gün planı
- Lansman sırasını belirle — hangi özellik önce duyurulmalı?

### Bölüm 4: Kullanıcı Araştırma Planı
- 6 özelliğin validasyonu için 10 adet kullanıcı mülakat sorusu (Türkçe)
- Hedef kullanıcı segmentleri ve bulma stratejisi
- A/B test önerileri (hangi özellikler test edilmeli)
- Başarı metrikleri tablosu (her özellik için KPI'lar)

### Bölüm 5: İçerik Stratejisi ve Editoryal Plan
- Diyalog formatı ve görsel essay için ilk 5 yazı konusu önerisi
- Zaman kapsülü için uygun film/dizi seçim kriterleri
- Entry sistemini aktive etmek için "seed content" stratejisi
- Sinema haritası için ilk İstanbul sinema listesi önerisi (web araştırması ile)

### Bölüm 6: Roadmap (Now / Next / Later)
- Mevcut 6 özelliğin iyileştirilmesi için Now/Next/Later roadmap
- Her özelliğin v2 olarak ne ekleyebileceği
- 6 ay ve 12 ay vizyonu

---

## Teslim Formatı

Tek bir self-contained HTML dosyası. İçermeli:
- Modern, temiz tasarım (dark/light renk uyumu)
- Navigasyon sidebar'ı (sayfa içi linkler)
- Yazdırılabilir CSS (@media print)
- Responsive mobil görünüm
- Tablolar, matrisler ve renk kodlu skorlar
- Türkçe ana dil, teknik terimler İngilizce kalabilir

## Önemli Notlar
- Web araştırması yap: Letterboxd, FilmLoverss, Beyazperde, Ekşi Sözlük'ü incele
- Türkiye sinema pazarını araştır (kaç aktif sinema sever var, sosyal medya dinamikleri)
- "benizledim.com" sitesini web'den incele
- Gerçekçi ol — küçük ekip, sınırlı bütçe, shared hosting ortamı
- Her öneriyi kanıtla — "bence" yerine "çünkü [veri/gözlem]" formatı kullan
