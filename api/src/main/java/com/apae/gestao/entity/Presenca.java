package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "presencas", uniqueConstraints = @UniqueConstraint(columnNames = {"alunos_id", "aulas_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter@Setter
@Builder
public class Presenca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Boolean faltou;

    @ManyToOne
    @JoinColumn(name = "alunos_id")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "aulas_id")
    private Aula aula;

    @PrePersist
    private void init() {
        if (this.faltou == null) this.faltou = false;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Presenca presenca = (Presenca) o;
        return id != null && Objects.equals(id, presenca.id);
    }

    @Override
    public int hashCode() {
        return id != null ? Objects.hash(id) : getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Presenca{" +
                "id=" + id +
                ", faltou=" + faltou +
                ", alunoId=" + (aluno != null ? aluno.getId() : null) +
                ", aulaId=" + (aula != null ? aula.getId() : null) +
                '}';
    }
}
