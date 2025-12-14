package com.apae.gestao.dto;

import com.apae.gestao.entity.Aluno;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate; 

import java.time.LocalDate;

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
    
    @Schema(description = "Descrição da deficiência", example = "Transtorno do Espectro Autista")
    private String deficiencia;

    @Schema(description = "Telefone do responsável (com DDD)", example = "(11) 98765-4321")
    private String telefoneResponsavel;

    @Schema(description = "Nome completo do responsável", example = "Maria Silva Andrade")
    private String nomeResponsavel;

    public AlunoResponseDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.nome = aluno.getNome();        
        this.dataNascimento = aluno.getDataNascimento();
        this.deficiencia = aluno.getDeficiencia();
        this.telefoneResponsavel = aluno.getTelefoneResponsavel();
        this.nomeResponsavel = aluno.getNomeResponsavel();
    }
}