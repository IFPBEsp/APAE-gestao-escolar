package com.apae.gestao.service;

import com.apae.gestao.dto.*;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.exception.ConflitoDeDadosException;
import com.apae.gestao.exception.RecursoNaoEncontradoException;
import com.apae.gestao.repository.ProfessorRepository;

import com.apae.gestao.repository.TurmaRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private TurmaRepository turmaRepository;

    private final ObjectMapper objectMapper;

    public ProfessorService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Transactional(readOnly = true)
    public List<ProfessorResumoDTO> listarProfessores(
            Long id,
            String nome,
            String cpf,
            String email,
            Boolean ativo) {

        String jsonResult = professorRepository.listarProfessoresJson(
                id, nome, cpf, email, ativo
        );

        return parseJsonToList(jsonResult);
    }

    @Transactional(readOnly = true)
    public ProfessorResumoDTO buscarPorIdResumido(Long id) {
        String jsonResult = professorRepository.listarProfessoresJson(
                id, null, null, null, null
        );

        List<ProfessorResumoDTO> professores = parseJsonToList(jsonResult);

        if (professores.isEmpty()) {
            throw new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id);
        }

        return professores.get(0);
    }

    private List<ProfessorResumoDTO> parseJsonToList(String json) {
        try {
            if (json == null || json.isBlank()) {
                return List.of();
            }
            return objectMapper.readValue(json, new TypeReference<List<ProfessorResumoDTO>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao processar JSON de professores", e);
        }
    }

    private List<TurmaResumoDTO> parseJsonTurmasToList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<TurmaResumoDTO>>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao processar JSON de turmas", e);
        }
    }

    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarPorId(Long id) {
        Professor professor = professorRepository.findByIdWithTurmas(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id));
        return new ProfessorResponseDTO(professor);
    }

    @Transactional
    public ProfessorResponseDTO criar(ProfessorRequestDTO dto) {
        validarCpfUnico(dto.getCpf(), null);
        validarEmailUnico(dto.getEmail(), null);

        Professor professor = new Professor();
        mapearDtoParaEntity(dto, professor);
        professor.setAtivo(true);
        Professor salvo = professorRepository.save(professor);

        return professorRepository.findByIdWithTurmas(salvo.getId())
                .map(ProfessorResponseDTO::new)
                .orElse(new ProfessorResponseDTO(salvo));
    }

    @Transactional
    public ProfessorResponseDTO atualizar(Long id, ProfessorRequestDTO dto) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id));

        validarCpfUnico(dto.getCpf(), id);
        validarEmailUnico(dto.getEmail(), id);

        mapearDtoParaEntity(dto, professor);

        Professor atualizado = professorRepository.save(professor);

        return professorRepository.findByIdWithTurmas(atualizado.getId())
                .map(ProfessorResponseDTO::new)
                .orElse(new ProfessorResponseDTO(atualizado));
    }

    @Transactional
    public ProfessorResponseDTO inativar(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id));

        professor.setAtivo(false);
        Professor salvo = professorRepository.save(professor);

        return professorRepository.findByIdWithTurmas(salvo.getId())
                .map(ProfessorResponseDTO::new)
                .orElse(new ProfessorResponseDTO(salvo));
    }

    @Transactional
    public ProfessorResponseDTO reativarProfessor(Long id) {
        Professor professor = professorRepository.findByIdWithTurmas(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id));

        professor.setAtivo(true);
        Professor salvo = professorRepository.save(professor);
        return new ProfessorResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<TurmaResumoDTO> getTurmasDeProfessor(Long id) {
        String jsonResult = turmaRepository.listarTurmasOtimizadoPorProfessor(id);
        return parseJsonTurmasToList(jsonResult);
    }

    private void mapearDtoParaEntity(ProfessorRequestDTO dto, Professor professor) {
        professor.setNome(dto.getNome());
        professor.setCpf(dto.getCpf());
        professor.setEmail(dto.getEmail());
        professor.setTelefone(dto.getTelefone());
        professor.setDataNascimento(dto.getDataNascimento());
        professor.setFormacao(dto.getFormacao());
        professor.setDataContratacao(dto.getDataContratacao());
        professor.setEndereco(dto.getEndereco());
    }

    private void validarCpfUnico(String cpf, Long id) {
        if (id == null) {
            if (professorRepository.existsByCpf(cpf)) {
                throw new RuntimeException("CPF já cadastrado: " + cpf);
            }
        } else {
            if (professorRepository.existsByCpfAndIdNot(cpf, id)) {
                throw new RuntimeException("CPF já cadastrado: " + cpf);
            }
        }
    }

    private void validarEmailUnico(String email, Long id) {
        if (email != null && !email.trim().isEmpty()) {
            boolean emailEmUso = id == null
                    ? professorRepository.existsByEmail(email)
                    : professorRepository.existsByEmailAndIdNot(email, id);

            if (emailEmUso) {
                throw new ConflitoDeDadosException("Já existe um professor cadastrado com este e-mail");
            }
        }
    }
}