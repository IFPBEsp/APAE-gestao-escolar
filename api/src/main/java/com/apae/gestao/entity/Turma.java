package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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

    @Column(nullable = false)
    private Boolean isAtiva = true;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "alunos_id")
    private Set<Aluno> alunos = new HashSet<>(); 

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "turma_professor",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private Set<Professor> professores = new HashSet<>();

    public void addProfessor(Professor professor) {
        if (this.professores.add(professor)) {
            professor.getTurmas().add(this); 
        }
    }

    public void removeProfessor(Professor professor) {
        if (this.professores.remove(professor)) {
            professor.getTurmas().remove(this);
        }
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