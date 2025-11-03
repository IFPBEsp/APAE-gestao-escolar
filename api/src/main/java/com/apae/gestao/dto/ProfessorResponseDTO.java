package com.apae.gestao.dto;

import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorResponseDTO {

    private Long id;
    private String nome;
    private String cpf;
    private String email;
    private String telefone;
    private LocalDate dataNascimento;
    private String especialidade;
    private LocalDate dataContratacao;
    private Boolean ativo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<Turma> turmas;

    public ProfessorResponseDTO(Professor professor) {
        this.id = professor.getId();
        this.nome = professor.getNome();
        this.cpf = professor.getCpf();
        this.email = professor.getEmail();
        this.telefone = professor.getTelefone();
        this.dataNascimento = professor.getDataNascimento();
        this.especialidade = professor.getEspecialidade();
        this.dataContratacao = professor.getDataContratacao();
        this.ativo = professor.getAtivo();
        this.createdAt = professor.getCreatedAt();
        this.updatedAt = professor.getUpdatedAt();
        this.turmas = professor.getTurmas();
    }
}

