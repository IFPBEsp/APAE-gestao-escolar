package com.apae.gestao.dto.aluno;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Informações básicas apresentadas ao consultar alunos.")
public class AlunoResumoDTO {

    private Long id;
    private String nome;
    private String nomeResponsavel;

    private String nomeTurma;
    private String turnoTurma;

    private Double percentualPresenca;
    private LocalDateTime dataUltimaAvaliacao;
}
