#!/bin/bash
# Manuel FTP deploy - GitHub Actions FTP flaky olduğu zaman kullan
# Kullanım:
#   export FTP_SERVER="ftp.benizledim.com"
#   export FTP_USERNAME="..."
#   export FTP_PASSWORD="..."
#   ./deploy-manual.sh

set -e

cd "$(dirname "$0")"

if [ -z "$FTP_SERVER" ] && [ -f "$HOME/.config/benizledim/deploy.env" ]; then
  set -a; . "$HOME/.config/benizledim/deploy.env"; set +a
fi

# Credentials kontrol
for k in FTP_SERVER FTP_USERNAME FTP_PASSWORD; do
  if [ -z "${!k}" ]; then
    echo "❌ Eksik environment variable: $k"
    echo ""
    echo "Şöyle çalıştır:"
    echo "  export FTP_SERVER='ftp.benizledim.com'"
    echo "  export FTP_USERNAME='your-cpanel-user'"
    echo "  export FTP_PASSWORD='your-password'"
    echo "  ./deploy-manual.sh"
    exit 1
  fi
done

# Yerel hazırlık kontrolü
[ -d vendor ] || { echo "⚠️  vendor/ yok — composer install çalıştırılıyor..."; composer install --no-dev --optimize-autoloader --no-interaction; }
[ -f public/build/manifest.json ] || { echo "⚠️  build manifest yok — npm run build çalıştırılıyor..."; npm ci --no-audit --no-fund && npm run build; }

# Exclude listesi (workflow ile aynı)
#
# bootstrap/cache/ is excluded on purpose: those files are compiled from the
# LOCAL .env. Uploading them makes production boot from local config (wrong
# APP_URL, wrong credentials) while silently ignoring its own .env.
cat > /tmp/lftp-exclude.txt << 'EOF'
^\.git
^\.github
^node_modules
^tests
^storage/logs
^bootstrap/cache/
^database/data/.*\.sqlite$
^\.env$
^\.env\.
\.env\.example$
\.env\.production$
\.env\.cpanel$
^CLAUDE\.md$
^AGENTS\.md$
^\.codex-instructions\.md$
^\.kimi-instructions\.md$
^\.qwen-instructions\.md$
^\.claude/
^\.DS_Store$
^\.vscode/
^\.idea/
^deploy-manual\.sh$
_diag\.php$
_probe\.php$
_probe\.txt$
read_env\.php$
check_config\.php$
check_db\.php$
check_mb\.php$
check_sessions\.php$
chmod_storage\.php$
db_users\.php$
debug_laravel\.php$
debug_.*\.txt$
extract\.php$
get_admin\.php$
list_users\.php$
mkdir_views\.php$
read_log\.php$
read_pct\.php$
reset_admin\.php$
reset_gurur\.php$
run_artisan\.php$
run_cli\.php$
save_hash\.php$
setup.*\.php$
seed_and_import\.php$
test_auth\.php$
test_hash\.php$
unzip\.php$
unzip_sys\.php$
update_pass\.php$
\.zip$
EOF

echo ""
echo "🚀 lftp ile $FTP_SERVER → public_html/ senkronize ediliyor..."
echo "   (sertleştirilmiş ayarlar: 50 retry, sıralı transfer, 5dk timeout)"
echo ""

lftp -u "${FTP_USERNAME},${FTP_PASSWORD}" "ftp://${FTP_SERVER}:21" << 'LFTPEOF'
set ftp:passive-mode true
set ftp:ssl-force true
set ssl:verify-certificate false
set net:timeout 300
set net:max-retries 50
set net:reconnect-interval-base 10
set net:reconnect-interval-multiplier 1.5
set net:reconnect-interval-max 90
set net:idle 30
set ftp:ssl-protect-data true
set mirror:parallel-directories false
set xfer:clobber on
mirror --reverse --delete --verbose=1 --parallel=1 --use-cache \
  --exclude-rx-from=/tmp/lftp-exclude.txt \
  . public_html/
bye
LFTPEOF

echo ""
echo "✅ Senkronizasyon bitti."
echo ""
echo "Sırada (SSH ile sunucuda — varsa):"
echo "  cd ~/public_html"
echo "  php artisan migrate --force"
echo "  php artisan optimize:clear"
echo "  php artisan config:cache"
echo "  php artisan view:cache"
echo ""
echo "Sonra Wix HTML cleanup:"
echo "  php artisan content:full-cleanup --dry-run    # önizleme"
echo "  php artisan content:full-cleanup              # backup tablosu otomatik"
