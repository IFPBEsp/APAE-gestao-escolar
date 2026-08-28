#!/usr/bin/env bash

set -euo pipefail

MODE="${1:-both}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

load_env() {
  if [ ! -f "$ENV_FILE" ]; then
    cp "$ROOT_DIR/.env.example" "$ENV_FILE"
  fi

  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
}

run_backend() {
  load_env
  cd "$ROOT_DIR/api"
  ./mvnw spring-boot:run
}

run_frontend() {
  load_env
  cd "$ROOT_DIR/app"
  npm run dev -- --port 3002
}

run_both() {
  run_backend &
  backend_pid=$!
  run_frontend &
  frontend_pid=$!

  cleanup() {
    kill "$backend_pid" "$frontend_pid" 2>/dev/null || true
  }

  trap cleanup INT TERM EXIT
  wait -n "$backend_pid" "$frontend_pid"
}

case "$MODE" in
  backend) run_backend ;;
  frontend) run_frontend ;;
  both) run_both ;;
  *) echo "Uso: $0 [backend|frontend|both]"; exit 1 ;;
esac
