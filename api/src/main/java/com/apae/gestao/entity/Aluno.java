package com.apae.gestao.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;

import lombok.*;


//Placeholder. Trocar para a entidade Paciente do outro repo depois...
@Entity
@Table(name = "alunos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Deprecated
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Integer idade;

    @Column(nullable = false)
    private String deficiencia;

    @ManyToMany(mappedBy = "alunos")
    private Set<Avaliacao> avaliacoes = new HashSet<>();

}
