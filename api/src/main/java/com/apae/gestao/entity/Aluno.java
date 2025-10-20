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

    @ManyToMany(mappedBy = "alunos")
    private Set<Avaliacao> avaliacoes = new HashSet<>();
}
