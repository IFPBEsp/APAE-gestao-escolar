package com.apae.gestao.repository;

import java.util.List;
import com.apae.gestao.entity.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    List<Aluno> findByNomeContainingIgnoreCase(String nome);

    @Query("SELECT a FROM Aluno a JOIN FETCH a.turmaAlunos WHERE a.id = :id")
    Aluno findByIdWithTurma(Long id);

    @Query("SELECT a FROM Aluno a JOIN FETCH a.turmaAlunos")
    List<Aluno> findAllWithTurma();

}