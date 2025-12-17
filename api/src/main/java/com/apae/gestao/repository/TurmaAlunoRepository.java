package com.apae.gestao.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;

@Repository
public interface TurmaAlunoRepository extends JpaRepository<TurmaAluno, Long>{
    boolean existsByTurmaAndAluno(Turma turma, Aluno aluno);

    List<TurmaAluno> findByTurma(Turma turma);

    List<TurmaAluno> findByTurmaAndIsAlunoAtivo(Turma turma, Boolean isAlunoAtivo);

    List<TurmaAluno> findByAlunoAndIsAlunoAtivo(Aluno aluno, Boolean isAlunoAtivo);

    Optional<TurmaAluno> findByTurmaAndAluno(Turma turma, Aluno aluno);

    Optional<TurmaAluno> findByAlunoAndIsAlunoAtivoTrue(Aluno aluno);
} 
