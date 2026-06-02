package com.apae.gestao.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO;
import com.apae.gestao.entity.Turma;

import java.util.Optional;
import java.util.UUID;


@Repository
public interface TurmaRepository extends JpaRepository<Turma, UUID> {

    boolean existsByNome(String nome);

    boolean existsByNomeAndIdNot(String nome, UUID id);

    @Query("""
        SELECT new com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO(
            CAST(SUM(CASE WHEN p.faltou = false THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(COUNT(p), 0) AS double),
            
            (SELECT COUNT(DISTINCT ta_sub.pacienteId)
            FROM TurmaAluno ta_sub
            WHERE ta_sub.turma.id = :turmaId
              AND ta_sub.ativo = true
              AND (
                SELECT SUM(CASE WHEN p2.faltou = false THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(COUNT(p2), 0)
                FROM Presenca p2 
                JOIN p2.aula au2 
                WHERE p2.pacienteId = ta_sub.pacienteId AND au2.turma.id = :turmaId
            ) < 75.0),
            
            (SELECT COUNT(au) FROM Aula au WHERE au.turma.id = :turmaId)
        )
        FROM TurmaAluno ta
        LEFT JOIN Presenca p ON p.pacienteId = ta.pacienteId AND p.aula.turma.id = :turmaId
        WHERE ta.turma.id = :turmaId
          AND ta.ativo = true
        GROUP BY ta.turma.id
    """)
    TurmaResumoFrequenciaDTO getResumoFrequenciaTurma(@Param("turmaId") UUID turmaId);

    @Query("SELECT t FROM Turma t LEFT JOIN FETCH t.turmaAlunos WHERE t.id = :id")
    Optional<Turma> findByIdWithDetails(@Param("id") UUID id);
}
