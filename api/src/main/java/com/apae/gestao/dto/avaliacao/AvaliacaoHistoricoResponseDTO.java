package com.apae.gestao.dto.avaliacao;

import com.apae.gestao.entity.Avaliacao;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoHistoricoResponseDTO {
    private UUID id;
    private LocalDateTime dataAvaliacao; 
    private String descricao;
    private String professorNome; 
    private String turmaNomeCompleto; 
    
    public static AvaliacaoHistoricoResponseDTO fromEntity(
        Avaliacao avaliacao,
        String professorNome,
        String nomeTurmaCompleto
    ) {
        return AvaliacaoHistoricoResponseDTO.builder()
                .id(avaliacao.getId())
                .dataAvaliacao(avaliacao.getDataAvaliacao())
                .descricao(avaliacao.getDescricao()) 
                .professorNome(professorNome)
                .turmaNomeCompleto(nomeTurmaCompleto)
                .build();
    }
}
