package com.apae.gestao.dto.avaliacao;

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
public class AvaliacaoResponseDTO {

    private Long id;
    private String descricao;
    private Long alunoId;
    private String alunoNome;
    private Long professorId;
    private String professorNome;
    private LocalDateTime dataAvaliacao;
    private String turmaNomeCompleto;


    public static AvaliacaoResponseDTO fromEntity(Avaliacao avaliacao, String turmaCompleto) {
        return AvaliacaoResponseDTO.builder()
                .id(avaliacao.getId())
                .descricao(avaliacao.getDescricao())
                .alunoId(avaliacao.getAluno().getId())
                .alunoNome(avaliacao.getAluno().getNome())
                .professorId(avaliacao.getProfessor().getId())
                .professorNome(avaliacao.getProfessor().getNome())
                .dataAvaliacao(avaliacao.getDataAvaliacao())
                .turmaNomeCompleto(turmaCompleto)
                .build();
    }
}