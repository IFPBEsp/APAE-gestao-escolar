package com.apae.gestao.dto;

import java.time.LocalDateTime;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(description = "Resposta padronizada de erro retornada pelos endpoints da plataforma.")
public class ApiErrorResponse {

    @Schema(description = "Data e hora da ocorrência do erro", example = "2024-11-20T10:15:30.123")
    private LocalDateTime timestamp;

    @Schema(description = "Código HTTP associado ao erro", example = "400")
    private Integer status;

    @Schema(description = "Descrição curta do tipo de erro", example = "Erro de validação")
    private String error;

    @Schema(description = "Mensagem detalhando o motivo do erro", example = "CPF já cadastrado: 12345678901")
    private String message;

    @Schema(description = "Path do endpoint que originou o erro", example = "/api/professores")
    private String path;

    @Schema(description = "Lista de erros por campo (quando aplicável)")
    private Map<String, String> errors;
}

