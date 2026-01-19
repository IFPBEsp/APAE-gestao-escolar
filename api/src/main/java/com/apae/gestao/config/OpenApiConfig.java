package com.apae.gestao.config;

import java.util.List;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.ExternalDocumentation;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "APAE Gestão Escolar API",
        version = "1.0.0",
        description = "Documentação oficial dos serviços da plataforma de gestão escolar da APAE.",
        contact = @Contact(name = "APAE Tech", email = "contato@apae.org.br", url = "https://apaebrasil.org.br"),
        license = @License(name = "MIT", url = "https://opensource.org/licenses/MIT")
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Ambiente Local")
    },
    tags = {
        @Tag(name = "Professores", description = "Recursos relacionados ao cadastro e manutenção de professores"),
        @Tag(name = "Turmas", description = "Fluxos de criação, vinculação e acompanhamento de turmas"),
        @Tag(name = "Alunos", description = "Consultas públicas sobre alunos ativos")
    },
    externalDocs = @ExternalDocumentation(
        description = "Guia funcional do Sistema APAE",
        url = "https://github.com/IFPBEsp/APAE-gestao-escolar"
    )
)
@SecurityScheme(
    name = "bearerAuth",
    description = "Utilize o header Authorization com o formato: Bearer {token}",
    scheme = "bearer",
    bearerFormat = "JWT",
    type = SecuritySchemeType.HTTP,
    in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {

    @Bean
    public io.swagger.v3.oas.models.OpenAPI apaOpenAPI() {
        return new io.swagger.v3.oas.models.OpenAPI()
                .info(new io.swagger.v3.oas.models.info.Info()
                        .title("APAE Gestão Escolar API")
                        .version("1.0.0")
                        .description("Catálogo completo de endpoints da plataforma APAE, incluindo validações e exemplos.")
                        .contact(new io.swagger.v3.oas.models.info.Contact()
                                .name("APAE - Núcleo de Tecnologia")
                                .email("contato@apae.org.br")
                                .url("https://apaebrasil.org.br"))
                        .license(new io.swagger.v3.oas.models.info.License()
                                .name("MIT")
                                .url("https://opensource.org/licenses/MIT")))
                .externalDocs(new io.swagger.v3.oas.models.ExternalDocumentation()
                        .description("Documentação funcional do projeto")
                        .url("https://github.com/IFPBEsp/APAE-gestao-escolar"))
                .addSecurityItem(new io.swagger.v3.oas.models.security.SecurityRequirement().addList("bearerAuth"))
                .schemaRequirement("bearerAuth", new io.swagger.v3.oas.models.security.SecurityScheme()
                        .name("bearerAuth")
                        .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT"));
    }

    @Bean
    public GroupedOpenApi professorApi() {
        return GroupedOpenApi.builder()
                .group("Professores")
                .pathsToMatch("/api/professores/**")
                .build();
    }

    @Bean
    public GroupedOpenApi turmaApi() {
        return GroupedOpenApi.builder()
                .group("Turmas")
                .pathsToMatch("/api/turmas/**")
                .build();
    }

    @Bean
    public GroupedOpenApi alunoApi() {
        return GroupedOpenApi.builder()
                .group("Alunos")
                .pathsToMatch("/api/alunos/**")
                .build();
    }
}