package com.apae.gestao.auth.controller;

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
import org.mockito.ArgumentCaptor;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@DisplayName("AuthController - Testes de Camada Web")
class AuthControllerTest {

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

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtService jwtService;

    @BeforeEach
    void resetMocks() {
        Mockito.reset(authService);
    }

    @Nested
    @DisplayName("POST /api/auth/login")
    class Login {

        @Test
        @DisplayName("Deve retornar 200 OK com token e role quando as credenciais sao validas")
        void deveRetornar200_QuandoCredenciaisValidas() throws Exception {
            LoginRequestDTO request = new LoginRequestDTO("admin@apae.org.br", "senhaSegura123");

            UUID professorId = UUID.randomUUID();
            LoginResponseDTO response = new LoginResponseDTO("jwt-token-fake", "ADMIN", professorId);

            when(authService.login(any(LoginRequestDTO.class))).thenReturn(response);

            mockMvc.perform(post(BASE_URL + "/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(jsonPath("$.token").value("jwt-token-fake"))
                    .andExpect(jsonPath("$.role").value("ADMIN"))
                    .andExpect(jsonPath("$.id").value(professorId.toString()));

            ArgumentCaptor<LoginRequestDTO> captor = ArgumentCaptor.forClass(LoginRequestDTO.class);
            verify(authService, times(1)).login(captor.capture());
            assertThat(captor.getValue().getEmail()).isEqualTo("admin@apae.org.br");
            assertThat(captor.getValue().getSenha()).isEqualTo("senhaSegura123");
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o e-mail esta em branco (@NotBlank)")
        void deveRetornar400_QuandoEmailEhBranco() throws Exception {
            LoginRequestDTO request = new LoginRequestDTO("", "senhaSegura123");

            mockMvc.perform(post(BASE_URL + "/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o e-mail e nulo (@NotBlank)")
        void deveRetornar400_QuandoEmailEhNulo() throws Exception {
            LoginRequestDTO request = new LoginRequestDTO(null, "senhaSegura123");

            mockMvc.perform(post(BASE_URL + "/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }
    }

    @Nested
    @DisplayName("POST /api/auth/primeiro-acesso")
    class PrimeiroAcesso {

        @Test
        @DisplayName("Deve retornar 200 OK quando e-mail e nova senha sao fornecidos corretamente")
        void deveRetornar200_QuandoDadosSaoValidos() throws Exception {
            PrimeiroAcessoRequestDTO request =
                    new PrimeiroAcessoRequestDTO("professor@apae.org.br", "novaSenhaSegura!");

            doNothing().when(authService).primeiroAcesso(any(PrimeiroAcessoRequestDTO.class));

            mockMvc.perform(post(BASE_URL + "/primeiro-acesso")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());

            ArgumentCaptor<PrimeiroAcessoRequestDTO> captor = ArgumentCaptor.forClass(PrimeiroAcessoRequestDTO.class);
            verify(authService, times(1)).primeiroAcesso(captor.capture());
            assertThat(captor.getValue().getEmail()).isEqualTo("professor@apae.org.br");
            assertThat(captor.getValue().getNovaSenha()).isEqualTo("novaSenhaSegura!");
        }

        @Test
        @DisplayName("Com email em branco, requisicao chega ao servico (endpoint sem @Valid)")
        void devePassarAoServico_QuandoEmailEhBranco_SemValidacao() throws Exception {
            PrimeiroAcessoRequestDTO request = new PrimeiroAcessoRequestDTO("", "novaSenha");

            doNothing().when(authService).primeiroAcesso(any(PrimeiroAcessoRequestDTO.class));

            mockMvc.perform(post(BASE_URL + "/primeiro-acesso")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());

            ArgumentCaptor<PrimeiroAcessoRequestDTO> captor = ArgumentCaptor.forClass(PrimeiroAcessoRequestDTO.class);
            verify(authService, times(1)).primeiroAcesso(captor.capture());
            assertThat(captor.getValue().getEmail()).isEmpty();
            assertThat(captor.getValue().getNovaSenha()).isEqualTo("novaSenha");
        }

        @Test
        @DisplayName("Com campos nulos, requisicao chega ao servico (endpoint sem @Valid)")
        void devePassarAoServico_QuandoCamposSaoNulos_SemValidacao() throws Exception {
            doNothing().when(authService).primeiroAcesso(any(PrimeiroAcessoRequestDTO.class));

            mockMvc.perform(post(BASE_URL + "/primeiro-acesso")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isOk());

            ArgumentCaptor<PrimeiroAcessoRequestDTO> captor = ArgumentCaptor.forClass(PrimeiroAcessoRequestDTO.class);
            verify(authService, times(1)).primeiroAcesso(captor.capture());
            assertThat(captor.getValue().getEmail()).isNull();
            assertThat(captor.getValue().getNovaSenha()).isNull();
        }
    }

    @Nested
    @DisplayName("POST /api/auth/redefinir-senha")
    class RedefinirSenha {

        @Test
        @DisplayName("Deve retornar 200 OK quando e-mail e CPF sao fornecidos corretamente")
        void deveRetornar200_QuandoDadosSaoValidos() throws Exception {
            RedefinirSenhaRequestDTO request =
                    new RedefinirSenhaRequestDTO("professor@apae.org.br", "12345678900");

            doNothing().when(authService).redefinirSenha(any(RedefinirSenhaRequestDTO.class));

            mockMvc.perform(post(BASE_URL + "/redefinir-senha")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk());

            ArgumentCaptor<RedefinirSenhaRequestDTO> captor = ArgumentCaptor.forClass(RedefinirSenhaRequestDTO.class);
            verify(authService, times(1)).redefinirSenha(captor.capture());
            assertThat(captor.getValue().getEmail()).isEqualTo("professor@apae.org.br");
            assertThat(captor.getValue().getCpf()).isEqualTo("12345678900");
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o e-mail esta em branco (@NotBlank)")
        void deveRetornar400_QuandoEmailEhBranco() throws Exception {
            RedefinirSenhaRequestDTO request =
                    new RedefinirSenhaRequestDTO("", "12345678900");

            mockMvc.perform(post(BASE_URL + "/redefinir-senha")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando o CPF esta em branco (@NotBlank)")
        void deveRetornar400_QuandoCpfEhBranco() throws Exception {
            RedefinirSenhaRequestDTO request =
                    new RedefinirSenhaRequestDTO("professor@apae.org.br", "");

            mockMvc.perform(post(BASE_URL + "/redefinir-senha")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }

        @Test
        @DisplayName("Deve retornar 400 Bad Request quando e-mail e CPF sao nulos")
        void deveRetornar400_QuandoAmbosCamposSaoNulos() throws Exception {
            RedefinirSenhaRequestDTO request = new RedefinirSenhaRequestDTO(null, null);

            mockMvc.perform(post(BASE_URL + "/redefinir-senha")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            verifyNoInteractions(authService);
        }
    }
}
