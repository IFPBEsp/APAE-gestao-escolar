package com.apae.gestao.dto.aluno;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlunoSimplificadoTurmaDTO {
    private Long id;
    private Long alunoId;
    private String alunoNome;
    private String deficiencia;
}
