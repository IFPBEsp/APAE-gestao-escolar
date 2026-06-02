package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "turmas", schema = "gestao_escolar")
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String nome;

    @Column(name = "ano_criacao")
    private Integer anoCriacao;

    private String turno;

    private String tipo;

    private Boolean ativa = true;

    @OneToMany(mappedBy = "turma", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TurmaAluno> turmaAlunos = new HashSet<>();


    @OneToMany(mappedBy = "turma", cascade = CascadeType.ALL)
    private Set<Aula> aulas = new HashSet<>();

    public void addAluno(UUID pacienteId, Boolean ativo) {
        TurmaAluno turmaAluno = new TurmaAluno();
        turmaAluno.setTurma(this);
        turmaAluno.setPacienteId(pacienteId);
        turmaAluno.setAtivo(ativo != null ? ativo : true);
        turmaAlunos.add(turmaAluno);
    }

    public void removeAluno(UUID pacienteId) {
        turmaAlunos.removeIf(ta -> ta.getPacienteId().equals(pacienteId));
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
