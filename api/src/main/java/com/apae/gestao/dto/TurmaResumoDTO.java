package com.apae.gestao.dto;

import com.apae.gestao.dto.aluno.AlunoResumoDTO;
import com.apae.gestao.dto.aluno.AlunoSimplificadoTurmaDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO resumido para listagem de turmas.")
public class TurmaResumoDTO {

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

    @Schema(description = "Nome do professor responsável", example = "Maria da Silva")
    private String professorNome;

    @Schema(description = "Total de alunos matriculados", example = "25")
    private Long totalAlunos;

    @Schema(description = "Total de alunos ativos", example = "23")
    private Long totalAlunosAtivos;

    @Schema(description = "Horário de aula baseado no turno", example = "Segunda a Sexta - 8h as 12h")
    private String horario;

}