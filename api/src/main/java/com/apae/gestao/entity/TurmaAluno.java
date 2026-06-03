package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Objects;
import java.util.UUID;



@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "turma_aluno", schema = "gestao_escolar")
public class TurmaAluno {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "turma_id", nullable = false)
    private Turma turma;

    @Column(name = "paciente_id", nullable = false)
    private UUID pacienteId;

    private Boolean ativo = true;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TurmaAluno that = (TurmaAluno) o;
        return Objects.equals(turma, that.turma) &&
                Objects.equals(pacienteId, that.pacienteId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(turma, pacienteId);
    }
}
