package com.apae.gestao.service;

import com.apae.gestao.dto.turma.TurmaRequestDTO;
import com.apae.gestao.dto.turma.TurmaResponseDTO;
import com.apae.gestao.dto.turma.TurmaResumoDTO;
import com.apae.gestao.dto.turmaAluno.TurmaAlunoResponseDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.UsuarioRepository;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.dto.professor.ProfessorResumoDTO;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class TurmaService {

    private final TurmaRepository turmaRepository;
    private final AlunoViewRepository alunoRepository;
    private final TurmaAlunoRepository turmaAlunoRepository;
    private final ProfessorRepository professorRepository;
    private final UsuarioRepository usuarioRepository;

    public TurmaService(TurmaRepository turmaRepository,
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

    @Transactional(readOnly = true)
    public List<TurmaResumoDTO> listarTurmas(UUID id, String nome, Integer anoCriacao, String turno, String tipo, Boolean ativa) {
        return turmaRepository.findAll()
                .stream()
                .filter(turma -> id == null || id.equals(turma.getId()))
                .filter(turma -> nome == null || turma.getNome().toLowerCase().contains(nome.toLowerCase()))
                .filter(turma -> anoCriacao == null || anoCriacao.equals(turma.getAnoCriacao()))
                .filter(turma -> turno == null || turno.equalsIgnoreCase(turma.getTurno()))
                .filter(turma -> tipo == null || tipo.equalsIgnoreCase(turma.getTipo()))
                .filter(turma -> ativa == null || ativa.equals(turma.getAtiva()))
                .map(this::toResumo)
                .toList();
    }

    @Transactional(readOnly = true)
    public TurmaResumoDTO buscarTurmaResumidaPorId(UUID id) {
        return toResumo(buscarTurma(id));
    }

    @Transactional
    public TurmaResponseDTO criar(TurmaRequestDTO dto) {
        Turma turma = new Turma();
        mapearDtoParaEntity(dto, turma);
        turma.setNome(obterNomeUnicoParaTurma(turma.getNome(), null));
        Turma salvo = turmaRepository.save(turma);
        vincularAlunosDoDto(salvo, dto.getAlunosIds());
        return toResponse(buscarTurma(salvo.getId()));
    }

    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> listarTodas() {
        return turmaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TurmaResponseDTO buscarPorId(UUID turmaId) {
        return toResponse(buscarTurma(turmaId));
    }

    @Transactional
    public TurmaResponseDTO atualizar(UUID turmaId, TurmaRequestDTO dto) {
        Turma turma = buscarTurma(turmaId);
        mapearDtoParaEntity(dto, turma);
        turma.setNome(obterNomeUnicoParaTurma(turma.getNome(), turma.getId()));
        Turma atualizado = turmaRepository.save(turma);
        vincularAlunosDoDto(atualizado, dto.getAlunosIds());
        return toResponse(buscarTurma(atualizado.getId()));
    }

    @Transactional
    public void deletarPorId(UUID turmaId) {
        turmaRepository.delete(buscarTurma(turmaId));
    }

    @Transactional
    public TurmaResponseDTO ativarTurma(UUID turmaId) {
        Turma turma = buscarTurma(turmaId);
        turma.setAtiva(true);

        if (turma.getTurmaAlunos() != null) {
            turma.getTurmaAlunos().forEach(turmaAluno -> {
                if (!isPacienteAtivoEmOutraTurma(turmaAluno.getPacienteId(), turmaId)) {
                    turmaAluno.setAtivo(true);
                }
            });
        }

        return toResponse(turmaRepository.save(turma));
    }

    @Transactional
    public TurmaResponseDTO desativarTurma(UUID turmaId) {
        Turma turma = buscarTurma(turmaId);
        turma.setAtiva(false);

        if (turma.getTurmaAlunos() != null) {
            turma.getTurmaAlunos().forEach(turmaAluno -> turmaAluno.setAtivo(false));
        }

        return toResponse(turmaRepository.save(turma));
    }

    @Transactional
    public TurmaResponseDTO adicionarAlunos(UUID turmaId, List<UUID> pacienteIds) {
        Turma turma = buscarTurma(turmaId);
        validarTurmaAtiva(turma);
        validarPacientesExistem(pacienteIds);
        validarPacientesNaoAtivosEmOutrasTurmas(pacienteIds, turmaId);
        vincularOuReativarPacientes(turma, pacienteIds);
        return toResponse(turmaRepository.save(turma));
    }

    @Transactional
    public TurmaResponseDTO adicionarProfessor(UUID turmaId, UUID professorId) {
        Turma turma = buscarTurma(turmaId);
        validarTurmaAtiva(turma);
        
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));
                
        turma.setProfessor(professor);
        return toResponse(turmaRepository.save(turma));
    }

    @Transactional
    public TurmaResponseDTO removerProfessor(UUID turmaId) {
        Turma turma = buscarTurma(turmaId);
        turma.setProfessor(null);
        return toResponse(turmaRepository.save(turma));
    }

    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunos(UUID turmaId) {
        return turmaAlunoRepository.findByTurmaIdOrderByPacienteNomeAsc(turmaId)
                .stream()
                .map(this::toTurmaAlunoResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunosAtivos(UUID turmaId) {
        Turma turma = buscarTurma(turmaId);
        return turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true)
                .stream()
                .map(this::toTurmaAlunoResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunosInativos(UUID turmaId) {
        Turma turma = buscarTurma(turmaId);
        return turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, false)
                .stream()
                .map(this::toTurmaAlunoResponse)
                .toList();
    }

    @Transactional
    public void ativarAluno(UUID turmaId, UUID pacienteId) {
        alterarStatus(turmaId, pacienteId, true);
    }

    @Transactional
    public void desativarAluno(UUID turmaId, UUID pacienteId) {
        alterarStatus(turmaId, pacienteId, false);
    }

    private void alterarStatus(UUID turmaId, UUID pacienteId, boolean ativo) {
        Turma turma = buscarTurma(turmaId);
        if (ativo) {
            validarTurmaAtiva(turma);
            if (isPacienteAtivoEmOutraTurma(pacienteId, turmaId)) {
                String nome = alunoRepository.findById(pacienteId).map(AlunoView::getNomeCompleto).orElse(pacienteId.toString());
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                        "Não foi possível ativar. O aluno " + nome + " já está ativo em outra turma.");
            }
        }

        TurmaAluno turmaAluno = turmaAlunoRepository.findByTurmaAndPacienteId(turma, pacienteId)
                .orElseThrow(() -> new RuntimeException("O aluno não pertence a esta turma."));
        turmaAluno.setAtivo(ativo);
        turmaAlunoRepository.save(turmaAluno);
    }

    private void mapearDtoParaEntity(TurmaRequestDTO dto, Turma turma) {
        turma.setAnoCriacao(dto.getAnoCriacao());
        turma.setTurno(dto.getTurno());
        turma.setTipo(dto.getTipo());

        String tipo = dto.getTipo() != null ? dto.getTipo() : "";
        String turno = dto.getTurno() != null && !dto.getTurno().isBlank()
                ? dto.getTurno().substring(0, 1).toUpperCase() + dto.getTurno().substring(1).toLowerCase()
                : "";
        turma.setNome(tipo + " " + turno + " - " + dto.getAnoCriacao());

        if (dto.getAtiva() != null) {
            turma.setAtiva(dto.getAtiva());
        }
    }

    private void vincularAlunosDoDto(Turma turma, Set<UUID> novosIds) {
        if (novosIds == null) {
            return;
        }

        if (!novosIds.isEmpty()) {
            validarTurmaAtiva(turma);
            validarPacientesExistem(novosIds.stream().toList());
            validarPacientesNaoAtivosEmOutrasTurmas(novosIds.stream().toList(), turma.getId());
        }

        turma.getTurmaAlunos().stream()
                .filter(ta -> Boolean.TRUE.equals(ta.getAtivo()))
                .filter(ta -> !novosIds.contains(ta.getPacienteId()))
                .forEach(ta -> ta.setAtivo(false));

        vincularOuReativarPacientes(turma, novosIds.stream().toList());
        turmaRepository.save(turma);
    }

    private void vincularOuReativarPacientes(Turma turma, List<UUID> pacienteIds) {
        for (UUID pacienteId : pacienteIds) {
            TurmaAluno vinculo = turmaAlunoRepository.findByTurmaAndPacienteId(turma, pacienteId).orElse(null);
            if (vinculo != null) {
                vinculo.setAtivo(true);
            } else {
                turma.addAluno(pacienteId, true);
            }
        }
    }

    private boolean isPacienteAtivoEmOutraTurma(UUID pacienteId, UUID turmaIdAtual) {
        return turmaAlunoRepository.findAllByPacienteIdAndAtivoTrue(pacienteId)
                .stream()
                .anyMatch(ta -> turmaIdAtual == null || !ta.getTurma().getId().equals(turmaIdAtual));
    }

    private void validarPacientesNaoAtivosEmOutrasTurmas(List<UUID> pacienteIds, UUID turmaIdAtual) {
        List<String> alunosInvalidos = pacienteIds.stream()
                .filter(pacienteId -> isPacienteAtivoEmOutraTurma(pacienteId, turmaIdAtual))
                .map(pacienteId -> alunoRepository.findById(pacienteId).map(AlunoView::getNomeCompleto).orElse(pacienteId.toString()))
                .toList();

        if (!alunosInvalidos.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_ENTITY,
                    "Operação cancelada. Os seguintes alunos já estão ativos em outra turma: " + String.join(", ", alunosInvalidos)
            );
        }
    }

    private void validarPacientesExistem(List<UUID> pacienteIds) {
        if (alunoRepository.findAllById(pacienteIds).size() != pacienteIds.size()) {
            throw new RuntimeException("Um ou mais IDs de aluno não foram encontrados.");
        }
    }

    private void validarTurmaAtiva(Turma turma) {
        if (!Boolean.TRUE.equals(turma.getAtiva())) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Não é possível adicionar aluno em uma turma inativa");
        }
    }

    private Turma buscarTurma(UUID turmaId) {
        return turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
    }

    private String obterNomeUnicoParaTurma(String nomeBase, UUID excludeId) {
        boolean nomeExiste = excludeId == null
                ? turmaRepository.existsByNome(nomeBase)
                : turmaRepository.existsByNomeAndIdNot(nomeBase, excludeId);

        if (!nomeExiste) {
            return nomeBase;
        }
        int sufixo = 2;
        String nomeCandidato;
        do {
            nomeCandidato = nomeBase + " (" + sufixo + ")";
            sufixo++;
            nomeExiste = excludeId == null
                    ? turmaRepository.existsByNome(nomeCandidato)
                    : turmaRepository.existsByNomeAndIdNot(nomeCandidato, excludeId);
        } while (nomeExiste);
        return nomeCandidato;
    }

    private TurmaResumoDTO toResumo(Turma turma) {
        long totalAlunos = turma.getTurmaAlunos() == null ? 0 : turma.getTurmaAlunos().size();
        long totalAtivos = turma.getTurmaAlunos() == null ? 0 : turma.getTurmaAlunos().stream().filter(ta -> Boolean.TRUE.equals(ta.getAtivo())).count();
        return new TurmaResumoDTO(
                turma.getId(),
                turma.getNome(),
                turma.getAnoCriacao(),
                turma.getTurno(),
                turma.getTipo(),
                turma.getAtiva(),
                totalAlunos,
                totalAtivos,
                horarioPorTurno(turma.getTurno()),
                mapProfessorResumo(turma.getProfessor())
        );
    }

    private TurmaResponseDTO toResponse(Turma turma) {
        return new TurmaResponseDTO(turma, mapProfessorResumo(turma.getProfessor()));
    }

    private ProfessorResumoDTO mapProfessorResumo(Professor professor) {
        if (professor == null) {
            return null;
        }
        Usuario usuario = usuarioRepository.findById(professor.getUsuarioId()).orElse(null);
        if (usuario == null) {
            return null;
        }
        return new ProfessorResumoDTO(
                professor.getId(),
                usuario.getId(),
                usuario.getNomeCompleto(),
                usuario.getCpf(),
                usuario.getEmail(),
                usuario.getAtivo(),
                usuario.getTelefone(),
                professor.getFormacao(),
                professor.getDataContratacao(),
                professor.getDataNascimento(),
                null,
                professor.getPrimeiroAcesso()
        );
    }

    private TurmaAlunoResponseDTO toTurmaAlunoResponse(TurmaAluno turmaAluno) {
        AlunoView aluno = alunoRepository.findById(turmaAluno.getPacienteId()).orElse(null);
        return new TurmaAlunoResponseDTO(turmaAluno, aluno);
    }

    private static String horarioPorTurno(String turno) {
        if (turno == null) {
            return "Horário não definido";
        }
        return switch (turno.toUpperCase()) {
            case "MANHA" -> "Segunda a Sexta - 8h as 12h";
            case "TARDE" -> "Segunda a Sexta - 14h as 18h";
            default -> "Horário não definido";
        };
    }
}
