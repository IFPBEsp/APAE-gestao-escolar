package com.apae.gestao.dto.professor;

import java.time.LocalDate;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados necessários para cadastrar ou atualizar um professor.")
public class ProfessorRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    @Schema(description = "Nome completo do professor", example = "Maria da Silva", maxLength = 100)
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    @Size(min = 11, max = 14 , message = "CPF deve ter entre 11 e 14 caracteres")
    @Schema(description = "CPF do professor com ou sem máscara", example = "12345678901")
    private String cpf;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
    @Schema(description = "E-mail institucional para contato", example = "maria.silva@apae.org.br")
    private String email;

    @Size(max = 15, message = "Telefone deve ter no máximo 15 caracteres")
    @Schema(description = "Telefone de contato no formato (11) 99999-8888", example = "(11) 99888-7766")
    private String telefone;

    private LocalDate dataNascimento;

    @Size(max = 100, message = "Formação deve ter no máximo 100 caracteres")
    @Schema(description = "Formação acadêmica do professor", example = "Licenciatura em Educação Especial")
    private String formacao;

    @NotNull(message = "Data de contratação é obrigatória")
    private LocalDate dataContratacao;

    @Valid
    @Schema(description = "Endereço vinculado ao usuário do professor")
    private EnderecoDTO endereco;

    @Schema(description = "Status do usuário do professor", example = "true")
    private Boolean ativo;
}
