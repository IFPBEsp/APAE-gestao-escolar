package com.apae.gestao.repository;

import com.apae.gestao.entity.Aula;
import com.apae.gestao.entity.Presenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PresencaRepository extends JpaRepository<Presenca, UUID> {

    List<Presenca> findByAula(Aula aula);

    @Query(value = "SELECT get_chamada_por_turma_e_data(:turmaId, :data)::text", nativeQuery = true)
    String getChamadaPorTurmaEData(@Param("turmaId") UUID turmaId, @Param("data") LocalDate data);

    Optional<Presenca> findByAulaAndPacienteId(Aula aula, UUID pacienteId);
}
