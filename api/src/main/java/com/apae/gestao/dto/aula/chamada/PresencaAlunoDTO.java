package com.apae.gestao.dto.aula.chamada;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresencaAlunoDTO {

    private UUID alunoId;
    private String alunoNome;
    private StatusPresenca status;
    private UUID presencaId;

    public enum StatusPresenca {
        PRESENTE,
        FALTA
    }
}
