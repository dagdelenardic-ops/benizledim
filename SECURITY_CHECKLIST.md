# Güvenlik Kontrol Listesi

Bu doküman, Benizledim platformunun güvenlik gereksinimlerini ve acil durum prosedürlerini içerir.

## 1. `.env` Yönetimi

### Kritik Değişkenler
```env
APP_KEY=              # Uygulama şifreleme anahtarı (asla paylaşmayın)
APP_ENV=production    # Production ortamında mutlaka 'production' olmalı
APP_DEBUG=false       # Production'da kesinlikle false olmalı
APP_URL=https://benizledim.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=benizledim
DB_USERNAME=          # Güçlü, benzersiz kullanıcı adı
DB_PASSWORD=          # Güçlü, benzersiz şifre (en az 16 karakter)

# OAuth Kimlik Bilgileri
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://benizledim.com/auth/google/callback

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_REDIRECT_URI=https://benizledim.com/auth/facebook/callback

# Session & Cache
SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_SECURE_COOKIE=true

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# Mail (SMTP)
MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
```

### Güvenlik Kuralları
- ✅ `.env` dosyası asla version control'e eklenmemeli (`.gitignore` ile korunmuş)
- ✅ Production ve development `.env` dosyaları farklı olmalı
- ✅ `APP_KEY` kaybedilirse tüm şifreli veriler kaybolur - güvenli yedekleyin
- ✅ DB şifreleri düzenli olarak rotate edilmeli (90 günde bir)
- ✅ OAuth secret'ları asla log'larda veya hata mesajlarında görünmemeli

---

## 2. Admin Hesabı Rotasyonu

### Düzenli Şifre Değiştirme (90 günde bir)
```bash
# Admin şifresini değiştirme
php artisan tinker
>>> User::where('role', 'admin')->first()->update(['password' => Hash::make('yeni-guclu-sifre')])
```

### Acil Durum Şifre Sıfırlama
```bash
# Tinker ile manuel sıfırlama
php artisan tinker
>>> $admin = User::where('email', 'admin@benizledim.com')->first();
>>> $admin->update(['password' => Hash::make('gecici-sifre')]);
>>> exit
```

### Admin Hesabı Güvenlik Kontrolü
- [ ] Admin e-posta adresi benzersiz ve tahmin edilebilir değil
- [ ] 2FA (Two-Factor Authentication) aktif (gelecek faz)
- [ ] Admin oturum süreleri kısıtlı
- [ ] Başarısız giriş denemeleri loglanıyor

---

## 3. OAuth Callback Doğrulama

### Google OAuth Güvenliği
```php
// routes/auth.php kontrolü
// Redirect URI mutlaka HTTPS ve doğrulanmış olmalı
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],
```

### Kontrol Listesi
- [ ] OAuth redirect URI'leri Google/Facebook konsolunda doğrulanmış
- [ ] Redirect URI'leri `.env` üzerinden yönetiliyor (hardcode değil)
- [ ] State parameter CSRF koruması aktif
- [ ] OAuth token'ları şifreli saklanıyor

### Google Cloud Console Ayarları
1. https://console.cloud.google.com/apis/credentials adresine git
2. OAuth 2.0 Client IDs bölümünü aç
3. Authorized redirect URIs'e ekle:
   - `https://benizledim.com/auth/google/callback`
4. Authorized JavaScript origins'e ekle:
   - `https://benizledim.com`

### Facebook Developer Ayarları
1. https://developers.facebook.com/apps/ adresine git
2. Uygulama seç > Settings > Basic
3. Facebook Login > Settings > Valid OAuth Redirect URIs:
   - `https://benizledim.com/auth/facebook/callback`

---

## 4. Backup/Restore Adımları

### Günlük Otomatik Yedekleme
```bash
# Cron job ekle (cPanel > Cron Jobs)
0 2 * * * cd /home/username/benizledim && php artisan db:backup
```

### Manuel Veritabanı Yedekleme
```bash
# Tam yedek alma
mysqldump -u username -p benizledim > backup_$(date +%Y%m%d_%H%M%S).sql

# Sıkıştırılmış yedek
mysqldump -u username -p benizledim | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Dosya Yedekleme
```bash
# Storage klasörü yedekleme
tar -czf storage_backup_$(date +%Y%m%d_%H%M%S).tar.gz storage/

# .env yedekleme (güvenli konuma!)
cp .env .env.backup_$(date +%Y%m%d_%H%M%S)
```

### Restore İşlemi
```bash
# Veritabanı restore
mysql -u username -p benizledim < backup_YYYYMMDD_HHMMSS.sql

# Storage restore
tar -xzf storage_backup_YYYYMMDD_HHMMSS.tar.gz

# Cache temizleme
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Yedekleme Kontrol Listesi
- [ ] Veritabanı yedekleri şifreli saklanıyor
- [ ] Yedekler farklı bir lokasyonda (off-site) saklanıyor
- [ ] Yedek restore işlemi düzenli test ediliyor (ayda bir)
- [ ] Yedek dosyaları 30 günden eskiyse otomatik siliniyor

---

## 5. Incident Response (Güvenlik Olayı Müdahalesi)

### Senaryo 1: Admin Hesabı Kompromize Olduysa

#### Acil Adımlar (İlk 15 dakika)
1. **Tüm oturumları sonlandır:**
   ```bash
   php artisan session:flush
   ```

2. **Admin şifresini sıfırla:**
   ```bash
   php artisan tinker
   >>> User::where('role', 'admin')->get()->each(fn($u) => $u->update([
       'password' => Hash::make('yeni-guclu-sifre-' . uniqid()),
       'remember_token' => null,
   ]))
   ```

