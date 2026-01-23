package com.apae.gestao.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO;
import com.apae.gestao.entity.Turma;


@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {

    @Query("""
        SELECT new com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO(
            CASE 
                WHEN COUNT(p) = 0 THEN 0
                ELSE SUM(CASE WHEN p.faltou = false THEN 1 ELSE 0 END) * 100.0 / COUNT(p)
            END,

            COUNT(DISTINCT CASE 
                WHEN (
                    SELECT 
                        SUM(CASE WHEN p2.faltou = false THEN 1 ELSE 0 END) * 100.0 / COUNT(p2)
                    FROM Presenca p2
                    WHERE p2.aluno = a
                ) < 75 THEN a.id
            END),

            CONCAT(COUNT(DISTINCT a.id), ' / ', COUNT(p))
        )
        FROM Turma t
        LEFT JOIN t.turmaAlunos ta ON ta.isAlunoAtivo = true
        LEFT JOIN ta.aluno a
        LEFT JOIN a.presencas p
        WHERE t.id = :turmaId
        GROUP BY t.id
    """)
    TurmaResumoFrequenciaDTO getResumoFrequenciaTurma(Long turmaId);
}