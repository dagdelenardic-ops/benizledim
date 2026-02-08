#!/usr/bin/env bash
set -euo pipefail

# Simple dev-server controller for this repo.
# - Starts `npm run dev` in the background with logs + pid/pgid/port files
# - Stops it later from a desktop shortcut without using the terminal manually

REPO_DIR="/Users/gurursonmez/CanvaBenizledim"
RUN_DIR="${REPO_DIR}/.run"

PID_FILE="${RUN_DIR}/dev.pid"
PGID_FILE="${RUN_DIR}/dev.pgid"
PORT_FILE="${RUN_DIR}/dev.port"
LOG_FILE="${RUN_DIR}/dev.log"

DEFAULT_PORT=3000
MAX_PORT=3010

say() { printf "%s\n" "$*"; }
die() { printf "ERROR: %s\n" "$*" 1>&2; exit 1; }

ensure_run_dir() { mkdir -p "${RUN_DIR}"; }

read_trim() {
  # Usage: read_trim /path/to/file
  local f="${1}"
  [[ -f "${f}" ]] || return 1
  tr -d ' \t\r\n' < "${f}"
}

pid_alive() {
  local pid="${1}"
  [[ -n "${pid}" ]] || return 1
  kill -0 "${pid}" 2>/dev/null
}

pid_cmdline() {
  local pid="${1}"
  ps -p "${pid}" -o command= 2>/dev/null || true
}

pid_seems_ours() {
  local pid="${1}"
  local cmd
  cmd="$(pid_cmdline "${pid}")"
  [[ -n "${cmd}" ]] || return 1
  [[ "${cmd}" == *"${REPO_DIR}"* ]] || return 1
  [[ "${cmd}" == *"next"* ]] || return 1
  return 0
}

detect_repo_next_dev_pid() {
  # Prefer the "main" next dev process (the one that holds the lock).
  # Example cmdline:
  #   node /Users/.../node_modules/.bin/next dev -H 127.0.0.1
  pgrep -f "${REPO_DIR}/node_modules/.bin/next dev" 2>/dev/null | head -n 1 || true
}

ports_listening_for_pid() {
  local pid="${1}"
  { lsof -n -P -a -p "${pid}" -iTCP -sTCP:LISTEN 2>/dev/null || true; } \
    | awk 'NR>1 {print $9}' \
    | sed -E 's/.*:([0-9]+)$/\1/' \
    | awk 'NF' \
    | sort -n \
    | uniq
}

detect_repo_port() {
  # Prefer deriving the port from the next dev process tree.
  local main_pid=""
  main_pid="$(detect_repo_next_dev_pid)"
  if [[ -n "${main_pid}" ]]; then
    local pids
    pids="${main_pid}"
    local c
    for c in $(pgrep -P "${main_pid}" 2>/dev/null || true); do
      pids="${pids} ${c}"
      local gc
      for gc in $(pgrep -P "${c}" 2>/dev/null || true); do
        pids="${pids} ${gc}"
      done
    done

    local p
    for p in ${pids}; do
      local lp
      for lp in $(ports_listening_for_pid "${p}"); do
        if [[ "${lp}" -ge "${DEFAULT_PORT}" ]] && [[ "${lp}" -le "${MAX_PORT}" ]]; then
          printf "%s" "${lp}"
          return 0
        fi
      done
    done
  fi

  # Fallback: scan ports and see if any listener is tied to this repo via cmdline.
  local port
  for port in $(seq "${DEFAULT_PORT}" "${MAX_PORT}"); do
    local listeners
    listeners="$(lsof -tiTCP:"${port}" -sTCP:LISTEN -n -P 2>/dev/null || true)"
    if [[ -z "${listeners}" ]]; then
      continue
    fi

    local lp
    for lp in ${listeners}; do
      if pid_seems_ours "${lp}"; then
        printf "%s" "${port}"
        return 0
      fi
    done
  done
  return 1
}

detect_repo_pids() {
  # Collect related next dev pids for this repo (best-effort).
  (
    pgrep -f "${REPO_DIR}/node_modules/.bin/next dev" 2>/dev/null || true
    pgrep -f "${REPO_DIR}/\\.next/dev" 2>/dev/null || true
  ) | awk 'NF' | sort -n | uniq
}

