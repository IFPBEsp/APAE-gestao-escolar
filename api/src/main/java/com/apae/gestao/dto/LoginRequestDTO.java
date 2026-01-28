package com.apae.gestao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados necessários para realizar login no sistema.")
public class LoginRequestDTO {

    @NotBlank
    @Schema(description = "E-mail do usuário", example = "maria.santos@apae.org.br")
    private String email;

    @Schema(description = "Senha do usuário", example = "123456")
    private String senha;
}
