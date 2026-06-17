package com.apae.gestao.service;

import com.apae.gestao.dto.professor.*;
import com.apae.gestao.entity.Endereco;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.exception.ConflitoDeDadosException;
import com.apae.gestao.exception.RecursoNaoEncontradoException;
import com.apae.gestao.repository.EnderecoRepository;
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
    private final EnderecoRepository enderecoRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfessorService(ProfessorRepository professorRepository,
                            UsuarioRepository usuarioRepository,
                            EnderecoRepository enderecoRepository,
                            PasswordEncoder passwordEncoder) {
        this.professorRepository = professorRepository;
        this.usuarioRepository = usuarioRepository;
        this.enderecoRepository = enderecoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<ProfessorListagemDTO> listarProfessores(UUID id, String nome, String email, Boolean ativo) {

        List<Object[]> resultados = professorRepository.listarProfessoresOtimizado(nome, email, ativo);

        List<ProfessorListagemDTO> lista = resultados.stream().map(row -> new ProfessorListagemDTO(
                (UUID) row[0],
                (Boolean) row[1], //ativo
                (String) row[2], //nome
                (String) row[3], //email
                (String) row[4] //turmas
        )).toList();

        if (id != null) {
            return lista.stream().filter(p -> p.getId().equals(id)).toList();
        }

        return lista;
    }

    @Transactional(readOnly = true)
    public ProfessorResumoDTO buscarPorIdResumido(UUID id) {
        Professor professor = buscarProfessor(id);
        Usuario usuario = buscarUsuario(professor);
        return toResumo(professor, usuario, buscarEndereco(usuario));
    }

    @Transactional(readOnly = true)
    public ProfessorResponseDTO buscarPorId(UUID id) {
        Professor professor = buscarProfessor(id);
        Usuario usuario = buscarUsuario(professor);
        return new ProfessorResponseDTO(professor, usuario, buscarEndereco(usuario));
    }

    @Transactional
    public ProfessorResponseDTO criar(ProfessorRequestDTO dto) {
        validarCpfUnico(dto.getCpf(), null);
        validarEmailUnico(dto.getEmail(), null);

        Usuario usuario = new Usuario();
        mapearUsuario(dto, usuario);
        Endereco endereco = salvarEndereco(dto.getEndereco(), null);
        if (endereco != null) {
            usuario.setEnderecoId(endereco.getId());
        }
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
        return new ProfessorResponseDTO(salvo, usuarioSalvo, endereco);
    }

    @Transactional
    public ProfessorResponseDTO atualizar(UUID id, ProfessorRequestDTO dto) {
        Professor professor = buscarProfessor(id);
        Usuario usuario = buscarUsuario(professor);

        validarCpfUnico(dto.getCpf(), usuario.getId());
        validarEmailUnico(dto.getEmail(), usuario.getId());

        mapearUsuario(dto, usuario);
        Endereco endereco = salvarEndereco(dto.getEndereco(), usuario.getEnderecoId());
        if (endereco != null) {
            usuario.setEnderecoId(endereco.getId());
        }
        if (dto.getAtivo() != null) {
            usuario.setAtivo(dto.getAtivo());
        }
        salvarUsuarioComErroClaro(usuario);

        professor.setFormacao(dto.getFormacao());
        professor.setDataNascimento(dto.getDataNascimento());
        professor.setDataContratacao(dto.getDataContratacao());
        Professor atualizado = professorRepository.save(professor);
        return new ProfessorResponseDTO(atualizado, usuario, endereco);
    }

    @Transactional
    public ProfessorResponseDTO inativar(UUID id) {
        Professor professor = buscarProfessor(id);
        Usuario usuario = buscarUsuario(professor);
        usuario.setAtivo(false);
        salvarUsuarioComErroClaro(usuario);
        return new ProfessorResponseDTO(professor, usuario, buscarEndereco(usuario));
    }

    @Transactional
    public ProfessorResponseDTO reativarProfessor(UUID id) {
        Professor professor = buscarProfessor(id);
        Usuario usuario = buscarUsuario(professor);
        usuario.setAtivo(true);
        salvarUsuarioComErroClaro(usuario);
        return new ProfessorResponseDTO(professor, usuario, buscarEndereco(usuario));
    }

    private Professor buscarProfessor(UUID id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Professor não encontrado com ID: " + id));
    }

    private Usuario buscarUsuario(Professor professor) {
        return usuarioRepository.findById(professor.getUsuarioId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuário do professor não encontrado com ID: " + professor.getUsuarioId()));
    }

    private Endereco buscarEndereco(Usuario usuario) {
        if (usuario.getEnderecoId() == null) {
            return null;
        }
        return enderecoRepository.findById(usuario.getEnderecoId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Endereço do usuário não encontrado com ID: " + usuario.getEnderecoId()));
    }

    private void mapearUsuario(ProfessorRequestDTO dto, Usuario usuario) {
        usuario.setNomeCompleto(dto.getNome());
        usuario.setCpf(dto.getCpf());
        usuario.setEmail(dto.getEmail());
        usuario.setTelefone(dto.getTelefone());
    }

    private Endereco salvarEndereco(EnderecoDTO dto, UUID enderecoIdAtual) {
        if (dto == null || enderecoVazio(dto)) {
            return enderecoIdAtual == null ? null : buscarEnderecoPorId(enderecoIdAtual);
        }

        validarEnderecoCompleto(dto);

        Endereco endereco = enderecoIdAtual == null
                ? new Endereco()
                : enderecoRepository.findById(enderecoIdAtual).orElseGet(Endereco::new);

        endereco.setCidade(dto.getCidade());
        endereco.setCep(dto.getCep());
        endereco.setEstado(dto.getEstado());
        endereco.setBairro(dto.getBairro());
        endereco.setRua(dto.getRua());
        endereco.setNumero(dto.getNumero());
        endereco.setComplemento(dto.getComplemento());

        return salvarEnderecoComErroClaro(endereco);
    }

    private Endereco buscarEnderecoPorId(UUID enderecoId) {
        return enderecoRepository.findById(enderecoId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Endereço não encontrado com ID: " + enderecoId));
    }

    private void validarEnderecoCompleto(EnderecoDTO dto) {
        if (isBlank(dto.getCidade())
                || isBlank(dto.getCep())
                || isBlank(dto.getEstado())
                || isBlank(dto.getBairro())
                || isBlank(dto.getRua())
                || isBlank(dto.getNumero())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Endereço incompleto: cidade, cep, estado, bairro, rua e número são obrigatórios"
            );
        }
    }

    private boolean enderecoVazio(EnderecoDTO dto) {
        return isBlank(dto.getCidade())
                && isBlank(dto.getCep())
                && isBlank(dto.getEstado())
                && isBlank(dto.getBairro())
                && isBlank(dto.getRua())
                && isBlank(dto.getNumero())
                && isBlank(dto.getComplemento());
    }

    private boolean isBlank(String valor) {
        return valor == null || valor.isBlank();
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

    private Endereco salvarEnderecoComErroClaro(Endereco endereco) {
        try {
            return enderecoRepository.save(endereco);
        } catch (DataAccessException e) {
            if (isErroDePermissao(e)) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Sem permissão para inserir ou atualizar apae_geral.enderecos",
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

    private ProfessorResumoDTO toResumo(Professor professor, Usuario usuario, Endereco endereco) {
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
                EnderecoDTO.fromEntity(endereco),
                professor.getPrimeiroAcesso()
        );
    }

    private record ProfessorUsuario(Professor professor, Usuario usuario, Endereco endereco) {
    }
}
