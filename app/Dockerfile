# =======================================================
# APAE - Gestão Escolar — Frontend (Next.js)
# =======================================================

# -------------------------------------------------------
# Stage 1: Build
# -------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .

# NEXT_PUBLIC_* são resolvidas em build-time no Next.js
ARG NEXT_PUBLIC_API_URL=/gestao-escolar/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# URL do backend usada nas rewrites do next.config.js
# Resolvida em build-time no modo standalone
ARG BACKEND_URL=http://localhost:8080
ENV BACKEND_URL=$BACKEND_URL

RUN npm run build

# -------------------------------------------------------
# Stage 2: Produção
# -------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Metadados da imagem (vincula ao repositório no GHCR)
LABEL org.opencontainers.image.source=https://github.com/IFPBEsp/APAE-gestao-escolar
LABEL org.opencontainers.image.description="APAE Gestão Escolar - Frontend (Next.js)"
LABEL org.opencontainers.image.licenses=MIT

# Usuário não-root para segurança em produção
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static/
COPY --from=builder --chown=appuser:appgroup /app/public ./public/

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/gestao-escolar || exit 1

CMD ["node", "server.js"]
