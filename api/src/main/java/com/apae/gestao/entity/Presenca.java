package com.apae.gestao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter@Setter
@Builder
@Table(name = "presencas", schema = "gestao_escolar", uniqueConstraints = @UniqueConstraint(columnNames = {"paciente_id", "aula_id"}))
public class Presenca {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column
    private Boolean faltou;

    @Column(name = "paciente_id")
    private UUID pacienteId;

    @ManyToOne
    @JoinColumn(name = "aula_id")
    private Aula aula;

    @PrePersist
    private void init() {
        if (this.faltou == null) this.faltou = false;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Presenca presenca = (Presenca) o;
        return id != null && Objects.equals(id, presenca.id);
    }

    @Override
    public int hashCode() {
        return id != null ? Objects.hash(id) : getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Presenca{" +
                "id=" + id +
                ", faltou=" + faltou +
                ", pacienteId=" + (pacienteId!= null ? pacienteId : null) +
                ", aulaId=" + (aula != null ? aula.getId() : null) +
                '}';
    }
}
