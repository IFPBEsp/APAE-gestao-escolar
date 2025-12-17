package com.apae.gestao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados para criação ou atualização de um relatório.")
public class RelatorioRequestDTO {
    @Schema(description = "Atividades realizadas pelo aluno", example = "Participou de atividades lúdicas e educacionais.")
    private String atividades;

    @Schema(description = "Habilidades desenvolvidas", example = "Melhoria na comunicação verbal.")
    private String habilidades;

    @Schema(description = "Estratégias utilizadas", example = "Uso de reforço positivo.")
    private String estrategias;

    @Schema(description = "Recursos utilizados", example = "Materiais didáticos adaptados.")
    private String recursos;

    @Schema(description = "ID do aluno", example = "1")
    private Long alunoId;

    @Schema(description = "ID da turma à qual o relatório está associado", example = "3")
    private Long turmaId; 

    @Schema(description = "ID do professor", example = "2")
    private Long professorId;
}