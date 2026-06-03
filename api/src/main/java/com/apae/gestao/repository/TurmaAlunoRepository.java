package com.apae.gestao.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;

@Repository
public interface TurmaAlunoRepository extends JpaRepository<TurmaAluno, UUID>{

    List<TurmaAluno> findByTurmaAndAtivo(Turma turma, Boolean ativo);

    @Query("SELECT ta FROM TurmaAluno ta JOIN AlunoView a ON ta.pacienteId = a.id WHERE ta.turma = :turma AND ta.ativo = :ativo ORDER BY a.nomeCompleto ASC")
    List<TurmaAluno> findByTurmaAndAtivoOrderByPacienteNomeAsc(@Param("turma") Turma turma, @Param("ativo") Boolean ativo);

    Optional<TurmaAluno> findByTurmaAndPacienteId(Turma turma, UUID pacienteId);

    List<TurmaAluno> findAllByPacienteIdAndAtivoTrue(UUID pacienteId);

    @Query("""
            SELECT DISTINCT ta FROM TurmaAluno ta
            JOIN FETCH ta.turma t
            WHERE ta.pacienteId = :pacienteId
            ORDER BY t.anoCriacao DESC, t.nome ASC
            """)
    List<TurmaAluno> findAllHistoricoByPaciente(@Param("pacienteId") UUID pacienteId);

    List<TurmaAluno> findByTurmaId(UUID turmaId);

    @Query("SELECT ta FROM TurmaAluno ta JOIN AlunoView a ON ta.pacienteId = a.id WHERE ta.turma.id = :turmaId ORDER BY a.nomeCompleto ASC")
    List<TurmaAluno> findByTurmaIdOrderByPacienteNomeAsc(@Param("turmaId") UUID turmaId);

    @Query("""
            SELECT ta FROM TurmaAluno ta
            JOIN FETCH ta.turma t
            WHERE ta.pacienteId = :pacienteId
            ORDER BY ta.ativo DESC, t.anoCriacao DESC, t.nome ASC
            """)
    List<TurmaAluno> findHistoricoCompletoPorPaciente(@Param("pacienteId") UUID pacienteId);
}