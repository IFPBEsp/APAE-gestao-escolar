package com.apae.gestao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados de resposta de um relatório.")
public class RelatorioResponseDTO {
    @Schema(description = "Identificador do relatório", example = "1")
    private Long id;

    @Schema(description = "ID do aluno vinculado", example = "1")
    private Long alunoId;

    @Schema(description = "Atividades realizadas pelo aluno", example = "Participou de atividades lúdicas e educacionais.")
    private String atividades;

    @Schema(description = "Habilidades desenvolvidas", example = "Melhoria na comunicação verbal.")
    private String habilidades;

    @Schema(description = "Estratégias utilizadas", example = "Uso de reforço positivo.")
    private String estrategias;

    @Schema(description = "Recursos utilizados", example = "Materiais didáticos adaptados.")
    private String recursos;

    @Schema(description = "Nome do aluno", example = "João Pedro")
    private String alunoNome;

    @Schema(description = "Data de nascimento do aluno", example = "2012-01-10")
    private LocalDate alunoDataNascimento;

    @Schema(description = "Nome da turma ativa do aluno", example = "Turma A")
    private String turmaNome;

    @Schema(description = "Nome do professor", example = "Maria Silva")
    private String professorNome;

    @Schema(description = "Data de criação do relatório", example = "2023-10-01T10:00:00")
    private LocalDateTime createdAt;
}