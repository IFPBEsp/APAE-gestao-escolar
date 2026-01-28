package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "turmas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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

    @Column(length = 50)
    private String tipo;

    @Column(nullable = false)
    private Boolean isAtiva = true;

    @OneToMany(mappedBy = "turma", cascade = CascadeType.ALL)
    private Set<TurmaAluno> turmaAlunos = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "professor_id", nullable = false)
    @JsonIgnoreProperties({"turmas", "relatorios", "avaliacoes"})
    private Professor professor;

    @OneToMany(mappedBy = "turma", cascade = CascadeType.ALL)
    private Set<Aula> aulas = new HashSet<>();

    public void addAluno(Aluno aluno, Boolean isAlunoAtivo) {
        TurmaAluno turmaAluno = new TurmaAluno();
        turmaAluno.setTurma(this);
        turmaAluno.setAluno(aluno);
        turmaAluno.setIsAlunoAtivo(isAlunoAtivo != null ? isAlunoAtivo : true);
        turmaAlunos.add(turmaAluno);
        aluno.getTurmaAlunos().add(turmaAluno);
    }

    public void removeAluno(Aluno aluno) {
        turmaAlunos.removeIf(ta -> ta.getAluno().equals(aluno));
        aluno.getTurmaAlunos().removeIf(ta -> ta.getTurma().equals(this));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Turma turma = (Turma) o;
        return id != null && Objects.equals(id, turma.id);
    }

    @Override
    public int hashCode() {
        return id != null ? Objects.hash(id) : getClass().hashCode();
    }
}