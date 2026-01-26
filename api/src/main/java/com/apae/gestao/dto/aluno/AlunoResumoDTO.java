package com.apae.gestao.dto.aluno;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AlunoResumoDTO {

    private Long id;
    private String nome;
    private String nomeResponsavel;

    private String nomeTurma;
    private String turnoTurma;

    private Double percentualPresenca;
    private LocalDateTime dataUltimaAvaliacao;
}
