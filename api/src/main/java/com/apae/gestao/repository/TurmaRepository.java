package com.apae.gestao.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apae.gestao.entity.Turma;

import java.util.List;


@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long>{
    List<Turma> findByNomeContainingIgnoreCase(String nome);
}
