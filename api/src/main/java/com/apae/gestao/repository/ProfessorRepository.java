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
    
    /**
     * Busca professores com filtros opcionais de nome e status.
     * Suporta combinação flexível dos parâmetros:
     * - Se nome for null: ignora filtro de nome
     * - Se ativo for null: ignora filtro de status (retorna todos)
     * - Se ambos forem fornecidos: aplica ambos os filtros
     * 
     * @param nome Parâmetro opcional para busca por nome (case-insensitive, contém)
     * @param ativo Parâmetro opcional para filtrar por status (true=ativos, false=inativos, null=todos)
     * @return Lista de professores que atendem aos critérios
     */
    @Query("SELECT p FROM Professor p WHERE " +
           "(:nome IS NULL OR :nome = '' OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
           "(:ativo IS NULL OR p.ativo = :ativo)")
    List<Professor> findByNomeContainingIgnoreCaseAndAtivo(
            @Param("nome") String nome, 
            @Param("ativo") Boolean ativo
    );
}