package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "professores", schema = "gestao_escolar")
public class Professor {

    @Id
    private UUID id;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private UUID usuarioId;

    private String formacao;

    @Column(name = "data_contratacao")
    private LocalDate dataContratacao;

    @Column(name = "primeiro_acesso")
    private Boolean primeiroAcesso;

    @PrePersist
    protected void onCreate() {
        if (primeiroAcesso == null) {
            primeiroAcesso = true;
        }
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Professor professor = (Professor) o;
        return id != null && Objects.equals(id, professor.id);
    }

    @Override
    public int hashCode() {
        return id != null ? Objects.hash(id) : getClass().hashCode();
    }
}
