package com.apae.gestao.dto.turma;

import java.util.Set;

import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Informações necessárias para criar ou atualizar uma turma.")
public class TurmaRequestDTO {

    @NotNull
    @Schema(description = "Ano letivo de criação da turma", example = "2025")
    private Integer anoCriacao;

    @NotBlank
    @Schema(description = "Turno principal da turma", example = "MANHA")
    private String turno;

    @NotNull
    @Schema(description = "Identificador do professor responsável", example = "12")
    private Long professorId;

    @Schema(description = "Status da turma (ativa/inativa). Caso não informado, assume true", example = "true")
    private Boolean isAtiva;

    @NotBlank(message = "Tipo é obrigatório")
    @Schema(description = "Tipo pedagógico ou classificação da turma", example = "Educação Especial")
    private String tipo;

    @ArraySchema(schema = @Schema(implementation = Long.class, description = "IDs de alunos vinculados"), uniqueItems = true)
    private Set<Long> alunosIds;
}
