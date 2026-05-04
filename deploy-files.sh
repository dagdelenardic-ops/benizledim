#!/bin/bash
# Targeted file deploy - sadece belirtilen dosyaları lftp put ile gönderir
# Kullanım:
#   export FTP_SERVER="ftp.benizledim.store"
#   export FTP_USERNAME="..."
#   export FTP_PASSWORD="..."
#   ./deploy-files.sh path/to/file1 path/to/file2 ...

set -e
cd "$(dirname "$0")"

for k in FTP_SERVER FTP_USERNAME FTP_PASSWORD; do
  if [ -z "${!k}" ]; then echo "❌ Eksik: $k"; exit 1; fi
done

if [ $# -eq 0 ]; then
  echo "❌ En az bir dosya yolu ver"
  exit 1
fi

# Build lftp command list
CMDS=""
for f in "$@"; do
  if [ ! -f "$f" ]; then
    echo "⚠️  Atlanıyor (yok): $f"
    continue
  fi
  DIR=$(dirname "$f")
  CMDS+="mkdir -fp public_html/${DIR}"$'\n'
  CMDS+="put -O public_html/${DIR} \"$f\""$'\n'
  echo "→ $f ($(wc -c < "$f" | tr -d ' ') bytes)"
done

echo ""
echo "🚀 lftp ile $FTP_SERVER → public_html/ targeted upload..."

lftp -u "${FTP_USERNAME},${FTP_PASSWORD}" "ftps://${FTP_SERVER}" <<LFTPEOF
set ftp:passive-mode true
set ftp:ssl-force true
set ssl:verify-certificate false
set net:timeout 60
set net:max-retries 5
set xfer:clobber on
${CMDS}
bye
LFTPEOF

echo ""
echo "✅ Bitti. Şimdi sunucuda cache temizlemek için:"
echo "   gh workflow run remote-artisan.yml -f cmd='optimize:clear'"
echo "veya cPanel Terminal/SSH ile:"
echo "   cd ~/public_html && php artisan optimize:clear"
