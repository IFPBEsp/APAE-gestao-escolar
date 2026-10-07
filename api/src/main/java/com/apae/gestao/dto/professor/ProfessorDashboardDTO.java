package com.apae.gestao.dto.professor;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class ProfessorDashboardDTO {

    private UUID professorId;
    private String nome;
    private Long totalTurmasAtivas;
    private Long totalAlunosAtivos;
    private Double frequenciaMedia;
    private Long aulasRealizadas;
    private Long alunosComFrequenciaBaixa;
    private Long totalPresencas;
    private Long totalFaltas;
}