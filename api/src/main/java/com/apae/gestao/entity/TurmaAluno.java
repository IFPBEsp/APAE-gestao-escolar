package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;


@Entity
@Table(name = "turma_aluno")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TurmaAluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @Column(name = "is_aluno_ativo", nullable = false)
    private Boolean isAlunoAtivo = true;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TurmaAluno that = (TurmaAluno) o;
        return Objects.equals(turma, that.turma) &&
                Objects.equals(aluno, that.aluno);
    }

    @Override
    public int hashCode() {
        return Objects.hash(turma, aluno);
    }
}
