package com.apae.gestao.dto;

public record AlunoDetalhesDTO(
    Long id,
    String nome,
    Integer idade,
    String deficiencia,
    String nomeResponsavel,
    String telefoneResponsavel,
    String nomeTurma
) {}