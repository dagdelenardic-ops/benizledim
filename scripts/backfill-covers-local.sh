#!/bin/bash
# Ben/İzledim — Görselsiz Yazılara Otomatik Kapak Görseli (TMDB) Backfill
#
# Lokal Mac'te çalışır. API KEY KULLANMAZ (film adı tespiti claude -p --model
# sonnet ile, Claude Max aboneliği). TMDB araması TMDB token'ı ile yapılır.
# Sonuç token korumalı /api/posts/set-cover endpoint'ine basılır.
#
# Kullanım:
#   scripts/backfill-covers-local.sh            # gerçek: bulduğunu siteye yazar
#   scripts/backfill-covers-local.sh --dry-run  # sadece raporlar, DB'ye dokunmaz
#
# Log: storage/logs/backfill-covers.log

set -uo pipefail

DRY_RUN=0
[ "${1:-}" = "--dry-run" ] && DRY_RUN=1

SITE="${BACKFILL_SITE:-https://benizledim.com}"
PROJ="$HOME/Documents/Benizledim"
ENV_FILE="$PROJ/.env"
LOG="$PROJ/storage/logs/backfill-covers.log"
CLAUDE_BIN="/usr/local/bin/claude"

log() { echo "[$(date '+%H:%M:%S')] $*" | tee -a "$LOG"; }

envval() { grep -E "^$1=" "$ENV_FILE" | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'" | xargs; }

TOKEN=$(envval FLASHNEWS_TOKEN)
TMDB_TOKEN=$(envval TMDB_ACCESS_TOKEN)
[ -z "$TOKEN" ] && { log "HATA: FLASHNEWS_TOKEN yok"; exit 1; }
[ -z "$TMDB_TOKEN" ] && { log "HATA: TMDB_ACCESS_TOKEN yok"; exit 1; }

[ "$DRY_RUN" = "1" ] && log "=== DRY-RUN (DB'ye yazılmayacak) ===" || log "=== GERÇEK koşum ==="

CAND=$(curl -sS --max-time 30 "$SITE/api/posts/cover-candidates?token=$TOKEN")
COUNT=$(echo "$CAND" | /usr/bin/jq -r '.count // 0')
log "Görselsiz yazı: $COUNT"
[ "$COUNT" -eq 0 ] && { log "Yapılacak iş yok."; exit 0; }

OK=0; SKIP=0; FAIL=0

echo "$CAND" | /usr/bin/jq -c '.posts[]' | while read -r row; do
  ID=$(echo "$row" | /usr/bin/jq -r '.id')
  TITLE=$(echo "$row" | /usr/bin/jq -r '.title')
  EXCERPT=$(echo "$row" | /usr/bin/jq -r '.excerpt // ""')
  EXT=$(echo "$row" | /usr/bin/jq -r '.external_title // ""')
  EXTYR=$(echo "$row" | /usr/bin/jq -r '.external_year // ""')
  EXTTYPE=$(echo "$row" | /usr/bin/jq -r '.tmdb_type // ""')

  if [ -n "$EXT" ] && [ "$EXT" != "null" ]; then
    QUERY="$EXT"; YEAR="$EXTYR"; TYPE="${EXTTYPE:-movie}"; FILM=1
  else
    PROMPT="Bir film/dizi blog yazısının başlığı ve özeti aşağıda. Bu yazı hangi film veya diziyle ilgili? SADECE şu JSON'u döndür, başka hiçbir şey yazma:
{\"film_related\": true|false, \"query\": \"TMDB'de aratılacak ORİJİNAL film/dizi adı (İngilizce/orijinal dil)\", \"type\": \"movie\"|\"tv\", \"year\": 2024|null}
Eğer yazı belirli bir film/diziyle ilgili DEĞİLSE (deneme, söyleşi, genel sinema yazısı) film_related=false ver.

BAŞLIK: $TITLE
ÖZET: $EXCERPT"
    AI=$(printf '%s' "$PROMPT" | "$CLAUDE_BIN" -p --model sonnet 2>>"$LOG")
    AI=$(echo "$AI" | sed -e 's/^```json//' -e 's/^```//' -e 's/```$//' | tr -d '\r')
    FILM=$(echo "$AI" | /usr/bin/jq -r '.film_related // false' 2>/dev/null)
    QUERY=$(echo "$AI" | /usr/bin/jq -r '.query // ""' 2>/dev/null)
    TYPE=$(echo "$AI" | /usr/bin/jq -r '.type // "movie"' 2>/dev/null)
    YEAR=$(echo "$AI" | /usr/bin/jq -r '.year // ""' 2>/dev/null)
    [ "$FILM" = "true" ] && FILM=1 || FILM=0
  fi

  if [ "$FILM" != "1" ] || [ -z "$QUERY" ] || [ "$QUERY" = "null" ]; then
    log "#$ID ATLA (film değil / ad yok): '$TITLE'"
    continue
  fi
  [ "$TYPE" != "movie" ] && [ "$TYPE" != "tv" ] && TYPE="movie"

  YQ=""
  if [ -n "$YEAR" ] && [ "$YEAR" != "null" ]; then
    [ "$TYPE" = "movie" ] && YQ="&year=$YEAR" || YQ="&first_air_date_year=$YEAR"
  fi

  TMDB=$(curl -sS --max-time 20 -H "Authorization: Bearer $TMDB_TOKEN" \
    "https://api.themoviedb.org/3/search/$TYPE?query=$(/usr/bin/jq -rn --arg q "$QUERY" '$q|@uri')&language=tr-TR$YQ")
  POSTER=$(echo "$TMDB" | /usr/bin/jq -r '.results[0].poster_path // ""')
  TMID=$(echo "$TMDB" | /usr/bin/jq -r '.results[0].id // ""')

  if [ -z "$POSTER" ] || [ "$POSTER" = "null" ]; then
    # yıl filtresini kaldırıp tekrar dene
    TMDB=$(curl -sS --max-time 20 -H "Authorization: Bearer $TMDB_TOKEN" \
      "https://api.themoviedb.org/3/search/$TYPE?query=$(/usr/bin/jq -rn --arg q "$QUERY" '$q|@uri')&language=tr-TR")
    POSTER=$(echo "$TMDB" | /usr/bin/jq -r '.results[0].poster_path // ""')
    TMID=$(echo "$TMDB" | /usr/bin/jq -r '.results[0].id // ""')
  fi

  if [ -z "$POSTER" ] || [ "$POSTER" = "null" ]; then
    log "#$ID BULUNAMADI: '$TITLE' -> TMDB '$QUERY' ($TYPE)"
    continue
  fi

  COVER="https://image.tmdb.org/t/p/original${POSTER}"
  log "#$ID OK: '$TITLE' -> $QUERY ($TYPE/$TMID) $COVER"

  if [ "$DRY_RUN" = "1" ]; then
    continue
  fi

  RESP=$(curl -sS --max-time 30 -X POST "$SITE/api/posts/set-cover?token=$TOKEN" \
    --data-urlencode "id=$ID" \
    --data-urlencode "cover_image=$COVER" \
    --data-urlencode "tmdb_id=$TMID" \
    --data-urlencode "tmdb_type=$TYPE" \
    --data-urlencode "external_title=$QUERY" \
    --data-urlencode "external_year=$YEAR")
  log "#$ID set-cover yanıtı: $RESP"
done

log "=== Bitti ==="
