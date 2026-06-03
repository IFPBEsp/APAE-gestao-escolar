package com.apae.gestao.service;

import com.apae.gestao.dto.avaliacao.AvaliacaoRequestDTO;
import com.apae.gestao.dto.avaliacao.AvaliacaoResponseDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Avaliacao;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.AvaliacaoRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final AlunoViewRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final TurmaAlunoRepository turmaAlunoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public AvaliacaoResponseDTO criar(AvaliacaoRequestDTO dto) {
        alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));
        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));

        Avaliacao avaliacao = Avaliacao.builder()
                .descricao(dto.getDescricao())
                .pacienteId(dto.getAlunoId())
                .professor(professor)
                .build();

        return toResponse(avaliacaoRepository.save(avaliacao));
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarTodas() {
        return avaliacaoRepository.findAllByOrderByDataAvaliacaoDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AvaliacaoResponseDTO buscarPorId(UUID id) {
        return toResponse(avaliacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada")));
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorAluno(UUID alunoId) {
        alunoRepository.findById(alunoId)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));
        return avaliacaoRepository.findByPacienteIdOrderByDataAvaliacaoDesc(alunoId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorProfessor(UUID professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));
        return avaliacaoRepository.findByProfessorOrderByDataAvaliacaoDesc(professor)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AvaliacaoResponseDTO atualizar(UUID id, AvaliacaoRequestDTO dto) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada"));

        alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));
        Professor professor = professorRepository.findById(dto.getProfessorId())
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));

        avaliacao.setDescricao(dto.getDescricao());
        avaliacao.setPacienteId(dto.getAlunoId());
        avaliacao.setProfessor(professor);

        return toResponse(avaliacaoRepository.save(avaliacao));
    }

    @Transactional
    public void deletar(UUID id) {
        if (!avaliacaoRepository.existsById(id)) {
            throw new EntityNotFoundException("Avaliação não encontrada");
        }
        avaliacaoRepository.deleteById(id);
    }

    private AvaliacaoResponseDTO toResponse(Avaliacao avaliacao) {
        return AvaliacaoResponseDTO.fromEntity(
                avaliacao,
                alunoRepository.findById(avaliacao.getPacienteId()).map(AlunoView::getNomeCompleto).orElse(null),
                nomeProfessor(avaliacao.getProfessor()),
                turmaCompleta(avaliacao.getPacienteId())
        );
    }

    private String turmaCompleta(UUID pacienteId) {
        return turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)
                .stream()
                .findFirst()
                .map(TurmaAluno::getTurma)
                .map(this::formatarTurma)
                .orElse("Sem Turma Ativa");
    }

    private String formatarTurma(Turma turma) {
        return turma.getNome() + " - " + turma.getTurno();
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
