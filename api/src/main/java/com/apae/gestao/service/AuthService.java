package com.apae.gestao.service;

import com.apae.gestao.dto.LoginRequestDTO;
import com.apae.gestao.dto.LoginResponseDTO;
import com.apae.gestao.dto.PrimeiroAcessoRequestDTO;
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

        System.out.println("EMAIL RECEBIDO: " + request.getEmail());
        System.out.println("SENHA RECEBIDA: " + request.getSenha());

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

        // Primeiro acesso
        if (professor.getSenha() == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "PRIMEIRO_ACESSO");
        }

        // Login normal
        if (!passwordEncoder.matches(request.getSenha(), professor.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha incorreta");
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

        if (professor.getSenha() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Senha já cadastrada");
        }

        professor.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        professorRepository.save(professor);
    }
}
