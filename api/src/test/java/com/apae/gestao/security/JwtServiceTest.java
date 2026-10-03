package com.apae.gestao.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

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
    void deveExtrairSubjectDoToken() {
        String token = jwtService.generateToken(
                "professor@teste.com",
                "TEACHER"
        );

        String subject = jwtService.extractSubject(token);

        assertEquals("professor@teste.com", subject);
    }

    @Test
    void deveExtrairRoleDoToken() {
        String token = jwtService.generateToken(
                "professor@teste.com",
                "TEACHER"
        );

        String role = jwtService.extractRole(token);

        assertEquals("TEACHER", role);
    }

    @Test
    void deveValidarTokenNaoExpirado() {
        String token = jwtService.generateToken(
                "professor@teste.com",
                "TEACHER"
        );

        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
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
    void deveRecusarTokenInvalido() {
        assertFalse(
                jwtService.isTokenValid("token-invalido")
        );
    }
}