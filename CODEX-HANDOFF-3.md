# Codex Handoff 3 — Ne İzlesem Persistence + History

## Durum: BUILD HAZIR — DEPLOY BEKLIYOR

---

## Ne Yapıldı (tamamlandı)

### Backend

1. **`app/Http/Middleware/EnsureVisitorId.php`** — YENİ OLUŞTURULDU
   - Her web isteğinde `bi_visitor_id` cookie'sini okur
   - Yoksa UUID v4 oluşturur, 365 günlük httpOnly cookie set eder
   - `$request->attributes->set('visitor_id', $visitorId)` ile controller'a iletir

2. **`bootstrap/app.php`** — GÜNCELLENDİ
   - `EnsureVisitorId` middleware'i web stack'e eklendi
   - Sıra: SecurityHeaders → CanonicalHost → EnsureVisitorId → HandleInertia

3. **`app/Models/AiConversation.php`** — GÜNCELLENDİ
   - `fillable`: `visitor_id` ve `title` eklendi
   - `scopeForOwner($query, ?int $userId, ?string $visitorId)` scope'u eklendi
     - userId varsa: `WHERE user_id = $userId`
     - yoksa: `WHERE visitor_id = $visitorId`

4. **`app/Http/Controllers/AiRecommendationController.php`** — TAM REFACTOR
   - `resolveOwner()` → `[userId, visitorId]` döndürür (session_id kullanımı bitti)
   - `index()` → conversations listesi + aktif sohbet döndürür (conversation_id query param ile seçilebilir)
   - `chat()` → visitor_id ile conversation bulur/oluşturur; ilk mesajdan title set eder
   - `newConversation()` → yeni boş sohbet oluşturur, `conversationId` döndürür

5. **`routes/web.php`** — GÜNCELLENDİ
   - `GET /_ops/migrate?token=<REDACTED_OPS_TOKEN>` — üretimde migration çalıştırır
   - `POST /ne-izlesem/new` — yeni sohbet endpoint'i (`recommend.new`)

6. **`database/migrations/2026_05_05_074616_add_visitor_id_and_title_to_ai_conversations_table.php`** — YENİ
   - `ai_conversations` tablosuna `visitor_id VARCHAR(64) NULL` ekler
   - `title VARCHAR(255) NULL` ekler
   - `session_id` nullable yapılır
   - İndeks: `(visitor_id, updated_at)` ve `(user_id, updated_at)`

### Frontend

7. **`resources/js/Components/Recommend/ConversationHistory.vue`** — YENİ
   - Sohbet geçmişi listesi (mobilde toggle, masaüstünde sidebar)
   - "Yeni Sohbet" butonu
   - `switchConversation(id)` → `/ne-izlesem?conversation_id={id}` navigasyonu

8. **`resources/js/Pages/Recommend/Index.vue`** — TAM REFACTOR
   - Gruplu quick prompts: Ruh Haline Göre / Türe Göre / Zamana Göre
   - Scroll-to-top butonu (300px+ scroll sonra görünür)
   - Resume banner (geri dönen kullanıcılara "son sohbetine devam ediyorsun")
   - `conversations` prop alır (geçmiş panel için)
   - ConversationHistory component entegre

### Build

- `npm run build` BAŞARIYLA TAMAMLANDI ✅
- `public/build/` ve `bootstrap/ssr/` güncel

---

## Ne Yapılmadı (bekliyor)

### 1. FTP Deploy

Şu an lokal build tamam ama production'a yüklenmesi gerekiyor.

**Gerekli env değerleri:**
```
FTP_SERVER=ftp.benizledim.store
FTP_USERNAME=ben271edimstore
FTP_PASSWORD=<KULLANICIDAN İSTE>
```

**Deploy komutu (proje dizininden):**
```bash
cd /Users/gurursonmez/Documents/Benizledim

export FTP_SERVER="ftp.benizledim.store"
export FTP_USERNAME="ben271edimstore"
export FTP_PASSWORD="ŞIFREYI_GİR"

./deploy-fast.sh --files \
  app/Http/Middleware/EnsureVisitorId.php \
  bootstrap/app.php \
  app/Models/AiConversation.php \
  app/Http/Controllers/AiRecommendationController.php \
  routes/web.php \
  database/migrations/2026_05_05_074616_add_visitor_id_and_title_to_ai_conversations_table.php \
  resources/js/Components/Recommend/ConversationHistory.vue \
  resources/js/Pages/Recommend/Index.vue
```

NOT: `deploy-fast.sh` aynı zamanda `public/build/` ve `bootstrap/ssr/` klasörlerini de mirror eder (incremental). Tüm build dosyaları otomatik gider.

### 2. Production Migration

Deploy bittikten sonra browser'dan:
```
https://benizledim.com/_ops/migrate?token=<REDACTED_OPS_TOKEN>
```
Beklenen çıktı: `Migrating: ...add_visitor_id_and_title...` veya `Nothing to migrate.`

### 3. Production Cache Temizleme

Migration'dan hemen sonra:
```
https://benizledim.com/_ops/clear-cache?token=<REDACTED_OPS_TOKEN>
```
Beklenen çıktı: `opcache: reset / cache:clear: ... / route:clear: ...`

---

## Test Senaryosu (deploy sonrası)

1. `/ne-izlesem` aç → boş sohbet ekranı + gruplu promptlar görünmeli
2. Bir prompt'a tıkla → AI cevabı gelsin
3. Tarayıcıyı TAMAMEN kapat (sekme değil, tüm tarayıcıyı)
4. Tekrar aç, `/ne-izlesem`'e git
5. **Önceki sohbet yüklü olmalı** ✅ (bu ana fix)
6. "Yeni Sohbet" butonuna bas → boş ekran gelsin, eski sohbet geçmişte kalsın
7. Uzun sohbette sağ altta ↑ butonu çıksın

---

## Dikkat Edilecekler

- `EnsureVisitorId` middleware `visitor_id` key'i ile attribute set ediyor (bi_visitor_id değil)
- Controller `$request->attributes->get('visitor_id')` ile okuyor — tutarlı
- `session_id` artık NULL yazılıyor, eski kayıtlar bozulmaz
- Migration'da `session_id` nullable yapılıyor — bu mevcut data için güvenli
- Eski `session_id` bazlı conversationlar kaybolmaz ama öne gelmez (visitor_id boş olduğundan)

---

## Dosya Değişiklik Listesi (özet)

| Dosya | Durum |
|-------|-------|
| `app/Http/Middleware/EnsureVisitorId.php` | YENİ |
| `bootstrap/app.php` | DEĞİŞTİ |
| `app/Models/AiConversation.php` | DEĞİŞTİ |
| `app/Http/Controllers/AiRecommendationController.php` | DEĞİŞTİ |
| `routes/web.php` | DEĞİŞTİ |
| `database/migrations/2026_05_05_074616_*.php` | YENİ |
| `resources/js/Components/Recommend/ConversationHistory.vue` | YENİ |
| `resources/js/Pages/Recommend/Index.vue` | DEĞİŞTİ |
| `public/build/**` | BUILD GÜNCELLENDI |
| `bootstrap/ssr/**` | BUILD GÜNCELLENDI |
