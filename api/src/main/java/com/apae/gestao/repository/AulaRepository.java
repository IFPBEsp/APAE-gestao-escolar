package com.apae.gestao.repository;

import com.apae.gestao.entity.Aula;
import com.apae.gestao.entity.Turma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AulaRepository extends JpaRepository<Aula,Long> {
    Optional<Aula> findByTurmaAndDataDaAula(Turma turma, LocalDate dataDaAula);
}
