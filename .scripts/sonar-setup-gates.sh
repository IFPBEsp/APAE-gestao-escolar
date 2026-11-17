#!/usr/bin/env bash
set -euo pipefail

SONAR_URL="${SONAR_URL:-http://localhost:9500}"

if [ -z "${SONAR_TOKEN:-}" ]; then
  echo "Erro: a variável de ambiente SONAR_TOKEN não está definida." >&2
  exit 1
fi

# ==============================================================================
# Limites calibrados a partir da linha de base medida na branch dev
# Ratings na Web API do SonarQube: 1=A, 2=B, 3=C, 4=D, 5=E
# ==============================================================================

# Backend (dev: coverage=0.0% [sem JaCoCo na dev], duplication=4.6%, reliability=D[4], security=D[4])
# A API do SonarQube exige valor > 0 para LT em new_coverage; usa-se 1% como piso mínimo inicial
BACKEND_MIN_COVERAGE="1"
BACKEND_MAX_DUPLICATION="4.6"
BACKEND_MAX_RELIABILITY="4"
BACKEND_MAX_SECURITY="4"
BACKEND_MIN_HOTSPOTS="100"

# Frontend (dev: coverage=0.0% [sem lcov.info], duplication=2.1%, reliability=C[3], security=A[1])
FRONTEND_MAX_DUPLICATION="2.1"
FRONTEND_MAX_RELIABILITY="3"
FRONTEND_MAX_SECURITY="1"
FRONTEND_MIN_HOTSPOTS="100"

api_post() {
  local endpoint="$1"
  shift
  local response http_code
  response=$(curl -sS -w "\n%{http_code}" -u "${SONAR_TOKEN}:" -X POST "${SONAR_URL}${endpoint}" "$@")
  http_code=$(echo "$response" | tail -n1)
  if [ "$http_code" -ge 400 ]; then
    echo "Erro HTTP ${http_code} em ${endpoint}: $(echo "$response" | sed '$d')" >&2
    exit 1
  fi
}

recreate_gate() {
  local gate_name="$1"
  echo "Configurando Quality Gate: ${gate_name}..."

  # Remove o gate se já existir (se estiver associado a projeto, desassocia antes)
  curl -s -u "${SONAR_TOKEN}:" -X POST "${SONAR_URL}/api/qualitygates/deselect" \
    --data-urlencode "projectKey=${gate_name}" >/dev/null || true
  curl -s -u "${SONAR_TOKEN}:" -X POST "${SONAR_URL}/api/qualitygates/destroy" \
    --data-urlencode "name=${gate_name}" >/dev/null || true

  api_post "/api/qualitygates/create" --data-urlencode "name=${gate_name}"

  # Limpa condições padrão criadas automaticamente pelo SonarQube v26+
  local gate_json cond_ids
  gate_json=$(curl -fsS -u "${SONAR_TOKEN}:" "${SONAR_URL}/api/qualitygates/show?name=${gate_name}")
  cond_ids=$(echo "$gate_json" | grep -o '"id":"[^"]*"' | cut -d'"' -f4 || true)
  for cid in $cond_ids; do
    api_post "/api/qualitygates/delete_condition" --data-urlencode "id=${cid}"
  done
}

add_condition() {
  local gate_name="$1"
  local metric="$2"
  local op="$3"
  local error_threshold="$4"

  api_post "/api/qualitygates/create_condition" \
    --data-urlencode "gateName=${gate_name}" \
    --data-urlencode "metric=${metric}" \
    --data-urlencode "op=${op}" \
    --data-urlencode "error=${error_threshold}"
  echo "  + Condição: ${metric} (${op} ${error_threshold})"
}

associate_project() {
  local gate_name="$1"
  local project_key="$2"
  api_post "/api/qualitygates/select" \
    --data-urlencode "gateName=${gate_name}" \
    --data-urlencode "projectKey=${project_key}"
  echo "  -> Associado ao projeto: ${project_key}"
}

# 1. Quality Gate: apae-gestao-escolar-backend
recreate_gate "apae-gestao-escolar-backend"
add_condition "apae-gestao-escolar-backend" "new_coverage" "LT" "${BACKEND_MIN_COVERAGE}"
add_condition "apae-gestao-escolar-backend" "new_duplicated_lines_density" "GT" "${BACKEND_MAX_DUPLICATION}"
add_condition "apae-gestao-escolar-backend" "new_reliability_rating" "GT" "${BACKEND_MAX_RELIABILITY}"
add_condition "apae-gestao-escolar-backend" "new_security_rating" "GT" "${BACKEND_MAX_SECURITY}"
add_condition "apae-gestao-escolar-backend" "new_security_hotspots_reviewed" "LT" "${BACKEND_MIN_HOTSPOTS}"
associate_project "apae-gestao-escolar-backend" "apae-gestao-escolar-backend"

# 2. Quality Gate: apae-gestao-escolar-frontend
# Sem condição de cobertura enquanto não houver geração de lcov.info (issue #462)
recreate_gate "apae-gestao-escolar-frontend"
add_condition "apae-gestao-escolar-frontend" "new_duplicated_lines_density" "GT" "${FRONTEND_MAX_DUPLICATION}"
add_condition "apae-gestao-escolar-frontend" "new_reliability_rating" "GT" "${FRONTEND_MAX_RELIABILITY}"
add_condition "apae-gestao-escolar-frontend" "new_security_rating" "GT" "${FRONTEND_MAX_SECURITY}"
add_condition "apae-gestao-escolar-frontend" "new_security_hotspots_reviewed" "LT" "${FRONTEND_MIN_HOTSPOTS}"
associate_project "apae-gestao-escolar-frontend" "apae-gestao-escolar-frontend"

echo "Concluído! Os dois Quality Gates foram criados e associados com sucesso."
