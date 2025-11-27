package com.apae.gestao.dto;

import com.apae.gestao.entity.Presenca;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChamadaResponseDTO {

    private Long turmaId;
    private String turmaNome;
    private LocalDate dataChamada;
    private String descricao;
    private Integer totalAlunosNaTurma;
    private Integer totalPresentes;
    private List<PresencaAlunoDTO> listaPresencas;

    public void calcularTotalPresentes() {
        if (listaPresencas != null) {
            this.totalPresentes = (int) listaPresencas.stream()
                    .filter(p -> p.getStatus() == PresencaAlunoDTO.StatusPresenca.PRESENTE)
                    .count();
        } else {
            this.totalPresentes = 0;
        }
    }
}