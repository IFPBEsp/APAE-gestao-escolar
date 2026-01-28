package com.apae.gestao.repository;

import com.apae.gestao.dto.aluno.AlunoFrequenciaResumoDTO;
import com.apae.gestao.dto.aluno.AlunoResumoDTO;
import com.apae.gestao.dto.aula.AulaPresencaAlunoResponseDTO;
import java.util.List;
import com.apae.gestao.entity.Aluno;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    @Query("""
        SELECT new com.apae.gestao.dto.aluno.AlunoResumoDTO(
        a.id,
        a.nome,
        a.nomeResponsavel,
        MAX(t.nome),
        MAX(t.turno),
        CASE 
            WHEN COUNT(p) = 0 THEN 0
            ELSE SUM(CASE WHEN p.faltou = false THEN 1 ELSE 0 END) * 100.0 / COUNT(p)
        END,
        MAX(av.dataAvaliacao)
    )
    FROM Aluno a
    LEFT JOIN a.turmaAlunos ta
    LEFT JOIN ta.turma t
    LEFT JOIN a.presencas p ON p.aula.turma.id = t.id
    LEFT JOIN a.avaliacoes av
    WHERE ta.isAlunoAtivo = true
    GROUP BY a.id, a.nome, a.nomeResponsavel
    """)
    Page<AlunoResumoDTO> listarAlunosResumido(Pageable pageable);

    @Query("""
        SELECT new com.apae.gestao.dto.aluno.AlunoResumoDTO(
            a.id,
            a.nome,
            a.nomeResponsavel,
            MAX(t.nome),
            MAX(t.turno),
            CASE 
                WHEN COUNT(p) = 0 THEN 0
                ELSE SUM(CASE WHEN p.faltou = false THEN 1 ELSE 0 END) * 100.0 / COUNT(p)
            END,
            MAX(av.dataAvaliacao)
        )
        FROM Aluno a
        LEFT JOIN a.turmaAlunos ta
        LEFT JOIN ta.turma t
        LEFT JOIN a.presencas p ON p.aula.turma.id = t.id
        LEFT JOIN a.avaliacoes av
        WHERE LOWER(a.nome) LIKE LOWER(CONCAT('%', :nome, '%'))
        GROUP BY a.id, a.nome, a.nomeResponsavel
    """)
    Page<AlunoResumoDTO> listarAlunosPorNomeResumido(String nome, Pageable pageable);

    @Query("""
        SELECT new com.apae.gestao.dto.aluno.AlunoFrequenciaResumoDTO(
            a.id,
            a.nome,
            CASE 
                WHEN COUNT(p) = 0 THEN 0
                ELSE SUM(CASE WHEN p.faltou = false THEN 1 ELSE 0 END) * 100.0 / COUNT(p)
            END,
            CASE 
                WHEN (
                    CASE 
                        WHEN COUNT(p) = 0 THEN 0
                        ELSE SUM(CASE WHEN p.faltou = false THEN 1 ELSE 0 END) * 100.0 / COUNT(p)
                    END
                ) < 75 THEN true ELSE false
            END
        )
        FROM Aluno a
        JOIN a.turmaAlunos ta
        JOIN ta.turma t
        LEFT JOIN a.presencas p ON p.aula.turma.id = :turmaId
        WHERE t.id = :turmaId
        AND ta.isAlunoAtivo = true
        GROUP BY a.id, a.nome
    """)
    Page<AlunoFrequenciaResumoDTO> listarFrequenciaAlunosDaTurma(
        Long turmaId,
        Pageable pageable
    );

    @Query("""
        SELECT new com.apae.gestao.dto.aula.AulaPresencaAlunoResponseDTO(
            au.id,
            a.id,
            au.descricao,
            CASE WHEN p.faltou = false THEN true ELSE false END
        )
        FROM Presenca p
        JOIN p.aula au
        JOIN p.aluno a
        WHERE a.id = :alunoId
        ORDER BY au.dataDaAula DESC
    """)
    Page<AulaPresencaAlunoResponseDTO> listarHistoricoAluno(
        Long alunoId,
        Pageable pageable
    );
    List<Aluno> findByNomeContainingIgnoreCase(String nome);
}
