package com.apae.gestao.dto.turma;

import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

import com.apae.gestao.dto.turmaAluno.TurmaAlunoResponseDTO;
import com.apae.gestao.entity.Turma;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Representação completa das turmas retornadas pelos endpoints.")
public class TurmaResponseDTO {

    @Schema(description = "Identificador único da turma")
    private UUID id;

    @Schema(description = "Nome completo da turma", example = "Alfabetização 2025 - Manhã")
    private String nome;

    @Schema(description = "Ano de criação", example = "2025")
    private Integer anoCriacao;

    @Schema(description = "Turno principal (MANHA, TARDE, NOITE)", example = "MANHA")
    private String turno;

    @Schema(description = "Tipo pedagógico", example = "Educação Especial")
    private String tipo;

    @Schema(description = "Indica se a turma está ativa", example = "true")
    private Boolean ativa;

    @ArraySchema(schema = @Schema(implementation = TurmaAlunoResponseDTO.class))
    private List<TurmaAlunoResponseDTO> alunos;

    @Schema(description = "Horário de aula baseado no turno", example = "Segunda a Sexta - 8h as 12h")
    private String horario;

    @Schema(description = "Dados resumidos do professor responsável")
    private com.apae.gestao.dto.professor.ProfessorResumoDTO professor;

    public TurmaResponseDTO(Turma turma) {
        this.id = turma.getId();
        this.nome = turma.getNome();
        this.anoCriacao = turma.getAnoCriacao();
        this.turno = turma.getTurno();
        this.tipo = turma.getTipo();
        this.ativa = turma.getAtiva();

        if (turma.getTurmaAlunos() != null) {
            this.alunos = turma.getTurmaAlunos().stream()
                    .map(TurmaAlunoResponseDTO::new)
                    .collect(Collectors.toList());
        }

        this.horario = getHorarioPorTurno(turma.getTurno());
    }

    private static String getHorarioPorTurno(String turno) {
        switch (turno.toUpperCase()) {
            case "MANHA":
                return "Segunda a Sexta - 8h as 12h";
            case "TARDE":
                return "Segunda a Sexta - 14h as 18h";
            default:
                return "Horário não definido";
        }
    }

    public TurmaResponseDTO(Turma turma, com.apae.gestao.dto.professor.ProfessorResumoDTO professor) {
        this(turma);
        this.professor = professor;
    }
}
