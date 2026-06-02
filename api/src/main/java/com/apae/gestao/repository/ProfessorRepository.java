package com.apae.gestao.repository;

import com.apae.gestao.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, UUID> {

    Optional<Professor> findByUsuarioId(UUID usuarioId);

    boolean existsByUsuarioId(UUID usuarioId);
}
