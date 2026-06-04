package com.apae.gestao.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuarios", schema = "apae_geral")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String email;

    @Column(name = "nome_completo")
    private String nomeCompleto;

    private String senha;

    private String cpf;

    private String cargo;

    @Column(name = "contato")
    private String telefone;

    @Column(name = "endereco_id")
    private UUID enderecoId;

    @Transient
    private Boolean ativo = true;

    @PrePersist
    private void init() {
        if (ativo == null) {
            ativo = true;
        }
    }

}
