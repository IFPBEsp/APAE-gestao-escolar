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
    @Schema(description = "Horário de aula baseado no turno", example = "Segunda a Sexta - 8h as 12h")
    private String horario;
    @Schema(description = "Quantidade de alunos ativos na turma", example = "15")
    private Integer quantidadeAlunos;

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
            List<Long> idsAtivos = turma.getTurmaAlunos().stream()
                    .filter(TurmaAluno::getIsAlunoAtivo)
                    .map(ta -> ta.getAluno().getId())
                    .collect(Collectors.toList());
            this.alunosIds = idsAtivos;
            this.quantidadeAlunos = idsAtivos.size();
        }else{
            this.quantidadeAlunos = 0;
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