# Codex Handoff #1 — Benizledim Deploy & Cache Sorunu

**Tarih:** 2026-05-05 16:30 GMT+3
**Önceki ajan:** Claude (Sonnet)
**Devam eden:** Codex
**Repo:** `/Users/gurursonmez/Documents/Benizledim`
**Site:** https://benizledim.com

---

## TL;DR — Acil Durum

Son haftalardaki **HİÇBİR kod deploy'u siteye yansımıyor**. GitHub Actions secrets'ında yanlış FTP hesabı tanımlı; tüm dosyalar chroot'lu sub-FTP user'ın izole klasörüne gidiyor, asıl Apache document root'unun yakınına bile değmiyor. Site şu an Mayıs 2 öncesi son doğru deploy'a asılı kalmış.

**Çözüm tek satır:** GitHub repo → Settings → Secrets and variables → Actions →
- `FTP_USERNAME` = `ben271edimstore` (ana cPanel kullanıcısı)
- `FTP_PASSWORD` = cPanel ana hesap şifresi (sub-user `<REDACTED_SUB_FTP_PASSWORD>` DEĞİL)

Sonra `git commit --allow-empty -m "trigger redeploy" && git push` → her şey kendi kendine düzelir.

---

## Yapılanlar (Kod Değişiklikleri — main branch'inde, deploy edilmemiş)

| # | Değişiklik | Dosya | Commit |
|---|---|---|---|
| 1 | Anasayfa spotlight Türkçe karakter düzeltmesi (Editör, İstanbul, kayıtları, vb.) | `app/Http/Controllers/HomeController.php` | önceki sessionlarda |
| 2 | Yazı detay sayfasında kategori chip'leri 3 ile sınırlandı + "+N more" badge | `resources/js/Pages/Post/Show.vue` | önceki sessionlarda |
| 3 | Wix legacy URL redirect altyapısı (`/post/{slug}`, `/blog/{slug}`, `/blog/categories/{slug}`) | `app/Http/Controllers/WixRedirectController.php`, `routes/web.php` | önceki sessionlarda |
| 4 | Yazı başlık typo'ları için `posts:fix-titles` Artisan komutu | `app/Console/Commands/FixPostTitles.php` | önceki sessionlarda |
| 5 | Kapak görseli upload limiti 2MB → 8MB (store + update) | `app/Http/Controllers/Admin/AdminPostController.php` | `05b07e2` |
| 6 | Geçici cache temizleme: `/_ops/clear-cache` endpoint + `public/recache.php` | `routes/web.php`, `public/recache.php` | `cec4876`, `19b8660` |
| 7 | `quick-deploy.yml` — GitHub Actions hızlı deploy (~30 sn, sadece değişen dosyalar) | `.github/workflows/quick-deploy.yml` | `a029ebc` |
| 8 | `quick-deploy.yml` 0-dosya bug'ı + recache her zaman dahil edildi | `.github/workflows/quick-deploy.yml` | `1e8872d` |
| 9 | `lftp -f` → stdin redirect (geçersiz flag düzeltmesi) | `.github/workflows/quick-deploy.yml` | `52e9e9c` |
| 10 | `lftp mkdir -fp` → `mkdir -p` (lftp'de `-f` yok, sessizce başarısız) | `.github/workflows/quick-deploy.yml` | `7df134c` |
| 11 | `deploy.yml` FTP port 990 (implicit FTPS) → 21 (explicit ssl-force) | `.github/workflows/deploy.yml` | önceki sessionlarda |

Hepsi `main` branch'inde, GitHub'a push edildi. Quick-deploy workflow'ları "✓ success" gösteriyor — ama yanlış hedefe yazıldığı için siteye yansımıyor.

---

## Yapılamayanlar / Tıkanan Yer

### Kök Sorun: Yanlış FTP Hesabı

**Test edilen FTP credentials (memory ID 1486'dan):**
- Sub-user: `ben271edimstore@benizledim.com`
- Şifre: `<REDACTED_SUB_FTP_PASSWORD>`
- Sunucu: `ftp.benizledim.store:21` (Explicit FTPS)

**Lokal test sonucu (lftp ile bağlandım):**
- Bu user chroot'lu. Home dizini = `/home/ben271edimstore/benizledim.com/ben271edimstore/`
- `pwd` → `/`, `ls` → sadece `public_html/` ve `.ftpquota` görünüyor
- Bu `public_html/` ASIL `public_html` DEĞİL — sub-user'ın izole görüntüsü
- Buraya `public_html/public/recache.php` yazınca dosya gerçekten oluyor (FTP `ls` ile gördüm) ama Apache görmüyor

**Apache'nin asıl gördüğü yer (memory ID 1433'ten):**
- `/home/ben271edimstore/public_html/public/`
- Bu sub-FTP user'ın chroot'u dışında — erişilemiyor

**Kanıt — son `git push`'tan sonra hâlâ 404 dönen endpoint'ler:**
```bash
curl https://benizledim.com/recache.php?token=<REDACTED_OPS_TOKEN>
# → Laravel 404 page (cache-control: no-cache, private)

curl https://benizledim.com/_ops/clear-cache?token=<REDACTED_OPS_TOKEN>
# → Laravel 404 page (route bile deploy edilmemiş)

curl https://benizledim.com/test-probe.php
# → Laravel 404 (deneme dosyasını sub-FTP'den manuel yükledim)
```

`index.php` çağrısı 200 dönüyor → demek site çalışıyor ama eski koddan. Yeni hiçbir kod yansımamış.

### Doğrulama

`git log --oneline main` son 5 commit:
```
7df134c fix(deploy): lftp mkdir -fp → -p
c0b27c8 chore(deploy): recache.php v3 trigger
52e9e9c fix(deploy): lftp -f geçersizmiş, stdin redirect'e çevir
ce97408 chore(deploy): force recache.php upload
1e8872d fix(deploy): public/recache.php artık deploy oluyor
```

Quick-deploy workflow'ları (gh run list --workflow=quick-deploy.yml):
- `7df134c` → ✓ success, FTP upload "✓"
- `c0b27c8` → ✓ success
- `ce97408` → ✓ success
- ama hiçbiri siteye yansımıyor

### SSH Yok

```bash
ssh -i ~/.ssh/benizledim_deploy benizledim@benizledim.com
# → ssh: connect to host benizledim.com port 22: Operation timed out
```
Port 22 dış dünyaya kapalı. cPanel SSH muhtemelen "Allow Hosts" listesi gerektiriyor.

---

## Codex İçin Yapılacaklar

### Adım 1 — DOĞRU FTP credentials'ı al
Gurur'a sor:
> "cPanel'e gir → FTP Accounts → ana hesap `ben271edimstore` için (sub-user değil) FTP şifresini söyle. Ya da yeni bir 'system user' FTP account aç ve home dizini `/home/ben271edimstore/` olsun."

### Adım 2 — GitHub Secrets güncelle
```
Repo: dagdelenardic-ops/benizledim
Settings → Secrets and variables → Actions → Repository secrets

FTP_SERVER    = ftp.benizledim.store          (büyük olasılıkla aynı)
FTP_USERNAME  = ben271edimstore               (sub-user değil!)
FTP_PASSWORD  = <cPanel ana hesap şifresi>
```

### Adım 3 — Test
```bash
cd /Users/gurursonmez/Documents/Benizledim
git commit --allow-empty -m "trigger redeploy after FTP creds fix" && git push

# 30-60 sn bekle, sonra:
curl https://benizledim.com/recache.php?token=<REDACTED_OPS_TOKEN>
```

Beklenen çıktı:
```
[OK] unlink routes-v7.php
[OK] unlink config-xxx.php
[OK] cleared N files from storage/framework/cache/data
[OK] cleared M files from storage/framework/views
[OK] opcache_reset()
[INFO] HomeController.php contains "kayıtları": YES
```

Eğer bu çıktıyı görüyorsan, **hepsi tamam**. Anasayfa Türkçe karakterler düzelmiş, kategori chipleri 3'le sınırlanmış, 8MB upload aktif, Wix redirect'leri çalışıyor.

### Adım 4 — Temizlik (opsiyonel, gelecek session)
- `routes/web.php` içindeki `/_ops/migrate` ve `/_ops/clear-cache` route'larını sil (production'da güvenlik riski)
- `public/recache.php`'yi production'dan FTP ile sil + repodan kaldır

