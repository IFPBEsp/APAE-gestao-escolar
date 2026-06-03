package com.apae.gestao.dto.turmaAluno;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TurmaAlunoRequestDTO {

    @NotNull
    private UUID turmaId;

    @NotNull
    private UUID pacienteId;

}
