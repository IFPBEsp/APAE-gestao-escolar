package com.apae.gestao.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados necessários para solicitar a recuperação de senha.")
public class RedefinirSenhaRequestDTO {

    @NotBlank(message = "O e-mail é obrigatório")
    @Schema(description = "E-mail do professor", example = "maria.santos@apae.org.br")
    private String email;

    @NotBlank(message = "O CPF é obrigatório")
    @Schema(description = "CPF do professor", example = "12345678900")
    private String cpf;
}