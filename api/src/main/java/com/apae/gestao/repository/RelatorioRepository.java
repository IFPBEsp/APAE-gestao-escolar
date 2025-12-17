package com.apae.gestao.repository;

import com.apae.gestao.entity.Relatorio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RelatorioRepository extends JpaRepository<Relatorio, Long> {
    List<Relatorio> findByAlunoId(Long alunoId);
}