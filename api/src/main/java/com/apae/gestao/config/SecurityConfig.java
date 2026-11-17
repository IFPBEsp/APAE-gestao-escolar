package com.apae.gestao.config;

import com.apae.gestao.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                response.setStatus(HttpStatus.FORBIDDEN.value()))
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/primeiro-acesso",
                                "/api/auth/redefinir-senha",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/docs/**",
                                "/actuator/health",
                                "/error"
                        ).permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/professores/me/dashboard").hasRole("TEACHER")
                        .requestMatchers("/api/professor/**").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.POST, "/api/professores").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/professores/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/professores/*/inativar", "/api/professores/*/ativar").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/professores", "/api/professores/completo").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/professores/*").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.POST, "/api/turmas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/turmas/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/turmas/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/turmas/*/ativar", "/api/turmas/*/desativar").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/turmas/*/professor/*").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/turmas/*/professor").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/turmas/*/alunos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/turmas/*/alunos/*/ativar", "/api/turmas/*/alunos/*/inativar").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/turmas", "/api/turmas/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.PATCH, "/api/alunos/*/turma").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/alunos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/alunos/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.POST, "/api/avaliacoes").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/avaliacoes/*").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/avaliacoes/*").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/avaliacoes", "/api/avaliacoes/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.POST, "/api/presencas/**").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/presencas/*").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/presencas/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.POST, "/api/relatorios").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.PUT, "/api/relatorios/*").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.DELETE, "/api/relatorios/*").hasRole("TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/relatorios", "/api/relatorios/**").hasAnyRole("ADMIN", "TEACHER")
                        .requestMatchers(HttpMethod.GET, "/api/frequencia/**").hasAnyRole("ADMIN", "TEACHER")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
