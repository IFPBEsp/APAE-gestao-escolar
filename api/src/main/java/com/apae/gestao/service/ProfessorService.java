package com.apae.gestao.service;

import com.apae.gestao.dto.professor.ProfessorRequestDTO;
import com.apae.gestao.dto.professor.ProfessorResponseDTO;
import com.apae.gestao.dto.professor.ProfessorResumoDTO;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.exception.ConflitoDeDadosException;
import com.apae.gestao.exception.RecursoNaoEncontradoException;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.UsuarioRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ProfessorService {

    private static final String CARGO_GESTAO_ESCOLAR = "GESTAO_ESCOLAR";

    private final ProfessorRepository professorRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfessorService(ProfessorRepository professorRepository,
                            UsuarioRepository usuarioRepository,
                            PasswordEncoder passwordEncoder) {
        this.professorRepository = professorRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<ProfessorResumoDTO> listarProfessores(UUID id, String nome, String cpf, String email, Boolean ativo) {
        return professorRepository.findAll()
                .stream()
                .filter(professor -> id == null || id.equals(professor.getId()))
                .map(professor -> new ProfessorUsuario(professor, buscarUsuario(professor)))
                .filter(item -> nome == null || item.usuario().getNomeCompleto().toLowerCase().contains(nome.toLowerCase()))
                .filter(item -> cpf == null || cpf.equals(item.usuario().getCpf()))
                .filter(item -> email == null || email.equalsIgnoreCase(item.usuario().getEmail()))
                .filter(item -> ativo == null || ativo.equals(item.usuario().getAtivo()))
                .map(item -> toResumo(item.professor(), item.usuario()))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProfessorResumoDTO buscarPorIdResumido(UUID id) {
        Professor professor = buscarProfessor(id);
        return toResumo(professor, buscarUsuario(professor));
    }

    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarPorId(UUID id) {
        Professor professor = buscarProfessor(id);
        return new ProfessorResponseDTO(professor, buscarUsuario(professor));
    }

    @Transactional
    public ProfessorResponseDTO criar(ProfessorRequestDTO dto) {
        validarCpfUnico(dto.getCpf(), null);
        validarEmailUnico(dto.getEmail(), null);

        Usuario usuario = new Usuario();
        mapearUsuario(dto, usuario);
        usuario.setCargo(CARGO_GESTAO_ESCOLAR);
        usuario.setAtivo(dto.getAtivo() == null ? true : dto.getAtivo());
        usuario.setSenha(passwordEncoder.encode(cpfSomenteDigitos(dto.getCpf())));

        Usuario usuarioSalvo = salvarUsuarioComErroClaro(usuario);

        Professor professor = new Professor();
        professor.setUsuarioId(usuarioSalvo.getId());
        professor.setFormacao(dto.getFormacao());
        professor.setDataNascimento(dto.getDataNascimento());
        professor.setDataContratacao(dto.getDataContratacao());
        professor.setPrimeiroAcesso(true);

        Professor salvo = professorRepository.save(professor);
        return new ProfessorResponseDTO(salvo, usuarioSalvo);
    }

    @Transactional
    public ProfessorResponseDTO atualizar(UUID id, ProfessorRequestDTO dto) {
        Professor professor = buscarProfessor(id);
        Usuario usuario = buscarUsuario(professor);

        validarCpfUnico(dto.getCpf(), usuario.getId());
        validarEmailUnico(dto.getEmail(), usuario.getId());

        mapearUsuario(dto, usuario);
        if (dto.getAtivo() != null) {
            usuario.setAtivo(dto.getAtivo());
        }
        salvarUsuarioComErroClaro(usuario);

        professor.setFormacao(dto.getFormacao());
        professor.setDataNascimento(dto.getDataNascimento());
        professor.setDataContratacao(dto.getDataContratacao());
        Professor atualizado = professorRepository.save(professor);
        return new ProfessorResponseDTO(atualizado, usuario);
    }

    @Transactional
    public ProfessorResponseDTO inativar(UUID id) {
        Professor professor = buscarProfessor(id);
        Usuario usuario = buscarUsuario(professor);
        usuario.setAtivo(false);
        salvarUsuarioComErroClaro(usuario);
        return new ProfessorResponseDTO(professor, usuario);
    }

    @Transactional
    public ProfessorResponseDTO reativarProfessor(UUID id) {
        Professor professor = buscarProfessor(id);
        Usuario usuario = buscarUsuario(professor);
        usuario.setAtivo(true);
        salvarUsuarioComErroClaro(usuario);
        return new ProfessorResponseDTO(professor, usuario);
    }

    private Professor buscarProfessor(UUID id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id));
    }

    private Usuario buscarUsuario(Professor professor) {
        return usuarioRepository.findById(professor.getUsuarioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário do professor não encontrado com ID: " + professor.getUsuarioId()));
    }

    private void mapearUsuario(ProfessorRequestDTO dto, Usuario usuario) {
        usuario.setNomeCompleto(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setEmail(dto.getEmail());
        usuario.setTelefone(dto.getTelefone());
        usuario.setEndereco(dto.getEndereco());
    }

    private Usuario salvarUsuarioComErroClaro(Usuario usuario) {
        try {
            return usuarioRepository.save(usuario);
        } catch (DataAccessException e) {
            if (isErroDePermissao(e)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Sem permissão para inserir ou atualizar apae_geral.usuarios",
                        e
                );
            }
            throw e;
        }
    }

    private boolean isErroDePermissao(Throwable erro) {
        Throwable atual = erro;
        while (atual != null) {
            String mensagem = atual.getMessage();
            if (mensagem != null && mensagem.toLowerCase().contains("permission denied")) {
                return true;
            }
            atual = atual.getCause();
        }
        return false;
    }

    private void validarCpfUnico(String cpf, UUID usuarioIdAtual) {
        usuarioRepository.findByCpf(cpf)
                .filter(usuario -> !usuario.getId().equals(usuarioIdAtual))
                .ifPresent(usuario -> {
                    throw new ConflitoDeDadosException("Já existe um usuário cadastrado com este CPF");
                });
    }

    private void validarEmailUnico(String email, UUID usuarioIdAtual) {
        if (email == null || email.isBlank()) {
            return;
        }
        usuarioRepository.findByEmail(email)
                .filter(usuario -> !usuario.getId().equals(usuarioIdAtual))
                .ifPresent(usuario -> {
                    throw new ConflitoDeDadosException("Já existe um usuário cadastrado com este e-mail");
                });
    }

    private String cpfSomenteDigitos(String cpf) {
        return cpf == null ? "" : cpf.replaceAll("\\D", "");
    }

    private ProfessorResumoDTO toResumo(Professor professor, Usuario usuario) {
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
                usuario.getEndereco(),
                professor.getPrimeiroAcesso()
        );
    }

    private record ProfessorUsuario(Professor professor, Usuario usuario) {
    }
}
