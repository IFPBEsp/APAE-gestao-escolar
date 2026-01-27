package com.apae.gestao.dto.aula;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AulaPresencaAlunoResponseDTO {
    private Long idAula;
    private Long idAluno;
    private String descricaoAula;
    private Boolean statusPresenca;
}
