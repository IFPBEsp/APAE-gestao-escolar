package com.apae.gestao.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresencaAlunoDTO {

    private Long alunoId;
    private String alunoNome;
    private StatusPresenca status;
    private Long presencaId;

    public enum StatusPresenca {
        PRESENTE,
        FALTA
    }

    public static StatusPresenca getStatusFromFaltou(Boolean faltou) {
        if (faltou == null || !faltou) {
            return StatusPresenca.PRESENTE;
        }
        return StatusPresenca.FALTA;
    }
}