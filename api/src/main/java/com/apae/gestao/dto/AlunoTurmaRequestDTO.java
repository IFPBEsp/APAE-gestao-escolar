package com.apae.gestao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "DTO para solicitar a atualização da turma atual do aluno.") 
public class AlunoTurmaRequestDTO { 

    @NotNull(message = "O ID da turma não pode ser nulo.")
    @Schema(description = "O novo identificador da turma para o aluno", example = "2")
    private Long novaTurmaId;
}