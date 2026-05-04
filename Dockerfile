# =======================================================
# APAE - Gestão Escolar
# Dockerfile multi-stage: Next.js (front) + Spring Boot (back)
# =======================================================

# -------------------------------------------------------
# Stage 1: Build do Frontend (Next.js)
# -------------------------------------------------------
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

# Copia dependências primeiro (melhor cache do Docker)
COPY app/package*.json ./
RUN npm ci --frozen-lockfile

# Copia o restante do código
COPY app/ .

# NEXT_PUBLIC_* são resolvidas em build-time no Next.js
# Quando o Nginx está na frente, o browser acessa via /gestao/api/
ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Gera o build standalone (necessário para este Dockerfile)
# Certifique-se de ter output: 'standalone' no next.config.js
RUN npm run build

# -------------------------------------------------------
# Stage 2: Build do Backend (Spring Boot)
# -------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder

WORKDIR /backend

# Copia o pom.xml primeiro e baixa as dependências
# (camada de cache separada — rebuild só se pom.xml mudar)
COPY api/pom.xml .
RUN mvn dependency:go-offline -B -q

# Copia o código-fonte e faz o build
COPY api/src ./src
RUN mvn clean package -DskipTests -B -q

# -------------------------------------------------------
# Stage 3: Imagem de produção
# -------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine

# Instala Node.js (para rodar o Next.js standalone) e o Supervisor
# O Supervisor gerencia os dois processos (front e back) no mesmo container
RUN apk add --no-cache nodejs supervisor

WORKDIR /app

# --- Copia o JAR do Spring Boot ---
COPY --from=backend-builder /backend/target/*.jar ./backend.jar

# --- Copia o Next.js no modo standalone ---
# A pasta standalone já inclui um server.js leve e as dependências mínimas
COPY --from=frontend-builder /frontend/.next/standalone ./frontend/
# Arquivos estáticos gerados (_next/static)
COPY --from=frontend-builder /frontend/.next/static ./frontend/.next/static/
# Arquivos públicos (imagens, ícones etc.)
COPY --from=frontend-builder /frontend/public ./frontend/public/

# Copia a configuração do Supervisor
COPY supervisord.conf /etc/supervisord.conf

# Porta do Next.js (frontend) e do Spring Boot (backend/API)
EXPOSE 3000 8080

# Supervisor sobe e mantém os dois processos rodando
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]