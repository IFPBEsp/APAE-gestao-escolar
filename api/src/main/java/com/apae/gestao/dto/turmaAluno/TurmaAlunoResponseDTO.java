package com.apae.gestao.dto.turmaAluno;

import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.TurmaAluno;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TurmaAlunoResponseDTO {
    private UUID pacienteId;
    private String nome;
    private Boolean ativo;

    public TurmaAlunoResponseDTO(TurmaAluno ta) {
        this.pacienteId = ta.getPacienteId();
        this.ativo = ta.getAtivo();
    }

    public TurmaAlunoResponseDTO(TurmaAluno ta, AlunoView aluno) {
        this(ta);
        this.nome = aluno != null ? aluno.getNomeCompleto() : null;
    }
}
