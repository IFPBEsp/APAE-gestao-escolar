package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "turmas")
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}
