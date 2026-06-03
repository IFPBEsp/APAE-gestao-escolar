package com.apae.gestao.dto.aluno;

import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Turma;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.Period;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Informações básicas apresentadas ao consultar alunos.")
public class AlunoResponseDTO {
    @Schema(description = "Identificador do aluno", example = "5")
    private UUID id;

    @Schema(description = "Nome completo", example = "Lucas Andrade")
    private String nome;

    @Schema(description = "Data de nascimento do aluno", example = "2015-08-15")
    private LocalDate dataNascimento;

    @Schema(description = "Idade atual do aluno", example = "10") 
    private Integer idade;

    @Schema(description = "Descrição da deficiência", example = "Transtorno do Espectro Autista")
    private String deficiencia;

    @Schema(description = "Telefone do responsável (com DDD)", example = "(11) 98765-4321")
    private String telefoneResponsavel;

    @Schema(description = "Nome completo do responsável", example = "Maria Silva Andrade")
    private String nomeResponsavel;

    @Schema(description = "Nome da turma atual (e.g., 'Alfabetização 2025')", example = "Alfabetização 2025")
    private String nomeTurmaAtual;

    @Schema(description = "Turno da turma atual (e.g., 'Manhã')", example = "Manhã")
    private String turnoTurmaAtual;

    public AlunoResponseDTO(AlunoView aluno, Turma turmaAtual) {
        this.id = aluno.getId();
        this.nome = aluno.getNomeCompleto();
        this.dataNascimento = aluno.getDataDeNascimento();
        this.idade = aluno.getDataDeNascimento() != null
                ? Period.between(aluno.getDataDeNascimento(), LocalDate.now()).getYears()
                : null;
        this.telefoneResponsavel = aluno.getContato();

        if (turmaAtual != null) {
            this.nomeTurmaAtual = turmaAtual.getNome();
            this.turnoTurmaAtual = turmaAtual.getTurno();
        }
    }
}