3. **Şüpheli oturumları kontrol et:**
   ```sql
   SELECT * FROM sessions WHERE user_id IN (SELECT id FROM users WHERE role = 'admin');
   ```

4. **Access loglarını incele:**
   ```bash
   tail -f storage/logs/laravel.log | grep -i "admin"
   ```

#### Sonraki 24 Saat
- [ ] Tüm admin kullanıcılarıyla iletişime geç
- [ ] Hangi verilerin erişildiğini belirle
- [ ] OAuth token'larını revoke et
- [ ] Güvenlik açığının kaynağını bul ve kapat

---

### Senaryo 2: OAuth Token Sızıntısı

#### Acil Adımlar
1. **Google Cloud Console'dan token'ları revoke et:**
   - https://console.cloud.google.com/apis/credentials
   - İlgili Client ID'yi bul > Reset Secret

2. **Facebook Developer'dan token'ları revoke et:**
   - https://developers.facebook.com/apps/
   - App Settings > Security > Reset App Secret

3. **`.env` dosyasını güncelle:**
   ```env
   GOOGLE_CLIENT_SECRET=yeni-secret
   FACEBOOK_CLIENT_SECRET=yeni-secret
   ```

4. **Uygulamayı yeniden başlat:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

---

### Senaryo 3: Veritabanı Saldırısı (SQL Injection Şüphesi)

#### Acil Adımlar
1. **Uygulamayı bakım moduna al:**
   ```bash
   php artisan down
   ```

2. **Veritabanı kullanıcı şifresini değiştir:**
   ```sql
   ALTER USER 'username'@'localhost' IDENTIFIED BY 'yeni-cok-guclu-sifre';
   FLUSH PRIVILEGES;
   ```

3. **`.env` dosyasını güncelle ve cache temizle:**
   ```bash
   # .env dosyasında DB_PASSWORD'yi güncelle
   php artisan config:clear
   ```

4. **Veritabanı loglarını incele:**
   ```bash
   # MySQL general log (eğer aktifse)
   tail -f /var/log/mysql/mysql.log
   ```

5. **Şüpheli query'leri ara:**
   ```sql
   -- Son 24 saatte oluşturulan şüpheli kullanıcılar
   SELECT * FROM users WHERE created_at > NOW() - INTERVAL 1 DAY;
   
   -- Rol değişiklikleri
   SELECT * FROM users WHERE updated_at > NOW() - INTERVAL 1 DAY AND role != 'reader';
   ```

6. **Uygulamayı tekrar başlat:**
   ```bash
   php artisan up
   ```

---

### Senaryo 4: Brute Force Saldırısı

#### Acil Adımlar
1. **Rate limit'i düşür:**
   ```php
   // app/Http/Controllers/Auth/AuthController.php
   // 5 deneme / 300 saniye -> 3 deneme / 600 saniye
   if (RateLimiter::tooManyAttempts($throttleKey, 3)) {
   ```

2. **Saldırgan IP'leri engelle:**
   ```bash
   # .htaccess'e ekle (Apache/LiteSpeed)
   Order Deny,Allow
   Deny from 192.168.1.100
   Deny from 192.168.1.101
   ```

3. **Cloudflare kullanıyorsa WAF kurallarını aktif et:**
   - Rate limiting: 100 req/min/IP
   - Country block (gerekirse)

---

## 6. Log İnceleme Rehberi

### Önemli Log Dosyaları
```
storage/logs/laravel.log      # Laravel uygulama logları
storage/logs/access.log       # Web server access log (varsa)
storage/logs/error.log        # Web server error log (varsa)
```

### Şüpheli Aktivite Arama
```bash
# Başarısız giriş denemeleri
grep -i "failed login" storage/logs/laravel.log

# 403 hataları (yetkisiz erişim denemeleri)
grep "403" storage/logs/laravel.log | tail -50

# SQL hataları (injection denemesi işareti)
grep -i "sql syntax" storage/logs/laravel.log

# Şüpheli user agent'lar
grep -E "(sqlmap|nikto|nmap|scanner)" storage/logs/access.log
```

### Log Yönetimi
- [ ] Loglar düzenli rotate ediliyor (haftalık)
- [ ] Eski loglar (90+ gün) arşivleniyor
- [ ] Loglarda hassas veri (şifre, token) bulunmuyor
- [ ] Loglara erişim kısıtlı (sadece admin)

---

## 7. Düzenli Güvenlik Kontrolleri

### Haftalık
- [ ] Başarısız login denemelerini kontrol et
- [ ] Yeni kullanıcı kayıtlarını gözden geçir
- [ ] Admin panel erişim loglarını incele

### Aylık
- [ ] Kullanılmayan admin hesaplarını kontrol et
- [ ] OAuth secret'ların güvenliğini doğrula
- [ ] Backup restore testi yap
- [ ] Dependency güncellemelerini kontrol et:
   ```bash
   composer outdated
   npm outdated
   ```

### Üç Aylık
- [ ] Tüm admin şifrelerini rotate et
- [ ] DB şifrelerini rotate et
- [ ] Güvenlik audit'i yap (bu checklist üzerinden)
- [ ] Penetration test yap (veya yaptır)

---

## 8. İletişim Bilgileri

### Acil Durum İletişim
- **Sorumlu Geliştirici:** [İsim Soyisim] - [E-posta] - [Telefon]
- **Yedek Geliştirici:** [İsim Soyisim] - [E-posta] - [Telefon]
- **Hosting Sağlayıcı:** [Firma] - [Destek Telefonu]

### Raporlama
Güvenlik açığı bulursanız: `guvenlik@benizledim.com` adresine bildirin.

---

**Son Güncelleme:** 2026-02-20  
**Doküman Versiyonu:** 1.0
