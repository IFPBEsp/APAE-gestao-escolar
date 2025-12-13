package com.apae.gestao.service;

import com.apae.gestao.dto.RelatorioRequestDTO;
import com.apae.gestao.dto.RelatorioResponseDTO;
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
    private final TurmaAlunoRepository turmaAlunoRepository;

    public RelatorioService(RelatorioRepository relatorioRepository,
                            AlunoRepository alunoRepository,
                            ProfessorRepository professorRepository,
                            TurmaRepository turmaRepository,
                            TurmaAlunoRepository turmaAlunoRepository) {
        this.relatorioRepository = relatorioRepository;
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.turmaRepository = turmaRepository;
        this.turmaAlunoRepository = turmaAlunoRepository;
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

        Relatorio relatorio = new Relatorio();
        relatorio.setAtividades(request.getAtividades());
        relatorio.setHabilidades(request.getHabilidades());
        relatorio.setEstrategias(request.getEstrategias());
        relatorio.setRecursos(request.getRecursos());
        relatorio.setAluno(aluno);
        relatorio.setProfessor(professor);

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

        relatorio.setAtividades(request.getAtividades());
        relatorio.setHabilidades(request.getHabilidades());
        relatorio.setEstrategias(request.getEstrategias());
        relatorio.setRecursos(request.getRecursos());
        relatorio.setAluno(aluno);
        relatorio.setProfessor(professor);

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

    @Transactional(readOnly = true)
    public RelatorioResponseDTO buscarCompletoPorId(Long id) {
        Relatorio relatorio = relatorioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relatório não encontrado com ID: " + id));

        Aluno aluno = relatorio.getAluno();
        Professor professor = relatorio.getProfessor();

        // Find active Turma for the aluno
        TurmaAluno turmaAluno = turmaAlunoRepository.findByAlunoAndIsAlunoAtivo(aluno, true)
                .stream()
                .findFirst()
                .orElse(null);

        Turma turma = null;
        if (turmaAluno != null) {
            turma = turmaRepository.findById(turmaAluno.getTurma().getId())
                    .filter(Turma::getIsAtiva)
                    .orElse(null);
        }

        return new RelatorioResponseDTO(
                relatorio.getId(),
                relatorio.getAtividades(),
                relatorio.getHabilidades(),
                relatorio.getEstrategias(),
                relatorio.getRecursos(),
                aluno.getNome(),
                aluno.getDataNascimento(),
                turma != null ? turma.getNome() : null,
                turma != null ? turma.getAnoCriacao() : null,
                professor.getNome(),
                relatorio.getCreatedAt()
        );
    }

    private RelatorioResponseDTO toResponseDTO(Relatorio relatorio) {
        Aluno aluno = relatorio.getAluno();
        Professor professor = relatorio.getProfessor();

        // For simple response, maybe don't fetch Turma, or fetch minimally
        // Since the spec for listarTodos and buscarPorId doesn't specify consolidation, I'll keep it simple
        return new RelatorioResponseDTO(
                relatorio.getId(),
                relatorio.getAtividades(),
                relatorio.getHabilidades(),
                relatorio.getEstrategias(),
                relatorio.getRecursos(),
                aluno.getNome(),
                aluno.getDataNascimento(),
                null, // Not fetching Turma for simple responses
                null,
                professor.getNome(),
                relatorio.getCreatedAt()
        );
    }
}