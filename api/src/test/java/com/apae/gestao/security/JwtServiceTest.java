package com.apae.gestao.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DisplayName("Testes unitários do serviço JWT")
class JwtServiceTest {

    private JwtService jwtService;

    private static final String SECRET =
            "chave-secreta-de-teste-com-tamanho-suficiente-para-hs256";

    @BeforeEach
    void configurarJwtService() {
        jwtService = new JwtService();

        ReflectionTestUtils.setField(
                jwtService,
                "secret",
                SECRET
        );

        ReflectionTestUtils.setField(
                jwtService,
                "expiration",
                TimeUnit.HOURS.toMillis(1)
        );
    }

    @Test
    @DisplayName("Deve gerar um token com o subject e a role informados")
    void deveGerarTokenComSubjectERole() {
        String token = jwtService.generateToken(
                "professor@teste.com",
                "TEACHER"
        );

        assertTrue(token != null && !token.isBlank());
        assertEquals(
                "professor@teste.com",
                jwtService.extractSubject(token)
        );
        assertEquals(
                "TEACHER",
                jwtService.extractRole(token)
        );
    }

    @Test
    @DisplayName("Deve extrair o subject corretamente do token")
    void deveExtrairSubjectDoToken() {
        String token = jwtService.generateToken(
                "professor@teste.com",
                "TEACHER"
        );

        String subject = jwtService.extractSubject(token);

        assertEquals("professor@teste.com", subject);
    }

    @Test
    @DisplayName("Deve extrair a role corretamente do token")
    void deveExtrairRoleDoToken() {
        String token = jwtService.generateToken(
                "professor@teste.com",
                "TEACHER"
        );

        String role = jwtService.extractRole(token);

        assertEquals("TEACHER", role);
    }

    @Test
    @DisplayName("Deve considerar válido um token não expirado")
    void deveValidarTokenNaoExpirado() {
        String token = jwtService.generateToken(
                "professor@teste.com",
                "TEACHER"
        );

        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    @DisplayName("Deve considerar inválido um token expirado")
    void deveRecusarTokenExpirado() {
        ReflectionTestUtils.setField(
                jwtService,
                "expiration",
                -1000L
        );

        String token = jwtService.generateToken(
                "professor@teste.com",
                "TEACHER"
        );

        assertFalse(jwtService.isTokenValid(token));
    }

    @Test
    @DisplayName("Deve recusar um token com formato inválido")
    void deveRecusarTokenInvalido() {
        assertFalse(
                jwtService.isTokenValid("token-invalido")
        );
    }
}
