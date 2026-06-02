package com.apae.gestao.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
    private UUID id;

    private String email;

    @Column(name = "nome_completo")
    private String nomeCompleto;

    private String senha;

    private String cpf;

    private String cargo;


}
