package com.apae.gestao.dto;

import java.time.LocalDate;

public record AlunoResumoDTO(
    Long id,
    String nome,
    Integer idade,
    String nomeTurma,
    Double percentualPresenca,
    LocalDate dataUltimaAvaliacao,
    String linkFoto
) {}