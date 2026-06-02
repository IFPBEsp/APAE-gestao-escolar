package com.apae.gestao.service;

import com.apae.gestao.dto.aula.chamada.ChamadaResponseDTO;
import com.apae.gestao.dto.aula.chamada.PresencaAlunoDTO;
import com.apae.gestao.dto.aula.chamada.RegistrarChamadaRequestDTO;
import com.apae.gestao.entity.*;
import com.apae.gestao.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;


@Service
@RequiredArgsConstructor
public class PresencaService {

    private final PresencaRepository presencaRepository;
    private final AulaRepository aulaRepository;
    private final TurmaRepository turmaRepository;
    private final AlunoViewRepository alunoRepository;
    private final ObjectMapper objectMapper;


    @Transactional(readOnly = true)
    public ChamadaResponseDTO getChamadaPorTurmaEData(Long turmaId, LocalDate data) {
        try {
            String presenca = presencaRepository.getChamadaPorTurmaEData(turmaId, data);
            return objectMapper.readValue(presenca, ChamadaResponseDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar chamada: " + e.getMessage(), e);
        }
    }

    @Transactional
    public ChamadaResponseDTO registrarChamada(
            Long turmaId,
            LocalDate data,
            RegistrarChamadaRequestDTO request
    ) {


        validarDiadaSemana(data);

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

        validarDiadaSemana(data);

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

    private void validarDiadaSemana(LocalDate data) {
        DayOfWeek diaDaSemana = data.getDayOfWeek();
        if (diaDaSemana == DayOfWeek.SATURDAY || diaDaSemana == DayOfWeek.SUNDAY) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "O sistema não permite registrar aulas ou frequência aos sábados e domingos.");
        }
    }

}

