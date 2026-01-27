package com.apae.gestao.service;

import com.apae.gestao.dto.avaliacao.AvaliacaoHistoricoResponseDTO;
import com.apae.gestao.dto.aluno.AlunoResponseDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaRequestDTO;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno; 
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.AvaliacaoRepository;
import com.apae.gestao.repository.TurmaRepository; 
import com.apae.gestao.repository.TurmaAlunoRepository; 

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final AvaliacaoRepository avaliacaoRepository; 
    private final TurmaRepository turmaRepository; 
    private final TurmaAlunoRepository turmaAlunoRepository; 

    public AlunoService(
        AlunoRepository alunoRepository, 
        AvaliacaoRepository avaliacaoRepository,
        TurmaRepository turmaRepository,
        TurmaAlunoRepository turmaAlunoRepository 
    ) {
        this.alunoRepository = alunoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.turmaRepository = turmaRepository;
        this.turmaAlunoRepository = turmaAlunoRepository;
    }

    @Transactional(readOnly = true)
    public List<AlunoResponseDTO> listarAlunosPorNome(String nome) {
        if (nome != null && !nome.trim().isEmpty()) {
            return alunoRepository.findByNomeContainingIgnoreCase(nome.trim())
                .stream()
                .map(AlunoResponseDTO::new)
                .collect(Collectors.toList());  
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
    public AlunoResponseDTO buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + id));
        return new AlunoResponseDTO(aluno);
    }
    
    @Transactional
    public AlunoResponseDTO atualizarTurma(Long alunoId, AlunoTurmaRequestDTO dto) {
        Aluno aluno = alunoRepository.findById(alunoId)
            .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + alunoId));
        
        Turma novaTurma = turmaRepository.findById(dto.getNovaTurmaId())
            .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + dto.getNovaTurmaId()));

        // BUSCA UMA LISTA EM VEZ DE UM ÚNICO OBJETO PARA EVITAR O ERRO
        List<TurmaAluno> registrosAtivos = turmaAlunoRepository.findAllByAlunoAndIsAlunoAtivoTrue(aluno);
        
        // Desativa todos os que encontrar (limpeza preventiva)
        for (TurmaAluno registro : registrosAtivos) {
            registro.setIsAlunoAtivo(false);
            turmaAlunoRepository.save(registro);
        }

        // Cria o novo registro
        TurmaAluno novoRegistro = new TurmaAluno();
        novoRegistro.setAluno(aluno);
        novoRegistro.setTurma(novaTurma);
        novoRegistro.setIsAlunoAtivo(true); 
        
        turmaAlunoRepository.save(novoRegistro);
        
        aluno.getTurmaAlunos().add(novoRegistro);

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
        
        String turmaAtualCompleta = aluno.getTurmaAtual()
            .map(t -> t.getNome() + " - " + t.getTurno()) 
            .orElse("Sem Turma Ativa"); 
        
        return avaliacaoRepository.findByAlunoOrderByDataAvaliacaoDesc(aluno)
                .stream()
                .map(avaliacao -> AvaliacaoHistoricoResponseDTO.fromEntity(avaliacao, turmaAtualCompleta))
                .collect(Collectors.toList());
    }
}
