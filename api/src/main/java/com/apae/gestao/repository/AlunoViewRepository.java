package com.apae.gestao.repository;

import com.apae.gestao.dto.aluno.AlunoFrequenciaResumoDTO;
import com.apae.gestao.dto.aluno.AlunoResumoDTO;
import com.apae.gestao.dto.aula.AulaPresencaAlunoResponseDTO;
import java.util.List;
import java.util.UUID;
import com.apae.gestao.entity.AlunoView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AlunoViewRepository extends JpaRepository<AlunoView, UUID> {

    @Query(
            value = """
                SELECT new com.apae.gestao.dto.aluno.AlunoResumoDTO(
                    a.id,
                    a.nomeCompleto,
                    MAX(r.nome),
                    MAX(t.nome)
                )
                FROM AlunoView a
                LEFT JOIN Responsavel r ON r.pacienteId = a.id
                LEFT JOIN TurmaAluno ta ON ta.pacienteId = a.id AND ta.ativo = true
                LEFT JOIN ta.turma t
                WHERE (:nome IS NULL OR TRIM(:nome) = '' OR LOWER(a.nomeCompleto) LIKE LOWER(CONCAT('%', TRIM(:nome), '%')))
                GROUP BY a.id, a.nomeCompleto
            """,
            countQuery = "SELECT COUNT(DISTINCT a.id) FROM AlunoView a WHERE (:nome IS NULL OR TRIM(:nome) = '' OR LOWER(a.nomeCompleto) LIKE LOWER(CONCAT('%', TRIM(:nome), '%')))"
    )
    Page<AlunoResumoDTO> listarAlunosPorFiltro(@Param("nome") String nome, Pageable pageable);

    @Query(value = """
                SELECT new com.apae.gestao.dto.aluno.AlunoResumoDTO(
                    a.id,
                    a.nomeCompleto,
                    MAX(r.nome),
                    MAX(t.nome)
                )
                FROM AlunoView a
                LEFT JOIN Responsavel r ON r.pacienteId = a.id
                JOIN TurmaAluno ta ON ta.pacienteId = a.id
                JOIN ta.turma t
                WHERE ta.ativo = true
                AND (:nome IS NULL OR TRIM(:nome) = '' OR LOWER(a.nomeCompleto) LIKE LOWER(CONCAT('%', TRIM(:nome), '%')))
                GROUP BY a.id, a.nomeCompleto
            """, countQuery = "SELECT COUNT(DISTINCT a.id) FROM AlunoView a JOIN TurmaAluno ta ON ta.pacienteId = a.id WHERE ta.ativo = true  AND (:nome IS NULL OR TRIM(:nome) = '' OR LOWER(a.nomeCompleto) LIKE LOWER(CONCAT('%', TRIM(:nome), '%')))")
    Page<AlunoResumoDTO> listarAlunosAtivosPorFiltro(@Param("nome") String nome, Pageable pageable);

    @Query(
            value = """
                SELECT new com.apae.gestao.dto.aluno.AlunoFrequenciaResumoDTO(
                    a.id,
                    a.nomeCompleto,
                    CASE
                        WHEN COUNT(p) = 0 THEN 0.0
                        ELSE SUM(CASE WHEN p.faltou = false THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(p)
                    END,
                    CASE
                        WHEN (
                            CASE
                                WHEN COUNT(p) = 0 THEN 0.0
                                ELSE SUM(CASE WHEN p.faltou = false THEN 1.0 ELSE 0.0 END) * 100.0 / COUNT(p)
                            END
                        ) < 75 THEN true ELSE false
                    END
                )
                FROM AlunoView a
                JOIN TurmaAluno ta ON ta.pacienteId = a.id
                JOIN ta.turma t
                LEFT JOIN Presenca p ON p.pacienteId = a.id AND p.aula.id IN (SELECT au.id FROM Aula au WHERE au.turma.id = :turmaId)
                WHERE t.id = :turmaId
                AND ta.ativo = true
                GROUP BY a.id, a.nomeCompleto
            """, countQuery = "SELECT COUNT(DISTINCT a.id) FROM AlunoView a JOIN TurmaAluno ta ON ta.pacienteId = a.id JOIN ta.turma t WHERE t.id = :turmaId AND ta.ativo = true")
    Page<AlunoFrequenciaResumoDTO> listarFrequenciaAlunosDaTurma(@Param("turmaId") UUID turmaId, Pageable pageable);

    @Query("""
                SELECT new com.apae.gestao.dto.aula.AulaPresencaAlunoResponseDTO(
                    au.id,
                    a.id,
                    au.descricao,
                    CASE WHEN p.faltou = false THEN true ELSE false END
                )
                FROM Presenca p
                JOIN Aula au ON p.aula.id = au.id
                JOIN AlunoView a ON p.pacienteId = a.id
                WHERE a.id = :pacienteId
                ORDER BY au.data DESC
            """)
    Page<AulaPresencaAlunoResponseDTO> listarHistoricoAluno(
            @Param("pacienteId") UUID pacienteId,
            Pageable pageable);

    List<AlunoView> findByNomeCompletoContainingIgnoreCase(String nomeCompleto);
}
