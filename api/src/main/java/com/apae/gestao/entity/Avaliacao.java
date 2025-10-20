package com.apae.gestao.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "avaliacoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Avaliacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pontosPositivos;

    @Column(nullable = false)
    private String pontosNegativos;

    @ManyToMany
    @JoinTable(
            name = "avaliacao_aluno",
            joinColumns = @JoinColumn(name = "avaliacao_id"),
            inverseJoinColumns = @JoinColumn(name = "aluno_id")
    )
    private Set<Aluno> alunos = new HashSet<>();
}
