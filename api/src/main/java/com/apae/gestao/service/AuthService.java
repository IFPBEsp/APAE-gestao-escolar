package com.apae.gestao.service;

import com.apae.gestao.dto.auth.LoginRequestDTO;
import com.apae.gestao.dto.auth.LoginResponseDTO;
import com.apae.gestao.dto.auth.PrimeiroAcessoRequestDTO;
import com.apae.gestao.dto.auth.RedefinirSenhaRequestDTO;
import com.apae.gestao.entity.Professor;
import com.apae.gestao.repository.ProfessorRepository;
import com.apae.gestao.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;


@Service
public class AuthService {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    private final ProfessorRepository professorRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(ProfessorRepository professorRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.professorRepository = professorRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponseDTO login(LoginRequestDTO request) {

        // ADMIN
        if (request.getEmail().equals(adminEmail)) {
            if (!request.getSenha().equals(adminPassword)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha errada");
            }

            return new LoginResponseDTO(
                    jwtService.generateToken(adminEmail, "ADMIN"),
                    "ADMIN",
                    null
            );
        }

        // PROFESSOR
        Professor professor = professorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Professor não encontrado"));

        //validação de professor ativo no sistema
        if(!professor.getAtivo()){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Professor inativado no sistema");
        }

        // Validação da senha informada
        if (!passwordEncoder.matches(request.getSenha(), professor.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha incorreta");
        }

        // Bloqueio de acesso enquanto estiver em primeiro acesso
        if (Boolean.TRUE.equals(professor.getPrimeiroAcesso())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "PRIMEIRO_ACESSO");
        }

        return new LoginResponseDTO(
                jwtService.generateToken(professor.getEmail(), "TEACHER"),
                "TEACHER",
                professor.getId()
        );
    }

    public void primeiroAcesso(PrimeiroAcessoRequestDTO request) {

        Professor professor = professorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (Boolean.FALSE.equals(professor.getPrimeiroAcesso())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Primeiro acesso já realizado");
        }

        professor.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        professor.setPrimeiroAcesso(false);
        professorRepository.save(professor);
    }

    public void redefinirSenha(RedefinirSenhaRequestDTO request){

        Professor professor = professorRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor com email não cadastrado"));

        if(!professor.getCpf().equals(request.getCpf())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cpf errado");
        }

        professor.setSenha(null);
        professor.setPrimeiroAcesso(true);
        professorRepository.save(professor);
    }

}
