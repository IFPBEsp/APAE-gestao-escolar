package com.apae.gestao.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AulaRequestDTO {

    @NotNull(message = "A turma é obrigatória")
    private Long turmaId;

    @NotNull(message = "A data da aula é obrigatória")
    private LocalDate data;

    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
    private String descricao;
}