package com.apae.gestao.service;

import java.util.List;
import java.util.stream.Collectors;

import com.apae.gestao.dto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.apae.gestao.entity.Aluno;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Turma;
import com.apae.gestao.entity.TurmaAluno;
import com.apae.gestao.repository.AlunoRepository;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaAlunoRepository;
import com.apae.gestao.repository.TurmaRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TurmaService {
    @Autowired
    private TurmaRepository turmaDAO;

    @Autowired
    private ProfessorRepository professorDAO;

    @Autowired
    private AlunoRepository alunoDAO;

    @Autowired
    private TurmaAlunoRepository turmaAlunoDAO;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional(readOnly = true)
    public List<TurmaResumoDTO> listarTurmas(
            Long id,
            String nome,
            Integer anoCriacao,
            String turno,
            String tipo,
            Boolean isAtiva,
            Long professorId) {

        String jsonResult = turmaDAO.listarTurmasJson(
                id, nome, anoCriacao, turno, tipo, isAtiva, professorId
        );

        return parseJsonToList(jsonResult);
    }

    @Transactional(readOnly = true)
    public TurmaResumoDTO buscarTurmaResumidaPorId(Long id) {
        String jsonResult = turmaDAO.listarTurmasJson(
                id, null, null, null, null, null, null
        );

        List<TurmaResumoDTO> turmas = parseJsonToList(jsonResult);

        if (turmas.isEmpty()) {
            throw new RuntimeException("Turma não encontrada com ID: " + id);
        }

        return turmas.get(0);
    }

    private List<TurmaResumoDTO> parseJsonToList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<TurmaResumoDTO>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao processar JSON de turmas", e);
        }
    }

    @Transactional
    public TurmaResponseDTO criar(TurmaRequestDTO dto) {
        Turma turma = new Turma();
        mapearDtoParaEntity(dto, turma);
        Turma salvo = turmaDAO.save(turma);
        return new TurmaResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<TurmaResponseDTO> listarTodas() {
        return turmaDAO.findAll()
                .stream()
                .map(TurmaResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TurmaResponseDTO buscarPorId(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        return new TurmaResponseDTO(turma);
    }

    @Transactional
    public TurmaResponseDTO atualizar(Long turmaId, TurmaRequestDTO dto) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        mapearDtoParaEntity(dto, turma);
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public void deletarPorId(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));
        turmaDAO.delete(turma);
    }

    @Transactional
    public TurmaResponseDTO vincularProfessoresATurma(Long turmaId, Long professorId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        Professor professor = professorDAO.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + professorId));

        turma.setProfessor(professor);
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public TurmaResponseDTO ativarTurma(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        turma.setIsAtiva(true);
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public TurmaResponseDTO desativarTurma(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        turma.setIsAtiva(false);
        Turma atualizado = turmaDAO.save(turma);
        return new TurmaResponseDTO(atualizado);
    }

    @Transactional
    public TurmaResponseDTO adicionarAlunos(Long turmaId, List<Long> alunoIds) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada com ID: " + turmaId));

        List<Aluno> alunos = alunoDAO.findAllById(alunoIds);

        if (alunos.size() != alunoIds.size()) {
            throw new RuntimeException("Um ou mais IDs de aluno não foram encontrados.");
        }

        for (Aluno aluno : alunos) {
            turma.addAluno(aluno, true);
        }

        Turma atualizada = turmaDAO.save(turma);

        return turmaDAO.findByIdWithDetails(atualizada.getId())
                .map(TurmaResponseDTO::new)
                .orElse(new TurmaResponseDTO(atualizada));
    }

    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunos(Long turmaId) {
        return turmaAlunoDAO.findByTurmaId(turmaId)
                .stream()
                .map(TurmaAlunoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunosAtivos(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        return turmaAlunoDAO.findByTurmaAndIsAlunoAtivo(turma, true)
                .stream()
                .map(TurmaAlunoResponseDTO::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TurmaAlunoResponseDTO> listarAlunosInativos(Long turmaId) {
        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        return turmaAlunoDAO.findByTurmaAndIsAlunoAtivo(turma, false)
                .stream()
                .map(TurmaAlunoResponseDTO::new)
                .toList();
    }

    @Transactional
    public void ativarAluno(Long turmaId, Long alunoId) {
        alterarStatus(turmaId, alunoId, true);
    }

    @Transactional
    public void desativarAluno(Long turmaId, Long alunoId) {
        alterarStatus(turmaId, alunoId, false);
    }

    private void alterarStatus(Long turmaId, Long alunoId, boolean ativo) {

        Turma turma = turmaDAO.findById(turmaId)
                .orElseThrow(() -> new RuntimeException("Turma não encontrada."));

        Aluno aluno = alunoDAO.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado."));

        TurmaAluno turmaAluno = turmaAlunoDAO.findByTurmaAndAluno(turma, aluno)
                .orElseThrow(() -> new RuntimeException("O aluno não pertence a esta turma."));

        turmaAluno.setIsAlunoAtivo(ativo);
        turmaAlunoDAO.save(turmaAluno);
    }

    private void mapearDtoParaEntity(TurmaRequestDTO dto, Turma turma) {
        turma.setAnoCriacao(dto.getAnoCriacao());
        turma.setTurno(dto.getTurno());
        turma.setTipo(dto.getTipo());
        turma.setNome(dto.getTipo() + " " + dto.getAnoCriacao() + " " + dto.getTurno());

        if (dto.getIsAtiva() != null) {
            turma.setIsAtiva(dto.getIsAtiva());
        }

        if (dto.getProfessorId() != null) {
            Professor professor = professorDAO.findById(dto.getProfessorId())
                    .orElseThrow(() -> new RuntimeException("Professor não encontrado"));
            turma.setProfessor(professor);
        }

        if (dto.getAlunosIds() != null && !dto.getAlunosIds().isEmpty()) {
            List<Aluno> alunos = alunoDAO.findAllById(dto.getAlunosIds());

            for (Aluno aluno : alunos) {
                boolean alunoJaExiste = turma.getTurmaAlunos().stream()
                        .anyMatch(ta -> ta.getAluno().getId().equals(aluno.getId()));
                if (!alunoJaExiste) {
                    turma.addAluno(aluno, true);
                }
            }
        }
    }
}
