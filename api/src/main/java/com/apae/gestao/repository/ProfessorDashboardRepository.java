package com.apae.gestao.repository;

import com.apae.gestao.entity.Professor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

@org.springframework.stereotype.Repository
public interface ProfessorDashboardRepository extends Repository<Professor, UUID> {

    @Query(value = """
            WITH turmas_professor AS (
                SELECT t.id, t.ativa
                FROM gestao_escolar.turmas t
                WHERE t.professor_id = :professorId
            ),

            alunos_ativos AS (
                SELECT DISTINCT ta.paciente_id
                FROM gestao_escolar.turma_aluno ta
                JOIN turmas_professor tp
                    ON tp.id = ta.turma_id
                JOIN gestao_escolar.alunos_view av
                    ON av.id = ta.paciente_id
                WHERE ta.ativo = true
            ),

            aulas_professor AS (
                SELECT a.id
                FROM gestao_escolar.aulas a
                JOIN turmas_professor tp
                    ON tp.id = a.turma_id
            ),

            presencas_professor AS (
                SELECT
                    p.id,
                    p.paciente_id,
                    p.faltou
                FROM gestao_escolar.presencas p
                JOIN aulas_professor ap
                    ON ap.id = p.aula_id
            ),

            frequencia_por_aluno AS (
                SELECT
                    aa.paciente_id,
                    CASE
                        WHEN COUNT(pp.id) = 0 THEN 0.0
                        ELSE
                            SUM(CASE WHEN pp.faltou = false THEN 1.0 ELSE 0.0 END)
                            * 100.0
                            / COUNT(pp.id)
                    END AS percentual_frequencia
                FROM alunos_ativos aa
                LEFT JOIN presencas_professor pp
                    ON pp.paciente_id = aa.paciente_id
                GROUP BY aa.paciente_id
            )

            SELECT
                (SELECT COUNT(*)
                 FROM turmas_professor
                 WHERE ativa = true) AS total_turmas_ativas,

                (SELECT COUNT(*)
                 FROM alunos_ativos) AS total_alunos_ativos,

                COALESCE(
                    (
                        SELECT
                            SUM(CASE WHEN faltou = false THEN 1.0 ELSE 0.0 END)
                            * 100.0
                            / NULLIF(COUNT(*), 0)
                        FROM presencas_professor
                    ),
                    0.0
                ) AS frequencia_media,

                (SELECT COUNT(*)
                 FROM aulas_professor) AS aulas_realizadas,

                (SELECT COUNT(*)
                 FROM frequencia_por_aluno
                 WHERE percentual_frequencia < 75.0) AS alunos_com_frequencia_baixa,

                (SELECT COUNT(*)
                 FROM presencas_professor
                 WHERE faltou = false) AS total_presencas,

                (SELECT COUNT(*)
                 FROM presencas_professor
                 WHERE faltou = true) AS total_faltas
            """, nativeQuery = true)
    List<Object[]> buscarResumoDashboard(@Param("professorId") UUID professorId);
}
