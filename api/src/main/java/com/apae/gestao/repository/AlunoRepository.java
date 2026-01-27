package com.apae.gestao.repository;

import com.apae.gestao.dto.aluno.AlunoResumoDTO;
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
            t.nome,
            t.turno,
            CASE 
                WHEN COUNT(p) = 0 THEN 0
                ELSE SUM(CASE WHEN p.faltou = false THEN 1 ELSE 0 END) * 100.0 / COUNT(p)
            END,
            MAX(av.dataAvaliacao)
        )
        FROM Aluno a
        LEFT JOIN a.turmaAlunos ta ON ta.isAlunoAtivo = true
        LEFT JOIN ta.turma t
        LEFT JOIN a.presencas p ON p.aula.turma.id = t.id
        LEFT JOIN a.avaliacoes av
        GROUP BY a.id, a.nome, a.nomeResponsavel, t.nome, t.turno
    """)
    Page<AlunoResumoDTO> listarAlunosResumido(Pageable pageable);

    @Query("""
        SELECT new com.apae.gestao.dto.aluno.AlunoResumoDTO(
            a.id,
            a.nome,
            a.nomeResponsavel,
            t.nome,
            t.turno,
            CASE 
                WHEN COUNT(p) = 0 THEN 0
                ELSE SUM(CASE WHEN p.faltou = false THEN 1 ELSE 0 END) * 100.0 / COUNT(p)
            END,
            MAX(av.dataAvaliacao)
        )
        FROM Aluno a
        LEFT JOIN a.turmaAlunos ta ON ta.isAlunoAtivo = true
        LEFT JOIN ta.turma t
        LEFT JOIN a.presencas p ON p.aula.turma.id = t.id
        LEFT JOIN a.avaliacoes av
        WHERE LOWER(a.nome) LIKE LOWER(CONCAT('%', :nome, '%'))
        GROUP BY a.id, a.nome, a.nomeResponsavel, t.nome, t.turno
    """)
    Page<AlunoResumoDTO> listarAlunosPorNomeResumido(String nome, Pageable pageable);

}
 