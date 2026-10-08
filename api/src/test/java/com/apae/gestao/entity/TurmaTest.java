package com.apae.gestao.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class TurmaTest {

    private Turma turma;

    @BeforeEach
    void setUp() {
        turma = new Turma();
        turma.setId(UUID.randomUUID());
        turma.setNome("Turma A");
    }

    @Nested
    @DisplayName("Tests for addAluno")
    class AddAlunoTests {

        @Test
        @DisplayName("Should successfully add student with active status as true")
        void shouldAddStudentWithActiveStatusTrue() {
            UUID pacienteId = UUID.randomUUID();

            turma.addAluno(pacienteId, true);

            assertEquals(1, turma.getTurmaAlunos().size());

            TurmaAluno turmaAluno = turma.getTurmaAlunos().iterator().next();
            assertEquals(pacienteId, turmaAluno.getPacienteId());
            assertEquals(turma, turmaAluno.getTurma());
            assertTrue(turmaAluno.getAtivo());
        }

        @Test
        @DisplayName("Should successfully add student with active status as false")
        void shouldAddStudentWithActiveStatusFalse() {
            UUID pacienteId = UUID.randomUUID();

            turma.addAluno(pacienteId, false);

            assertEquals(1, turma.getTurmaAlunos().size());

            TurmaAluno turmaAluno = turma.getTurmaAlunos().iterator().next();
            assertEquals(pacienteId, turmaAluno.getPacienteId());
            assertEquals(turma, turmaAluno.getTurma());
            assertFalse(turmaAluno.getAtivo());
        }

        @Test
        @DisplayName("Should default active status to true when null is provided")
        void shouldDefaultActiveStatusToTrueWhenNullProvided() {
            UUID pacienteId = UUID.randomUUID();

            turma.addAluno(pacienteId, null);

            assertEquals(1, turma.getTurmaAlunos().size());

            TurmaAluno turmaAluno = turma.getTurmaAlunos().iterator().next();
            assertEquals(pacienteId, turmaAluno.getPacienteId());
            assertTrue(turmaAluno.getAtivo(), "Status should default to true when null is passed");
        }

        @Test
        @DisplayName("Should add multiple different students to the turma")
        void shouldAddMultipleStudents() {
            UUID paciente1 = UUID.randomUUID();
            UUID paciente2 = UUID.randomUUID();

            turma.addAluno(paciente1, true);
            turma.addAluno(paciente2, true);

            assertEquals(2, turma.getTurmaAlunos().size());
        }
    }

    @Nested
    @DisplayName("Tests for removeAluno")
    class RemoveAlunoTests {

        @Test
        @DisplayName("Should remove student by id successfully")
        void shouldRemoveStudentById() {
            UUID pacienteId = UUID.randomUUID();
            turma.addAluno(pacienteId, true);
            assertEquals(1, turma.getTurmaAlunos().size());

            turma.removeAluno(pacienteId);

            assertTrue(turma.getTurmaAlunos().isEmpty());
        }

        @Test
        @DisplayName("Should remove only the specified student when multiple exist")
        void shouldRemoveOnlySpecifiedStudent() {
            UUID paciente1 = UUID.randomUUID();
            UUID paciente2 = UUID.randomUUID();
            turma.addAluno(paciente1, true);
            turma.addAluno(paciente2, true);

            turma.removeAluno(paciente1);

            assertEquals(1, turma.getTurmaAlunos().size());
            TurmaAluno remaining = turma.getTurmaAlunos().iterator().next();
            assertEquals(paciente2, remaining.getPacienteId());
        }

        @Test
        @DisplayName("Should do nothing when removing a non-existing student id")
        void shouldDoNothingWhenRemovingNonExistingStudent() {
            UUID paciente1 = UUID.randomUUID();
            UUID nonExistingId = UUID.randomUUID();
            turma.addAluno(paciente1, true);

            turma.removeAluno(nonExistingId);

            assertEquals(1, turma.getTurmaAlunos().size());
        }
    }

    @Nested
    @DisplayName("Tests for equals and hashCode")
    class EqualsAndHashCodeTests {

        @Test
        @DisplayName("Should be equal to itself (same reference)")
        void shouldBeEqualToItself() {
            assertEquals(turma, turma);
            assertEquals(turma.hashCode(), turma.hashCode());
        }

        @Test
        @DisplayName("Should be equal when both instances have the same id")
        void shouldBeEqualWhenSameId() {
            UUID sameId = UUID.randomUUID();
            turma.setId(sameId);

            Turma anotherTurma = new Turma();
            anotherTurma.setId(sameId);
            anotherTurma.setNome("Outra Turma Qualquer");

            assertEquals(turma, anotherTurma);
            assertEquals(turma.hashCode(), anotherTurma.hashCode());
        }

        @Test
        @DisplayName("Should not be equal when ids are different")
        void shouldNotBeEqualWhenDifferentIds() {
            Turma anotherTurma = new Turma();
            anotherTurma.setId(UUID.randomUUID());

            assertNotEquals(turma, anotherTurma);
        }

        @Test
        @DisplayName("Should not be equal when one or both ids are null")
        void shouldNotBeEqualWhenIdIsNull() {
            Turma turmaWithNullId1 = new Turma();
            turmaWithNullId1.setId(null);

            Turma turmaWithNullId2 = new Turma();
            turmaWithNullId2.setId(null);

            assertNotEquals(turmaWithNullId1, turmaWithNullId2);
            assertNotEquals(turma, turmaWithNullId1);
        }

        @Test
        @DisplayName("Should not be equal to null or different class")
        void shouldNotBeEqualToNullOrDifferentClass() {
            assertNotEquals(null, turma);
            assertNotEquals("uma string qualquer", turma);
        }
    }
}