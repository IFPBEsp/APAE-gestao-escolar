package com.apae.gestao.repository;

import com.apae.gestao.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {

    @Query(value = "SELECT listar_professores_com_turmas(:id, :nome, :cpf, :email, :ativo)",
            nativeQuery = true)
    String listarProfessoresJson(
            @Param("id") Long id,
            @Param("nome") String nome,
            @Param("cpf") String cpf,
            @Param("email") String email,
            @Param("ativo") Boolean ativo
    );

    @Query("SELECT p FROM Professor p LEFT JOIN FETCH p.turmas WHERE p.id = :id")
    Optional<Professor> findByIdWithTurmas(@Param("id") Long id);

    boolean existsByCpf(String cpf);
    
    boolean existsByEmail(String email);
    
    boolean existsByCpfAndIdNot(String cpf, Long id);
    
    boolean existsByEmailAndIdNot(String email, Long id);

    Optional<Professor> findByEmail(String email);
}