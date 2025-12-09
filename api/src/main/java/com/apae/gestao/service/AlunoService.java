package com.apae.gestao.service;

import com.apae.gestao.dto.AlunoResponseDTO;
import com.apae.gestao.dto.AvaliacaoHistoricoResponseDTO;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.AvaliacaoRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final AvaliacaoRepository avaliacaoRepository; 


    public AlunoService(AlunoRepository alunoRepository, AvaliacaoRepository avaliacaoRepository) {
        this.alunoRepository = alunoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listarTodos(String nome) {
        List<Aluno> alunos;
        if (nome != null && !nome.trim().isEmpty()) {
            alunos = alunoRepository.findByNomeContainingIgnoreCase(nome);
        } else {
            alunos = alunoRepository.findAll();
        }
        return alunos.stream()
                .map(AlunoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + id));
        return new AlunoResponseDTO(aluno);
    }

    @Transactional
    public void deletar(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new RuntimeException("Aluno não encontrado com ID: " + id);
        }
        alunoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoHistoricoResponseDTO> buscarAvaliacoesPorAlunoId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + id));
        
        return avaliacaoRepository.findByAlunoOrderByDataAvaliacaoDesc(aluno)
                .stream()
                .map(AvaliacaoHistoricoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
