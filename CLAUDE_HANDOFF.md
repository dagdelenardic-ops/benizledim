# Claude Handoff — Benizledim

**Repo:** `/Users/gurursonmez/Documents/Benizledim`
**Stack:** Laravel 11 + Vue 3 + Inertia.js + Tailwind CSS
**Production:** `benizledim.store` (cPanel, shared hosting)
**Son güncelleme:** 2 Mayıs 2026

---

## ✅ Bu Oturumda Yapılanlar

### Production Acil Stabilizasyon
| Alan | Durum |
|------|-------|
| Public debug/operasyon dosyaları | `public_html/public` altındaki `read_env.php`, `check_config.php`, `check_db.php`, `check_sessions.php`, `_diag.php`, `run_artisan.php`, reset/update/test/unzip scriptleri silindi |
| Debug endpoint doğrulaması | `read_env.php`, `run_artisan.php`, `_diag.php` ve kritik dosyalar `404` dönüyor |
| Google OAuth | `bootstrap/app.php` içinde `routes/auth.php` web/session middleware grubuna alındı; `/auth/google` artık Google OAuth URL’sine `302` veriyor |
| Production dosya deploy | OAuth/review workflow ilgili PHP dosyaları ve `public/build` assetleri FTP ile canlıya yüklendi |

### Backend
| Dosya | Değişiklik |
|-------|-----------|
| `app/Http/Controllers/Auth/SocialAuthController.php` | Google OAuth fix: 500 engeli kaldırıldı; callback'te Wix placeholder (`@benizledim.local`) ile name-match hesap bağlama eklendi |
| `bootstrap/app.php` | `routes/auth.php` web middleware içinde yükleniyor; Socialite session hatası giderildi |
| `app/Http/Controllers/Auth/AuthController.php` | Login sonrası role-based redirect: admin/editor/author → `/admin`, reader → `/` |
| `app/Http/Controllers/Admin/AdminPostController.php` | `approveReview()`, `rejectReview()`, `updateOwner()` eklendi; index'e owner filtresi + sahip listesi |
| `app/Http/Controllers/Admin/AdminDashboardController.php` | `pending_review_count` stat eklendi |
| `app/Http/Controllers/Admin/AdminUserController.php` | Google bağlantı durumu ve Wix placeholder tespiti |
| `app/Models/Post.php` | `pending_review_at`, `pending_review_by` fillable/casts; `isPendingReview()`, `resolveStatus()` helper'ları |
| `app/Models/User.php` | `isWixPlaceholder()` helper (`@benizledim.local` email kontrolü) |
| `routes/web.php` | `{post:id}` explicit binding; approve-review, reject-review, updateOwner rotaları |

### Migration (henüz canlıda çalıştırılmadı)
```
database/migrations/2026_05_02_120000_add_review_workflow_to_posts_table.php
```
→ `posts` tablosuna `pending_review_at`, `pending_review_by`, `reviewed_at`, `reviewed_by` ekleniyor ve status enum’una `pending_review` dahil ediliyor.

### Frontend
| Dosya | Değişiklik |
|-------|-----------|
| `resources/js/Pages/Admin/Dashboard.vue` | pending_review stat kartı |
| `resources/js/Pages/Admin/Posts/Index.vue` | Owner filtresi dropdown, inline owner değiştirme, review action butonları |
| `resources/js/Pages/Admin/Posts/Create.vue` | Author rolü için "İncelemeye Gönder" butonu |
| `resources/js/Pages/Admin/Posts/Edit.vue` | pending_review banner, role-aware submit davranışı |
| `resources/js/Pages/Admin/Users/Index.vue` | Google/Wix statüsü rozetleri, rol dropdown |

### Commitler (main branch'e push edildi)
```
48c0b1d  fix(auth): avoid hard failures on social redirect errors
e0652e5  chore(deploy): purge legacy debug endpoints before ftp sync
44cfef3  chore(deploy): cap ftp cleanup timeouts
f5dd64f  chore(deploy): remove hanging ftp cleanup step
```

---

## ❌ Tamamlanamayan / Bloklanan İşler

### 1. Production Migration/Cache — BEKLİYOR
Planlanan güvenli manuel sıra:
```bash
cd /home/ben271edimstore/public_html
php artisan optimize:clear
php artisan migrate --force
php artisan config:cache
php artisan view:cache
```
`route:cache` çalıştırma; projede closure route’lar var.

### 2. GitHub Actions Secrets — BEKLİYOR
- FTP yeni parola ile lokal FTP erişimi çalışıyor.
- `gh` CLI oturumu geçersiz; GitHub secrets buradan güncellenemedi.
- Kalıcı hedef: `FTP_PASSWORD`, `SSH_HOST`, `SSH_USERNAME`, `SSH_PRIVATE_KEY`, `SSH_APP_PATH`, `DEPLOY_HEALTHCHECK_URL`.

### 3. SSH — BEKLİYOR
- `cpanel07-web-host-cl.turkticaret.net:22` timeout verdi.
- cPanel SSH Access/key authorize kurulmadan GitHub Actions post-deploy artisan otomasyonu çalışamaz.

### 4. DNS/Registrar — BEKLİYOR
- External NS hâlâ Wix: `ns2.wixdns.net`, `ns3.wixdns.net`.
- cPanel zone hazır görünüyor (`A 31.186.11.117`, `www CNAME`, MX/SPF/DKIM/DMARC mevcut).
- Wix nameserver değişimi için Wix/domain panel erişimi gerekiyor.

---

## 🚀 Devam Planı

### 1. Production Migration/Cache
```bash
php artisan optimize:clear
php artisan migrate --force
php artisan config:cache
php artisan view:cache
```

### 2. GitHub Actions Kalıcılaştırma
- GitHub auth/secrets düzelt.
- SSH Access kur.
- Deploy workflow’u push sonrası test et.

### 3. Deploy Sonrası Doğrulama
```
benizledim.store/auth/google      → Google'a redirect etmeli (500 değil)
benizledim.store/read_env.php     → 404 olmalı
benizledim.store/admin            → gurursonmez Google ile giriş → /admin
benizledim.store/admin/posts      → owner filtresi + inline atama
benizledim.store/admin/users      → Google/Wix rozeti
```

### 6. Sonraki Feature
- Google login → yazar post claim akışı uçtan uca test
- pending_review workflow test
- 29 unresolved Wix post için admin panel çözümü

---

## Arka Plan
- Wix → Laravel geçişi tamamlandı
- `wix:apply-author-report` canlıda çalıştı: 187 post güncellendi, 29 skip
- Role sistemi: `admin`, `editor`, `author`, `reader`
- Wix placeholder email: `wix-author+{identifier}@benizledim.local`
- Normalize edilmeyecek isimler: `Nedir`, `Ben İzledim`, `nevroz ürün`, `kirazselin`
- Production DB: `ben271edimstore_db`, kullanıcı: `ben271edimstore_usr`
- cPanel host: `cpanel07-web-host-cl.turkticaret.net`
