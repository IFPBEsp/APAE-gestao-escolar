package com.apae.gestao.dto.aluno;

import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Registro do histórico de participação do aluno em turmas.")
public class AlunoTurmaHistoricoResponseDTO {

    @Schema(description = "Identificador da turma", example = "12")
    private Long turmaId;

    @Schema(description = "Tipo pedagógico da turma", example = "Educação Especial")
    private String tipo;

    @Schema(description = "Ano letivo da turma", example = "2025")
    private Integer ano;

    @Schema(description = "Turno da turma", example = "MANHA")
    private String turno;

    @Schema(description = "Indica se este é o vínculo ativo (turma atual) do aluno")
    private Boolean turmaAtual;

    public static AlunoTurmaHistoricoResponseDTO from(TurmaAluno ta) {
        Turma t = ta.getTurma();
        return new AlunoTurmaHistoricoResponseDTO(
                t.getId(),
                t.getTipo(),
                t.getAnoCriacao(),
                t.getTurno(),
                Boolean.TRUE.equals(ta.getIsAlunoAtivo())
        );
    }
}
