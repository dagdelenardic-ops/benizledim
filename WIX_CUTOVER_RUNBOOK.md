# Wix Cutover Runbook

Ben İzledim için Wix'ten Laravel/cPanel altyapısına tam çıkış runbook'u.

Bu dosya 2026-05-02 tarihinde mevcut repo artefact'ları ve canlı doğrulamalar baz alınarak hazırlandı.

## Amaç

- Wix'teki içerik, medya ve ilişkilendirme verisini güvenli biçimde korumak
- `benizledim.com` web trafiğini kalıcı olarak yeni hostta tutmak
- SSL, DNS ve registrar tarafındaki kalan Wix bağımlılıklarını planlı biçimde kapatmak

## 2026-05-02 Durumu

### Uygulama ve veri

- Repo: Laravel + Vue/Inertia uygulaması aktif
- Wix import komutları mevcut
- Wix redirect route'ları mevcut: eski `/post/{slug}` yapısı yeni `/yazi/{slug}` yapısına yönleniyor

### Alınmış veri ve artefact'lar

- Yazılar: `228` adet
  - [database/data/wix-posts.json](/Users/gurursonmez/Documents/Benizledim/database/data/wix-posts.json)
- Sayfalar: `3` adet
  - [database/data/wix-pages.json](/Users/gurursonmez/Documents/Benizledim/database/data/wix-pages.json)
- Wix kullanıcı export'u: `5` adet
  - [database/data/wix-users.json](/Users/gurursonmez/Documents/Benizledim/database/data/wix-users.json)
- Wix URL listesi: `232` adet
  - [database/data/wix-urls.json](/Users/gurursonmez/Documents/Benizledim/database/data/wix-urls.json)
- Author görünürlük/veri çözümleme CSV'si: `216` satır
  - `190` resolved
  - `26` missing live match
  - [output/spreadsheet/wix-author-resolution.csv](/Users/gurursonmez/Documents/Benizledim/output/spreadsheet/wix-author-resolution.csv)
- Wix contact export'u: `145` kayıt
  - [output/wix-admin/wix-contacts-2026-05-02.csv](/Users/gurursonmez/Documents/Benizledim/output/wix-admin/wix-contacts-2026-05-02.csv)
- Medya URL listesi: `1641` URL
  - [output/wix-admin/wix-media-urls.txt](/Users/gurursonmez/Documents/Benizledim/output/wix-admin/wix-media-urls.txt)
- İndirilen medya: `1412` dosya
  - Hata: `82`
  - Skip: `147`
  - [output/wix-admin/wix-media-download-summary.json](/Users/gurursonmez/Documents/Benizledim/output/wix-admin/wix-media-download-summary.json)
  - [output/wix-media](/Users/gurursonmez/Documents/Benizledim/output/wix-media)

### Author verisi hakkında not

- Wix panelindeki author sayısı gerçek sayıdan düşüktü.
- Bunun nedeni Wix tarafındaki author limiti ve ücretli kısıtlamaydı.
- Fiili author bilgisi, yazı üzerindeki görünür isimden türetildi.
- Bu yüzden migration için referans dosya `wix-users.json` değil, öncelikle `wix-author-resolution.csv` olmalı.

### Domain ve DNS

2026-05-02 kontrol sonucu:

- `benizledim.com A -> 31.186.11.117`
- `www.benizledim.com CNAME -> benizledim.com`
- Web trafiği artık Wix'e değil yeni hosta gidiyor
- Public Wix DNS üzerinde MX/TXT kayıtları görünmüyor
- cPanel zone dosyasında geçiş için hazır kayıtlar var:
  - `benizledim.com A 31.186.11.117`
  - `www CNAME benizledim.com`
  - `MX 0 benizledim.com`
  - SPF, DKIM ve DMARC TXT kayıtları

Ama domain yönetimi henüz tamamen Wix'ten çıkmış değil:

- Registrar: `Wix.com Ltd.`
- Nameserver:
  - `ns2.wixdns.net`
  - `ns3.wixdns.net`
- Domain status:
  - `clientTransferProhibited`
  - `clientUpdateProhibited`

### SSL durumu

2026-05-02 ilk kontrolde:

