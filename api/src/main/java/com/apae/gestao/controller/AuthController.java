package com.apae.gestao.controller;

import com.apae.gestao.dto.LoginRequestDTO;
import com.apae.gestao.dto.LoginResponseDTO;
import com.apae.gestao.dto.PrimeiroAcessoRequestDTO;
import com.apae.gestao.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @Operation(
            summary = "Login de usuário",
            description = "Realiza login de administrador ou professor. Professores em primeiro acesso devem informar o CPF (somente dígitos) como senha. " +
                    "Se o professor estiver em primeiro acesso, a API retornará 403 com a mensagem \"PRIMEIRO_ACESSO\" para que o front redirecione para a tela de definição de nova senha."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas"),
            @ApiResponse(responseCode = "403", description = "Primeiro acesso pendente (\"PRIMEIRO_ACESSO\")")
    })
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {

        LoginResponseDTO response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/primeiro-acesso")
    @Operation(
            summary = "Conclusão do primeiro acesso do professor",
            description = "Endpoint utilizado após o login retornar 403 com mensagem \"PRIMEIRO_ACESSO\". " +
                    "Recebe o e-mail do professor e a nova senha definitiva, atualizando o cadastro e marcando o campo primeiroAcesso como false."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Senha definida com sucesso e primeiro acesso concluído"),
            @ApiResponse(responseCode = "400", description = "Primeiro acesso já foi realizado anteriormente"),
            @ApiResponse(responseCode = "404", description = "Professor não encontrado para o e-mail informado")
    })
    public ResponseEntity<Void> primeiroAcesso(
            @RequestBody PrimeiroAcessoRequestDTO request
    ) {
        authService.primeiroAcesso(request);
        return ResponseEntity.ok().build();
    }
}
