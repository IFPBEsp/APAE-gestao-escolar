package com.apae.gestao.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO resumido para listagem de professores.")
public class ProfessorResumoDTO {

    @Schema(description = "Identificador único do professor", example = "42")
    private Long id;

    @Schema(description = "Nome completo do professor", example = "Maria da Silva")
    private String nome;

    @Schema(description = "CPF armazenado", example = "12345678901")
    private String cpf;

    @Schema(description = "E-mail institucional", example = "maria.silva@apae.org.br")
    private String email;

    @Schema(description = "Telefone cadastrado", example = "(11) 98888-0000")
    private String telefone;

    @Schema(description = "Formação acadêmica", example = "Licenciatura em Educação Especial")
    private String formacao;

    @Schema(description = "Data de contratação", example = "2024-02-01")
    private LocalDate dataContratacao;

    @Schema(description = "Indica se o professor está ativo no sistema", example = "true")
    private Boolean ativo;

    @Schema(description = "Lista com nomes das turmas vinculadas ao professor")
    private List<String> turmas;
}
