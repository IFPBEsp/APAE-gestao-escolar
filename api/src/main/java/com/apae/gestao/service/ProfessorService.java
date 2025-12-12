package com.apae.gestao.service;

import com.apae.gestao.dto.ProfessorRequestDTO;
import com.apae.gestao.dto.ProfessorResponseDTO;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.repository.ProfessorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import com.apae.gestao.exception.ConflitoDeDadosException;
import com.apae.gestao.exception.RecursoNaoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Transactional(readOnly = true)
public List<ProfessorResponseDTO> listarPorNomeEStatus(String nome, Boolean ativo) {
    // Prioridade 1: Busca por nome (pode combinar com ativo)
    if (nome != null && !nome.trim().isEmpty()) {
        if (ativo != null) {
            // Busca por nome E status (ativo/inativo)
            return professorRepository.findByNomeContainingIgnoreCaseAndAtivo(nome.trim(), ativo)
                    .stream()
                    .map(ProfessorResponseDTO::new)
                    .collect(Collectors.toList());
        } else {
            // Apenas por nome
            return buscarPorNome(nome.trim());
        }
    }
    
    // Prioridade 2: Filtro apenas por status
    if (ativo != null) {
        return ativo ? listarAtivos() : listarInativos();
    }
        
        return listarTodos();
    }

    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> listarInativos() {
        return professorRepository.findByAtivoFalse()
                .stream()
                .map(ProfessorResponseDTO::new)
                .collect(Collectors.toList());
    }

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

    /**
     * Lista professores com filtros opcionais de nome e status.
     * 
     * @param nome  Parâmetro opcional para busca por nome (case-insensitive,
     *              contém)
     * @param ativo Parâmetro opcional para filtrar por status (true=ativos,
     *              false=inativos, null=todos)
     * @return Lista de professores que atendem aos critérios
     */
    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> listarTodos(String nome, Boolean ativo) {
        // Normaliza string vazia para null
        String nomeNormalizado = (nome != null && nome.trim().isEmpty()) ? null : nome;

        // Se ambos os parâmetros forem null, usa o método findAll para melhor
        // performance
        if (nomeNormalizado == null && ativo == null) {
            return listarTodos();
        }

        List<Professor> professores = professorRepository.findByNomeContainingIgnoreCaseAndAtivo(nomeNormalizado,
                ativo);

        return professores.stream()
                .map(ProfessorResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProfessorResponseDTO> buscarPorNome(String nome) {
        return professorRepository.findByNomeContainingIgnoreCase(nome)
                .stream()
                .map(ProfessorResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarPorId(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id));
        return new ProfessorResponseDTO(professor);
    }

    @Transactional
    public ProfessorResponseDTO atualizar(Long id, ProfessorRequestDTO dto) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id));

        validarCpfUnico(dto.getCpf(), id);
        validarEmailUnico(dto.getEmail(), id);

        mapearDtoParaEntity(dto, professor);

        Professor atualizado = professorRepository.save(professor);
        return new ProfessorResponseDTO(atualizado);
    }

    @Transactional
    public ProfessorResponseDTO inativar(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id));

        // Desativação lógica
        professor.setAtivo(false);
        Professor salvo = professorRepository.save(professor);
        return new ProfessorResponseDTO(salvo);
    }

    @Transactional
    public void deletarFisicamente(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id);
        }
        professorRepository.deleteById(id);
    }

    private void mapearDtoParaEntity(ProfessorRequestDTO dto, Professor professor) {
        professor.setNome(dto.getNome());
        professor.setCpf(dto.getCpf());
        professor.setEmail(dto.getEmail());
        professor.setTelefone(dto.getTelefone());
        professor.setDataNascimento(dto.getDataNascimento());
        professor.setEspecialidade(dto.getEspecialidade());
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

    @Transactional
    public ProfessorResponseDTO reativarProfessor(Long id) {
        Professor professor = professorRepository.findByIdWithTurmas(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com ID: " + id));

        professor.setAtivo(true);
        Professor salvo = professorRepository.save(professor);
        return new ProfessorResponseDTO(salvo);
    }
}
