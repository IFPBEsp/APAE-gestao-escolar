package com.apae.gestao.service;

import com.apae.gestao.dto.AlunoResponseDTO;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.repository.AlunoRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import com.apae.gestao.mock.AlunoMockData;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;

    public AlunoService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listarAlunosPorNome(String nome) {
        if (nome != null && !nome.trim().isEmpty()) {
            return buscarPorNome(nome.trim());  
        } else {
            return listarTodos(); 
        }
    }

    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listarTodos() {
        return alunoRepository.findAll()
                .stream()
                .map(AlunoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> buscarPorNome(String nome) {
        return alunoRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
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
}
