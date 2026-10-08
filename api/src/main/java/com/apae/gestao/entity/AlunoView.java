package com.apae.gestao.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Immutable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "alunos_view", schema = "gestao_escolar")
public class AlunoView {

    @Id
    private UUID id;

    @Column(name = "nome_completo")
    private String nomeCompleto;

    private String cpf;

    @Column(name = "data_de_nascimento")
    private LocalDate dataDeNascimento;

    private String contato;

    @Column(name = "endereco_id")
    private UUID enderecoId;

    @Column(name = "is_aluno")
    private Boolean isAluno;

    @Column(name = "is_apagado" )
    private Boolean isApagado;

}
