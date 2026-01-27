package com.apae.gestao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO resumido para listagem de professores.")
public class ProfessorResumoDTO {

    @Schema(description = "Identificador único do professor", example = "42")
    private Long id;

    @Schema(description = "Nome completo do professor", example = "Maria da Silva")
    private String nome;

    @Schema(description = "CPF armazenado", example = "12345678901")
    private String cpf;

    @Schema(description = "E-mail institucional", example = "maria.silva@apae.org.br")
    private String email;

    @Schema(description = "Indica se o professor está ativo no sistema", example = "true")
    private Boolean ativo;

    @Schema(description = "Lista com nomes das turmas vinculadas ao professor")
    private List<String> turmas;
}
