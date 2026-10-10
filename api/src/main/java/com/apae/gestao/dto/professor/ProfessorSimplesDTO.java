package com.apae.gestao.dto.professor;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO enxuto do professor para exibição em listagens de turmas.")
public class ProfessorSimplesDTO {

    @Schema(description = "Identificador único do professor")
    private UUID id;

    @Schema(description = "Nome completo do professor", example = "Luan lorêto")
    private String nome;
}
