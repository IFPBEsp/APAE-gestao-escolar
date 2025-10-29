package com.apae.gestao.entity;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "turmas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Integer anoCriacao;

    @Column(nullable = false)
    private String turno;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "alunos_id")
    private Set<Aluno> alunos;

    @ManyToMany
    @JoinTable(
            name = "turma_professor",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private Set<Professor> professores = new HashSet<>();

}