#!/bin/bash

if [ -z "$SONAR_TOKEN" ]; then
  echo "Erro: A variável SONAR_TOKEN não está definida."
  echo "Execute passando o token:"
  echo "SONAR_TOKEN=<SEU_TOKEN> .scripts/sonar-scan-frontend.sh"
  exit 1
fi

SONAR_HOST_URL="${SONAR_HOST_URL:-http://localhost:9500}"
FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../app" && pwd)"

echo "Iniciando análise do SonarQube para o Frontend..."
echo "Host: $SONAR_HOST_URL"

docker run --rm \
    --network host \
    -e SONAR_HOST_URL="$SONAR_HOST_URL" \
    -e SONAR_TOKEN="$SONAR_TOKEN" \
    -v "$FRONTEND_DIR:/usr/src" \
    sonarsource/sonar-scanner-cli:11
