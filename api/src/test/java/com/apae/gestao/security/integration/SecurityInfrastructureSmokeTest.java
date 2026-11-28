package com.apae.gestao.security.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

class SecurityInfrastructureSmokeTest extends AbstractSecurityIntegrationTest {

    @Test
    @DisplayName("Cenário base: professores A/B, turmas A/B e alunos, incluindo a view de alunos")
    void deveCriarCenarioBase() {
        assertThat(contar("gestao_escolar.professores")).isEqualTo(2);
        assertThat(contar("gestao_escolar.turmas")).isEqualTo(2);
        assertThat(contar("gestao_escolar.turma_aluno")).isEqualTo(4);
        assertThat(contar("gestao_escolar.alunos_view")).isEqualTo(4);
    }

    @Test
    @DisplayName("Isolamento: dado criado em um teste não vaza para o outro (parte 1)")
    void isolamentoParte1() {
        jdbcTemplate.update("INSERT INTO gestao_escolar.aulas (turma_id, data) VALUES (?, CURRENT_DATE)", TURMA_A_ID);
        assertThat(contar("gestao_escolar.aulas")).isEqualTo(1);
    }

    @Test
    @DisplayName("Isolamento: dado criado em um teste não vaza para o outro (parte 2)")
    void isolamentoParte2() {
        jdbcTemplate.update("INSERT INTO gestao_escolar.aulas (turma_id, data) VALUES (?, CURRENT_DATE)", TURMA_B_ID);
        assertThat(contar("gestao_escolar.aulas")).isEqualTo(1);
    }

    @Test
    @DisplayName("Sem token: 401")
    void semTokenDeveRetornar401() throws Exception {
        mockMvc.perform(get("/api/turmas")).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Token expirado: 401")
    void tokenExpiradoDeveRetornar401() throws Exception {
        mockMvc.perform(get("/api/turmas")
                .header("Authorization", bearer(tokenExpirado(PROFESSOR_A_EMAIL, "TEACHER"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Assinatura inválida: 401")
    void assinaturaInvalidaDeveRetornar401() throws Exception {
        mockMvc.perform(get("/api/turmas")
                .header("Authorization", bearer(tokenAssinaturaInvalida(PROFESSOR_A_EMAIL, "TEACHER"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Token malformado: 401")
    void tokenMalformadoDeveRetornar401() throws Exception {
        mockMvc.perform(get("/api/turmas")
                .header("Authorization", bearer(tokenMalformado())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Professor em rota de admin: 403")
    void professorEmRotaDeAdminDeveRetornar403() throws Exception {
        mockMvc.perform(get("/api/professores")
                .header("Authorization", bearer(tokenProfessorA())))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Admin com token válido passa pelos filtros")
    void adminComTokenValidoDeveSerAutorizado() throws Exception {
        mockMvc.perform(get("/api/turmas")
                .header("Authorization", bearer(tokenAdmin())))
                .andExpect(status().is2xxSuccessful());
    }

    private Integer contar(String tabela) {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + tabela, Integer.class);
    }
}
