package com.apae.gestao.dto;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Turma;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.Optional; 

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Informações básicas apresentadas ao consultar alunos.")
public class AlunoResponseDTO {
    @Schema(description = "Identificador do aluno", example = "5")
    private Long id;

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

    public AlunoResponseDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.nome = aluno.getNome();
        this.dataNascimento = aluno.getDataNascimento();
        this.idade = aluno.getIdade();
        this.deficiencia = aluno.getDeficiencia();
        this.telefoneResponsavel = aluno.getTelefoneResponsavel();
        this.nomeResponsavel = aluno.getNomeResponsavel();
        
        Optional<Turma> turmaAtual = aluno.getTurmaAtual(); 

        if (turmaAtual.isPresent()) {
            Turma turma = turmaAtual.get();
            this.nomeTurmaAtual = turma.getNome();
            this.turnoTurmaAtual = turma.getTurno();
        }
    }
}