### Adım 5 — Doğrulama checklist
- [ ] `https://benizledim.com/` anasayfada "Editör masası kayıtları", "İstanbul'daki bağımsız sinemalar" görünüyor mu?
- [ ] Bir yazı detayında 3'ten fazla kategori varsa "+N more" badge görünüyor mu?
- [ ] Admin'de 4MB cover image yüklenebiliyor mu? (önceden 2MB limit)
- [ ] `https://benizledim.com/post/eski-wix-slug` → yeni post'a 301 redirect oluyor mu?
- [ ] `https://benizledim.com/_ops/clear-cache?token=<REDACTED_OPS_TOKEN>` 200 dönüyor mu?

---

## Bilinen Workspace Durumu

`git status` çıktısı:
- **Uncommitted changes:** `app/Http/Controllers/AiRecommendationController.php`, `app/Models/AiConversation.php`, `app/Providers/AppServiceProvider.php`, `bootstrap/app.php`, `resources/js/Pages/Recommend/Index.vue` — Faz A (Ne İzlesem geliştirmesi) çalışması, başka branch'te (`feature/faz-a-frontend`)
- **Untracked:** `app/Http/Middleware/EnsureVisitorId.php`, `app/Listeners/`, `database/migrations/2026_05_05_074616_add_visitor_id_and_title_to_ai_conversations_table.php`, `docs/`, vite build artifact'leri
- Bu değişiklikler `feature/faz-a-frontend` branch'inde commit'li, main'e merge edilmedi

Şu an `main` branch'indesin (`git checkout main` ile geçtim).

## İlgili Memory Kayıtları

Detay için `mem-search` ile çek:
- ID 1433 — Production server yapısı (document root keşfi)
- ID 1486 — FTP/FTPS erişim bilgileri (sub-user creds)
- ID 1488 — lftp 874 MB her seferinde yüklüyor sorunu
- ID 1697 — Deploy altyapısı script + endpoint haritası

---

## Önemli Notlar

1. **`deploy-fast.sh` aynı sub-user creds ile çalışıyor.** Yani lokal manuel deploy de yanlış yere yazıyor. Tüm deploy yöntemleri aynı kök sorunla maluldür.
2. Site **şu an** çalışıyor demek hiç deploy gerekmemiş demek değil — sadece eski code işini yapıyor.
3. **`recache.php` v4** olarak `public/recache.php`'de hazır, sadece doğru yere kopyalanması yeterli.
4. cPanel ana hesap şifresi verilirse her şey otomatik düzelir, başka kod değişikliği gerekmez.

---

**Hand-off bitiş.** Codex, sıradaki adım: Gurur'dan ana cPanel FTP creds'ini al → GitHub Secrets'ı güncelle → empty commit push → recache.php çağır → doğrulama checklist'ini geç.
