package com.apae.gestao.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

import com.apae.gestao.entity.Turma;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfessorRequestDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;

    private String cpf;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ser válido")
    @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
    private String email;

    @Size(max = 15, message = "Telefone deve ter no máximo 15 caracteres")
    private String telefone;

    private LocalDate dataNascimento;

    @Size(max = 100, message = "Especialidade deve ter no máximo 100 caracteres")
    private String especialidade;

    private LocalDate dataContratacao;

    private Set<Turma> turmas;
}

