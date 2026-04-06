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
@Schema(description = "Turma em que o aluno possui ou possuiu vínculo (histórico acadêmico).")
public class AlunoTurmaHistoricoItemDTO {

    @Schema(description = "Identificador da turma", example = "7")
    private Long id;

    @Schema(description = "Nome da turma", example = "Alfabetização 2025 - Manhã")
    private String nome;

    @Schema(description = "Ano de criação da turma", example = "2025")
    private Integer anoCriacao;

    @Schema(description = "Turno (MANHA, TARDE, NOITE)", example = "MANHA")
    private String turno;

    @Schema(description = "Tipo pedagógico", example = "Educação Especial")
    private String tipo;

    @Schema(description = "Indica se a turma está ativa no sistema", example = "true")
    private Boolean isAtiva;

    @Schema(description = "Nome do professor responsável", example = "Maria da Silva")
    private String professorNome;

    @Schema(description = "ID do professor responsável", example = "12")
    private Long professorId;

    @Schema(description = "Indica se este é o vínculo ativo (turma atual) do aluno", example = "false")
    private Boolean isAlunoAtivo;

    @Schema(description = "Horário de aula conforme o turno", example = "Segunda a Sexta - 8h as 12h")
    private String horario;

    public AlunoTurmaHistoricoItemDTO(TurmaAluno turmaAluno) {
        Turma turma = turmaAluno.getTurma();
        this.id = turma.getId();
        this.nome = turma.getNome();
        this.anoCriacao = turma.getAnoCriacao();
        this.turno = turma.getTurno();
        this.tipo = turma.getTipo();
        this.isAtiva = turma.getIsAtiva();
        if (turma.getProfessor() != null) {
            this.professorNome = turma.getProfessor().getNome();
            this.professorId = turma.getProfessor().getId();
        }
        this.isAlunoAtivo = turmaAluno.getIsAlunoAtivo();
        this.horario = horarioPorTurno(turma.getTurno());
    }

    private static String horarioPorTurno(String turno) {
        if (turno == null) {
            return "Horário não definido";
        }
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
