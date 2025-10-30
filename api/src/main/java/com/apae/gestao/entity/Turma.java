package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "turmas")
// Substituído @Data por anotações específicas.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"alunos", "professores"}) // Evita StackOverflowError
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

    // OneToMany: Coleção deve ser inicializada.
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "alunos_id")
    private Set<Aluno> alunos = new HashSet<>(); 

    // ManyToMany: LADO DONO. Adicionado Cascade.
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "turma_professor",
            joinColumns = @JoinColumn(name = "turma_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id")
    )
    private Set<Professor> professores = new HashSet<>();


    // --- MÉTODOS HELPER (CHAVE PARA EVITAR ConcurrentModificationException) ---

    public void addProfessor(Professor professor) {
        // Usa o Set.add() para evitar duplicatas e adiciona apenas se for uma nova associação.
        if (this.professores.add(professor)) {
            // Sincroniza o lado inverso.
            professor.getTurmas().add(this); 
        }
    }

    public void removeProfessor(Professor professor) {
        // Usa o Set.remove() para remover e sincroniza apenas se foi removido.
        if (this.professores.remove(professor)) {
            // Sincroniza o lado inverso.
            professor.getTurmas().remove(this);
        }
    }
    
    // ... Helpers para Alunos (se necessário)

    // --- equals() e hashCode() CORRIGIDOS (APENAS pelo ID) ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Turma turma = (Turma) o;
        // Somente o ID é usado.
        return id != null && Objects.equals(id, turma.id);
    }

    @Override
    public int hashCode() {
        return id != null ? Objects.hash(id) : getClass().hashCode();
    }
}