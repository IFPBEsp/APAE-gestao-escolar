package com.apae.gestao.repository;

import com.apae.gestao.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    
    List<Professor> findByAtivoTrue();
    
    Optional<Professor> findByIdAndAtivoTrue(Long id);
    
    boolean existsByCpf(String cpf);
    
    boolean existsByEmail(String email);
    
    boolean existsByCpfAndIdNot(String cpf, Long id);
    
    boolean existsByEmailAndIdNot(String email, Long id);
}

