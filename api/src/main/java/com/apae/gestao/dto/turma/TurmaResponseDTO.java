package com.apae.gestao.dto.turma;

import java.util.List;
import java.util.stream.Collectors;

import com.apae.gestao.dto.ProfessorResponseDTO;
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
@Schema(description = "Representação das turmas retornadas pelos endpoints.")
public class TurmaResponseDTO {
    @Schema(description = "Identificador único da turma", example = "7")
    private Long id;
    @Schema(description = "Nome completo da turma", example = "Alfabetização 2025 - Manhã")
    private String nome;
    @Schema(description = "Ano de criação", example = "2025")
    private Integer anoCriacao;
    @Schema(description = "Turno principal (MANHA, TARDE, NOITE)", example = "MANHA")
    private String turno;
    @Schema(description = "Tipo pedagógico", example = "Educação Especial")
    private String tipo;
    @Schema(description = "Indica se a turma está ativa", example = "true")
    private Boolean isAtiva;
    @Schema(description = "Professor responsável", implementation = ProfessorResponseDTO.class)
    private ProfessorResponseDTO professor;
    @ArraySchema(schema = @Schema(implementation = TurmaAlunoResponseDTO.class))
    private List<TurmaAlunoResponseDTO> alunos;

    @Schema(description = "Horário de aula baseado no turno", example = "Segunda a Sexta - 8h as 12h")
    private String horario;

    public TurmaResponseDTO(Turma turma){
        this.id = turma.getId();
        this.nome = turma.getNome();
        this.anoCriacao = turma.getAnoCriacao();
        this.turno = turma.getTurno();
        this.tipo = turma.getTipo();
        this.isAtiva = turma.getIsAtiva();

        if(turma.getProfessor() != null) {
            this.professor = new ProfessorResponseDTO(turma.getProfessor());
        }

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
}