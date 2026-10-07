package com.apae.gestao.dto.aula;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.UUID;

@Data
@AllArgsConstructor
public class AulaPresencaAlunoResponseDTO {
    private UUID idAula;
    private UUID idAluno;
    private String descricaoAula;
    private Boolean statusPresenca;
}
