package com.apae.gestao.controller.auth;

import com.apae.gestao.controller.AuthController;
import com.apae.gestao.dto.auth.LoginRequestDTO;
import com.apae.gestao.dto.auth.LoginResponseDTO;
import com.apae.gestao.dto.auth.PrimeiroAcessoRequestDTO;
import com.apae.gestao.dto.auth.RedefinirSenhaRequestDTO;
import com.apae.gestao.security.JwtService;
import com.apae.gestao.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Testes de camada Web (MockMvc) para {@link AuthController}.
 *
 * <p>Utiliza {@code @WebMvcTest} para carregar apenas a fatia web do contexto Spring.
 * A camada de servico e isolada via {@code @MockBean} em {@link AuthService}.</p>
 *
 * <p><b>Seguranca:</b> A classe interna {@link TestSecurityConfig} substitui a
 * auto-configuracao padrao do Spring Security (CSRF on / tudo bloqueado) por uma
 * configuracao permissiva especifica para testes (CSRF off / tudo liberado).
 * O {@link JwtService} continua mockado porque o {@code JwtAuthFilter} e um
 * {@code Filter} anotado com {@code @Component} carregado pelo slice.</p>
 *
 * <p><b>Reset do mock:</b> O metodo {@link #resetMocks()} anotado com
 * {@code @BeforeEach} garante que as interacoes do {@link AuthService} sejam
 * limpas antes de cada teste. Isso e necessario porque o
 * {@code ResetMocksTestExecutionListener} do Spring Boot nao dispara
 * corretamente para classes {@code @Nested} em algumas versoes, causando
 * acumulo de interacoes entre testes do mesmo grupo.</p>
 */
@WebMvcTest(AuthController.class)
@DisplayName("AuthController - Testes de Camada Web")
class AuthControllerTest {

    /**
     * Configuracao de seguranca exclusiva para testes: desativa CSRF e libera
     * todos os endpoints, simulando o comportamento das rotas publicas de auth.
     */
    @TestConfiguration
    static class TestSecurityConfig {
        @Bean
        public SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
            http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
            return http.build();
        }
    }

    private static final String BASE_URL = "/api/auth";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    /** Isola a camada de servico: nenhuma logica de negocio e executada nos testes. */
    @MockBean
    private AuthService authService;

    /**
     * JwtAuthFilter e um Filter carregado pelo slice e possui JwtService
     * como dependencia. O mock evita falha na criacao do bean.
     */
    @MockBean
    private JwtService jwtService;

    /**
     * Garante que as interacoes acumuladas no mock sejam limpas antes de cada
     * teste, incluindo os de classes @Nested onde o reset automatico do Spring
     * Boot pode nao funcionar confiavelmente.
     */
    @BeforeEach
    void resetMocks() {
        Mockito.reset(authService);
    }

    // =========================================================================
    // POST /api/auth/login
    // =========================================================================

    @Nested
    @DisplayName("POST /api/auth/login")
    class Login {

        @Test
        @DisplayName("Deve retornar 200 OK com token e role quando as credenciais sao validas")
        void deveRetornar200_QuandoCredenciaisValidas() throws Exception {
            // Arrange
            LoginRequestDTO request = new LoginRequestDTO("admin@apae.org.br", "senhaSegura123");

            UUID professorId = UUID.randomUUID();
            LoginResponseDTO response = new LoginResponseDTO("jwt-token-fake", "ADMIN", professorId);

            when(authService.login(any(LoginRequestDTO.class))).thenReturn(response);

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.token").value("jwt-token-fake"))
                    .andExpect(jsonPath("$.role").value("ADMIN"))
                    .andExpect(jsonPath("$.id").value(professorId.toString()));

            verify(authService, times(1)).login(any(LoginRequestDTO.class));
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o e-mail esta em branco (@NotBlank)")
        void deveRetornar400_QuandoEmailEhBranco() throws Exception {
            // Arrange - email violando @NotBlank
            LoginRequestDTO request = new LoginRequestDTO("", "senhaSegura123");

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            // O servico NAO deve ser invocado quando @Valid barrar a requisicao
            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o e-mail e nulo (@NotBlank)")
        void deveRetornar400_QuandoEmailEhNulo() throws Exception {
            // Arrange - email nulo violando @NotBlank
            LoginRequestDTO request = new LoginRequestDTO(null, "senhaSegura123");

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }
    }

    // =========================================================================
    // POST /api/auth/primeiro-acesso
    // =========================================================================

    @Nested
    @DisplayName("POST /api/auth/primeiro-acesso")
    class PrimeiroAcesso {

        @Test
        @DisplayName("Deve retornar 200 OK quando e-mail e nova senha sao fornecidos corretamente")
        void deveRetornar200_QuandoDadosSaoValidos() throws Exception {
            // Arrange
            PrimeiroAcessoRequestDTO request =
                    new PrimeiroAcessoRequestDTO("professor@apae.org.br", "novaSenhaSegura!");

            doNothing().when(authService).primeiroAcesso(any(PrimeiroAcessoRequestDTO.class));

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/primeiro-acesso")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());

            verify(authService, times(1)).primeiroAcesso(any(PrimeiroAcessoRequestDTO.class));
        }

        /**
         * Nota: o endpoint /primeiro-acesso nao possui @Valid no controller (comportamento atual).
         * Por isso, mesmo com email em branco, a requisicao chega ao servico.
         * Se @Valid for adicionado futuramente, este teste deve ser atualizado para esperar 400.
         */
        @Test
        @DisplayName("Com email em branco, requisicao chega ao servico (endpoint sem @Valid)")
        void devePassarAoServico_QuandoEmailEhBranco_SemValidacao() throws Exception {
            // Arrange
            PrimeiroAcessoRequestDTO request = new PrimeiroAcessoRequestDTO("", "novaSenha");

            doNothing().when(authService).primeiroAcesso(any(PrimeiroAcessoRequestDTO.class));

            // Act & Assert - sem @Valid, o servico e invocado mesmo com dados invalidos
            mockMvc.perform(post(BASE_URL + "/primeiro-acesso")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());

            verify(authService, times(1)).primeiroAcesso(any(PrimeiroAcessoRequestDTO.class));
        }

        @Test
        @DisplayName("Com campos nulos, requisicao chega ao servico (endpoint sem @Valid)")
        void devePassarAoServico_QuandoCamposSaoNulos_SemValidacao() throws Exception {
            // Arrange
            doNothing().when(authService).primeiroAcesso(any(PrimeiroAcessoRequestDTO.class));

            // Act & Assert - corpo com campos nulos chega ao servico sem @Valid
            mockMvc.perform(post(BASE_URL + "/primeiro-acesso")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isOk());

            verify(authService, times(1)).primeiroAcesso(any(PrimeiroAcessoRequestDTO.class));
        }
    }

    // =========================================================================
    // POST /api/auth/redefinir-senha
    // =========================================================================

    @Nested
    @DisplayName("POST /api/auth/redefinir-senha")
    class RedefinirSenha {

        @Test
        @DisplayName("Deve retornar 200 OK quando e-mail e CPF sao fornecidos corretamente")
        void deveRetornar200_QuandoDadosSaoValidos() throws Exception {
            // Arrange
            RedefinirSenhaRequestDTO request =
                    new RedefinirSenhaRequestDTO("professor@apae.org.br", "12345678900");

            doNothing().when(authService).redefinirSenha(any(RedefinirSenhaRequestDTO.class));

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/redefinir-senha")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());

            verify(authService, times(1)).redefinirSenha(any(RedefinirSenhaRequestDTO.class));
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o e-mail esta em branco (@NotBlank)")
        void deveRetornar400_QuandoEmailEhBranco() throws Exception {
            // Arrange
            RedefinirSenhaRequestDTO request =
                    new RedefinirSenhaRequestDTO("", "12345678900");

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/redefinir-senha")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o CPF esta em branco (@NotBlank)")
        void deveRetornar400_QuandoCpfEhBranco() throws Exception {
            // Arrange
            RedefinirSenhaRequestDTO request =
                    new RedefinirSenhaRequestDTO("professor@apae.org.br", "");

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/redefinir-senha")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando e-mail e CPF sao nulos")
        void deveRetornar400_QuandoAmbosCamposSaoNulos() throws Exception {
            // Arrange
            RedefinirSenhaRequestDTO request = new RedefinirSenhaRequestDTO(null, null);

            // Act & Assert
            mockMvc.perform(post(BASE_URL + "/redefinir-senha")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }
    }
}
