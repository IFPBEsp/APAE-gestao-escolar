# syntax=docker/dockerfile:1.7

FROM maven:3.9-eclipse-temurin-21-alpine@sha256:65353f527c86cb23187c8233475713e15067e8d36220d18863c379680698fe85 AS builder

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN --mount=type=cache,id=gestao-escolar-m2,target=/root/.m2 \
    mvn package -DskipTests -B -q


FROM gcr.io/distroless/java21-debian13:nonroot@sha256:bb0b3c7edc4417acdf76ea0f52bb5fae28881fe05aae6cc55af4cc4cb0200d2d AS runtime

ARG APP_VERSION
ARG VCS_REF

LABEL org.opencontainers.image.title="APAE Gestão Escolar" \
      org.opencontainers.image.description="Backend do APAE Gestão Escolar" \
      org.opencontainers.image.source="https://github.com/IFPBEsp/APAE-gestao-escolar" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version=$APP_VERSION \
      org.opencontainers.image.revision=$VCS_REF

WORKDIR /app

COPY --from=builder --chown=65532:65532 /app/target/*.jar app.jar

USER 65532:65532

EXPOSE 8080

ENTRYPOINT ["/usr/bin/java"]
CMD ["-jar", "app.jar"]