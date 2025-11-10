package com.apae.gestao.dto;

import java.util.Set;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Professor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurmaRequestDTO {

    @NotBlank
    private String nome;

    @NotNull
    private Integer anoCriacao;

    @NotBlank
    private String turno;

    private Boolean isAtiva;

    private Set<Aluno> alunos;

    private Set<Professor> professores;
}
