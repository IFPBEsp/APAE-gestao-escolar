package com.apae.gestao.repository;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Avaliacao;
import com.apae.gestao.entity.Professor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    // =========================
    // USO EXISTENTE (DETALHES)
    // =========================
    List<Avaliacao> findByAlunoOrderByDataAvaliacaoDesc(Aluno aluno);

    List<Avaliacao> findByProfessorOrderByDataAvaliacaoDesc(Professor professor);

    List<Avaliacao> findByAlunoAndProfessorOrderByDataAvaliacaoDesc(
            Aluno aluno,
            Professor professor
    );

    List<Avaliacao> findAllByOrderByDataAvaliacaoDesc();

    // =========================
    // 🚀 QUERY OTIMIZADA PARA CARDS
    // =========================
   @Query("""
        SELECT MAX(a.dataAvaliacao)
        FROM Avaliacao a
        WHERE a.aluno.id = :alunoId
    """)
    LocalDateTime findDataUltimaAvaliacao(@Param("alunoId") Long alunoId);
}
