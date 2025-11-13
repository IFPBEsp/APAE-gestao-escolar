package com.apae.gestao.dto;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurmaResponseDTO {
    private Long id;
    private String nome;
    private Integer anoCriacao;
    private String turno;
    private String tipo;
    private Boolean isAtiva;
    private ProfessorResponseDTO professor;
    private List<Long> alunosIds;

    public TurmaResponseDTO(Turma turma){
        this.id = turma.getId();
        this.nome = turma.getNome();
        this.anoCriacao = turma.getAnoCriacao();
        this.turno = turma.getTurno();
        this.isAtiva = turma.getIsAtiva();

        if(turma.getProfessor() != null) {
            this.professor = new ProfessorResponseDTO(turma.getProfessor());
        }

        if(turma.getTurmaAlunos() != null) {
            this.alunosIds = turma.getTurmaAlunos().stream()
                    .filter(TurmaAluno::getIsAlunoAtivo)
                    .map(ta -> ta.getAluno().getId())
                    .collect(Collectors.toList());
        }
    }
}