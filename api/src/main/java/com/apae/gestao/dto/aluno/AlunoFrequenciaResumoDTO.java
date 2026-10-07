package com.apae.gestao.dto.aluno;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.UUID;

@Data
@AllArgsConstructor
@Schema(description = "Informações do aluno relacionadas a frequência")
public class AlunoFrequenciaResumoDTO {
    UUID id;
    String nome;
    Double percentualPresenca;
    Boolean emAlerta;
}
