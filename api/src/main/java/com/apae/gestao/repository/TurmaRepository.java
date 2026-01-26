package com.apae.gestao.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.apae.gestao.entity.Turma;

import java.util.Optional;


@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long>{

    @Query(value = "SELECT listar_turmas_otimizado(:id, :nome, :anoCriacao, :turno, :tipo, :isAtiva, :professorId)",
            nativeQuery = true)
    String listarTurmasJson(
            @Param("id") Long id,
            @Param("nome") String nome,
            @Param("anoCriacao") Integer anoCriacao,
            @Param("turno") String turno,
            @Param("tipo") String tipo,
            @Param("isAtiva") Boolean isAtiva,
            @Param("professorId") Long professorId
    );

    @Query("SELECT t FROM Turma t LEFT JOIN FETCH t.professor LEFT JOIN FETCH t.turmaAlunos WHERE t.id = :id")
    Optional<Turma> findByIdWithDetails(@Param("id") Long id);

    @Query(value = "SELECT listar_turmas_otimizado(NULL, NULL, NULL, NULL, NULL, NULL, :professorId)", nativeQuery = true)
    String listarTurmasOtimizadoPorProfessor(@Param("professorId") Long professorId);
}
