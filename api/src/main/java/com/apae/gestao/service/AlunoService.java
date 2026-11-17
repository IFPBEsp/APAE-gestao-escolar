package com.apae.gestao.service;

import com.apae.gestao.dto.aluno.AlunoDetalhesDTO;
import com.apae.gestao.dto.aluno.AlunoResumoDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaHistoricoItemDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaHistoricoResponseDTO;
import com.apae.gestao.dto.aluno.AlunoTurmaRequestDTO;
import com.apae.gestao.dto.avaliacao.AvaliacaoHistoricoResponseDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.AvaliacaoRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class AlunoService {

    private final AlunoViewRepository alunoRepository;
    private final TurmaRepository turmaRepository;
    private final TurmaAlunoRepository turmaAlunoRepository;
    private final AvaliacaoRepository avaliacaoRepository;
    private final ProfessorRepository professorRepository;
    private final UsuarioRepository usuarioRepository;

    public AlunoService(AlunoViewRepository alunoRepository,
                        TurmaRepository turmaRepository,
                        TurmaAlunoRepository turmaAlunoRepository,
                        AvaliacaoRepository avaliacaoRepository,
                        ProfessorRepository professorRepository,
                        UsuarioRepository usuarioRepository) {
        this.alunoRepository = alunoRepository;
        this.turmaRepository = turmaRepository;
        this.turmaAlunoRepository = turmaAlunoRepository;
        this.avaliacaoRepository = avaliacaoRepository;
        this.professorRepository = professorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public Page<AlunoResumoDTO> listarAlunosPorNome(String nome, Boolean apenasAtivos, Pageable pageable) {
        String filtroNome = nome == null ? "" : nome.trim();
        return Boolean.TRUE.equals(apenasAtivos)
                ? alunoRepository.listarAlunosAtivosPorFiltro(filtroNome, pageable)
                : alunoRepository.listarAlunosPorFiltro(filtroNome, pageable);
    }

    @Transactional(readOnly = true)
    public AlunoDetalhesDTO buscarPorId(UUID id) {
        AlunoView aluno = buscarAluno(id);
        validarAcessoProfessorAoAluno(id);
        return new AlunoDetalhesDTO(aluno, turmaAtual(id));
    }

    @Transactional
    public AlunoDetalhesDTO atualizarTurma(UUID pacienteId, AlunoTurmaRequestDTO dto) {
        AlunoView aluno = buscarAluno(pacienteId);
        Turma novaTurma = turmaRepository.findById(dto.getNovaTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada"));

        if (!Boolean.TRUE.equals(novaTurma.getAtiva())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Não é possível adicionar aluno em uma turma inativa");
        }

        turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)
                .forEach(ta -> {
                    ta.setAtivo(false);
                    turmaAlunoRepository.save(ta);
                });

        TurmaAluno vinculo = turmaAlunoRepository.findByTurmaAndPacienteId(novaTurma, pacienteId)
                .orElseGet(() -> {
                    TurmaAluno novo = new TurmaAluno();
                    novo.setTurma(novaTurma);
                    novo.setPacienteId(pacienteId);
                    return novo;
                });
        vinculo.setAtivo(true);
        turmaAlunoRepository.save(vinculo);

        return new AlunoDetalhesDTO(aluno, novaTurma);
    }

    @Transactional(readOnly = true)
    public List<AlunoTurmaHistoricoResponseDTO> buscarHistoricoTurmasPorAlunoId(UUID id) {
        buscarAluno(id);
        validarAcessoProfessorAoAluno(id);
        return turmaAlunoRepository.findHistoricoCompletoPorPaciente(id)
                .stream()
                .map(AlunoTurmaHistoricoResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AvaliacaoHistoricoResponseDTO> buscarAvaliacoesPorAlunoId(UUID id) {
        buscarAluno(id);
        validarAcessoProfessorAoAluno(id);
        String turmaAtual = turmaAtual(id) != null ? turmaAtual(id).getNome() : "Sem turma ativa";

        return avaliacaoRepository.findByPacienteIdOrderByDataAvaliacaoDesc(id)
                .stream()
                .map(avaliacao -> AvaliacaoHistoricoResponseDTO.fromEntity(
                        avaliacao,
                        nomeProfessor(avaliacao.getProfessor()),
                        turmaAtual
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AlunoTurmaHistoricoItemDTO> listarHistoricoTurmasPorAlunoId(UUID pacienteId) {
        buscarAluno(pacienteId);
        validarAcessoProfessorAoAluno(pacienteId);
        return turmaAlunoRepository.findAllHistoricoByPaciente(pacienteId)
                .stream()
                .map(AlunoTurmaHistoricoItemDTO::new)
                .toList();
    }

    private AlunoView buscarAluno(UUID id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

    private void validarAcessoProfessorAoAluno(UUID alunoId) {
        if (!isProfessorAutenticado()) {
            return;
        }
        Professor professor = obterProfessorAutenticado();
        boolean vinculado = turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(alunoId)
                .stream()
                .map(TurmaAluno::getTurma)
                .anyMatch(turma -> turma != null
                        && turma.getProfessor() != null
                        && professor.getId().equals(turma.getProfessor().getId()));
        if (!vinculado) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Professor não possui vínculo com este aluno");
        }
    }

    private Professor obterProfessorAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Professor autenticado não encontrado"));
        return professorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Professor autenticado não encontrado"));
    }

    private boolean isProfessorAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_TEACHER".equals(a.getAuthority()));
    }

    private Turma turmaAtual(UUID pacienteId) {
        return turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)
                .stream()
                .findFirst()
                .map(TurmaAluno::getTurma)
                .orElse(null);
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
