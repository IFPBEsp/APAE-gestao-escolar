package com.apae.gestao.repository;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Avaliacao;
import com.apae.gestao.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findByAlunoOrderByDataAvaliacaoDesc(Aluno aluno);

    List<Avaliacao> findByProfessorOrderByDataAvaliacaoDesc(Professor professor);

    List<Avaliacao> findByAlunoAndProfessorOrderByDataAvaliacaoDesc(Aluno aluno, Professor professor);

    List<Avaliacao> findAllByOrderByDataAvaliacaoDesc();
}