package com.apae.gestao.dto.aluno;

import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@Schema(description = "Informações básicas apresentadas ao consultar alunos.")
public class AlunoResumoDTO {

    private UUID id;
    private String nome;
    private String nomeResponsavel;
    private String nomeTurma;
}
