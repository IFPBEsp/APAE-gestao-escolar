package com.apae.gestao.repository;

import com.apae.gestao.entity.Aula;
import com.apae.gestao.entity.Presenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PresencaRepository extends JpaRepository<Presenca, UUID> {

    List<Presenca> findByAula(Aula aula);

    Optional<Presenca> findByAulaAndPacienteId(Aula aula, UUID pacienteId);
}
