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
    
    @Query("SELECT p FROM Professor p LEFT JOIN FETCH p.turmas WHERE p.id = :id")
    Optional<Professor> findByIdWithTurmas(@Param("id") Long id);

    @EntityGraph(attributePaths = "turmas")
    List<Professor> findByAtivoTrue();
    
    Optional<Professor> findByIdAndAtivoTrue(Long id);
    
    boolean existsByCpf(String cpf);
    
    boolean existsByEmail(String email);
    
    boolean existsByCpfAndIdNot(String cpf, Long id);
    
    boolean existsByEmailAndIdNot(String email, Long id);
}