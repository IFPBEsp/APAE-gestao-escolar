# Relatório de Revisão de Dependências e Vulnerabilidades - APAE Gestão Escolar

## Backend (api/pom.xml)
- **Spring Boot Parent:** Atualizado para `3.3.11`.
- **Spring Framework:** Atualizado via `<spring-framework.version>` para `6.2.19`, corrigindo as vulnerabilidades `CVE-2024-38816`, `CVE-2024-38819`, `CVE-2026-41842` e `CVE-2026-41845`.
- **Dependências Gerenciadas:** Tomcat (`10.1.59`), Jackson (`2.21.7`), PostgreSQL (`42.7.12`), Guava (`33.7.2-jre`), BouncyCastle (`1.85`), Minio (`8.6.0`), Snappy-Java (`1.1.10.9`).
- **Exceções Mantidas em .trivyignore:**
  - `CVE-2026-47884`: Vulnerabilidade em XsltView no spring-webmvc. Sem correção na linha 6.x (exige Spring 7). A aplicação atua estritamente como API REST JSON e não utiliza renderização XsltView.
  - `CVE-2026-47890`: Vulnerabilidade em SSE com view rendering no spring-webmvc. Sem correção na linha 6.x (exige Spring 7). A aplicação não utiliza SSE com view.

## Frontend (app/package.json)
- **Overrides e Atualizações:** `axios`, `next`, `nanoid`, `sharp`, `postcss`, `form-data`, `brace-expansion`, `minimatch`, `lodash`, `source-map-js`.
