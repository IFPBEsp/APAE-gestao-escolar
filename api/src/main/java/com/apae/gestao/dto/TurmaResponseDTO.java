package com.apae.gestao.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;

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
    @ArraySchema(schema = @Schema(implementation = Long.class, description = "ID do aluno vinculado"))
    private List<Long> alunosIds;

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

        if(turma.getTurmaAlunos() != null) {
            this.alunosIds = turma.getTurmaAlunos().stream()
                    .filter(TurmaAluno::getIsAlunoAtivo)
                    .map(ta -> ta.getAluno().getId())
                    .collect(Collectors.toList());
        }
    }
}