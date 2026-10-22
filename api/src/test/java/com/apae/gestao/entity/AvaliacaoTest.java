package com.apae.gestao.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class AvaliacaoTest {

    @Nested
    @DisplayName("Tests for onCreate")
    class OnCreateTests {

        @Test
        @DisplayName("Should set the evaluation date when it is null")
        void shouldSetDateWhenNull() {
            Avaliacao avaliacao = new Avaliacao();

            LocalDateTime antes = LocalDateTime.now();

            avaliacao.onCreate();

            LocalDateTime depois = LocalDateTime.now();

            assertNotNull(avaliacao.getDataAvaliacao());
            assertFalse(avaliacao.getDataAvaliacao().isBefore(antes));
            assertFalse(avaliacao.getDataAvaliacao().isAfter(depois));
        }

        @Test
        @DisplayName("Should preserve the evaluation date when already set")
        void shouldPreserveExistingDate() {
            Avaliacao avaliacao = new Avaliacao();
            LocalDateTime dataEsperada = LocalDateTime.of(2026, 10, 20, 10, 30);

            avaliacao.setDataAvaliacao(dataEsperada);

            avaliacao.onCreate();

            assertEquals(dataEsperada, avaliacao.getDataAvaliacao());
        }
    }

    @Nested
    @DisplayName("Tests for equals")
    class EqualsTests {

        @Test
        @DisplayName("Should be equal to itself")
        void shouldBeEqualToItself() {
            Avaliacao avaliacao = new Avaliacao();

            assertEquals(avaliacao, avaliacao);
        }

        @Test
        @DisplayName("Should be equal when both instances have the same id")
        void shouldBeEqualWhenSameId() {
            UUID sameId = UUID.randomUUID();

            Avaliacao primeira = new Avaliacao();
            primeira.setId(sameId);

            Avaliacao segunda = new Avaliacao();
            segunda.setId(sameId);

            assertEquals(primeira, segunda);
        }

        @Test
        @DisplayName("Should not be equal when ids are different")
        void shouldNotBeEqualWhenDifferentIds() {
            Avaliacao primeira = new Avaliacao();
            primeira.setId(UUID.randomUUID());

            Avaliacao segunda = new Avaliacao();
            segunda.setId(UUID.randomUUID());

            assertNotEquals(primeira, segunda);
        }

        @Test
        @DisplayName("Should not be equal when ids are null on different instances")
        void shouldNotBeEqualWhenIdsAreNull() {
            Avaliacao primeira = new Avaliacao();
            Avaliacao segunda = new Avaliacao();

            assertNotEquals(primeira, segunda);
        }

        @Test
        @DisplayName("Should not be equal to null or a different class")
        void shouldNotBeEqualToNullOrDifferentClass() {
            Avaliacao avaliacao = new Avaliacao();

            assertNotEquals(null, avaliacao);
            assertNotEquals("uma string qualquer", avaliacao);
        }
    }

    @Nested
    @DisplayName("Tests for hashCode")
    class HashCodeTests {

        @Test
        @DisplayName("Should return the same hash code for instances with the same id")
        void shouldReturnSameHashCodeWhenIdsAreEqual() {
            UUID sameId = UUID.randomUUID();

            Avaliacao primeira = new Avaliacao();
            primeira.setId(sameId);

            Avaliacao segunda = new Avaliacao();
            segunda.setId(sameId);

            assertEquals(primeira.hashCode(), segunda.hashCode());
        }

        @Test
        @DisplayName("Should return the class hash code when the id is null")
        void shouldReturnClassHashCodeWhenIdIsNull() {
            Avaliacao avaliacao = new Avaliacao();

            assertEquals(Avaliacao.class.hashCode(), avaliacao.hashCode());
        }
    }
}
