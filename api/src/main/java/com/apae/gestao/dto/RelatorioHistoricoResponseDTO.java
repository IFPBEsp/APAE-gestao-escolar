package com.apae.gestao.dto;

import com.apae.gestao.entity.Relatorio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioHistoricoResponseDTO {

    private Long id;
    private LocalDateTime dataRelatorio;

    private String atividades;
    private String habilidades;
    private String estrategias;
    private String recursos;

    private String professorNome;
    private String turmaNomeCompleto;

    public static RelatorioHistoricoResponseDTO fromEntity(
            Relatorio relatorio,
            String nomeTurmaCompleto
    ) {
        return RelatorioHistoricoResponseDTO.builder()
                .id(relatorio.getId())
                .dataRelatorio(relatorio.getCreatedAt())
                .atividades(relatorio.getAtividades())
                .habilidades(relatorio.getHabilidades())
                .estrategias(relatorio.getEstrategias())
                .recursos(relatorio.getRecursos())
                .professorNome(relatorio.getProfessor().getNome())
                .turmaNomeCompleto(nomeTurmaCompleto)
                .build();
    }
}