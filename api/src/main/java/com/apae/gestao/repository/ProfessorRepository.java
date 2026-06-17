package com.apae.gestao.repository;

import com.apae.gestao.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, UUID> {

    Optional<Professor> findByUsuarioId(UUID usuarioId);

    boolean existsByUsuarioId(UUID usuarioId);

    @Query(value = """
        SELECT 
            p.id AS id,
            u.ativo AS ativo,
            u.nome_completo AS nome,
            u.email AS email,
            COALESCE(STRING_AGG(t.nome, ', '), 'Sem turma vinculada') AS turmas
        FROM gestao_escolar.professores p
        JOIN apae_geral.usuarios u ON p.usuario_id = u.id
        LEFT JOIN gestao_escolar.turmas t ON t.professor_id = p.id
        WHERE (:nome IS NULL OR TRIM(:nome) = '' OR LOWER(u.nome_completo) LIKE LOWER(CONCAT('%', TRIM(:nome), '%')))
          AND (:email IS NULL OR TRIM(:email) = '' OR LOWER(u.email) LIKE LOWER(CONCAT('%', TRIM(:email), '%')))
          AND (:ativo IS NULL OR u.ativo = :ativo)
        GROUP BY p.id, u.ativo, u.nome_completo, u.email
        ORDER BY u.ativo DESC, u.nome_completo ASC
    """, nativeQuery = true)
    List<Object[]> listarProfessoresOtimizado(
            @Param("nome") String nome,
            @Param("email") String email,
            @Param("ativo") Boolean ativo
    );
}
