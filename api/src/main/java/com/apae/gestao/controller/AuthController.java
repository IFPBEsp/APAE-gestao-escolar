package com.apae.gestao.controller;

import com.apae.gestao.dto.LoginRequestDTO;
import com.apae.gestao.dto.LoginResponseDTO;
import com.apae.gestao.dto.PrimeiroAcessoRequestDTO;
import com.apae.gestao.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {

        System.out.println("EMAIL RECEBIDO: " + request.getEmail());
        System.out.println("SENHA RECEBIDA: " + request.getSenha());

        LoginResponseDTO response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/primeiro-acesso")
    public ResponseEntity<Void> primeiroAcesso(
            @RequestBody PrimeiroAcessoRequestDTO request
    ) {
        authService.primeiroAcesso(request);
        return ResponseEntity.ok().build();
    }
}
