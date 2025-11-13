package com.apae.gestao.entity;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import jakarta.persistence.*;
import lombok.*;

//Placeholder. Trocar para a entidade Paciente do outro repo depois...
@Entity
@Table(name = "alunos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@EqualsAndHashCode

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

    @Column(name = "link_foto", length = 500)
    private String linkFoto;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL)
    private Set<Avaliacao> avaliacoes = new HashSet<>();

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
