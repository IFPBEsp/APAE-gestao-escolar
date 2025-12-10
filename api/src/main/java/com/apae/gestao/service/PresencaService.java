package com.apae.gestao.service;

import com.apae.gestao.dto.ChamadaResponseDTO;
import com.apae.gestao.dto.PresencaAlunoDTO;
import com.apae.gestao.dto.RegistrarChamadaRequestDTO;
import com.apae.gestao.entity.*;
import com.apae.gestao.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PresencaService {

    private final PresencaRepository presencaRepository;
    private final AulaRepository aulaRepository;
    private final TurmaRepository turmaRepository;
    private final AlunoRepository alunoRepository;
    private final TurmaAlunoRepository turmaAlunoRepository;


    @Transactional(readOnly = true)
    public ChamadaResponseDTO getChamadaPorTurmaEData(Long turmaId, LocalDate data) {

        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com id: " + turmaId));

        Aula aula = aulaRepository.findByTurmaAndDataDaAula(turma, data).orElse(null);

        List<TurmaAluno> turmaAlunoList = turmaAlunoRepository.findByTurmaAndIsAlunoAtivo(turma,true);

        List<Aluno> alunosDaTurma = turmaAlunoList.stream().map(TurmaAluno::getAluno).toList();

        Map<Long, Presenca> presencasPorAluno = Map.of();
        if (aula != null) {
            presencasPorAluno = presencaRepository.findByAula(aula).stream()
            .collect(Collectors.toMap(p -> p.getAluno().getId(), p -> p));
        }

        List<PresencaAlunoDTO> listaPresencas = new ArrayList<>();

        for (Aluno aluno : alunosDaTurma) {

            Presenca presenca = presencasPorAluno.get(aluno.getId());

            PresencaAlunoDTO dto = PresencaAlunoDTO.builder()
                    .alunoId(aluno.getId())
                    .alunoNome(aluno.getNome())
                    .presencaId(presenca != null ? presenca.getId() : null)
                    .status(presenca != null
                            ? PresencaAlunoDTO.getStatusFromFaltou(presenca.getFaltou())
                            : PresencaAlunoDTO.StatusPresenca.PRESENTE)
                    .build();

            listaPresencas.add(dto);
        }

        ChamadaResponseDTO response = ChamadaResponseDTO.builder()
                .turmaId(turma.getId())
                .turmaNome(turma.getNome())
                .dataChamada(data)
                .descricao(aula != null ? aula.getDescricao() : null)
                .totalAlunosNaTurma(alunosDaTurma.size())
                .listaPresencas(listaPresencas)
                .build();

        response.calcularTotalPresentes();
        return response;
    }

    @Transactional
    public ChamadaResponseDTO registrarChamada(
            Long turmaId,
            LocalDate data,
            RegistrarChamadaRequestDTO request
    ) {

        Turma turma = turmaRepository.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com id: " + turmaId));

        Aula aula = aulaRepository.findByTurmaAndDataDaAula(turma, data)
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

    private Aula criarNovaAula(Turma turma, LocalDate data, String descricao) {
        Aula aula = Aula.builder()
                .turma(turma)
                .dataDaAula(data)
                .descricao(descricao)
                .build();
        return aulaRepository.save(aula);
    }

    @Transactional
    public void deletar(Long id) {
        if (!presencaRepository.existsById(id)) {
            throw new RuntimeException("Presença não encontrada com id: " + id);
        }
        presencaRepository.deleteById(id);
    }

    private void registrarOuAtualizarPresencaIndividual(
            Aula aula,
            RegistrarChamadaRequestDTO.PresencaItemDTO item
    ) {

        Aluno aluno = alunoRepository.findById(item.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com id: " + item.getAlunoId()));

        Presenca presenca = presencaRepository.findByAulaAndAluno(aula, aluno)
                .orElseGet(() -> Presenca.builder()
                        .aula(aula)
                        .aluno(aluno)
                        .build());

        presenca.setFaltou(item.getStatus() == PresencaAlunoDTO.StatusPresenca.FALTA);

        presencaRepository.save(presenca);
    }
}

