package com.apae.gestao.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;

@Repository
public interface TurmaAlunoRepository extends JpaRepository<TurmaAluno, Long>{

    List<TurmaAluno> findByTurmaAndIsAlunoAtivo(Turma turma, Boolean isAlunoAtivo);

    List<TurmaAluno> findByTurmaAndIsAlunoAtivoOrderByAlunoNomeAsc(Turma turma, Boolean isAlunoAtivo);

    Optional<TurmaAluno> findByTurmaAndAluno(Turma turma, Aluno aluno);

    List<TurmaAluno> findAllByAlunoAndIsAlunoAtivoTrue(Aluno aluno);

    @Query("""
            SELECT DISTINCT ta FROM TurmaAluno ta
            JOIN FETCH ta.turma t
            LEFT JOIN FETCH t.professor
            WHERE ta.aluno = :aluno
            ORDER BY t.anoCriacao DESC, t.nome ASC
            """)
    List<TurmaAluno> findAllHistoricoByAluno(@Param("aluno") Aluno aluno);

    List<TurmaAluno> findByTurmaId(Long turmaId);

    List<TurmaAluno> findByTurmaIdOrderByAlunoNomeAsc(Long turmaId);

    @Query("""
            SELECT ta FROM TurmaAluno ta
            JOIN FETCH ta.turma t
            WHERE ta.aluno = :aluno
            ORDER BY ta.isAlunoAtivo DESC, t.anoCriacao DESC, t.nome ASC
            """)
    List<TurmaAluno> findHistoricoCompletoPorAluno(@Param("aluno") Aluno aluno);
}