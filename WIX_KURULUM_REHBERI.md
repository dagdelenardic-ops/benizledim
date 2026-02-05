# Wix'e Quiz Ekleme Rehberi

## Yöntem 1: GitHub Pages ile Ücretsiz Hosting (Önerilen)

### Adım 1: GitHub Hesabı Oluştur
1. https://github.com adresine git
2. Ücretsiz hesap oluştur (zaten varsa giriş yap)

### Adım 2: Yeni Repository Oluştur
1. Sağ üstteki "+" butonuna tıkla → "New repository"
2. Repository name: `hangi-karaktersin`
3. Public seçili olsun
4. "Create repository" butonuna tıkla

### Adım 3: Dosyaları Yükle
1. "uploading an existing file" linkine tıkla
2. Bu 3 dosyayı sürükle-bırak ile yükle:
   - `index.html`
   - `quiz_questions.json`
   - `quiz_characters.json`
3. "Commit changes" butonuna tıkla

### Adım 4: GitHub Pages'ı Aktifleştir
1. Repository'de "Settings" sekmesine git
2. Sol menüden "Pages" tıkla
3. Source kısmında "Deploy from a branch" seç
4. Branch: "main" ve "/ (root)" seç
5. "Save" butonuna tıkla
6. Birkaç dakika bekle, sayfa adresi görünecek:
   `https://KULLANICI_ADIN.github.io/hangi-karaktersin/`

### Adım 5: Wix'e Ekle
1. Wix Editor'ü aç
2. Sol menüden "Gömülü Kod" seç
3. "HTML iframe" veya "Embed a Site" seç
4. Sayfaya sürükle
5. GitHub Pages adresini yapıştır:
   `https://KULLANICI_ADIN.github.io/hangi-karaktersin/`
6. iframe'i tam sayfa olacak şekilde boyutlandır

---

## Yöntem 2: Netlify ile Hosting (Alternatif)

### Adım 1: Netlify'a Git
1. https://www.netlify.com adresine git
2. GitHub ile ücretsiz kayıt ol

### Adım 2: Dosyaları Yükle
1. "Sites" sekmesinde "drag and drop" alanını bul
2. `quiz_pack` klasörünü sürükle-bırak
3. Otomatik olarak site oluşturulacak
4. Verilen URL'yi kopyala (örn: `https://random-name.netlify.app`)

### Adım 3: Wix'e Ekle
(Yöntem 1, Adım 5 ile aynı)

---

## Wix'te iframe Ayarları

iframe ekledikten sonra:

1. **Boyut:** Genişlik %100, Yükseklik en az 800px
2. **Mobil:** Mobil görünümde de kontrol et
3. **Scrolling:** "Yes" olarak ayarla

### Tam Sayfa Quiz için:
Wix'te yeni bir boş sayfa oluştur ve sadece iframe koy.
Sayfa ayarlarından header/footer gizleyebilirsin.

---

## Alternatif: Doğrudan Wix Custom Code

Wix Premium planın varsa:
1. Sol menü → Gömülü Kod → Custom Code
2. `<head>` veya `<body>` bölümüne kod ekleyebilirsin

Ama iframe yöntemi daha basit ve güvenilir.

---

## Sorun Giderme

**Sayfa yüklenmiyor:**
- GitHub Pages aktif mi kontrol et (birkaç dakika bekle)
- URL'yi doğru yazdığından emin ol

**Mobilde düzgün görünmüyor:**
- Wix'te iframe'in mobil ayarlarını kontrol et
- Responsive boyutlandırma yap

**CORS hatası:**
- Dosyaların aynı domain'de olduğundan emin ol
- GitHub Pages'ta tüm dosyalar aynı repo'da olmalı
