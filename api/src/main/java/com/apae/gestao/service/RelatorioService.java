package com.apae.gestao.service;

import com.apae.gestao.dto.relatorio.RelatorioRequestDTO;
import com.apae.gestao.dto.relatorio.RelatorioResponseDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Relatorio;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.RelatorioRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class RelatorioService {

    private final RelatorioRepository relatorioRepository;
    private final AlunoViewRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final TurmaRepository turmaRepository;
    private final UsuarioRepository usuarioRepository;

    public RelatorioService(RelatorioRepository relatorioRepository,
                            AlunoViewRepository alunoRepository,
                            ProfessorRepository professorRepository,
                            TurmaRepository turmaRepository,
                            UsuarioRepository usuarioRepository) {
        this.relatorioRepository = relatorioRepository;
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.turmaRepository = turmaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<RelatorioResponseDTO> listarTodos() {
        return relatorioRepository.findAll().stream().map(this::toResponseDTO).toList();
    }

    @Transactional(readOnly = true)
    public RelatorioResponseDTO buscarPorId(UUID id) {
        return toResponseDTO(relatorioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relatório não encontrado com ID: " + id)));
    }

    @Transactional
    public RelatorioResponseDTO criar(RelatorioRequestDTO request) {
        alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + request.getAlunoId()));
        Professor professor = professorRepository.findById(request.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + request.getProfessorId()));
        Turma turma = turmaRepository.findById(request.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + request.getTurmaId()));

        Relatorio relatorio = new Relatorio();
        mapearRequest(request, relatorio);
        relatorio.setPacienteId(request.getAlunoId());
        relatorio.setProfessor(professor);
        relatorio.setTurma(turma);

        return toResponseDTO(relatorioRepository.save(relatorio));
    }

    @Transactional
    public RelatorioResponseDTO atualizar(UUID id, RelatorioRequestDTO request) {
        Relatorio relatorio = relatorioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relatório não encontrado com ID: " + id));

        alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + request.getAlunoId()));
        Professor professor = professorRepository.findById(request.getProfessorId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + request.getProfessorId()));
        Turma turma = turmaRepository.findById(request.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + request.getTurmaId()));

        mapearRequest(request, relatorio);
        relatorio.setPacienteId(request.getAlunoId());
        relatorio.setProfessor(professor);
        relatorio.setTurma(turma);

        return toResponseDTO(relatorioRepository.save(relatorio));
    }

    @Transactional
    public void deletar(UUID id) {
        if (!relatorioRepository.existsById(id)) {
            throw new RuntimeException("Relatório não encontrado com ID: " + id);
        }
        relatorioRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<RelatorioResponseDTO> buscarPorAluno(UUID alunoId) {
        return relatorioRepository.findByPacienteId(alunoId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    private void mapearRequest(RelatorioRequestDTO request, Relatorio relatorio) {
        relatorio.setAtividades(request.getAtividades());
        relatorio.setHabilidades(request.getHabilidades());
        relatorio.setEstrategias(request.getEstrategias());
        relatorio.setRecursos(request.getRecursos());
    }

    private RelatorioResponseDTO toResponseDTO(Relatorio relatorio) {
        AlunoView aluno = alunoRepository.findById(relatorio.getPacienteId()).orElse(null);
        Professor professor = relatorio.getProfessor();
        Turma turma = relatorio.getTurma();

        return new RelatorioResponseDTO(
                relatorio.getId(),
                relatorio.getPacienteId(),
                relatorio.getAtividades(),
                relatorio.getHabilidades(),
                relatorio.getEstrategias(),
                relatorio.getRecursos(),
                aluno != null ? aluno.getNomeCompleto() : null,
                aluno != null ? aluno.getDataDeNascimento() : null,
                turma != null ? turma.getNome() : null,
                nomeProfessor(professor),
                relatorio.getCreatedAt()
        );
    }

    private String nomeProfessor(Professor professor) {
        if (professor == null) {
            return null;
        }
        return usuarioRepository.findById(professor.getUsuarioId())
                .map(Usuario::getNomeCompleto)
                .orElse(null);
    }
}
