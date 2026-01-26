package com.apae.gestao.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO;
import com.apae.gestao.entity.Turma;


@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {

    @Query("""
        SELECT new com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO(
            CAST(SUM(CASE WHEN p.faltou = false THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(COUNT(p), 0) AS double),
            
            (SELECT COUNT(DISTINCT a_sub.id) 
            FROM Turma t_sub 
            JOIN t_sub.turmaAlunos ta_sub 
            JOIN ta_sub.aluno a_sub 
            WHERE t_sub.id = :turmaId AND (
                SELECT SUM(CASE WHEN p2.faltou = false THEN 1.0 ELSE 0.0 END) * 100.0 / NULLIF(COUNT(p2), 0)
                FROM Presenca p2 
                JOIN p2.aula au2 
                WHERE p2.aluno = a_sub AND au2.turma.id = :turmaId
            ) < 75.0),
            
            (SELECT COUNT(au) FROM Aula au WHERE au.turma.id = :turmaId)
        )
        FROM Turma t
        LEFT JOIN t.turmaAlunos ta ON ta.isAlunoAtivo = true
        LEFT JOIN ta.aluno a
        LEFT JOIN a.presencas p ON p.aula.turma.id = :turmaId
        WHERE t.id = :turmaId
        GROUP BY t.id
    """)
    TurmaResumoFrequenciaDTO getResumoFrequenciaTurma(@Param("turmaId") Long turmaId);
}
