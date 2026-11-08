# Relatório de Revisão de Dependências e Vulnerabilidades - APAE Gestão Escolar

## Backend (api/pom.xml)
- **Spring Boot Parent:** Atualizado para 3.3.11.
- **Dependências Atualizadas:** Tomcat (10.1.59), Jackson (2.21.7), PostgreSQL (42.7.12), Guava (33.7.2-jre), BouncyCastle (1.85), Minio (8.6.0), Snappy-Java (1.1.10.9).
- **Exceções em .trivyignore:** CVE-2026-47884 e CVE-2026-47890 (Spring MVC 6.2.x sem patch disponível, exige Spring 7).

## Frontend (app/package.json)
- **Overrides e Atualizações:** axios, next, nanoid, sharp, postcss, form-data, brace-expansion, minimatch, lodash, source-map-js.
