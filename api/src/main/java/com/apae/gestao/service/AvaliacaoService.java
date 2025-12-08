package com.apae.gestao.service;

import com.apae.gestao.dto.AvaliacaoRequestDTO;
import com.apae.gestao.dto.AvaliacaoResponseDTO;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Avaliacao;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.AvaliacaoRepository;
import com.apae.gestao.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;


    @Transactional
    public AvaliacaoResponseDTO criar(AvaliacaoRequestDTO dto) {

        Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com id: " + dto.getAlunoId()));

        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com id: " + dto.getProfessorId()));

        Avaliacao avaliacao = Avaliacao.builder()
                .pontosPositivos(dto.getDescricao())
                .pontosNegativos("")
                .aluno(aluno)
                .professor(professor)
                .build();

        avaliacao = avaliacaoRepository.save(avaliacao);

        return AvaliacaoResponseDTO.fromEntity(avaliacao);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarTodas() {
        return avaliacaoRepository.findAllByOrderByDataAvaliacaoDesc().stream()
                .map(AvaliacaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AvaliacaoResponseDTO buscarPorId(Long id) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avaliação não encontrada com id: " + id));

        return AvaliacaoResponseDTO.fromEntity(avaliacao);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorAluno(Long alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com id: " + alunoId));

        return avaliacaoRepository.findByAlunoOrderByDataAvaliacaoDesc(aluno).stream()
                .map(AvaliacaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorProfessor(Long professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com id: " + professorId));

        return avaliacaoRepository.findByProfessorOrderByDataAvaliacaoDesc(professor).stream()
                .map(AvaliacaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }


    @Transactional
    public void deletar(Long id) {
        if (!avaliacaoRepository.existsById(id)) {
            throw new RuntimeException("Avaliação não encontrada com id: " + id);
        }
        avaliacaoRepository.deleteById(id);
    }
}