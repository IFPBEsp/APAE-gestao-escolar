package com.apae.gestao.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    private JwtAuthFilter filter;

    @AfterEach
    void limparSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void deveContinuarQuandoAuthorizationNaoForInformado() throws Exception {
        filter = new JwtAuthFilter(jwtService);

        when(request.getHeader("Authorization")).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtService);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void deveContinuarQuandoAuthorizationNaoComecarComBearer() throws Exception {
        filter = new JwtAuthFilter(jwtService);

        when(request.getHeader("Authorization")).thenReturn("Basic qualquer-token");

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtService);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void deveContinuarQuandoTokenForInvalido() throws Exception {
        filter = new JwtAuthFilter(jwtService);

        when(request.getHeader("Authorization")).thenReturn("Bearer token-invalido");
        when(jwtService.isTokenValid("token-invalido")).thenReturn(false);

        filter.doFilterInternal(request, response, filterChain);

        verify(jwtService).isTokenValid("token-invalido");
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void deveAutenticarQuandoTokenForValido() throws Exception {
        filter = new JwtAuthFilter(jwtService);

        when(request.getHeader("Authorization")).thenReturn("Bearer token-valido");
        when(jwtService.isTokenValid("token-valido")).thenReturn(true);
        when(jwtService.extractSubject("token-valido")).thenReturn("professor@teste.com");
        when(jwtService.extractRole("token-valido")).thenReturn("PROFESSOR");

        filter.doFilterInternal(request, response, filterChain);

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        assertEquals("professor@teste.com", authentication.getPrincipal());
        assertTrue(authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_PROFESSOR")));

        verify(jwtService).isTokenValid("token-valido");
        verify(jwtService).extractSubject("token-valido");
        verify(jwtService).extractRole("token-valido");
        verify(filterChain).doFilter(request, response);
    }
}