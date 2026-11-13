package com.apae.gestao.service;

import com.apae.gestao.dto.aula.chamada.ChamadaResponseDTO;
import com.apae.gestao.dto.aula.chamada.PresencaAlunoDTO;
import com.apae.gestao.dto.aula.chamada.RegistrarChamadaRequestDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Aula;
import com.apae.gestao.entity.Presenca;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.AulaRepository;
import com.apae.gestao.repository.PresencaRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import com.apae.gestao.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresencaService {

    private final PresencaRepository presencaRepository;
    private final AulaRepository aulaRepository;
    private final TurmaRepository turmaRepository;
    private final AlunoViewRepository alunoRepository;
    private final TurmaAlunoRepository turmaAlunoRepository;
    private final ProfessorRepository professorRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public ChamadaResponseDTO getChamadaPorTurmaEData(UUID turmaId, LocalDate data) {
        return montarChamada(turmaId, data);
    }

    @Transactional
    public ChamadaResponseDTO registrarChamada(UUID turmaId, LocalDate data, RegistrarChamadaRequestDTO request) {
        validarDiaDaSemana(data);

        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com id: " + turmaId));

        Professor professor = obterProfessorAutenticado();
        validarVinculoProfessorComTurma(professor, turma);

        Aula aula = aulaRepository.findByTurmaAndData(turma, data)
                .map(aulaExistente -> {
                    if (request.getDescricao() != null && !request.getDescricao().isBlank()) {
                        aulaExistente.setDescricao(request.getDescricao());
                        aulaRepository.save(aulaExistente);
                    }
                    return aulaExistente;
                })
                .orElseGet(() -> criarNovaAula(turma, data, request.getDescricao()));

        for (RegistrarChamadaRequestDTO.PresencaItemDTO item : request.getPresencas()) {
            registrarOuAtualizarPresencaIndividual(aula, item);
        }

        return montarChamada(turmaId, data);
    }

    @Transactional
    public void deletar(UUID id) {
        Presenca presenca = presencaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Presença não encontrada com id: " + id));
        Professor professor = obterProfessorAutenticado();
        if (presenca.getAula() == null || presenca.getAula().getTurma() == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para excluir esta presença");
        }
        validarVinculoProfessorComTurma(professor, presenca.getAula().getTurma());
        presencaRepository.deleteById(id);
    }

    private ChamadaResponseDTO montarChamada(UUID turmaId, LocalDate data) {
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com id: " + turmaId));
        if (isProfessorAutenticado()) {
            Professor professor = obterProfessorAutenticado();
            validarVinculoProfessorComTurma(professor, turma);
        }
        Aula aula = aulaRepository.findByTurmaAndData(turma, data).orElse(null);

        Map<UUID, Presenca> presencasPorPaciente = aula == null
                ? Map.of()
                : presencaRepository.findByAula(aula)
                        .stream()
                        .collect(Collectors.toMap(Presenca::getPacienteId, presenca -> presenca));

        ChamadaResponseDTO response = ChamadaResponseDTO.builder()
                .turmaId(turma.getId())
                .turmaNome(turma.getNome())
                .dataChamada(data)
                .descricao(aula != null ? aula.getDescricao() : null)
                .listaPresencas(turmaAlunoRepository.findByTurmaAndAtivoOrderByPacienteNomeAsc(turma, true)
                        .stream()
                        .map(turmaAluno -> toPresencaAluno(turmaAluno, presencasPorPaciente.get(turmaAluno.getPacienteId())))
                        .toList())
                .build();
        response.setTotalAlunosNaTurma(response.getListaPresencas().size());
        response.calcularTotalPresentes();
        return response;
    }

    private Aula criarNovaAula(Turma turma, LocalDate data, String descricao) {
        validarDiaDaSemana(data);
        Aula aula = Aula.builder()
                .turma(turma)
                .data(data)
                .descricao(descricao)
                .build();
        return aulaRepository.save(aula);
    }

    private void registrarOuAtualizarPresencaIndividual(Aula aula, RegistrarChamadaRequestDTO.PresencaItemDTO item) {
        alunoRepository.findById(item.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com id: " + item.getAlunoId()));

        TurmaAluno vinculo = turmaAlunoRepository.findByTurmaAndPacienteId(aula.getTurma(), item.getAlunoId())
                .orElse(null);
        if (vinculo == null || !Boolean.TRUE.equals(vinculo.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "O aluno informado não pertence a esta turma");
        }

        Presenca presenca = presencaRepository.findByAulaAndPacienteId(aula, item.getAlunoId())
                .orElseGet(() -> Presenca.builder()
                        .aula(aula)
                        .pacienteId(item.getAlunoId())
                        .build());

        presenca.setFaltou(item.getStatus() == PresencaAlunoDTO.StatusPresenca.FALTA);
        presencaRepository.save(presenca);
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

    private void validarVinculoProfessorComTurma(Professor professor, Turma turma) {
        if (turma.getProfessor() == null || !professor.getId().equals(turma.getProfessor().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Professor não possui vínculo com esta turma");
        }
    }

    private PresencaAlunoDTO toPresencaAluno(TurmaAluno turmaAluno, Presenca presenca) {
        AlunoView aluno = alunoRepository.findById(turmaAluno.getPacienteId()).orElse(null);
        boolean faltou = presenca != null && Boolean.TRUE.equals(presenca.getFaltou());
        return PresencaAlunoDTO.builder()
                .alunoId(turmaAluno.getPacienteId())
                .alunoNome(aluno != null ? aluno.getNomeCompleto() : null)
                .presencaId(presenca != null ? presenca.getId() : null)
                .status(faltou ? PresencaAlunoDTO.StatusPresenca.FALTA : PresencaAlunoDTO.StatusPresenca.PRESENTE)
                .build();
    }

    private void validarDiaDaSemana(LocalDate data) {
        DayOfWeek diaDaSemana = data.getDayOfWeek();
        if (diaDaSemana == DayOfWeek.SATURDAY || diaDaSemana == DayOfWeek.SUNDAY) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "O sistema não permite registrar aulas ou frequência aos sábados e domingos.");
        }
    }
}
