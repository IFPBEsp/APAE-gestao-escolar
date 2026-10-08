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
public class AvaliacaoResponseDTO {

    private UUID id;
    private String descricao;
    private UUID alunoId;
    private String alunoNome;
    private UUID professorId;
    private String professorNome;
    private LocalDateTime dataAvaliacao;
    private String turmaNomeCompleto;


    public static AvaliacaoResponseDTO fromEntity(
            Avaliacao avaliacao,
            String alunoNome,
            String professorNome,
            String turmaCompleto
    ) {
        return AvaliacaoResponseDTO.builder()
                .id(avaliacao.getId())
                .descricao(avaliacao.getDescricao())
                .alunoId(avaliacao.getPacienteId())
                .alunoNome(alunoNome)
                .professorId(avaliacao.getProfessor().getId())
                .professorNome(professorNome)
                .dataAvaliacao(avaliacao.getDataAvaliacao())
                .turmaNomeCompleto(turmaCompleto)
                .build();
    }
}
