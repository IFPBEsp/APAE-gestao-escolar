package com.apae.gestao.dto.professor;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "DTO otimizado para a tela de listagem de professores.")
public class ProfessorListagemDTO {

    @Schema(description = "Identificador único do professor")
    private UUID id;

    @Schema(description = "Campo para saber se o professor está ativo", example = "false")
    private Boolean ativo;

    @Schema(description = "Nome completo do professor", example = "Luan lorêto")
    private String nome;

    @Schema(description = "E-mail do professor", example = "luan.loreto@gmail.com")
    private String email;

    @Schema(description = "Turmas vinculadas como responsável (separadas por vírgula)")
    private String turmas;

}
