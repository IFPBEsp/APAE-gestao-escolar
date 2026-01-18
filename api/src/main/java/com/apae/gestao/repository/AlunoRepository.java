package com.apae.gestao.repository;

import java.util.List;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.TurmaAluno;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    List<Aluno> findByNomeContainingIgnoreCase(String nome);

    @Query("""
        SELECT DISTINCT a
        FROM Aluno a
        LEFT JOIN FETCH a.turmaAlunos ta
        LEFT JOIN FETCH ta.turma t
        WHERE ta.isAlunoAtivo = true
        OR ta.id IS NULL
    """)
    Page<Aluno> findAlunosComTurmaAtual(Pageable pageable);

    @Query("""
        SELECT DISTINCT a
        FROM Aluno a
        LEFT JOIN FETCH a.turmaAlunos ta
        LEFT JOIN FETCH ta.turma t
        WHERE LOWER(a.nome) LIKE LOWER(CONCAT('%', :nome, '%'))
    """)
    Page<Aluno> findAlunosComTurmaAtualPorNome(
        @Param("nome") String nome,
        Pageable pageable
    );
}