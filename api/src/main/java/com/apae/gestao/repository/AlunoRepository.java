package com.apae.gestao.repository;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    @Query("SELECT ta.aluno FROM TurmaAluno ta WHERE ta.turma = :turma AND ta.isAlunoAtivo = true")
    List<Aluno> findByTurmaAndAtivoTrue(@Param("turma") Turma turma);
}
