package com.apae.gestao.repository;

import java.util.List;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    List<Aluno> findByTurmaAndAtivoTrue(@Param("turma") Turma turma);
    List<Aluno> findByNomeContainingIgnoreCase(String nome);
}
