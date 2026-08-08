#!/bin/bash

echo "🚀 Ben İzledim - Deploy Script"
echo "================================"

# Hata durumunda dur
set -e

# 1. Composer dependencies (production)
echo ""
echo "📦 Composer install (production)..."
composer install --no-dev --optimize-autoloader --no-interaction

# 2. NPM build
echo ""
echo "🔨 NPM install & build..."
npm ci
npm run build

# 3. Migration
echo ""
echo "🗄️  Migration çalıştırılıyor..."
php artisan migrate --force

# 3.1 Primary admin hesabını garanti et
if [ -n "${PRIMARY_ADMIN_PASSWORD:-}" ]; then
  echo ""
  echo "👤 Primary admin hesabı hazırlanıyor..."
  php artisan benizledim:ensure-admin --no-interaction
else
  echo ""
  echo "⚠️  PRIMARY_ADMIN_PASSWORD boş. Admin hesabı otomatik oluşturulmadı."
fi

# 4. Storage link
echo ""
echo "📁 Storage link oluşturuluyor..."
php artisan storage:link 2>/dev/null || true

# 5. Optimizasyon
# Only cache config/routes when this script runs ON the production server.
# Running it locally would compile the local .env into bootstrap/cache/, and a
# later FTP sync would make production boot from local config.
echo ""
if [ "$(php -r 'echo trim((string) getenv("APP_ENV"));' 2>/dev/null)" = "production" ] || grep -qE '^APP_ENV=production' .env 2>/dev/null; then
  echo "⚡ Optimizasyon..."
  php artisan production:optimize
else
  echo "⏭️  Optimizasyon atlandı (.env production değil)."
  echo "   Cache'i sunucuda üret: php artisan optimize:clear && php artisan production:optimize"
fi

# 6. Cache temizle (eski cache sorun çıkarmasın)
echo ""
echo "🧹 Eski cache temizleniyor..."
php artisan cache:clear

echo ""
echo "================================"
echo "✅ Deploy tamamlandı!"
echo ""
echo "⚠️  Kontrol listesi:"
echo "   - .env dosyası production ayarlarıyla dolu mu?"
echo "   - APP_KEY oluşturuldu mu? (php artisan key:generate)"
echo "   - Google/Facebook OAuth key'leri girildi mi?"
echo "   - MySQL veritabanı oluşturuldu mu?"
echo "   - public/ klasörü web root olarak ayarlandı mı?"
