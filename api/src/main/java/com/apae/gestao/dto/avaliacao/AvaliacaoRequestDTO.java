package com.apae.gestao.dto.avaliacao;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvaliacaoRequestDTO {

    @NotBlank(message = "A descrição da avaliação é obrigatória")
    @Size(max = 2000, message = "A descrição deve ter no máximo 2000 caracteres")
    private String descricao;

    @NotNull(message = "O ID do aluno é obrigatório")
    private UUID alunoId;

    @NotNull(message = "O ID do professor é obrigatório")
    private UUID professorId;
}
