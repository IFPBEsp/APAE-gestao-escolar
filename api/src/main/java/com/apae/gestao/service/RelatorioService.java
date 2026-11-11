package com.apae.gestao.service;

import com.apae.gestao.dto.relatorio.RelatorioRequestDTO;
import com.apae.gestao.dto.relatorio.RelatorioResponseDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Relatorio;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.RelatorioRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class RelatorioService {

    private final RelatorioRepository relatorioRepository;
    private final AlunoViewRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final TurmaRepository turmaRepository;
    private final TurmaAlunoRepository turmaAlunoRepository;
    private final UsuarioRepository usuarioRepository;

    public RelatorioService(RelatorioRepository relatorioRepository,
                            AlunoViewRepository alunoRepository,
                            ProfessorRepository professorRepository,
                            TurmaRepository turmaRepository,
                            TurmaAlunoRepository turmaAlunoRepository,
                            UsuarioRepository usuarioRepository) {
        this.relatorioRepository = relatorioRepository;
        this.alunoRepository = alunoRepository;
        this.professorRepository = professorRepository;
        this.turmaRepository = turmaRepository;
        this.turmaAlunoRepository = turmaAlunoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<RelatorioResponseDTO> listarTodos() {
        List<Relatorio> relatorios = relatorioRepository.findAll();
        if (isProfessorAutenticado()) {
            Professor professor = obterProfessorAutenticado();
            return relatorios.stream()
                    .filter(r -> isRelatorioAcessivelPeloProfessor(r, professor))
                    .map(this::toResponseDTO)
                    .toList();
        }
        return relatorios.stream().map(this::toResponseDTO).toList();
    }

    @Transactional(readOnly = true)
    public RelatorioResponseDTO buscarPorId(UUID id) {
        Relatorio relatorio = relatorioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relatório não encontrado com ID: " + id));
        if (isProfessorAutenticado()) {
            Professor professor = obterProfessorAutenticado();
            if (!isRelatorioAcessivelPeloProfessor(relatorio, professor)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso negado a este relatório");
            }
        }
        return toResponseDTO(relatorio);
    }

    @Transactional
    public RelatorioResponseDTO criar(RelatorioRequestDTO request) {
        alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + request.getAlunoId()));
        Professor professor = obterProfessorAutenticado();
        Turma turma = turmaRepository.findById(request.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + request.getTurmaId()));

        validarVinculoProfessorTurmaEAluno(professor, turma, request.getAlunoId());

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

        Professor professor = obterProfessorAutenticado();
        validarAutoriaRelatorio(relatorio, professor);

        alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com ID: " + request.getAlunoId()));
        Turma turma = turmaRepository.findById(request.getTurmaId())
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + request.getTurmaId()));

        validarVinculoProfessorTurmaEAluno(professor, turma, request.getAlunoId());

        mapearRequest(request, relatorio);
        relatorio.setPacienteId(request.getAlunoId());
        relatorio.setProfessor(professor);
        relatorio.setTurma(turma);

        return toResponseDTO(relatorioRepository.save(relatorio));
    }

    @Transactional
    public void deletar(UUID id) {
        Relatorio relatorio = relatorioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Relatório não encontrado com ID: " + id));
        Professor professor = obterProfessorAutenticado();
        validarAutoriaRelatorio(relatorio, professor);
        relatorioRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<RelatorioResponseDTO> buscarPorAluno(UUID alunoId) {
        if (isProfessorAutenticado()) {
            Professor professor = obterProfessorAutenticado();
            if (!isAlunoVinculadoAoProfessor(alunoId, professor.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Professor não possui vínculo com o aluno informado");
            }
        }
        return relatorioRepository.findByPacienteId(alunoId)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    private Professor obterProfessorAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado");
        }
        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
        return professorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
    }

    private boolean isProfessorAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }
        return authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_TEACHER".equals(a.getAuthority()));
    }

    private void validarVinculoProfessorTurmaEAluno(Professor professor, Turma turma, UUID alunoId) {
        if (turma.getProfessor() == null || !professor.getId().equals(turma.getProfessor().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Professor não possui vínculo com a turma informada");
        }
        TurmaAluno vinculo = turmaAlunoRepository.findByTurmaAndPacienteId(turma, alunoId).orElse(null);
        if (vinculo == null || !Boolean.TRUE.equals(vinculo.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "O aluno informado não possui vínculo ativo com esta turma");
        }
    }

    private void validarAutoriaRelatorio(Relatorio relatorio, Professor professor) {
        if (relatorio.getProfessor() == null || !professor.getId().equals(relatorio.getProfessor().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para alterar ou excluir este relatório");
        }
    }

    private boolean isRelatorioAcessivelPeloProfessor(Relatorio relatorio, Professor professor) {
        if (relatorio.getProfessor() != null && professor.getId().equals(relatorio.getProfessor().getId())) {
            return true;
        }
        if (relatorio.getTurma() != null && relatorio.getTurma().getProfessor() != null
                && professor.getId().equals(relatorio.getTurma().getProfessor().getId())) {
            return true;
        }
        return isAlunoVinculadoAoProfessor(relatorio.getPacienteId(), professor.getId());
    }

    private boolean isAlunoVinculadoAoProfessor(UUID alunoId, UUID professorId) {
        return turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(alunoId)
                .stream()
                .map(TurmaAluno::getTurma)
                .anyMatch(turma -> turma != null
                        && turma.getProfessor() != null
                        && professorId.equals(turma.getProfessor().getId()));
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