- `https://www.benizledim.com` yanlış sertifika sunuyordu
- Sunulan sertifika konusu `CN=www.benizledim.store` idi

2026-05-02 aynı gün AutoSSL yeniden tetiklendikten sonra:

- Yeni Let’s Encrypt sertifikası üretildi
- Sertifika SAN kapsamı:
  - `benizledim.com`
  - `www.benizledim.com`
  - `benizledim.store`
  - `www.benizledim.store`
- `curl -I https://benizledim.com` başarılı
- `curl -I https://www.benizledim.com` başarılı
- `openssl s_client` doğrulamasında aktif sunulan sertifika konusu `CN=www.benizledim.com`

Sonuç:

- SSL blocker kapanmıştır
- Kalan işler DNS yönetimi ve istenirse registrar transferidir

## 2026-05-02 Canonical Host Kararı

Final kullanıcı alan adı `https://benizledim.com` olarak sabitlendi.

Canlıda beklenen host davranışı:

- `https://benizledim.com/*` uygulamayı sunar
- `https://www.benizledim.com/*` -> `301` ile `https://benizledim.com/*`
- `https://benizledim.store/*` -> `301` ile `https://benizledim.com/*`
- `https://www.benizledim.store/*` -> `301` ile `https://benizledim.com/*`

Bu sayede `.store` artık ikinci bir giriş alanı değildir; sadece test/yedek domain olarak canonical `.com` alan adına akar.

## Bitirme Sırası

1. Uygulama ve yönlendirmeleri tekrar doğrula
2. DNS yönetimini Wix dışına taşı
3. Gerekirse registrar transferini ayrıca yap

## 1. SSL Düzeltme

Durum: tamamlandı.

Hedef:

- `https://benizledim.com`
- `https://www.benizledim.com`

iki host da tarayıcıda uyarısız açılmalı.

Yapılacaklar:

1. cPanel içinde `benizledim.com` domaininin aktif olduğunu doğrula.
2. `www.benizledim.com` alias/subdomain olarak hesapta tanımlı mı kontrol et.
3. `SSL/TLS Status` veya `AutoSSL` ekranında `benizledim.com` ve `www.benizledim.com` için sertifika üretimini tetikle.
4. Eğer panel `www` hostunu kapsamıyorsa önce alias/domain mapping tamamlanmalı.
5. Sertifika yenilendikten sonra aşağıdaki komutlarla doğrula:

```bash
curl -I https://benizledim.com
curl -I https://www.benizledim.com
echo | openssl s_client -servername www.benizledim.com -connect www.benizledim.com:443 2>/dev/null | openssl x509 -noout -subject -dates
```

Elde edilen durum:

- `curl` sertifika hatası vermiyor
- Sertifika `benizledim.com` ve `www.benizledim.com` için geçerli
- Aynı sertifika `benizledim.store` ve `www.benizledim.store` alan adlarını da kapsıyor

## 2. Uygulama ve İçerik Doğrulama

SSL düzeldikten sonra şu kontroller yapılmalı:

1. Ana sayfa açılıyor mu
2. En az 10 eski Wix yazı URL'si doğru 301 ile yeni sayfaya gidiyor mu
3. Rastgele 10 yazıda:
   - kapak görseli
   - author ismi
   - kategori/tag
   - içerik gövdesi
   doğru görünüyor mu
4. Profil sayfalarında author-post eşleşmesi doğru mu
5. Admin panel login ve post edit ekranı çalışıyor mu

Örnek redirect kontrolü:

```bash
curl -I https://www.benizledim.com/post/loki-bitti-mi-3-sezon-gelecek-mi
curl -I https://www.benizledim.com/post/ben-o-değilim
```

## 3. DNS Yönetimini Wix Dışına Taşıma

Bu adım registrar transferi değildir. Sadece DNS yönetimini Wix'ten çıkarır.

Hedef nameserver'lar Turkticaret/cPanel tarafında doğrulanmalı. Mevcut cPanel zone SOA/NS kayıtları `ns1.31-186-11-118.cprapid.com` gösteriyor; Turkticaret paneli farklı nameserver seti verirse panelde verilen değer esas alınmalı.

Muhtemel hedef nameserver'lar:

