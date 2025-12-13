package com.apae.gestao.entity;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

//Trocar para a entidade Paciente do outro repo depois...
@Entity
@Table(name = "alunos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Aluno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false)
    private String deficiencia;

    @Column(nullable = false)
    private String telefoneResponsavel;

    @Column(nullable = false)
    private String nomeResponsavel;

    @Column(name = "link_foto", length = 500)
    private String linkFoto;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL)
    private Set<Avaliacao> avaliacoes = new HashSet<>();

    public Aluno(
        Long id, 
        String nome, 
        String deficiencia, 
        LocalDate dataNascimento, 
        String telefoneResponsavel,
        String nomeResponsavel 
    ) {
        this.id = id;
        this.nome = nome;
        this.deficiencia = deficiencia;
        this.dataNascimento = dataNascimento;
        this.nomeResponsavel = nomeResponsavel;
        this.telefoneResponsavel = telefoneResponsavel;
    }
    
    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL)
    private Set<Presenca> presencas = new HashSet<>();

    @OneToMany(mappedBy = "aluno")
    private Set<TurmaAluno> turmaAlunos = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Aluno aluno = (Aluno) o;
        return id != null && Objects.equals(id, aluno.id);
    }

    @Override
    public int hashCode() {
        return id != null ? Objects.hash(id) : getClass().hashCode();
    }
}
