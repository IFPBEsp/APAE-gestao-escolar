package com.apae.gestao.repository;

import com.apae.gestao.entity.Relatorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface RelatorioRepository extends JpaRepository<Relatorio, UUID> {
    List<Relatorio> findByPacienteId(UUID pacienteId);
}