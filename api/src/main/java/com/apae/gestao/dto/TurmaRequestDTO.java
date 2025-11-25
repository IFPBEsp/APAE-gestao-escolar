package com.apae.gestao.dto;

import java.util.Set;

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

    @NotBlank(message = "Nome é obrigatorio")
    @Schema(description = "Nome completo da turma", example = "Alfabetização 2025 - Manhã")
    private String nome;

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

    private Set<Long> alunosIds;
}
