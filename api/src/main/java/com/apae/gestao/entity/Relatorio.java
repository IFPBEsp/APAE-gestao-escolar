package com.apae.gestao.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Table(name = "relatorios", schema = "gestao_escolar")
public class Relatorio {

    @Id
    private UUID id;

    @Column(columnDefinition = "TEXT")
    private String atividades;

    @Column(columnDefinition = "TEXT")
    private String habilidades;

    @Column(columnDefinition = "TEXT")
    private String estrategias;

    @Column(columnDefinition = "TEXT")
    private String recursos;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "paciente_id")
    private UUID pacienteId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "professor_id" )
    private Professor professor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "turma_id" )
    private Turma turma;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}