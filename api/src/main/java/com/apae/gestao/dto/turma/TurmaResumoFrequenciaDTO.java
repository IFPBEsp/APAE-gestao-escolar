package com.apae.gestao.dto.turma;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TurmaResumoFrequenciaDTO {
    private Double percentualMedioTurma;
    private Long alunosEmAlerta;
    private Long totalAulas;
}
