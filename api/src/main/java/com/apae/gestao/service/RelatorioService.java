package com.apae.gestao.service;

import com.apae.gestao.dto.relatorio.*;
import com.apae.gestao.entity.*;
import com.apae.gestao.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RelatorioService {

    private final RelatorioRepository relatorioRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final TurmaRepository turmaRepository;

    public RelatorioService(RelatorioRepository relatorioRepository,
                            AlunoRepository alunoRepository,
                            ProfessorRepository professorRepository,
                            TurmaRepository turmaRepository) {
        this.relatorioRepository = relatorioRepository;
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.turmaRepository = turmaRepository;
    }

    @Transactional(readOnly = true)
    public List<RelatorioResponseDTO> listarTodos() {
        return relatorioRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RelatorioResponseDTO buscarPorId(Long id) {
        Relatorio relatorio = relatorioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relatório não encontrado com ID: " + id));
        return toResponseDTO(relatorio);
    }

    @Transactional
    public RelatorioResponseDTO criar(RelatorioRequestDTO request) {
        Aluno aluno = alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + request.getAlunoId()));
        Professor professor = professorRepository.findById(request.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + request.getProfessorId()));
        Turma turma = turmaRepository.findById(request.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + request.getTurmaId()));

        Relatorio relatorio = new Relatorio();
        relatorio.setAtividades(request.getAtividades());
        relatorio.setHabilidades(request.getHabilidades());
        relatorio.setEstrategias(request.getEstrategias());
        relatorio.setRecursos(request.getRecursos());
        relatorio.setAluno(aluno);
        relatorio.setProfessor(professor);
        relatorio.setTurma(turma);

        Relatorio saved = relatorioRepository.save(relatorio);
        return toResponseDTO(saved);
    }

    @Transactional
    public RelatorioResponseDTO atualizar(Long id, RelatorioRequestDTO request) {
        Relatorio relatorio = relatorioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relatório não encontrado com ID: " + id));

        Aluno aluno = alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + request.getAlunoId()));
        Professor professor = professorRepository.findById(request.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + request.getProfessorId()));
        Turma turma = turmaRepository.findById(request.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + request.getTurmaId()));

        relatorio.setAtividades(request.getAtividades());
        relatorio.setHabilidades(request.getHabilidades());
        relatorio.setEstrategias(request.getEstrategias());
        relatorio.setRecursos(request.getRecursos());
        relatorio.setAluno(aluno);
        relatorio.setProfessor(professor);
        relatorio.setTurma(turma);

        Relatorio updated = relatorioRepository.save(relatorio);
        return toResponseDTO(updated);
    }

    @Transactional
    public void deletar(Long id) {
        if (!relatorioRepository.existsById(id)) {
            throw new RuntimeException("Relatório não encontrado com ID: " + id);
        }
        relatorioRepository.deleteById(id);
    }

    private RelatorioResponseDTO toResponseDTO(Relatorio relatorio) {
        Aluno aluno = relatorio.getAluno();
        Professor professor = relatorio.getProfessor();
        Turma turma = relatorio.getTurma(); 

        return new RelatorioResponseDTO(
                relatorio.getId(),
                aluno.getId(),
                relatorio.getAtividades(),
                relatorio.getHabilidades(),
                relatorio.getEstrategias(),
                relatorio.getRecursos(),
                aluno.getNome(),
                aluno.getDataNascimento(),
                turma != null ? turma.getNome() : null, 
                professor.getNome(),
                relatorio.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
        public List<RelatorioResponseDTO> buscarPorAluno(Long alunoId) {
        return relatorioRepository.findByAlunoId(alunoId)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
        }
}