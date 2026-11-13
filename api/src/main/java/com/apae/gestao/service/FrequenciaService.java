package com.apae.gestao.service;

import com.apae.gestao.dto.aluno.AlunoFrequenciaResumoDTO;
import com.apae.gestao.dto.aula.AulaPresencaAlunoResponseDTO;
import com.apae.gestao.dto.turma.TurmaResumoFrequenciaDTO;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class FrequenciaService {

    private final TurmaRepository turmaRepository;
    private final AlunoViewRepository alunoRepository;
    private final TurmaAlunoRepository turmaAlunoRepository;
    private final ProfessorRepository professorRepository;
    private final UsuarioRepository usuarioRepository;

    public FrequenciaService(TurmaRepository turmaRepository,
                             AlunoViewRepository alunoRepository,
                             TurmaAlunoRepository turmaAlunoRepository,
                             ProfessorRepository professorRepository,
                             UsuarioRepository usuarioRepository) {
        this.turmaRepository = turmaRepository;
        this.alunoRepository = alunoRepository;
        this.turmaAlunoRepository = turmaAlunoRepository;
        this.professorRepository = professorRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public TurmaResumoFrequenciaDTO getResumoTurma(UUID turmaId) {
        validarAcessoProfessorNaTurma(turmaId);
        return turmaRepository.getResumoFrequenciaTurma(turmaId);
    }

    @Transactional
    public Page<AlunoFrequenciaResumoDTO> listarAlunos(UUID turmaId, Pageable pageable) {
        validarAcessoProfessorNaTurma(turmaId);
        return alunoRepository.listarFrequenciaAlunosDaTurma(turmaId, pageable);
    }

    @Transactional
    public Page<AulaPresencaAlunoResponseDTO> getHistoricoIndividualAluno(UUID alunoId, Pageable pageable) {
        validarAcessoProfessorAoAluno(alunoId);
        return alunoRepository.listarHistoricoAluno(alunoId, pageable);
    }

    private void validarAcessoProfessorNaTurma(UUID turmaId) {
        if (!isProfessorAutenticado()) {
            return;
        }
        Professor professor = obterProfessorAutenticado();
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        if (turma.getProfessor() == null || !professor.getId().equals(turma.getProfessor().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Professor não possui vínculo com esta turma");
        }
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
}
