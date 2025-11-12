package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "presencas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter@Setter

public class Presenca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Integer faltas;

    @ManyToOne
    @JoinColumn(name = "alunos_id")
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "aulas_id")
    private Aula aula;

    @PrePersist
    private void init() {
        if (this.faltas == null) this.faltas = 0;
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
}
