package com.apae.gestao.service;

import com.apae.gestao.dto.aula.chamada.ChamadaResponseDTO;
import com.apae.gestao.dto.aula.chamada.PresencaAlunoDTO;
import com.apae.gestao.dto.aula.chamada.RegistrarChamadaRequestDTO;
import com.apae.gestao.entity.AlunoView;
import com.apae.gestao.entity.Aula;
import com.apae.gestao.entity.Presenca;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.repository.AlunoViewRepository;
import com.apae.gestao.repository.AulaRepository;
import com.apae.gestao.repository.PresencaRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @Transactional(readOnly = true)
    public ChamadaResponseDTO getChamadaPorTurmaEData(UUID turmaId, LocalDate data) {
        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com id: " + turmaId));
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

    @Transactional
    public ChamadaResponseDTO registrarChamada(UUID turmaId, LocalDate data, RegistrarChamadaRequestDTO request) {
        validarDiaDaSemana(data);

        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com id: " + turmaId));

        Aula aula = aulaRepository.findByTurmaAndData(turma, data)
                .orElseGet(() -> criarNovaAula(turma, data, request.getDescricao()));

        if (request.getDescricao() != null && !request.getDescricao().isBlank()) {
            aula.setDescricao(request.getDescricao());
            aulaRepository.save(aula);
        }

        for (RegistrarChamadaRequestDTO.PresencaItemDTO item : request.getPresencas()) {
            registrarOuAtualizarPresencaIndividual(aula, item);
        }

        return getChamadaPorTurmaEData(turmaId, data);
    }

    @Transactional
    public void deletar(UUID id) {
        if (!presencaRepository.existsById(id)) {
            throw new RuntimeException("Presença não encontrada com id: " + id);
        }
        presencaRepository.deleteById(id);
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

        Presenca presenca = presencaRepository.findByAulaAndPacienteId(aula, item.getAlunoId())
                .orElseGet(() -> Presenca.builder()
                        .aula(aula)
                        .pacienteId(item.getAlunoId())
                        .build());

        presenca.setFaltou(item.getStatus() == PresencaAlunoDTO.StatusPresenca.FALTA);
        presencaRepository.save(presenca);
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
