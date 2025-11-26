package com.apae.gestao.dto;

import com.apae.gestao.entity.Aluno;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Informações básicas apresentadas ao consultar alunos.")
public class AlunoResponseDTO {
    @Schema(description = "Identificador do aluno", example = "5")
    private Long id;
    @Schema(description = "Nome completo", example = "Lucas Andrade")
    private String nome;
    @Schema(description = "Idade do aluno", example = "12")
    private Integer idade;
    @Schema(description = "Descrição da deficiência", example = "Transtorno do Espectro Autista")
    private String deficiencia;

    public AlunoResponseDTO(Aluno aluno) {
        this.id = aluno.getId();
        this.nome = aluno.getNome();
        this.idade = aluno.getIdade();
        this.deficiencia = aluno.getDeficiencia();
    }
}
