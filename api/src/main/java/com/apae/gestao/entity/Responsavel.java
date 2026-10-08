package com.apae.gestao.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.util.UUID;

@Entity
@Immutable
@Getter
@NoArgsConstructor
@Table(name = "responsaveis", schema = "apae_geral")
public class Responsavel {

    @Id
    private UUID id;

    private String nome;

    @Column(name = "paciente_id")
    private UUID pacienteId;
}
