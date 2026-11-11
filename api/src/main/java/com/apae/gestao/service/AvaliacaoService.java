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
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
        Professor professor = obterProfessorAutenticado();
        validarVinculoProfessorComAluno(professor, dto.getAlunoId());

        Avaliacao avaliacao = Avaliacao.builder()
                .descricao(dto.getDescricao())
                .pacienteId(dto.getAlunoId())
                .professor(professor)
                .build();

        return toResponse(avaliacaoRepository.save(avaliacao));
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarTodas() {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findAllByOrderByDataAvaliacaoDesc();
        if (isProfessorAutenticado()) {
            Professor professor = obterProfessorAutenticado();
            return avaliacoes.stream()
                    .filter(av -> isAlunoVinculadoAoProfessor(av.getPacienteId(), professor.getId())
                            || (av.getProfessor() != null && professor.getId().equals(av.getProfessor().getId())))
                    .map(this::toResponse)
                    .toList();
        }
        return avaliacoes.stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AvaliacaoResponseDTO buscarPorId(UUID id) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada"));
        if (isProfessorAutenticado()) {
            Professor professor = obterProfessorAutenticado();
            if (!isAlunoVinculadoAoProfessor(avaliacao.getPacienteId(), professor.getId())
                    && (avaliacao.getProfessor() == null || !professor.getId().equals(avaliacao.getProfessor().getId()))) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado a esta avaliação");
            }
        }
        return toResponse(avaliacao);
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorAluno(UUID alunoId) {
        alunoRepository.findById(alunoId)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));
        if (isProfessorAutenticado()) {
            Professor professor = obterProfessorAutenticado();
            validarVinculoProfessorComAluno(professor, alunoId);
        }
        return avaliacaoRepository.findByPacienteIdOrderByDataAvaliacaoDesc(alunoId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoResponseDTO> listarPorProfessor(UUID professorId) {
        if (isProfessorAutenticado()) {
            Professor professorAutenticado = obterProfessorAutenticado();
            if (!professorAutenticado.getId().equals(professorId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Não é permitido consultar avaliações de outro professor");
            }
        }
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

        Professor professor = obterProfessorAutenticado();
        validarAutoriaAvaliacao(avaliacao, professor);

        alunoRepository.findById(dto.getAlunoId())
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));
        validarVinculoProfessorComAluno(professor, dto.getAlunoId());

        avaliacao.setDescricao(dto.getDescricao());
        avaliacao.setPacienteId(dto.getAlunoId());
        avaliacao.setProfessor(professor);

        return toResponse(avaliacaoRepository.save(avaliacao));
    }

    @Transactional
    public void deletar(UUID id) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Avaliação não encontrada"));
        Professor professor = obterProfessorAutenticado();
        validarAutoriaAvaliacao(avaliacao, professor);
        avaliacaoRepository.deleteById(id);
    }

    private Professor obterProfessorAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));
        return professorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new EntityNotFoundException("Professor não encontrado"));
    }

    private boolean isProfessorAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_TEACHER".equals(a.getAuthority()));
    }

    private void validarVinculoProfessorComAluno(Professor professor, UUID alunoId) {
        if (!isAlunoVinculadoAoProfessor(alunoId, professor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Professor não possui vínculo com o aluno informado");
        }
    }

    private boolean isAlunoVinculadoAoProfessor(UUID alunoId, UUID professorId) {
        return turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(alunoId)
                .stream()
                .map(TurmaAluno::getTurma)
                .anyMatch(turma -> turma != null
                        && turma.getProfessor() != null
                        && professorId.equals(turma.getProfessor().getId()));
    }

    private void validarAutoriaAvaliacao(Avaliacao avaliacao, Professor professor) {
        if (avaliacao.getProfessor() == null || !professor.getId().equals(avaliacao.getProfessor().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para alterar ou excluir esta avaliação");
        }
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
