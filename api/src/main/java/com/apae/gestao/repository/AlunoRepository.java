package com.apae.gestao.repository;

import java.util.List;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    //tá dando erro nesse filtro aqui embaixo:
    // List<Aluno> findByTurmaAndAtivoTrue(Turma turma);

    List<Aluno> findByNomeContainingIgnoreCase(String nome);
}
