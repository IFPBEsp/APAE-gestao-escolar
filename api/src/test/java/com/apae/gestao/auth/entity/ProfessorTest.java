package com.apae.gestao.auth.entity;

import com.apae.gestao.entity.Professor;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ProfessorTest {

    @Test
    void deveCriarProfessorComDadosInformados() {
        UUID usuarioId = UUID.randomUUID();
        UUID professorId = UUID.randomUUID();
        LocalDate dataNascimento = LocalDate.of(1990, 5, 15);
        LocalDate dataContratacao = LocalDate.of(2020, 2, 10);

        Professor professor = new Professor(
                professorId,
                usuarioId,
                "Licenciatura em Pedagogia",
                dataNascimento,
                dataContratacao,
                true
        );

        assertEquals(professorId, professor.getId());
        assertEquals(usuarioId, professor.getUsuarioId());
        assertEquals("Licenciatura em Pedagogia", professor.getFormacao());
        assertEquals(dataNascimento, professor.getDataNascimento());
        assertEquals(dataContratacao, professor.getDataContratacao());
        assertTrue(professor.getPrimeiroAcesso());
    }

    @Test
    void deveDefinirPrimeiroAcessoComoTrueQuandoForNulo() throws Exception {
        Professor professor = new Professor();

        professor.setPrimeiroAcesso(null);

        var metodoOnCreate = Professor.class.getDeclaredMethod("onCreate");
        metodoOnCreate.setAccessible(true);
        metodoOnCreate.invoke(professor);

        assertTrue(professor.getPrimeiroAcesso());
    }

    @Test
    void naoDeveAlterarPrimeiroAcessoQuandoForFalse() throws Exception {
        Professor professor = new Professor();

        professor.setPrimeiroAcesso(false);

        var metodoOnCreate = Professor.class.getDeclaredMethod("onCreate");
        metodoOnCreate.setAccessible(true);
        metodoOnCreate.invoke(professor);

        assertFalse(professor.getPrimeiroAcesso());
    }
}
