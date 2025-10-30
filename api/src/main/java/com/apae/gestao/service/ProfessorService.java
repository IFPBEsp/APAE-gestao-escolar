package com.apae.gestao.service;

import com.apae.gestao.dto.ProfessorRequestDTO;
import com.apae.gestao.dto.ProfessorResponseDTO;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.TurmaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;


    @Transactional
    public ProfessorResponseDTO criar(ProfessorRequestDTO dto) {
        validarCpfUnico(dto.getCpf(), null);
        validarEmailUnico(dto.getEmail(), null);

        Professor professor = new Professor();
        mapearDtoParaEntity(dto, professor);
        professor.setAtivo(true);
        Professor salvo = professorRepository.save(professor);
        return new ProfessorResponseDTO(salvo);
    }

    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> listarTodos() {
        return professorRepository.findAll()
                .stream()
                .map(ProfessorResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> listarAtivos() {
        return professorRepository.findByAtivoTrue()
                .stream()
                .map(ProfessorResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarPorId(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + id));
        return new ProfessorResponseDTO(professor);
    }

    @Transactional
    public ProfessorResponseDTO atualizar(Long id, ProfessorRequestDTO dto) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + id));

        validarCpfUnico(dto.getCpf(), id);
        validarEmailUnico(dto.getEmail(), id);

        mapearDtoParaEntity(dto, professor);

        Professor atualizado = professorRepository.save(professor);
        return new ProfessorResponseDTO(atualizado);
    }

    @Transactional
    public void deletar(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + id));

        // Desativação lógica
        professor.setAtivo(false);
        professorRepository.save(professor);
    }

    @Transactional
    public void deletarFisicamente(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new RuntimeException("Professor não encontrado com ID: " + id);
        }
        professorRepository.deleteById(id);
    }

    private void mapearDtoParaEntity(ProfessorRequestDTO dto, Professor professor) {
        professor.setNome(dto.getNome());
        professor.setCpf(dto.getCpf());
        professor.setEmail(dto.getEmail());
        professor.setTelefone(dto.getTelefone());
        professor.setDataNascimento(dto.getDataNascimento());
        professor.setDataContratacao(dto.getDataContratacao());
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
        if (id == null) {
            if (professorRepository.existsByEmail(email)) {
                throw new RuntimeException("Email já cadastrado: " + email);
            }
        } else {
            if (professorRepository.existsByEmailAndIdNot(email, id)) {
                throw new RuntimeException("Email já cadastrado: " + email);
            }
        }
    }
}

