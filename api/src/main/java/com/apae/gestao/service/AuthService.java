package com.apae.gestao.service;

import com.apae.gestao.dto.auth.LoginRequestDTO;
import com.apae.gestao.dto.auth.LoginResponseDTO;
import com.apae.gestao.dto.auth.PrimeiroAcessoRequestDTO;
import com.apae.gestao.dto.auth.RedefinirSenhaRequestDTO;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.entity.Usuario;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.repository.UsuarioRepository;
import com.apae.gestao.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private static final String CARGO_GESTAO_ESCOLAR = "GESTAO_ESCOLAR";

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    private final UsuarioRepository usuarioRepository;
    private final ProfessorRepository professorRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository,
                       ProfessorRepository professorRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.professorRepository = professorRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO request) {
        if (request.getEmail().equals(adminEmail)) {
            if (!request.getSenha().equals(adminPassword)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha errada");
            }
            return new LoginResponseDTO(jwtService.generateToken(adminEmail, "ADMIN"), "ADMIN", null);
        }

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Professor não encontrado"));

        if (!CARGO_GESTAO_ESCOLAR.equalsIgnoreCase(usuario.getCargo())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não pertence ao Gestão Escolar");
        }

        if (Boolean.FALSE.equals(usuario.getAtivo())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Professor inativado no sistema");
        }

        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha incorreta");
        }

        Professor professor = professorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Professor não encontrado"));

        if (Boolean.TRUE.equals(professor.getPrimeiroAcesso())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "PRIMEIRO_ACESSO");
        }

        return new LoginResponseDTO(
                jwtService.generateToken(usuario.getEmail(), "TEACHER"),
                "TEACHER",
                professor.getId()
        );
    }

    @Transactional
    public void primeiroAcesso(PrimeiroAcessoRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Professor professor = professorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (Boolean.FALSE.equals(professor.getPrimeiroAcesso())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Primeiro acesso já realizado");
        }

        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        professor.setPrimeiroAcesso(false);
        salvarUsuarioComErroClaro(usuario);
        professorRepository.save(professor);
    }

    @Transactional
    public void redefinirSenha(RedefinirSenhaRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor com email não cadastrado"));

        Professor professor = professorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor com email não cadastrado"));

        String cpfRequestSomenteDigitos = request.getCpf().replaceAll("\\D", "");
        String cpfBancoSomenteDigitos = usuario.getCpf().replaceAll("\\D", "");

        if (!cpfBancoSomenteDigitos.equals(cpfRequestSomenteDigitos)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dados inválidos");
        }

        usuario.setSenha(passwordEncoder.encode(cpfRequestSomenteDigitos));
        professor.setPrimeiroAcesso(true);
        salvarUsuarioComErroClaro(usuario);
        professorRepository.save(professor);
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
}
