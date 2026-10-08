package com.apae.gestao.repository;

import com.apae.gestao.entity.Avaliacao;
import com.apae.gestao.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, UUID> {

    List<Avaliacao> findByPacienteIdOrderByDataAvaliacaoDesc(UUID pacienteId);

    List<Avaliacao> findByProfessorOrderByDataAvaliacaoDesc(Professor professor);

    List<Avaliacao> findByPacienteIdAndProfessorOrderByDataAvaliacaoDesc(UUID pacienteId, Professor professor);

    List<Avaliacao> findAllByOrderByDataAvaliacaoDesc();
}