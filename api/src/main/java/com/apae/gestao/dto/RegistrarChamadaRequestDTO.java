package com.apae.gestao.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrarChamadaRequestDTO {

    @Size(max = 500, message = "A descrição deve ter no máximo 500 caracteres")
    private String descricao;

    @NotEmpty(message = "A lista de presenças não pode estar vazia")
    @Valid
    private List<PresencaItemDTO> presencas;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PresencaItemDTO {

        @NotNull(message = "O ID do aluno é obrigatório")
        private Long alunoId;

        @NotNull(message = "O status da presença é obrigatório")
        private PresencaAlunoDTO.StatusPresenca status;
    }
}