package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "turmas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Aula {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "turmas_id")
    private Turma turma;
}