- `ns1.turkticaret.net`
- `ns2.turkticaret.net`
- `ns3.turkticaret.net`
- veya cPanel zone tarafından verilen `*.cprapid.com` nameserver'ları

Önerilen güvenli sıra:

1. Turkticaret tarafında DNS zone oluştur.
2. Wix'teki tüm gerekli kayıtları birebir kopyala:
   - `A`
   - `CNAME`
   - `MX`
   - `TXT`
   - gerekiyorsa `DKIM`, `SPF`, `DMARC`
3. Yeni zone içinde en az şu web kayıtlarını doğrula:
   - `@ -> 31.186.11.117`
   - `www -> benizledim.com`
4. Mail kullanılmıyor varsayımı geçerli olsa bile cPanel zone içindeki SPF/DKIM/DMARC kayıtlarını koru.
5. Her kayıt doğrulandıktan sonra registrar panelinden nameserver'ları Turkticaret'e çevir.

Not:

- Nameserver değişikliği sırasında web zaten doğru IP'ye gittiği için risk düşük olur.
- Asıl risk mail kayıtlarının eksik taşınmasıdır.

## 4. Registrar Transferi

Bu adım opsiyoneldir. Amaç domain tescilini de Wix'ten tamamen çıkarmaktır.

En güvenli yaklaşım:

- Önce SSL düzelt
- Sonra DNS yönetimini stabil hale getir
- Registrar transferini en sona bırak

Transfer öncesi kontrol listesi:

1. Domain lock kaldırılmalı
   - mevcut durum: `clientTransferProhibited`
2. Update lock kaldırılmalı
   - mevcut durum: `clientUpdateProhibited`
3. EPP/Auth code alınmalı
4. Registrant mail erişimi doğrulanmalı
5. Transfer sırasında nameserver aynı bırakılmalı

Registrar transfer akışı:

1. Wix'te domain unlock
2. Auth/EPP code al
3. Yeni registrar tarafında transfer başlat
4. Transfer onay mail'lerini tamamla
5. Transfer bitene kadar mevcut nameserver'ları değiştirme
6. Transfer tamamlandıktan sonra istenirse nameserver yönetimi yeni registrarda güncellenir

## Önerilen Laravel Import Sırası

Sıfırdan ya da tekrar import gerekirse:

```bash
php artisan wix:import-users database/data/wix-users.json
php artisan wix:import-categories database/data/wix-categories.json
php artisan wix:import-posts database/data/wix-posts.json
php artisan wix:import-pages database/data/wix-pages.json
php artisan wix:import-comments database/data/wix-comments.json
php artisan wix:apply-author-report output/spreadsheet/wix-author-resolution.csv --dry-run
php artisan wix:apply-author-report output/spreadsheet/wix-author-resolution.csv
php artisan wix:import-images --dry-run
php artisan wix:import-images
```

Not:

- Author eşleşmesi için ana kaynak `wix:apply-author-report`
- `wix-users.json` gerçek author kapsamını tek başına temsil etmiyor

## Post-Cutover Doğrulama Komutları

```bash
dig +short benizledim.com A
dig +short www.benizledim.com CNAME
whois benizledim.com | egrep 'Registrar:|Name Server:|Status:'
curl -I https://benizledim.com
curl -I https://www.benizledim.com
```

Beklenen final durum:

- `benizledim.com` yeni host IP'sine gider
- `www` doğru şekilde `benizledim.com`a bağlanır
- SSL her iki host için geçerlidir
- İsteniyorsa registrar artık Wix değildir
- İsteniyorsa nameserver artık Wix değildir

## Riskler

- En yakın risk: nameserver değişiminde mail kayıtlarının eksik taşınması
- Orta risk: registrar transferinden önce domain lock durumlarının kaldırılmamış olması
- Düşük risk: Wix author panel sayısının eksik olması nedeniyle yanlış author import kararı alınması

## Karar Özeti

2026-05-02 itibarıyla web trafiği Wix'ten çıkmış durumda. "Tam taşındık" diyebilmek için kalan iş listesi:

1. DNS zone kopyası ve gerekirse nameserver geçişi
2. İsteniyorsa registrar transferi

Bu sıranın dışına çıkmak önerilmez.