pid_tree_pids() {
  # Print PID + all descendants (best-effort) one per line.
  local root="${1:-}"
  [[ -n "${root}" ]] || return 1

  local -a queue=("${root}")
  local -a out=()
  local seen=" "

  while ((${#queue[@]})); do
    local p="${queue[0]}"
    queue=("${queue[@]:1}")

    [[ -n "${p}" ]] || continue
    [[ "${seen}" == *" ${p} "* ]] && continue

    seen="${seen}${p} "
    out+=("${p}")

    local child
    while IFS= read -r child; do
      [[ -n "${child}" ]] && queue+=("${child}")
    done < <(pgrep -P "${p}" 2>/dev/null || true)
  done

  printf "%s\n" "${out[@]}"
}

port_in_use() {
  local port="${1}"
  lsof -iTCP:"${port}" -sTCP:LISTEN -n -P >/dev/null 2>&1
}

find_free_port() {
  local port="${DEFAULT_PORT}"
  while [[ "${port}" -le "${MAX_PORT}" ]]; do
    if ! port_in_use "${port}"; then
      printf "%s" "${port}"
      return 0
    fi
    port=$((port + 1))
  done
  return 1
}

open_browser() {
  local port="${1}"
  open "http://127.0.0.1:${port}" >/dev/null 2>&1 || true
}

wait_for_http() {
  local url="${1}"
  local timeout_s="${2:-20}"

  local start
  start="$(date +%s)"

  while true; do
    if curl -fsS "${url}" >/dev/null 2>&1; then
      return 0
    fi
    if [[ $(( $(date +%s) - start )) -ge "${timeout_s}" ]]; then
      return 1
    fi
    sleep 0.5
  done
}

cleanup_state_files() {
  rm -f "${PID_FILE}" "${PGID_FILE}" "${PORT_FILE}" 2>/dev/null || true
}

start_dev() {
  ensure_run_dir

  local existing_pid=""
  existing_pid="$(read_trim "${PID_FILE}" 2>/dev/null || true)"

  if [[ -n "${existing_pid}" ]] && pid_alive "${existing_pid}" && pid_seems_ours "${existing_pid}"; then
    local port="${DEFAULT_PORT}"
    port="$(read_trim "${PORT_FILE}" 2>/dev/null || echo "${DEFAULT_PORT}")"
    say "Zaten calisiyor. (pid=${existing_pid}, port=${port})"
    open_browser "${port}"
    exit 0
  fi

  # Clean stale state (or state belonging to something else).
  cleanup_state_files

  # If a dev server is already running for this repo (started manually), just open it.
  local detected_port=""
  detected_port="$(detect_repo_port 2>/dev/null || true)"
  if [[ -n "${detected_port}" ]]; then
    local detected_pid=""
    detected_pid="$(detect_repo_next_dev_pid)"
    [[ -n "${detected_pid}" ]] && printf "%s\n" "${detected_pid}" > "${PID_FILE}" || true
    printf "%s\n" "${detected_port}" > "${PORT_FILE}"
    say "Zaten calisiyor. (port=${detected_port}${detected_pid:+, pid=${detected_pid}})"
    open_browser "${detected_port}"
    exit 0
  fi

  local port
  port="$(find_free_port)" || die "3000-3010 araliginda bos port bulunamadi."

  say "Baslatiliyor... (port=${port})"
  say "Log: ${LOG_FILE}"

  # Use zsh as login+interactive so nvm/homebrew node setups work reliably.
  # Keep the whole process tree in one process group; we store pid+pgid to stop later.
  local start_cmd
  start_cmd="cd \"${REPO_DIR}\" && npm run dev -- -p ${port}"

  nohup zsh -lic "${start_cmd}" >"${LOG_FILE}" 2>&1 &
  local pid=$!

  # Best-effort capture of process group id.
  local pgid=""
  pgid="$(ps -o pgid= "${pid}" 2>/dev/null | tr -d ' ' || true)"

  printf "%s\n" "${pid}" > "${PID_FILE}"
  [[ -n "${pgid}" ]] && printf "%s\n" "${pgid}" > "${PGID_FILE}" || true
  printf "%s\n" "${port}" > "${PORT_FILE}"

  # Wait a bit for server to respond, then open browser.
  wait_for_http "http://127.0.0.1:${port}" 20 || true
  open_browser "${port}"

  say "Tamam. (pid=${pid}${pgid:+, pgid=${pgid}})"
}

stop_dev() {
  ensure_run_dir

  local pid=""
  pid="$(read_trim "${PID_FILE}" 2>/dev/null || true)"

  if [[ -z "${pid}" ]]; then
    # Fallback: try to stop a manually-started instance.
    local detected_pid=""
    detected_pid="$(detect_repo_next_dev_pid)"
    if [[ -z "${detected_pid}" ]]; then
      say "PID dosyasi yok. (Muhtemelen zaten kapali.)"
      exit 0
    fi
    pid="${detected_pid}"
  fi

  if ! pid_alive "${pid}"; then
    # Fallback: check if something is still running for this repo.
    local detected_port=""
    detected_port="$(detect_repo_port 2>/dev/null || true)"
    if [[ -z "${detected_port}" ]]; then
      say "Zaten kapali gorunuyor. (pid=${pid})"
      cleanup_state_files
      exit 0
    fi
    # Continue and try to stop whatever is detected.
  fi

  local port="${DEFAULT_PORT}"
  port="$(read_trim "${PORT_FILE}" 2>/dev/null || echo "${DEFAULT_PORT}")"

  if [[ -z "${port}" ]] || ! port_in_use "${port}"; then
    local detected_port=""
    detected_port="$(detect_repo_port 2>/dev/null || true)"
    [[ -n "${detected_port}" ]] && port="${detected_port}"
  fi

  local pgid=""
  pgid="$(read_trim "${PGID_FILE}" 2>/dev/null || true)"

  say "Durduruluyor... (pid=${pid}, port=${port})"

  if [[ -n "${pgid}" ]]; then
    kill -TERM "-${pgid}" 2>/dev/null || true
  fi

  # Stop the whole process tree (covers cases where the listener pid cmdline doesn't include the repo path).
  local -a tree=()
  local t
  while IFS= read -r t; do
    [[ -n "${t}" ]] && tree+=("${t}")
  done < <(pid_tree_pids "${pid}" 2>/dev/null || true)

  local i
  for ((i=${#tree[@]}-1; i>=0; i--)); do
    kill -TERM "${tree[i]}" 2>/dev/null || true
  done

  # Also stop any related processes we can match by pattern (best-effort).
  local rp
  for rp in $(detect_repo_pids); do
    kill -TERM "${rp}" 2>/dev/null || true
  done

  # Wait up to ~10s for the port to close.
  local i=0
  while [[ "${i}" -lt 20 ]]; do
    if ! port_in_use "${port}"; then
      cleanup_state_files
      say "Kapatildi."
      exit 0
    fi
    sleep 0.5
    i=$((i + 1))
  done

  say "Hala calisiyor olabilir. Masaustundeki 'Force Kill' dosyasini kullan."
  exit 1
}

force_kill_dev() {
  ensure_run_dir

  local pid=""
  pid="$(read_trim "${PID_FILE}" 2>/dev/null || true)"

  local port=""
  port="$(read_trim "${PORT_FILE}" 2>/dev/null || true)"

  local pgid=""
  pgid="$(read_trim "${PGID_FILE}" 2>/dev/null || true)"

  say "Force kill..."

  if [[ -n "${pgid}" ]]; then
    kill -KILL "-${pgid}" 2>/dev/null || true
  fi

  if [[ -z "${pid}" ]]; then
    pid="$(detect_repo_next_dev_pid)"
  fi

  local -a tree=()
  local t
  while IFS= read -r t; do
    [[ -n "${t}" ]] && tree+=("${t}")
  done < <(pid_tree_pids "${pid}" 2>/dev/null || true)

  local i
  for ((i=${#tree[@]}-1; i>=0; i--)); do
    kill -KILL "${tree[i]}" 2>/dev/null || true
  done

  local rp
  for rp in $(detect_repo_pids); do
    kill -KILL "${rp}" 2>/dev/null || true
  done

  if [[ -n "${pid}" ]]; then
    kill -KILL "${pid}" 2>/dev/null || true
  fi

  # If the port is still open, try to kill listeners that clearly belong to this repo.
  if [[ -z "${port}" ]]; then
    port="$(detect_repo_port 2>/dev/null || true)"
  fi

  if [[ -n "${port}" ]] && port_in_use "${port}"; then
    local listeners
    listeners="$(lsof -tiTCP:"${port}" -sTCP:LISTEN -n -P 2>/dev/null || true)"
    if [[ -n "${listeners}" ]]; then
      local lp
      for lp in ${listeners}; do
        local cmd
        cmd="$(pid_cmdline "${lp}")"
        if [[ "${cmd}" == *"${REPO_DIR}"* ]]; then
          kill -KILL "${lp}" 2>/dev/null || true
        fi
      done
    fi
  fi

  cleanup_state_files
  say "Bitti."
}

status_dev() {
  ensure_run_dir

  local pid=""
  pid="$(read_trim "${PID_FILE}" 2>/dev/null || true)"

  local port="${DEFAULT_PORT}"
  port="$(read_trim "${PORT_FILE}" 2>/dev/null || echo "${DEFAULT_PORT}")"

  if [[ -n "${pid}" ]] && pid_alive "${pid}" && pid_seems_ours "${pid}"; then
    say "Calisiyor. (pid=${pid}, port=${port})"
    exit 0
  fi

  # Fallback: detect manually started instance.
  local detected_port=""
  detected_port="$(detect_repo_port 2>/dev/null || true)"
  if [[ -n "${detected_port}" ]]; then
    local detected_pid=""
    detected_pid="$(detect_repo_next_dev_pid)"
    [[ -n "${detected_pid}" ]] && printf "%s\n" "${detected_pid}" > "${PID_FILE}" || true
    printf "%s\n" "${detected_port}" > "${PORT_FILE}"
    say "Calisiyor. (port=${detected_port}${detected_pid:+, pid=${detected_pid}})"
    exit 0
  fi

  say "Calismiyor."
  exit 1
}

usage() {
  cat <<EOF
Usage: $(basename "$0") <start|stop|force-kill|status>
EOF
}

main() {
  local cmd="${1:-}"
  case "${cmd}" in
    start) start_dev ;;
    stop) stop_dev ;;
    force-kill) force_kill_dev ;;
    status) status_dev ;;
    *) usage; exit 2 ;;
  esac
}

main "${@:-}"
