package com.apae.gestao.entity;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "avaliacoes", schema = "gestao_escolar")
public class Avaliacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String descricao; 
    
    @Column(name = "data_avaliacao")
    private LocalDateTime dataAvaliacao;

    @Column(name = "paciente_id")
    private UUID pacienteId;
    
    @ManyToOne
    @JoinColumn(name = "professor_id" )
    private Professor professor;
    
    @PrePersist
    protected void onCreate() {
        if (dataAvaliacao == null) {
            dataAvaliacao = LocalDateTime.now();
        }
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Avaliacao avaliacao = (Avaliacao) o;
        return id != null && Objects.equals(id, avaliacao.id);
    }
    
    @Override
    public int hashCode() {
        return id != null ? Objects.hash(id) : getClass().hashCode();
    }
}
