package com.apae.gestao.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.apae.gestao.dto.RelatorioRequestDTO;
import com.apae.gestao.dto.RelatorioResponseDTO;
import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Relatorio;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.RelatorioRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;

@Service
public class RelatorioService {

    private final RelatorioRepository relatorioRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final TurmaRepository turmaRepository;

    public RelatorioService(RelatorioRepository relatorioRepository,
                            AlunoRepository alunoRepository,
                            ProfessorRepository professorRepository,
                            TurmaRepository turmaRepository,
                            TurmaAlunoRepository turmaAlunoRepository) {
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

    public List<RelatorioResponseDTO> listarPorAluno(Long alunoId) {
    return relatorioRepository
        .findByAlunoId(alunoId)
        .stream()
        .map(RelatorioResponseDTO::new)
        .toList();
}


    @Transactional(readOnly = true)
    public RelatorioResponseDTO buscarCompletoPorId(Long id) {
        Relatorio relatorio = relatorioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relatório não encontrado com ID: " + id));

        Aluno aluno = relatorio.getAluno();
        Professor professor = relatorio.getProfessor();
        Turma turma = relatorio.getTurma(); 

        return new RelatorioResponseDTO(
                relatorio.getId(),
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
    
    private RelatorioResponseDTO toResponseDTO(Relatorio relatorio) {
        Aluno aluno = relatorio.getAluno();
        Professor professor = relatorio.getProfessor();
        Turma turma = relatorio.getTurma(); 

        return new RelatorioResponseDTO(
                relatorio.getId(),
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
}