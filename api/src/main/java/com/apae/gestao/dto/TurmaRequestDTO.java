package com.apae.gestao.dto;

import java.util.Set;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurmaRequestDTO {

    @NotBlank(message = "Nome é obrigatorio")
    private String nome;

    @NotNull
    private Integer anoCriacao;

    @NotBlank
    private String turno;

    @NotNull
    private Long professorId;

    private Boolean isAtiva;

    @NotBlank(message = "Tipo é obrigatório")
    private String tipo;

    private Set<Long> alunosIds;
}
