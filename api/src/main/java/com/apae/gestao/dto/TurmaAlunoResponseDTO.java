package com.apae.gestao.dto;

import com.apae.gestao.entity.TurmaAluno;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurmaAlunoResponseDTO {
    private Long alunoId;
    private String nome;
    private Boolean isAtivo;

    public TurmaAlunoResponseDTO(TurmaAluno ta) {
        this.alunoId = ta.getAluno().getId();
        this.nome = ta.getAluno().getNome();
        this.isAtivo = ta.getIsAlunoAtivo();
    }
}