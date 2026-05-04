#!/bin/bash
# Fast incremental deploy:
#   - public/build/ ve bootstrap/ssr/ klasörlerini lftp mirror (incremental, sadece değişenler)
#   - --files argümanıyla verilen tek tek dosyaları lftp put ile gönderir
# Kullanım:
#   export FTP_SERVER FTP_USERNAME FTP_PASSWORD
#   ./deploy-fast.sh [--no-build] [--files file1 file2 ...]

set -e
cd "$(dirname "$0")"

for k in FTP_SERVER FTP_USERNAME FTP_PASSWORD; do
  if [ -z "${!k}" ]; then echo "❌ Eksik: $k"; exit 1; fi
done

EXTRA_FILES=()
if [ "$1" = "--files" ]; then
  shift
  EXTRA_FILES=("$@")
fi

# Build LFTP commands for individual files
FILE_CMDS=""
for f in "${EXTRA_FILES[@]}"; do
  if [ ! -f "$f" ]; then echo "⚠️  Atlanıyor (yok): $f"; continue; fi
  DIR=$(dirname "$f")
  FILE_CMDS+="mkdir -fp public_html/${DIR}"$'\n'
  FILE_CMDS+="put -O public_html/${DIR} \"$f\""$'\n'
  echo "📄 $f"
done

echo ""
echo "🚀 lftp incremental deploy → $FTP_SERVER"
echo "   - public/build/  (mirror, only-newer)"
echo "   - bootstrap/ssr/ (mirror, only-newer)"
[ ${#EXTRA_FILES[@]} -gt 0 ] && echo "   - ${#EXTRA_FILES[@]} extra file(s)"
echo ""

lftp -u "${FTP_USERNAME},${FTP_PASSWORD}" "ftps://${FTP_SERVER}" <<LFTPEOF
set ftp:passive-mode true
set ftp:ssl-force true
set ssl:verify-certificate false
set net:timeout 60
set net:max-retries 5
set xfer:clobber on
mirror --reverse --only-newer --verbose=1 --parallel=2 public/build/ public_html/public/build/
mirror --reverse --only-newer --verbose=1 --parallel=2 bootstrap/ssr/ public_html/bootstrap/ssr/
${FILE_CMDS}
bye
LFTPEOF

echo ""
echo "✅ Bitti."
