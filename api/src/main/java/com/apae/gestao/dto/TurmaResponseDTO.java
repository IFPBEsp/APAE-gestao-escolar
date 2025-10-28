package com.apae.gestao.dto;

import java.util.List;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;

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
    private List<Aluno> alunos;
    private Professor professor;
    

    public TurmaResponseDTO(Turma turma){
        this.id = turma.getId();
        this.nome = turma.getNome();
        this.anoCriacao = turma.getAnoCriacao();
        this.turno = turma.getTurno();
        this.alunos = turma.getAlunos();
        this.professor = turma.getProfessor();
    }
}
