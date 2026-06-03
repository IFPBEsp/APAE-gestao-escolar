package com.apae.gestao.dto.professor;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO resumido para listagem de professores.")
public class ProfessorResumoDTO {

    @Schema(description = "Identificador único do professor")
    private UUID id;

    @Schema(description = "Identificador do usuário vinculado ao professor")
    private UUID usuarioId;

    @Schema(description = "Nome completo do professor", example = "Maria da Silva")
    private String nome;

    @Schema(description = "CPF armazenado", example = "12345678901")
    private String cpf;

    @Schema(description = "E-mail institucional", example = "maria.silva@apae.org.br")
    private String email;

    @Schema(description = "Indica se o professor está ativo no sistema", example = "true")
    private Boolean ativo;

    @Schema(description = "Telefone cadastrado", example = "(11) 98888-0000")
    private String telefone;

    @Schema(description = "Formação acadêmica", example = "Licenciatura em Educação Especial")
    private String formacao;

    @Schema(description = "Data de contratação", example = "2024-02-01")
    private LocalDate dataContratacao;

    @Schema(description = "Data de nascimento", example = "1985-10-15")
    private LocalDate dataNascimento;

    @Schema(description = "Endereço cadastrado", example = "Rua das Flores, 123")
    private String endereco;

    @Schema(description = "Indica se o professor ainda precisa concluir o primeiro acesso")
    private Boolean primeiroAcesso;
}
