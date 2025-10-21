package com.apae.gestao.entity;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alunos_id")
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professores_id")
    private Professor professor;

}