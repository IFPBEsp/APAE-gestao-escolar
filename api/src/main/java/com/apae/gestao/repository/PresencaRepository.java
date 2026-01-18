package com.apae.gestao.repository;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Aula;
import com.apae.gestao.entity.Presenca;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PresencaRepository extends JpaRepository<Presenca, Long> {

    // =========================
    // USO LEGADO / ADMIN
    // =========================
    List<Presenca> findByAula(Aula aula);

    Optional<Presenca> findByAulaAndAluno(Aula aula, Aluno aluno);

    // =========================
    // FUNÇÃO EXISTENTE (OK)
    // =========================
    @Query(value = "SELECT get_chamada_por_turma_e_data(:turmaId, :data)::text", nativeQuery = true)
    String getChamadaPorTurmaEData(
            @Param("turmaId") Long turmaId,
            @Param("data") LocalDate data
    );

    // =========================
    // 🚀 QUERY OTIMIZADA PARA CARDS
    // =========================
    @Query("""
        SELECT 
            (SUM(CASE WHEN p.faltou = false THEN 1 ELSE 0 END) * 100.0)
            / COUNT(p)
        FROM Presenca p
        WHERE p.aluno.id = :alunoId
    """)
    Double calcularPercentualPresenca(@Param("alunoId") Long alunoId);
}
