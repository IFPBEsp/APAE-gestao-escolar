package com.apae.gestao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados para criação de senha no primeiro acesso do professor.")
public class PrimeiroAcessoRequestDTO {

    @NotBlank
    @Schema(description = "E-mail do professor", example = "maria.santos@apae.org.br")
    private String email;

    @NotBlank
    @Schema(description = "Nova senha que será cadastrada")
    private String novaSenha;
}
