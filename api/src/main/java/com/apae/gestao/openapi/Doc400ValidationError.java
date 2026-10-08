package com.apae.gestao.openapi;

import com.apae.gestao.dto.api.ApiErrorResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Resposta padronizada de erro 400 (dados inválidos) usando ApiErrorResponse.
 * Pode ser aplicada diretamente em métodos ou usada como meta-anotação.
 */
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@ApiResponse(
        responseCode = "400",
        description = "Dados inválidos",
        content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))
)
public @interface Doc400ValidationError {
}

