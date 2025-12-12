package com.apae.gestao.service;

import com.apae.gestao.dto.AvaliacaoRequestDTO;
import com.apae.gestao.dto.AvaliacaoResponseDTO;
import com.apae.gestao.entity.Avaliacao;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.repository.AvaliacaoRepository;
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.ProfessorRepository;
import jakarta.persistence.EntityNotFoundException;
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
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));        
        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));

        Avaliacao avaliacao = Avaliacao.builder()
                .descricao(dto.getDescricao())
                .aluno(aluno)
                .professor(professor)
                .build();
        
        Avaliacao saved = avaliacaoRepository.save(avaliacao);
        return AvaliacaoResponseDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarTodas() {
        return avaliacaoRepository.findAllByOrderByDataAvaliacaoDesc()
                .stream()
                .map(AvaliacaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public AvaliacaoResponseDTO buscarPorId(Long id) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada"));
        return AvaliacaoResponseDTO.fromEntity(avaliacao);
    }
    
    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorAluno(Long alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));
        
        return avaliacaoRepository.findByAlunoOrderByDataAvaliacaoDesc(aluno)
                .stream()
                .map(AvaliacaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorProfessor(Long professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));
        
        return avaliacaoRepository.findByProfessorOrderByDataAvaliacaoDesc(professor)
                .stream()
                .map(AvaliacaoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public AvaliacaoResponseDTO atualizar(Long id, AvaliacaoRequestDTO dto) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada"));
        
        avaliacao.setDescricao(dto.getDescricao());
        
        if (!avaliacao.getAluno().getId().equals(dto.getAlunoId())) {
            Aluno aluno = alunoRepository.findById(dto.getAlunoId())
                    .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));
            avaliacao.setAluno(aluno);
        }
        
        if (!avaliacao.getProfessor().getId().equals(dto.getProfessorId())) {
            Professor professor = professorRepository.findById(dto.getProfessorId())
                    .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));
            avaliacao.setProfessor(professor);
        }
        
        Avaliacao updated = avaliacaoRepository.save(avaliacao);
        return AvaliacaoResponseDTO.fromEntity(updated);
    }

    @Transactional
    public void deletar(Long id) {
        if (!avaliacaoRepository.existsById(id)) {
            throw new EntityNotFoundException("Avaliação não encontrada");
        }
        avaliacaoRepository.deleteById(id);
    }
}