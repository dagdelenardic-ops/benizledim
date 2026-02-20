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

# 4. Storage link
echo ""
echo "📁 Storage link oluşturuluyor..."
php artisan storage:link 2>/dev/null || true

# 5. Optimizasyon
echo ""
echo "⚡ Optimizasyon..."
php artisan production:optimize

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
