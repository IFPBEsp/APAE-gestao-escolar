package com.apae.gestao.controller;

import com.apae.gestao.dto.auth.LoginRequestDTO;
import com.apae.gestao.dto.auth.LoginResponseDTO;
import com.apae.gestao.dto.auth.PrimeiroAcessoRequestDTO;
import com.apae.gestao.dto.auth.RedefinirSenhaRequestDTO;
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

    @PostMapping("/redefinir-senha")
    @Operation(
            summary = "Solicitar redefinição de senha para professores",
            description = "Recebe o e-mail e o CPF do professor. Se os dados baterem com o banco de dados, o status de 'primeiro acesso' do professor é reativado, permitindo que ele defina uma nova senha."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Solicitação processada com sucesso (primeiro acesso reativado)"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos (CPF incorreto ou dados em branco)"),
            @ApiResponse(responseCode = "404", description = "Professor não encontrado para o e-mail informado")
    })
    public ResponseEntity<Void> redefinirSenha(@Valid @RequestBody RedefinirSenhaRequestDTO request) {

        authService.redefinirSenha(request);

        return ResponseEntity.ok().build();
    }
}
