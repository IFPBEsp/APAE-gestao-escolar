package com.apae.gestao.dto;

import com.apae.gestao.entity.Avaliacao;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoHistoricoResponseDTO {
    private Long id;
    private LocalDateTime data;
    private String descricao;
    private String nomeProfessor;
    
    
    public static AvaliacaoHistoricoResponseDTO fromEntity(Avaliacao avaliacao) {
        return AvaliacaoHistoricoResponseDTO.builder()
                .id(avaliacao.getId())
                .data(avaliacao.getDataAvaliacao())
                .descricao(avaliacao.getDescricao()) 
                .nomeProfessor(avaliacao.getProfessor().getNome())
                .build();
    }
}