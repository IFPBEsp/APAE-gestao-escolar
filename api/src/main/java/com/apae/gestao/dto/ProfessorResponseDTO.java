package com.apae.gestao.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Dados retornados após operações com professores.")
public class ProfessorResponseDTO {

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
    @Schema(description = "Data de nascimento", example = "1990-05-12")
    private LocalDate dataNascimento;
    @Schema(description = "Especialidade/área de atuação", example = "Educação Especial")
    private String especialidade;
    @Schema(description = "Data de contratação", example = "2024-02-01")
    private LocalDate dataContratacao;
    @Schema(description = "Endereço completo", example = "Av. Brasil, 1000 - Centro, Recife/PE")
    private String endereco;
    @Schema(description = "Indica se o professor está ativo no sistema", example = "true")
    private Boolean ativo;
    @Schema(description = "Data de criação do registro", example = "2024-01-10T15:30:00")
    private LocalDateTime createdAt;
    @Schema(description = "Data da última atualização do registro", example = "2024-03-01T12:00:00")
    private LocalDateTime updatedAt;
    @Schema(description = "Turmas vinculadas ao professor", accessMode = Schema.AccessMode.READ_ONLY)
    private Set<Turma> turmas;

    public ProfessorResponseDTO(Professor professor) {
        this.id = professor.getId();
        this.nome = professor.getNome();
        this.cpf = professor.getCpf();
        this.email = professor.getEmail();
        this.telefone = professor.getTelefone();
        this.dataNascimento = professor.getDataNascimento();
        this.especialidade = professor.getEspecialidade();
        this.dataContratacao = professor.getDataContratacao();
        this.endereco = professor.getEndereco();
        this.ativo = professor.getAtivo();
        this.createdAt = professor.getCreatedAt();
        this.updatedAt = professor.getUpdatedAt();
        this.turmas = professor.getTurmas();
    }
}

