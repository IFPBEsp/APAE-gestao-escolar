package com.apae.gestao.repository;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Aula;
import com.apae.gestao.entity.Presenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PresencaRepository extends JpaRepository<Presenca, Long> {

    List<Presenca> findByAula(Aula aula);

    List<Presenca> findByAluno(Aluno aluno);

    Optional<Presenca> findByAulaAndAluno(Aula aula, Aluno aluno);
}
