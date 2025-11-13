package com.apae.gestao.dto;

import com.apae.gestao.entity.Aluno;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlunoResponseDTO {
    private Long id;
    private String nome;
    private Integer idade;
    private String deficiencia;

    public AlunoResponseDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.nome = aluno.getNome();
        this.idade = aluno.getIdade();
        this.deficiencia = aluno.getDeficiencia();
    }
}
