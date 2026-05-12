# =======================================================
# APAE - Gestão Escolar — Backend (Spring Boot)
# =======================================================

# -------------------------------------------------------
# Stage 1: Build
# -------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copia o pom.xml primeiro e baixa as dependências
# (camada de cache separada — rebuild só se pom.xml mudar)
COPY pom.xml .
RUN mvn dependency:go-offline -B -q

COPY src ./src
RUN mvn clean package -DskipTests -B -q

# -------------------------------------------------------
# Stage 2: Produção
# -------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Metadados da imagem (vincula ao repositório no GHCR)
LABEL org.opencontainers.image.source=https://github.com/IFPBEsp/APAE-gestao-escolar
LABEL org.opencontainers.image.description="APAE Gestão Escolar - Backend (Spring Boot)"
LABEL org.opencontainers.image.licenses=MIT

# Usuário não-root para segurança em produção
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder --chown=appuser:appgroup /app/target/*.jar app.jar

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]