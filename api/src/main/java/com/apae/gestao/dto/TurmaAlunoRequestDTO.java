package com.apae.gestao.dto;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Turma;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurmaAlunoRequestDTO {

    @NotNull
    private Turma turma;

    @NotNull
    private Aluno aluno;

}
