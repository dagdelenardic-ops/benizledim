#!/bin/bash
# Ben/İzledim — Akşam 21:00 Flash Haber Özeti Rutini
#
# Lokal Mac'te çalışır. API KEY KULLANMAZ — özet, Claude Max aboneliği ile
# `claude -p --model sonnet` üzerinden üretilir. Sonuç token korumalı
# /api/flashnews/digest-send endpoint'ine POST edilir; site tüm push
# abonelerine bildirimi gönderir.
#
# LaunchAgent: ~/Library/LaunchAgents/com.benizledim.flashdigest.plist
# Log: ~/Documents/Benizledim/storage/logs/flash-digest-local.log

set -uo pipefail

SITE="https://benizledim.com"
ENV_FILE="$HOME/Documents/Benizledim/.env"
LOG="$HOME/Documents/Benizledim/storage/logs/flash-digest-local.log"
CLAUDE_BIN="/usr/local/bin/claude"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG"; }

TOKEN=$(grep -E '^FLASHNEWS_TOKEN=' "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'" | xargs)
if [ -z "${TOKEN:-}" ]; then
  log "HATA: FLASHNEWS_TOKEN .env'den okunamadı"
  exit 1
fi

log "Başladı — kaynak çekiliyor"

SOURCE=$(curl -sS --max-time 30 "$SITE/api/flashnews/digest-source?token=$TOKEN")
if [ -z "$SOURCE" ]; then
  log "HATA: digest-source boş yanıt"
  exit 1
fi

COUNT=$(echo "$SOURCE" | /usr/bin/jq -r '.count // 0')
if ! [[ "$COUNT" =~ ^[0-9]+$ ]] || [ "$COUNT" -eq 0 ]; then
  log "Bugün yayınlanmış flash haber yok (count=$COUNT) — bildirim gönderilmedi"
  exit 0
fi

NEWS=$(echo "$SOURCE" | /usr/bin/jq -r '.items[] | "- \(.title): \(.summary)"')

PROMPT="Aşağıda Ben/İzledim sitesinde bugün yayınlanan sinema/dizi flash haberleri var. Bunları akşam push bildirimi için TEK SEFERDE özetle.

KURALLAR:
- 1-2 kısa Türkçe cümle, gazete spotu üslubu.
- Sonuna mutlaka şunu ekle: 'En çok konuşulan: <en önemli haberin kısa başlığı>'
- TOPLAM EN FAZLA 150 KARAKTER.
- Sadece düz metin döndür. Açıklama, tırnak, markdown, ön söz YOK. Sadece bildirim metni.

HABERLER:
$NEWS"

log "claude -p ile özet üretiliyor ($COUNT haber)"

BODY=$(printf '%s' "$PROMPT" | "$CLAUDE_BIN" -p --model sonnet 2>>"$LOG")
BODY=$(echo "$BODY" | tr -d '\r' | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' | tr '\n' ' ' | sed 's/  */ /g')

if [ -z "${BODY:-}" ]; then
  log "HATA: claude -p boş özet döndü — fallback metin kullanılıyor"
  FIRST=$(echo "$SOURCE" | /usr/bin/jq -r '.items[0].title // ""')
  BODY="Bugün $COUNT yeni haber yayınlandı. En çok konuşulan: $FIRST"
fi

# 160 karakter güvenlik kırpması
BODY=$(echo "$BODY" | cut -c1-160)

log "Özet: $BODY"

RESP=$(curl -sS --max-time 30 -X POST "$SITE/api/flashnews/digest-send?token=$TOKEN" \
  --data-urlencode "body=$BODY" \
  --data-urlencode "count=$COUNT")

log "digest-send yanıtı: $RESP"
log "Bitti"
